/**
 * Posts Table Component
 * Displays blog posts in a data table with actions
 */

import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { DataTable } from '@/components/admin/shared/DataTable';
import type { AdminBlogPost, ColumnDef, TableAction } from '@/types/admin';

interface PostsTableProps {
    posts: AdminBlogPost[];
    isLoading?: boolean;
    onDelete?: (post: AdminBlogPost) => void;
    onRestore?: (post: AdminBlogPost) => void;
    showDeleted?: boolean;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
}

export function PostsTable({ posts, isLoading, onDelete, onRestore, showDeleted, pagination }: PostsTableProps) {
    const router = useRouter();

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const columns: ColumnDef<AdminBlogPost>[] = [
        {
            key: 'title',
            header: 'Title',
            sortable: true,
            render: (_, row) => (
                <div className="max-w-xs">
                    <p className="font-medium text-white truncate">{row.title}</p>
                    <p className="text-xs text-gray-500 truncate">{row.slug}</p>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 text-xs bg-white/10 rounded-full">{String(value)}</span>
            ),
        },
        {
            key: 'is_published',
            header: 'Status',
            sortable: true,
            render: (_, row) => (
                <span className={`px-2 py-1 text-xs rounded-full ${row.is_deleted
                        ? 'bg-red-500/20 text-red-400'
                        : row.is_published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {row.is_deleted ? 'Deleted' : row.is_published ? 'Published' : 'Draft'}
                </span>
            ),
        },
        {
            key: 'view_count',
            header: 'Views',
            sortable: true,
            width: '80px',
            render: (value) => <span className="text-gray-400">{Number(value).toLocaleString()}</span>,
        },
        {
            key: 'published_at',
            header: 'Date',
            sortable: true,
            render: (_, row) => (
                <span className="text-gray-400 text-sm">
                    {formatDate(row.published_at || row.created_at)}
                </span>
            ),
        },
    ];

    const handleRowClick = useCallback((post: AdminBlogPost) => {
        router.push(`/admin/posts/${post.id}`);
    }, [router]);

    const actions: TableAction<AdminBlogPost>[] = [
        {
            label: 'Edit',
            onClick: (post) => router.push(`/admin/posts/${post.id}`),
            show: (post) => !post.is_deleted,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
        {
            label: 'View',
            onClick: (post) => window.open(`/nextgen-blog/${post.slug}`, '_blank'),
            show: (post) => post.is_published && !post.is_deleted,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            ),
        },
        {
            label: 'Restore',
            onClick: (post) => onRestore?.(post),
            show: (post) => post.is_deleted && !!onRestore,
            variant: 'success',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
        },
        {
            label: 'Delete',
            onClick: (post) => onDelete?.(post),
            show: (post) => !post.is_deleted && !!onDelete,
            variant: 'danger',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
        },
    ];

    return (
        <DataTable
            data={posts}
            columns={columns}
            isLoading={isLoading}
            actions={actions}
            onRowClick={handleRowClick}
            pagination={pagination}
            emptyTitle={showDeleted ? 'No deleted posts' : 'No posts yet'}
            emptyMessage={showDeleted ? 'The trash is empty.' : 'Create your first blog post to get started.'}
        />
    );
}

export default PostsTable;
