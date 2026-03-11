import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPosts } from '@/services/blog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { posts, total } = await getBlogPosts({}, 1, 100);
        return res.status(200).json({
            success: true,
            total,
            posts: posts.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                is_featured: p.is_featured,
            })),
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ success: false, error: message, stack: err instanceof Error ? err.stack : undefined });
    }
}
