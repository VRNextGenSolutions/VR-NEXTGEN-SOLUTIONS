export type BlogCategory =
    | 'Technology'
    | 'Business'
    | 'Insights'
    | 'Case Studies'
    | 'Company News';

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
    'Technology',
    'Business',
    'Insights',
    'Case Studies',
    'Company News'
] as const;

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    author_name: string;
    author_avatar: string;
    category: BlogCategory;
    tags: string[];
    read_time_minutes: number;
    is_published: boolean;
    is_featured: boolean;
    view_count: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type BlogPostSummary = Pick<BlogPost,
    | 'id'
    | 'title'
    | 'slug'
    | 'excerpt'
    | 'featured_image'
    | 'author_name'
    | 'category'
    | 'read_time_minutes'
    | 'published_at'
    | 'is_featured'
>;

export interface BlogComment {
    id: string;
    post_id: string;
    parent_id: string | null;
    author_name: string;
    author_email: string;
    content: string;
    is_approved: boolean;
    is_deleted?: boolean;
    deleted_at?: string | null;
    created_at: string;
}

// Form types
export interface CommentFormData {
    author_name: string;
    author_email: string;
    content: string;
    honeypot?: string;
}

export interface NewsletterFormData {
    email: string;
    name?: string;
    honeypot?: string;
}

// API response types
export interface BlogPostsResponse {
    posts: BlogPostSummary[];
    total: number;
    page: number;
    pageSize: number;
}

// Filter/sort types
export type SortOrder = 'newest' | 'oldest' | 'popular';

export interface BlogFilters {
    category?: BlogCategory;
    search?: string;
    sort?: SortOrder;
}
