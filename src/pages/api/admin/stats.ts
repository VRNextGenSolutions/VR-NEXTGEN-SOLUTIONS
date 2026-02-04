/**
 * Dashboard Stats API
 * Returns aggregate statistics for the admin dashboard
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import type { DashboardStats } from '@/types/admin';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DashboardStats | { error: string }>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createServiceRoleClient();

        // Fetch all stats in parallel
        const [
            postsResult,
            publishedResult,
            draftResult,
            viewsResult,
            pendingResult,
            subscribersResult,
        ] = await Promise.all([
            supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
            supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_published', true).eq('is_deleted', false),
            supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_published', false).eq('is_deleted', false),
            supabase.from('blog_posts').select('view_count').eq('is_deleted', false),
            supabase.from('blog_comments').select('id', { count: 'exact', head: true }).eq('is_approved', false).eq('is_deleted', false),
            supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('is_active', true),
        ]);

        // Calculate total views
        const totalViews = viewsResult.data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

        const stats: DashboardStats = {
            totalPosts: postsResult.count || 0,
            publishedPosts: publishedResult.count || 0,
            draftPosts: draftResult.count || 0,
            totalViews,
            pendingComments: pendingResult.count || 0,
            activeSubscribers: subscribersResult.count || 0,
        };

        return res.status(200).json(stats);
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return res.status(500).json({ error: 'Failed to fetch stats' });
    }
}
