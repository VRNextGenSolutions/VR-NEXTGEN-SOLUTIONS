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

    // Get all root level folders
    const { data: rootFolders } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { limit: 100 });

    for (const folder of rootFolders || []) {
        if (!folder.id) continue;

        // Get files in each folder
        const { data: subFolders } = await supabase.storage
            .from(BUCKET_NAME)
            .list(folder.name, { limit: 100 });

        for (const subFolder of subFolders || []) {
            if (!subFolder.id) continue;

            const { data: folderFiles } = await supabase.storage
                .from(BUCKET_NAME)
                .list(`${folder.name}/${subFolder.name}`, { limit: 100 });

            for (const file of folderFiles || []) {
                if (file.id && file.name) {
                    files.push({
                        id: file.id,
                        name: file.name,
                        path: `${folder.name}/${subFolder.name}/${file.name}`,
                        size: file.metadata?.size || 0,
                        createdAt: new Date(file.created_at || Date.now()),
                    });
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
