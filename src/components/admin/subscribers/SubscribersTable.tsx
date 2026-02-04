/**
 * Subscribers Table Component
 */

import { DataTable } from '@/components/admin/shared/DataTable';
import type { AdminSubscriber, ColumnDef, TableAction } from '@/types/admin';

interface SubscribersTableProps {
    subscribers: AdminSubscriber[];
    isLoading?: boolean;
    onDelete?: (subscriber: AdminSubscriber) => void;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
}

export function SubscribersTable({
    subscribers,
    isLoading,
    onDelete,
    pagination,
}: SubscribersTableProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const columns: ColumnDef<AdminSubscriber>[] = [
        {
            key: 'email',
            header: 'Email',
            sortable: true,
            render: (value) => (
                <span className="text-white font-medium">{String(value)}</span>
            ),
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (value) => (
                <span className="text-gray-300">{value ? String(value) : '-'}</span>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (_, row) => (
                <span className={`px-2 py-1 text-xs rounded-full ${row.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'subscribed_at',
            header: 'Subscribed',
            sortable: true,
            render: (value) => (
                <span className="text-gray-400 text-sm">{formatDate(String(value))}</span>
            ),
        },
    ];

    const actions: TableAction<AdminSubscriber>[] = onDelete ? [
        {
            label: 'Remove',
            onClick: onDelete,
            variant: 'danger',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
        },
    ] : [];

    return (
        <DataTable
            data={subscribers}
            columns={columns}
            isLoading={isLoading}
            actions={actions}
            pagination={pagination}
            emptyTitle="No subscribers"
            emptyMessage="No one has subscribed to the newsletter yet."
        />
    );
}

export default SubscribersTable;
