/**
 * Admin Posts Service
 * Server-side functions for blog post management
 */

import { createServiceRoleClient } from '@/lib/supabase';
import type { AdminBlogPost, CreatePostPayload, UpdatePostPayload, PaginatedResponse } from '@/types/admin';

interface GetPostsOptions {
    page?: number;
    pageSize?: number;
    includeDeleted?: boolean;
    filter?: 'all' | 'published' | 'draft' | 'deleted';
    search?: string;
}

export async function getAdminPosts(options: GetPostsOptions = {}): Promise<PaginatedResponse<AdminBlogPost>> {
    const { page = 1, pageSize = 10, filter = 'all', search } = options;
    const supabase = createServiceRoleClient();

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

    // Apply filters
    switch (filter) {
        case 'published':
            query = query.eq('is_published', true).eq('is_deleted', false);
            break;
        case 'draft':
            query = query.eq('is_published', false).eq('is_deleted', false);
            break;
        case 'deleted':
            query = query.eq('is_deleted', true);
            break;
        default:
            query = query.eq('is_deleted', false);
    }

    // Search
    if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
    }

    return {
        data: (data as AdminBlogPost[]) || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
    };
}

export async function getAdminPostById(id: string): Promise<AdminBlogPost | null> {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data as AdminBlogPost;
}

export async function createPost(payload: CreatePostPayload): Promise<AdminBlogPost> {
    const supabase = createServiceRoleClient();

    // Check slug uniqueness (only among non-deleted posts)
    const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', payload.slug)
        .eq('is_deleted', false)
        .single();

    if (existing) {
        throw new Error('A post with this slug already exists');
    }

    const { data, error } = await supabase
        .from('blog_posts')
        .insert({
            ...payload,
            author_name: payload.author_name || 'VR NextGEN Team',
            tags: payload.tags || [],
            is_published: payload.is_published || false,
            is_featured: payload.is_featured || false,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
    }

    return data as AdminBlogPost;
}

export async function updatePost(payload: UpdatePostPayload): Promise<AdminBlogPost> {
    const supabase = createServiceRoleClient();
    const { id, ...updates } = payload;

    // Check slug uniqueness if changing (only among non-deleted posts)
    if (updates.slug) {
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', updates.slug)
            .eq('is_deleted', false)
            .neq('id', id)
            .single();

        if (existing) {
            throw new Error('A post with this slug already exists');
        }
    }

    const { data, error } = await supabase
        .from('blog_posts')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating post:', error);
        throw new Error('Failed to update post');
    }

    return data as AdminBlogPost;
}

export async function softDeletePost(id: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_posts')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
}

export async function restorePost(id: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_posts')
        .update({
            is_deleted: false,
            deleted_at: null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error restoring post:', error);
        throw new Error('Failed to restore post');
    }
}

export async function getAllSlugs(): Promise<string[]> {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('is_deleted', false);

    if (error) return [];
    return data.map(p => p.slug);
}
