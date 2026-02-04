/**
 * Reusable Data Table Component
 * Table with sorting, pagination, and bulk actions
 */

import { useState, useCallback } from 'react';
import type { ColumnDef, TableAction } from '@/types/admin';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface DataTableProps<T extends { id: string }> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean;
    actions?: TableAction<T>[];
    onRowClick?: (row: T) => void;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
    bulkActions?: {
        label: string;
        onClick: (selectedIds: string[]) => void;
        variant?: 'default' | 'danger';
    }[];
    emptyTitle?: string;
    emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    isLoading,
    actions,
    onRowClick,
    pagination,
    bulkActions,
    emptyTitle = 'No data found',
    emptyMessage = 'There are no items to display.',
}: DataTableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const allSelected = data.length > 0 && selectedIds.size === data.length;
    const someSelected = selectedIds.size > 0 && selectedIds.size < data.length;

    const toggleAll = useCallback(() => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(data.map(item => item.id)));
        }
    }, [allSelected, data]);

    const toggleOne = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleSort = useCallback((key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }, [sortKey]);

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        const direction = sortDirection === 'asc' ? 1 : -1;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * direction;
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * direction;
        }
        // Fallback for other types - convert to string
        const aStr = String(aVal ?? '');
        const bStr = String(bVal ?? '');
        return aStr.localeCompare(bStr) * direction;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (data.length === 0) {
        return <EmptyState title={emptyTitle} message={emptyMessage} />;
    }

    const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

    return (
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            {/* Bulk Actions */}
            {bulkActions && selectedIds.size > 0 && (
                <div className="px-4 py-3 bg-gold/10 border-b border-gold/20 flex items-center gap-4">
                    <span className="text-sm text-gold">{selectedIds.size} selected</span>
                    <div className="flex gap-2">
                        {bulkActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => action.onClick(Array.from(selectedIds))}
                                className={`px-3 py-1.5 text-sm rounded-lg ${action.variant === 'danger'
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-gold/20 text-gold hover:bg-gold/30'
                                    } transition-colors`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            {bulkActions && (
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={el => { if (el) el.indeterminate = someSelected; }}
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-white/20 bg-transparent text-gold focus:ring-gold/20"
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`px-4 py-3 text-left text-sm font-medium text-gray-400 ${col.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.header}
                                        {col.sortable && sortKey === String(col.key) && (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="w-24 px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedData.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row)}
                                className={`hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {bulkActions && (
                                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(row.id)}
                                            onChange={() => toggleOne(row.id)}
                                            className="w-4 h-4 rounded border-white/20 bg-transparent text-gold focus:ring-gold/20"
                                        />
                                    </td>
                                )}
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="px-4 py-4 text-sm text-gray-300">
                                        {col.render
                                            ? col.render((row as Record<string, unknown>)[String(col.key)] as T[keyof T], row)
                                            : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2">
                                            {actions.filter(a => !a.show || a.show(row)).map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => action.onClick(row)}
                                                    className={`p-2 rounded-lg transition-colors ${action.variant === 'danger'
                                                        ? 'hover:bg-red-500/20 text-red-400'
                                                        : action.variant === 'success'
                                                            ? 'hover:bg-green-500/20 text-green-400'
                                                            : 'hover:bg-white/10 text-gray-400'
                                                        }`}
                                                    title={action.label}
                                                >
                                                    {action.icon}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= totalPages}
                            className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
