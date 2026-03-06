/**
 * Blog View Count API
 * POST /api/blog/view - Increment view count for a blog post
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabase } from '@/lib/supabase';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.body;
    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Slug is required' });
    }

    try {
        const supabase = createServerSupabase();
        await supabase.rpc('increment_view_count', { post_slug: slug });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('View count increment failed:', error);
        return res.status(500).json({ error: 'Failed to increment view count' });
    }
}
