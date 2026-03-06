/**
 * Admin Media API - List and Delete
 * GET /api/admin/media - List all media files
 * DELETE /api/admin/media - Delete a file
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/verifyAdmin';

const BUCKET_NAME = 'blog-media';

interface MediaFile {
    id: string;
    name: string;
    path: string;
    url: string;
    size: number;
    created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const supabase = createServiceRoleClient();

    if (req.method === 'GET') {
        try {
            // Instead of just 'posts', we should list all root folders to find all media
            const { data: rootItems, error: itemsError } = await supabase.storage
                .from(BUCKET_NAME)
                .list('', { limit: 100 });

            if (itemsError) {
                console.error('Error listing root items:', itemsError);
                return res.status(500).json({ success: false, error: 'Failed to list media' });
            }

            console.log('ROOT ITEMS FROM SUPABASE:', JSON.stringify(rootItems, null, 2));

            const allFiles: MediaFile[] = [];

            // Helper to get public URL
            const getUrl = (path: string) => supabase.storage.from(BUCKET_NAME).getPublicUrl(path).data.publicUrl;

            // Iterate through root items
            for (const item of rootItems || []) {
                if (!item.name) continue; // Every item has a name

                // If it's a file at root level (has no metadata if folder in some Storage APIs, but has it if file)
                // Actually, Supabase Storage list() returns files AND folders.
                // Folders typically have no metadata or a specific format.
                // A reliable way: if item has metadata, it's a file.
                if (item.metadata) {
                    if (!item.id) continue; // Sanity check for file ID
                    allFiles.push({
                        id: item.id,
                        name: item.name,
                        path: item.name,
                        url: getUrl(item.name),
                        size: item.metadata?.size || 0,
                        created_at: item.created_at || new Date().toISOString(),
                    });
                } else {
                    // It's a folder (e.g., 'posts', 'general')
                    const { data: subItems } = await supabase.storage
                        .from(BUCKET_NAME)
                        .list(item.name, { limit: 100 });

                    for (const subItem of subItems || []) {
                        if (!subItem.name) continue;

                        if (subItem.metadata) {
                            if (!subItem.id) continue;
                            // It's a file inside the folder
                            const path = `${item.name}/${subItem.name}`;
                            allFiles.push({
                                id: subItem.id,
                                name: subItem.name,
                                path,
                                url: getUrl(path),
                                size: subItem.metadata?.size || 0,
                                created_at: subItem.created_at || new Date().toISOString(),
                            });
                        } else {
                            // Support one more level of nesting ('posts/slug')
                            const { data: deepItems } = await supabase.storage
                                .from(BUCKET_NAME)
                                .list(`${item.name}/${subItem.name}`, { limit: 100 });

                            for (const deepItem of deepItems || []) {
                                if (deepItem.id && deepItem.metadata) {
                                    const path = `${item.name}/${subItem.name}/${deepItem.name}`;
                                    allFiles.push({
                                        id: deepItem.id,
                                        name: deepItem.name,
                                        path,
                                        url: getUrl(path),
                                        size: deepItem.metadata?.size || 0,
                                        created_at: deepItem.created_at || new Date().toISOString(),
                                    });
                                }
                            }
                        }
                    }
                }
            }

            // Sort by created_at descending
            allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            return res.status(200).json({ success: true, data: allFiles });
        } catch (error) {
            console.error('Error fetching media:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch media' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { path } = req.body;

            if (!path) {
                return res.status(400).json({ success: false, error: 'File path is required' });
            }

            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([path]);

            if (error) {
                console.error('Error deleting file:', error);
                return res.status(500).json({ success: false, error: 'Failed to delete file' });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting media:', error);
            return res.status(500).json({ success: false, error: 'Failed to delete media' });
        }
    }

    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
