/**
 * Admin Comments Page
 * Moderate blog comments
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminLayout, ProtectedRoute, ConfirmDialog } from '@/components/admin';
import { CommentsTable } from '@/components/admin/comments/CommentsTable';
import { useAuth } from '@/hooks/useAuth';
import type { AdminComment } from '@/types/admin';

type FilterType = 'all' | 'pending' | 'approved' | 'deleted';

export default function AdminCommentsPage() {
    const { getAuthHeader } = useAuth();

    const [comments, setComments] = useState<AdminComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('pending');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 20;

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                filter,
            });

            const response = await fetch(`/api/admin/comments?${params}`, {
                headers: getAuthHeader(),
            });
            const data = await response.json();

            if (data.success) {
                setComments(data.data);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, filter, getAuthHeader]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAction = async (action: string, comment: AdminComment) => {
        try {
            const response = await fetch('/api/admin/comments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ action, id: comment.id }),
            });
            const data = await response.json();

            if (data.success) {
                fetchComments();
            }
        } catch (error) {
            console.error(`Failed to ${action} comment:`, error);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        try {
            const response = await fetch('/api/admin/comments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ action: 'delete', id: deleteTarget.id }),
            });
            const data = await response.json();

            if (data.success) {
                fetchComments();
                setDeleteTarget(null);
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkAction = async (action: string, ids: string[]) => {
        try {
            const response = await fetch('/api/admin/comments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ action, ids }),
            });
            const data = await response.json();

            if (data.success) {
                fetchComments();
            }
        } catch (error) {
            console.error(`Failed to bulk ${action} comments:`, error);
        }
    };

    const filters: { label: string; value: FilterType }[] = [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'All', value: 'all' },
        { label: 'Deleted', value: 'deleted' },
    ];

    return (
        <ProtectedRoute>
            <AdminLayout title="Comments">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-white">Comments</h2>
                        <p className="text-gray-400 text-sm mt-1">Moderate and manage blog comments</p>
                    </div>

                    {/* Filters */}
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

                    {/* Table */}
                    <CommentsTable
                        comments={comments}
                        isLoading={isLoading}
                        onApprove={(c) => handleAction('approve', c)}
                        onReject={(c) => handleAction('reject', c)}
                        onDelete={setDeleteTarget}
                        onRestore={(c) => handleAction('restore', c)}
                        showDeleted={filter === 'deleted'}
                        onBulkApprove={(ids) => handleBulkAction('approve', ids)}
                        onBulkDelete={(ids) => handleBulkAction('delete', ids)}
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
                    title="Delete Comment"
                    message="Are you sure you want to delete this comment? It will be moved to trash."
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
