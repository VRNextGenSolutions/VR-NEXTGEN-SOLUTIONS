/**
 * Admin Subscribers Page
 * Manage newsletter subscribers
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminLayout, ProtectedRoute, ConfirmDialog } from '@/components/admin';
import { SubscribersTable } from '@/components/admin/subscribers/SubscribersTable';
import { useAuth } from '@/hooks/useAuth';
import type { AdminSubscriber } from '@/types/admin';

export default function AdminSubscribersPage() {
    const { getAuthHeader } = useAuth();

    const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 20;

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState<AdminSubscriber | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchSubscribers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            });
            if (search) params.append('search', search);

            const response = await fetch(`/api/admin/subscribers?${params}`, {
                headers: getAuthHeader(),
            });
            const data = await response.json();

            if (data.success) {
                setSubscribers(data.data);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, getAuthHeader]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        try {
            const response = await fetch('/api/admin/subscribers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ id: deleteTarget.id }),
            });
            const data = await response.json();

            if (data.success) {
                fetchSubscribers();
                setDeleteTarget(null);
            }
        } catch (error) {
            console.error('Failed to delete subscriber:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ProtectedRoute>
            <AdminLayout title="Subscribers">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Newsletter Subscribers</h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {total} total subscriber{total !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search by email or name..."
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <SubscribersTable
                        subscribers={subscribers}
                        isLoading={isLoading}
                        onDelete={setDeleteTarget}
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
                    title="Remove Subscriber"
                    message={`Are you sure you want to remove ${deleteTarget?.email} from the newsletter? This action cannot be undone.`}
                    confirmLabel="Remove"
                    variant="danger"
                    isLoading={isDeleting}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            </AdminLayout>
        </ProtectedRoute>
    );
}
