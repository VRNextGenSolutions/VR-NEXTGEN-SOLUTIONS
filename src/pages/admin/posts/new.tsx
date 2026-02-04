/**
 * Create New Post Page
 */

import { AdminLayout, ProtectedRoute } from '@/components/admin';
import { PostForm } from '@/components/admin/posts/PostForm';

export default function NewPostPage() {
    return (
        <ProtectedRoute>
            <AdminLayout title="New Post">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Create New Post</h2>
                        <p className="text-gray-400 text-sm mt-1">Write and publish a new blog article</p>
                    </div>

                    <PostForm />
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
