import { createServerSupabase } from '@/lib/supabase';
import type { BlogComment } from '@/types/blog';

export async function getComments(postId: string): Promise<BlogComment[]> {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true }); // Chronological for conversation flow

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }

    return data as BlogComment[];
}

export async function getCommentCount(postId: string): Promise<number> {
    const supabase = createServerSupabase();

    const { count, error } = await supabase
        .from('blog_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('is_approved', true);

    if (error) return 0;
    return count || 0;
}
