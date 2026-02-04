/**
 * Admin Comments API
 * GET /api/admin/comments - List comments
 * PUT /api/admin/comments - Bulk actions
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import {
    getAdminComments,
    approveComment,
    rejectComment,
    softDeleteComment,
    restoreComment,
    bulkApproveComments,
    bulkDeleteComments,
} from '@/services/admin/comments';

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

    if (req.method === 'GET') {
        try {
            const { page = '1', pageSize = '20', filter = 'all', postId } = req.query;

            const result = await getAdminComments({
                page: parseInt(page as string, 10),
                pageSize: parseInt(pageSize as string, 10),
                filter: filter as 'all' | 'pending' | 'approved' | 'deleted',
                postId: postId as string | undefined,
            });

            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            console.error('Error fetching comments:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch comments' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { action, ids, id } = req.body;

            // Single comment actions
            if (id) {
                switch (action) {
                    case 'approve':
                        await approveComment(id);
                        break;
                    case 'reject':
                        await rejectComment(id);
                        break;
                    case 'delete':
                        await softDeleteComment(id);
                        break;
                    case 'restore':
                        await restoreComment(id);
                        break;
                    default:
                        return res.status(400).json({ success: false, error: 'Invalid action' });
                }
                return res.status(200).json({ success: true });
            }

            // Bulk actions
            if (ids && Array.isArray(ids)) {
                switch (action) {
                    case 'approve':
                        await bulkApproveComments(ids);
                        break;
                    case 'delete':
                        await bulkDeleteComments(ids);
                        break;
                    default:
                        return res.status(400).json({ success: false, error: 'Invalid bulk action' });
                }
                return res.status(200).json({ success: true });
            }

            return res.status(400).json({ success: false, error: 'Missing id or ids' });
        } catch (error) {
            console.error('Error updating comments:', error);
            return res.status(500).json({ success: false, error: 'Failed to update comments' });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
