/**
 * Admin Media API - List and Delete
 * GET /api/admin/media - List all media files
 * DELETE /api/admin/media - Delete a file
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';

const BUCKET_NAME = 'blog-media';

async function verifyAdmin(req: NextApiRequest): Promise<boolean> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];
    const supabase = createServiceRoleClient();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) return false;

    const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', user.email)
        .single();

    return !!admin;
}

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
            // List all folders in the bucket
            const { data: folders, error: foldersError } = await supabase.storage
                .from(BUCKET_NAME)
                .list('posts', { limit: 100 });

            if (foldersError) {
                console.error('Error listing folders:', foldersError);
                return res.status(500).json({ success: false, error: 'Failed to list media' });
            }

            const allFiles: MediaFile[] = [];

            // Iterate through each post folder
            for (const folder of folders || []) {
                if (folder.id) {
                    const { data: files } = await supabase.storage
                        .from(BUCKET_NAME)
                        .list(`posts/${folder.name}`, { limit: 100 });

                    for (const file of files || []) {
                        if (file.id && file.name) {
                            const path = `posts/${folder.name}/${file.name}`;
                            const { data: urlData } = supabase.storage
                                .from(BUCKET_NAME)
                                .getPublicUrl(path);

                            allFiles.push({
                                id: file.id,
                                name: file.name,
                                path,
                                url: urlData.publicUrl,
                                size: file.metadata?.size || 0,
                                created_at: file.created_at || new Date().toISOString(),
                            });
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
