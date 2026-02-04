/**
 * Admin Subscribers API
 * GET /api/admin/subscribers - List subscribers
 * DELETE /api/admin/subscribers - Remove subscriber
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import type { AdminSubscriber, PaginatedResponse } from '@/types/admin';

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

async function getSubscribers(options: { page: number; pageSize: number; search?: string }): Promise<PaginatedResponse<AdminSubscriber>> {
    const { page, pageSize, search } = options;
    const supabase = createServiceRoleClient();

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact' });

    if (search) {
        query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data, count, error } = await query
        .order('subscribed_at', { ascending: false })
        .range(start, end);

    if (error) throw new Error('Failed to fetch subscribers');

    return {
        data: (data || []) as AdminSubscriber[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const { page = '1', pageSize = '20', search } = req.query;

            const result = await getSubscribers({
                page: parseInt(page as string, 10),
                pageSize: parseInt(pageSize as string, 10),
                search: search as string | undefined,
            });

            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ success: false, error: 'Missing subscriber ID' });
            }

            const supabase = createServiceRoleClient();
            const { error } = await supabase
                .from('newsletter_subscribers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            return res.status(500).json({ success: false, error: 'Failed to delete subscriber' });
        }
    }

    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
