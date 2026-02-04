/**
 * Admin Posts API - Single Post Operations
 * GET /api/admin/posts/[id] - Get post
 * PUT /api/admin/posts/[id] - Update post
 * DELETE /api/admin/posts/[id] - Soft delete post
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { getAdminPostById, updatePost, softDeletePost, restorePost, getAllSlugs } from '@/services/admin/posts';
import { slugify, uniqueSlug } from '@/utils/admin/slugify';
import { calculateReadTime } from '@/utils/admin/readTime';
import { sanitizeInput } from '@/utils/security';

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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid post ID' });
    }

    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const post = await getAdminPostById(id);

            if (!post) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            return res.status(200).json({ success: true, data: post });
        } catch (error) {
            console.error('Error fetching post:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch post' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { title, slug, excerpt, content, featured_image, author_name, category, tags, is_published, is_featured, published_at, restore } = req.body;

            // Handle restore action
            if (restore === true) {
                await restorePost(id);
                const restored = await getAdminPostById(id);
                return res.status(200).json({ success: true, data: restored });
            }

            // Get current post
            const currentPost = await getAdminPostById(id);
            if (!currentPost) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            // Handle slug change
            let finalSlug = currentPost.slug;
            if (slug && slug !== currentPost.slug) {
                const existingSlugs = await getAllSlugs();
                const filteredSlugs = existingSlugs.filter(s => s !== currentPost.slug);
                finalSlug = uniqueSlug(slugify(slug), filteredSlugs);
            } else if (title && title !== currentPost.title) {
                // Auto-update slug if title changed and slug wasn't manually set
                const existingSlugs = await getAllSlugs();
                const filteredSlugs = existingSlugs.filter(s => s !== currentPost.slug);
                const baseSlug = slugify(sanitizeInput(title));
                finalSlug = uniqueSlug(baseSlug, filteredSlugs);
            }

            // Calculate read time if content changed
            const read_time_minutes = content ? calculateReadTime(content) : currentPost.read_time_minutes;

            // Determine published_at
            let finalPublishedAt = currentPost.published_at;
            if (is_published && !currentPost.is_published) {
                // Publishing for the first time
                finalPublishedAt = published_at || new Date().toISOString();
            } else if (!is_published) {
                // Unpublishing - keep the date for when they republish
                finalPublishedAt = currentPost.published_at;
            }

            const updated = await updatePost({
                id,
                title: title ? sanitizeInput(title) : undefined,
                slug: finalSlug,
                excerpt: excerpt ? sanitizeInput(excerpt) : undefined,
                content,
                featured_image,
                author_name: author_name ? sanitizeInput(author_name) : undefined,
                category,
                tags,
                is_published,
                is_featured,
                published_at: finalPublishedAt,
            });

            return res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating post:', error);
            const message = error instanceof Error ? error.message : 'Failed to update post';
            return res.status(500).json({ success: false, error: message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await softDeletePost(id);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting post:', error);
            return res.status(500).json({ success: false, error: 'Failed to delete post' });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
