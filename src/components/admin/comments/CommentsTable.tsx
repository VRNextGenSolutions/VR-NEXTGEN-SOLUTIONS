/**
 * Comments Table Component
 * Displays comments with moderation actions
 */

import { DataTable } from '@/components/admin/shared/DataTable';
import type { AdminComment, ColumnDef, TableAction } from '@/types/admin';

interface CommentsTableProps {
    comments: AdminComment[];
    isLoading?: boolean;
    onApprove?: (comment: AdminComment) => void;
    onReject?: (comment: AdminComment) => void;
    onDelete?: (comment: AdminComment) => void;
    onRestore?: (comment: AdminComment) => void;
    showDeleted?: boolean;
    onBulkApprove?: (ids: string[]) => void;
    onBulkDelete?: (ids: string[]) => void;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
}

export function CommentsTable({
    comments,
    isLoading,
    onApprove,
    onReject,
    onDelete,
    onRestore,
    showDeleted,
    onBulkApprove,
    onBulkDelete,
    pagination,
}: CommentsTableProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns: ColumnDef<AdminComment>[] = [
        {
            key: 'content',
            header: 'Comment',
            render: (_, row) => (
                <div className="max-w-md">
                    <p className="text-white text-sm line-clamp-2">{row.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        by {row.author_name} ({row.author_email})
                    </p>
                </div>
            ),
        },
        {
            key: 'post_title',
            header: 'Post',
            render: (_, row) => (
                <a
                    href={`/nextgen-blog/${row.post_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 text-sm line-clamp-1"
                >
                    {row.post_title}
                </a>
            ),
        },
        {
            key: 'is_approved',
            header: 'Status',
            sortable: true,
            render: (_, row) => (
                <span className={`px-2 py-1 text-xs rounded-full ${row.is_deleted
                        ? 'bg-red-500/20 text-red-400'
                        : row.is_approved
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {row.is_deleted ? 'Deleted' : row.is_approved ? 'Approved' : 'Pending'}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: 'Date',
            sortable: true,
            render: (value) => (
                <span className="text-gray-400 text-sm">{formatDate(String(value))}</span>
            ),
        },
    ];

    const actions: TableAction<AdminComment>[] = [
        {
            label: 'Approve',
            onClick: (comment) => onApprove?.(comment),
            show: (comment) => !comment.is_approved && !comment.is_deleted && !!onApprove,
            variant: 'success',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        {
            label: 'Reject',
            onClick: (comment) => onReject?.(comment),
            show: (comment) => comment.is_approved && !comment.is_deleted && !!onReject,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
        {
            label: 'Restore',
            onClick: (comment) => onRestore?.(comment),
            show: (comment) => comment.is_deleted && !!onRestore,
            variant: 'success',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
        },
        {
            label: 'Delete',
            onClick: (comment) => onDelete?.(comment),
            show: (comment) => !comment.is_deleted && !!onDelete,
            variant: 'danger',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
        },
    ];

    const bulkActions = onBulkApprove || onBulkDelete ? [
        ...(onBulkApprove && !showDeleted ? [{
            label: 'Approve Selected',
            onClick: onBulkApprove,
            variant: 'default' as const,
        }] : []),
        ...(onBulkDelete && !showDeleted ? [{
            label: 'Delete Selected',
            onClick: onBulkDelete,
            variant: 'danger' as const,
        }] : []),
    ] : undefined;

    return (
        <DataTable
            data={comments}
            columns={columns}
            isLoading={isLoading}
            actions={actions}
            bulkActions={bulkActions}
            pagination={pagination}
            emptyTitle={showDeleted ? 'No deleted comments' : 'No comments'}
            emptyMessage={showDeleted ? 'The trash is empty.' : 'No comments to moderate.'}
        />
    );
}

export default CommentsTable;
