/**
 * On-Demand Revalidation API
 * POST /api/revalidate - Trigger ISR revalidation for blog pages
 * 
 * Called automatically by admin CRUD operations (create, update, delete posts)
 * to ensure the public blog pages reflect changes immediately.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';

async function verifyAdmin(req: NextApiRequest): Promise<boolean> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];

    try {
        const supabase = createServiceRoleClient();
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user?.email) return false;

        const { data: admin } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', user.email)
            .single();

        return !!admin;
    } catch {
        return false;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { slug } = req.body || {};

    try {
        // Revalidate the blog listing page
        await res.revalidate('/nextgen-blog');

        // If a specific slug is provided, also revalidate that post page
        if (slug && typeof slug === 'string') {
            try {
                await res.revalidate(`/nextgen-blog/${slug}`);
            } catch {
                // Individual post revalidation failure is non-critical
                console.warn(`Failed to revalidate /nextgen-blog/${slug}`);
            }
        }

        return res.status(200).json({ success: true, revalidated: true });
    } catch (error) {
        console.error('Revalidation error:', error);
        return res.status(500).json({ success: false, error: 'Revalidation failed' });
    }
}
