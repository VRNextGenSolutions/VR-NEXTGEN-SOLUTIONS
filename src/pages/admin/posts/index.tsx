/**
 * Admin Posts List Page
 * View and manage all blog posts
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AdminLayout, ProtectedRoute, ConfirmDialog } from '@/components/admin';
import { PostsTable } from '@/components/admin/posts/PostsTable';
import { useAuth } from '@/hooks/useAuth';
import type { AdminBlogPost } from '@/types/admin';

type FilterType = 'all' | 'published' | 'draft' | 'deleted';

export default function AdminPostsPage() {
    const router = useRouter();
    const { getAuthHeader } = useAuth();

    const [posts, setPosts] = useState<AdminBlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 10;

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                filter,
            });
            if (search) params.append('search', search);

            const response = await fetch(`/api/admin/posts?${params}`, {
                headers: getAuthHeader(),
            });
            const data = await response.json();

            if (data.success) {
                setPosts(data.data);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, filter, search, getAuthHeader]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/posts/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            const data = await response.json();

            if (data.success) {
                fetchPosts();
                setDeleteTarget(null);
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRestore = async (post: AdminBlogPost) => {
        try {
            const response = await fetch(`/api/admin/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ restore: true }),
            });
            const data = await response.json();

            if (data.success) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Failed to restore post:', error);
        }
    };

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Published', value: 'published' },
        { label: 'Drafts', value: 'draft' },
        { label: 'Deleted', value: 'deleted' },
    ];

    return (
        <ProtectedRoute>
            <AdminLayout title="Posts">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
                            <p className="text-gray-400 text-sm mt-1">Create and manage your blog content</p>
                        </div>
                        <Link
                            href="/admin/posts/new"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Post
                        </Link>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex gap-2">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => { setFilter(f.value); setPage(1); }}
                                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${filter === f.value
                                            ? 'bg-gold text-black font-medium'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search posts..."
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <PostsTable
                        posts={posts}
                        isLoading={isLoading}
                        onDelete={setDeleteTarget}
                        onRestore={handleRestore}
                        showDeleted={filter === 'deleted'}
                        pagination={{
                            page,
                            pageSize,
                            total,
                            onPageChange: setPage,
                        }}
                    />
                </div>

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={!!deleteTarget}
                    title="Delete Post"
                    message={`Are you sure you want to delete "${deleteTarget?.title}"? It will be moved to trash and can be restored later.`}
                    confirmLabel="Delete"
                    variant="danger"
                    isLoading={isDeleting}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            </AdminLayout>
        </ProtectedRoute>
    );
}
