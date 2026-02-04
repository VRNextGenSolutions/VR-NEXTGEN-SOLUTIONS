/**
 * Media Cleanup API
 * GET /api/admin/media/cleanup - Preview files to clean up
 * POST /api/admin/media/cleanup - Execute cleanup
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { findOrphanedFiles, findOldFiles, deleteFiles, listAllFiles } from '@/utils/media';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const supabase = createServiceRoleClient();

    // GET - Preview cleanup
    if (req.method === 'GET') {
        try {
            const { mode = 'orphans', days = '60' } = req.query;
            const daysOld = parseInt(days as string, 10);

            let filesToClean = [];
            let description = '';

            if (mode === 'orphans') {
                filesToClean = await findOrphanedFiles(supabase);
                description = 'Files not referenced by any blog post';
            } else if (mode === 'old') {
                const allFiles = await listAllFiles(supabase);
                filesToClean = findOldFiles(allFiles, daysOld);
                description = `Files older than ${daysOld} days`;
            } else if (mode === 'all') {
                const allFiles = await listAllFiles(supabase);
                const orphans = await findOrphanedFiles(supabase);
                const oldFiles = findOldFiles(allFiles, daysOld);

                // Combine and dedupe
                const pathSet = new Set([
                    ...orphans.map(f => f.path),
                    ...oldFiles.map(f => f.path),
                ]);
                filesToClean = allFiles.filter(f => pathSet.has(f.path));
                description = `Orphaned files + files older than ${daysOld} days`;
            }

            const totalSize = filesToClean.reduce((sum, f) => sum + f.size, 0);

            return res.status(200).json({
                success: true,
                data: {
                    description,
                    files: filesToClean,
                    count: filesToClean.length,
                    totalSizeBytes: totalSize,
                    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
                },
            });
        } catch (error) {
            console.error('Cleanup preview error:', error);
            return res.status(500).json({ success: false, error: 'Failed to preview cleanup' });
        }
    }

    // POST - Execute cleanup
    if (req.method === 'POST') {
        try {
            const { paths } = req.body;

            if (!paths || !Array.isArray(paths) || paths.length === 0) {
                return res.status(400).json({ success: false, error: 'No files to delete' });
            }

            const result = await deleteFiles(supabase, paths);

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('Cleanup execution error:', error);
            return res.status(500).json({ success: false, error: 'Failed to execute cleanup' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
