/**
 * Admin Comments Service
 * Server-side functions for comment moderation
 */

import { createServiceRoleClient } from '@/lib/supabase';
import type { AdminComment, PaginatedResponse } from '@/types/admin';

interface GetCommentsOptions {
    page?: number;
    pageSize?: number;
    filter?: 'all' | 'pending' | 'approved' | 'deleted';
    postId?: string;
}

export async function getAdminComments(options: GetCommentsOptions = {}): Promise<PaginatedResponse<AdminComment>> {
    const { page = 1, pageSize = 20, filter = 'all', postId } = options;
    const supabase = createServiceRoleClient();

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
        .from('blog_comments')
        .select(`
            *,
            blog_posts!inner(title, slug)
        `, { count: 'exact' });

    // Apply filters
    switch (filter) {
        case 'pending':
            query = query.eq('is_approved', false).eq('is_deleted', false);
            break;
        case 'approved':
            query = query.eq('is_approved', true).eq('is_deleted', false);
            break;
        case 'deleted':
            query = query.eq('is_deleted', true);
            break;
        default:
            query = query.eq('is_deleted', false);
    }

    if (postId) {
        query = query.eq('post_id', postId);
    }

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments');
    }

    // Transform to include post info
    const comments: AdminComment[] = (data || []).map((comment) => ({
        ...comment,
        post_title: comment.blog_posts?.title || 'Unknown Post',
        post_slug: comment.blog_posts?.slug || '',
    }));

    return {
        data: comments,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
    };
}

export async function approveComment(id: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: true })
        .eq('id', id);

    if (error) {
        console.error('Error approving comment:', error);
        throw new Error('Failed to approve comment');
    }
}

export async function rejectComment(id: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: false })
        .eq('id', id);

    if (error) {
        console.error('Error rejecting comment:', error);
        throw new Error('Failed to reject comment');
    }
}

export async function softDeleteComment(id: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_comments')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error deleting comment:', error);
        throw new Error('Failed to delete comment');
    }
}

export async function restoreComment(id: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_comments')
        .update({
            is_deleted: false,
            deleted_at: null,
        })
        .eq('id', id);

    if (error) {
        console.error('Error restoring comment:', error);
        throw new Error('Failed to restore comment');
    }
}

export async function bulkApproveComments(ids: string[]): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: true })
        .in('id', ids);

    if (error) {
        console.error('Error bulk approving comments:', error);
        throw new Error('Failed to approve comments');
    }
}

export async function bulkDeleteComments(ids: string[]): Promise<void> {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('blog_comments')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
        })
        .in('id', ids);

    if (error) {
        console.error('Error bulk deleting comments:', error);
        throw new Error('Failed to delete comments');
    }
}
