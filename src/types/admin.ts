/**
 * Admin Portal Type Definitions
 * Types for authentication, admin operations, and API responses
 */

import type { User, Session } from '@supabase/supabase-js';

// =====================================================
// AUTH TYPES
// =====================================================

export interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = void> {
    success: boolean;
    data?: T;
    error?: string;
    field?: string; // For validation errors
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// =====================================================
// ADMIN POST TYPES
// =====================================================

export interface AdminBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    author_name: string;
    author_avatar: string | null;
    category: string;
    tags: string[];
    read_time_minutes: number;
    is_published: boolean;
    is_featured: boolean;
    is_deleted: boolean;
    view_count: number;
    published_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreatePostPayload {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image?: string | null;
    author_name?: string;
    category: string;
    tags?: string[];
    is_published?: boolean;
    is_featured?: boolean;
    published_at?: string | null;
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {
    id: string;
}

// =====================================================
// ADMIN COMMENT TYPES
// =====================================================

export interface AdminBlogComment {
    id: string;
    post_id: string;
    parent_id: string | null;
    author_name: string;
    author_email: string;
    content: string;
    is_approved: boolean;
    is_deleted: boolean;
    deleted_at: string | null;
    created_at: string;
    // Joined data
    post_title?: string;
    post_slug?: string;
}

// Alias for convenience
export type AdminComment = AdminBlogComment;

// =====================================================
// ADMIN SUBSCRIBER TYPES
// =====================================================

export interface AdminSubscriber {
    id: string;
    email: string;
    name: string | null;
    is_active: boolean;
    subscribed_at: string;
}

// =====================================================
// MEDIA TYPES
// =====================================================

export interface MediaFile {
    id: string;
    name: string;
    bucket_id: string;
    created_at: string;
    updated_at: string;
    metadata: {
        size: number;
        mimetype: string;
    };
    publicUrl: string;
}

export interface UploadProgress {
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    error?: string;
    url?: string;
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface DashboardStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    pendingComments: number;
    activeSubscribers: number;
}

// =====================================================
// TABLE TYPES
// =====================================================

export interface ColumnDef<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    width?: string;
}

export interface TableAction<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: 'default' | 'danger' | 'success';
    show?: (row: T) => boolean;
}
