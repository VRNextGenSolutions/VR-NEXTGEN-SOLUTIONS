import { createServerSupabase, getFeaturedImageUrl } from '@/lib/supabase';
import type { BlogPost, BlogPostSummary, BlogFilters, BlogPostsResponse } from '@/types/blog';

export async function getBlogPosts(
    filters: BlogFilters = {},
    page = 1,
    pageSize = 9
): Promise<BlogPostsResponse> {
    const supabase = createServerSupabase();
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .eq('is_deleted', false);

    if (filters.category) {
        query = query.eq('category', filters.category);
    }

    if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
    }

    // Sort handling
    switch (filters.sort) {
        case 'oldest':
            query = query.order('published_at', { ascending: true });
            break;
        case 'popular':
            query = query.order('view_count', { ascending: false });
            break;
        case 'newest':
        default:
            query = query.order('published_at', { ascending: false });
    }

    const { data, count, error } = await query.range(start, end);

    if (error) {
        console.error('Error fetching blog posts:', error);
        return { posts: [], total: 0, page, pageSize };
    }

    const posts: BlogPostSummary[] = (data as BlogPost[])?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featured_image: post.featured_image || getFeaturedImageUrl(post.slug),
        author_name: post.author_name,
        category: post.category,
        read_time_minutes: post.read_time_minutes,
        published_at: post.published_at,
        is_featured: post.is_featured,
    })) || [];

    return {
        posts,
        total: count || 0,
        page,
        pageSize,
    };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .eq('is_deleted', false)
        .single();

    if (error || !data) return null;

    return {
        ...data,
        featured_image: data.featured_image || getFeaturedImageUrl(data.slug),
    };
}

export async function getRelatedPosts(currentSlug: string, category: string, limit = 3): Promise<BlogPostSummary[]> {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, author_name, category, read_time_minutes, published_at, is_featured')
        .eq('is_published', true)
        .eq('is_deleted', false)
        .eq('category', category)
        .neq('slug', currentSlug)
        .limit(limit);

    if (error) return [];

    return (data as BlogPostSummary[]).map(post => ({
        ...post,
        featured_image: post.featured_image || getFeaturedImageUrl(post.slug),
    }));
}
