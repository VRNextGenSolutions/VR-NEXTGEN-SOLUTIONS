/**
 * Admin Posts API - List and Create
 * GET /api/admin/posts - List posts
 * POST /api/admin/posts - Create post
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { getAdminPosts, createPost, getAllSlugs } from '@/services/admin/posts';
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
    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const { page = '1', pageSize = '10', filter = 'all', search } = req.query;

            const result = await getAdminPosts({
                page: parseInt(page as string, 10),
                pageSize: parseInt(pageSize as string, 10),
                filter: filter as 'all' | 'published' | 'draft' | 'deleted',
                search: search as string | undefined,
            });

            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch posts' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { title, excerpt, content, featured_image, author_name, category, tags, is_published, is_featured, published_at } = req.body;

            // Validation
            if (!title?.trim()) {
                return res.status(400).json({ success: false, error: 'Title is required', field: 'title' });
            }
            if (!excerpt?.trim()) {
                return res.status(400).json({ success: false, error: 'Excerpt is required', field: 'excerpt' });
            }
            if (!content?.trim()) {
                return res.status(400).json({ success: false, error: 'Content is required', field: 'content' });
            }
            if (!category) {
                return res.status(400).json({ success: false, error: 'Category is required', field: 'category' });
            }

            // Generate unique slug
            const existingSlugs = await getAllSlugs();
            const baseSlug = slugify(sanitizeInput(title));
            const slug = uniqueSlug(baseSlug, existingSlugs);

            // Calculate read time
            const read_time_minutes = calculateReadTime(content);

            const post = await createPost({
                title: sanitizeInput(title),
                slug,
                excerpt: sanitizeInput(excerpt),
                content, // Content is sanitized on display, not storage
                featured_image: featured_image || null,
                author_name: author_name ? sanitizeInput(author_name) : undefined,
                category,
                tags: tags || [],
                is_published: is_published || false,
                is_featured: is_featured || false,
                published_at: is_published ? (published_at || new Date().toISOString()) : null,
            });

            try {
                await res.revalidate('/nextgen-blog');
            } catch (revalidateError) {
                console.error('Error revalidating blog list:', revalidateError);
                // Continue execution, don't fail the request
            }

            return res.status(201).json({ success: true, data: post });
        } catch (error) {
            console.error('Error creating post:', error);
            const message = error instanceof Error ? error.message : 'Failed to create post';
            return res.status(500).json({ success: false, error: message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
