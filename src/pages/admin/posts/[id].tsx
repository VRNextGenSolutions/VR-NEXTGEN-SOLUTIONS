/**
 * Edit Post Page
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout, ProtectedRoute, LoadingSpinner } from '@/components/admin';
import { PostForm } from '@/components/admin/posts/PostForm';
import { useAuth } from '@/hooks/useAuth';
import type { AdminBlogPost } from '@/types/admin';

export default function EditPostPage() {
    const router = useRouter();
    const { id } = router.query;
    const { getAuthHeader } = useAuth();

    const [post, setPost] = useState<AdminBlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/admin/posts/${id}`, {
                    headers: getAuthHeader(),
                });
                const data = await response.json();

                if (data.success) {
                    setPost(data.data);
                } else {
                    setError(data.error || 'Post not found');
                }
            } catch {
                setError('Failed to load post');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id, getAuthHeader]);

    if (isLoading) {
        return (
            <ProtectedRoute>
                <AdminLayout title="Loading...">
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    if (error || !post) {
        return (
            <ProtectedRoute>
                <AdminLayout title="Error">
                    <div className="text-center py-20">
                        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                        <p className="text-gray-400">{error || 'Post not found'}</p>
                        <button
                            onClick={() => router.push('/admin/posts')}
                            className="mt-4 px-4 py-2 bg-gold text-black rounded-lg"
                        >
                            Back to Posts
                        </button>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <AdminLayout title={`Edit: ${post.title}`}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Edit Post</h2>
                            <p className="text-gray-400 text-sm mt-1">{post.title}</p>
                        </div>
                        {post.is_published && (
                            <a
                                href={`/nextgen-blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80"
                            >
                                View Live
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>

                    <PostForm post={post} />
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
