/**
 * Media Cleanup Utility
 * Functions for managing storage cleanup operations
 * 
 * Features:
 * - Find orphaned files (not referenced by posts)
 * - Find files older than specified age
 * - Delete files from storage
 */

import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'blog-media';

export interface StorageFile {
    id: string;
    name: string;
    path: string;
    size: number;
    createdAt: Date;
    isOrphan?: boolean;
}

export interface CleanupResult {
    deleted: string[];
    failed: string[];
    freedBytes: number;
}

/**
 * List all files in the storage bucket
 */
export async function listAllFiles(supabase: SupabaseClient): Promise<StorageFile[]> {
    const files: StorageFile[] = [];

    // Get all root level items
    const { data: rootItems } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { limit: 100 });

    for (const item of rootItems || []) {
        if (!item.name) continue; // Don't check item.id — folders have id=null

        if (item.metadata) {
            // It's a file at the root
            files.push({
                id: item.id,
                name: item.name,
                path: item.name,
                size: item.metadata.size || 0,
                createdAt: new Date(item.created_at || Date.now()),
            });
        } else {
            // It's a folder (e.g., 'posts', 'general')
            const { data: subItems } = await supabase.storage
                .from(BUCKET_NAME)
                .list(item.name, { limit: 100 });

            for (const subItem of subItems || []) {
                if (!subItem.name) continue; // Check for name instead of ID for sub-items

                if (subItem.metadata) {
                    // It's a file inside the folder
                    if (!subItem.id) continue; // Keep ID check for actual files
                    files.push({
                        id: subItem.id,
                        name: subItem.name,
                        path: `${item.name}/${subItem.name}`,
                        size: subItem.metadata.size || 0,
                        createdAt: new Date(subItem.created_at || Date.now()),
                    });
                } else {
                    // Support one more level of nesting ('posts/slug/image.jpg')
                    const { data: deepItems } = await supabase.storage
                        .from(BUCKET_NAME)
                        .list(`${item.name}/${subItem.name}`, { limit: 100 });

                    for (const deepItem of deepItems || []) {
                        if (deepItem.id && deepItem.metadata) {
                            files.push({
                                id: deepItem.id,
                                name: deepItem.name,
                                path: `${item.name}/${subItem.name}/${deepItem.name}`,
                                size: deepItem.metadata.size || 0,
                                createdAt: new Date(deepItem.created_at || Date.now()),
                            });
                        }
                    }
                }
            }
        }
    }

    return files;
}

/**
 * Find orphaned files (not referenced by any blog post)
 */
export async function findOrphanedFiles(supabase: SupabaseClient): Promise<StorageFile[]> {
    const files = await listAllFiles(supabase);

    // Get all featured_image URLs from posts
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('featured_image');

    const usedUrls = new Set(
        (posts || [])
            .map(p => p.featured_image)
            .filter(Boolean)
    );

    // Mark files as orphans if not referenced
    return files.filter(file => {
        const isUsed = Array.from(usedUrls).some(url =>
            url?.includes(file.path) || url?.includes(file.name)
        );
        return !isUsed;
    });
}

/**
 * Find files older than specified days
 */
export function findOldFiles(files: StorageFile[], daysOld: number): StorageFile[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return files.filter(file => file.createdAt < cutoffDate);
}

/**
 * Delete files from storage
 */
export async function deleteFiles(
    supabase: SupabaseClient,
    paths: string[]
): Promise<CleanupResult> {
    const result: CleanupResult = {
        deleted: [],
        failed: [],
        freedBytes: 0,
    };

    for (const path of paths) {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path]);

        if (error) {
            result.failed.push(path);
        } else {
            result.deleted.push(path);
        }
    }

    return result;
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(supabase: SupabaseClient): Promise<{
    totalFiles: number;
    totalSizeBytes: number;
    totalSizeMB: string;
    usagePercent: number;
}> {
    const files = await listAllFiles(supabase);
    const totalSizeBytes = files.reduce((sum, f) => sum + f.size, 0);
    const maxStorageBytes = 1024 * 1024 * 1024; // 1GB limit

    return {
        totalFiles: files.length,
        totalSizeBytes,
        totalSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2),
        usagePercent: Math.round((totalSizeBytes / maxStorageBytes) * 100),
    };
}
