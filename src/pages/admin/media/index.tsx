/**
 * Admin Media Library Page
 * View, upload, and manage media files (images and videos)
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminLayout, ProtectedRoute, ConfirmDialog, LoadingSpinner, EmptyState } from '@/components/admin';
import { MediaUploader } from '@/components/admin/media/MediaUploader';
import { useAuth } from '@/hooks/useAuth';

interface MediaFile {
    id: string;
    name: string;
    path: string;
    url: string;
    size: number;
    created_at: string;
}

export default function MediaLibraryPage() {
    const { getAuthHeader } = useAuth();
    const [storageStats, setStorageStats] = useState<{ totalSizeMB: string; totalFiles: number; usagePercent: number } | null>(null);
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/media/stats', {
                headers: getAuthHeader(),
            });
            const data = await response.json();
            if (data.success) {
                setStorageStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, [getAuthHeader]);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/media', {
                headers: getAuthHeader(),
            });
            const data = await response.json();
            if (data.success) {
                setFiles(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setLoading(false);
        }
    }, [getAuthHeader]);

    useEffect(() => {
        fetchMedia();
        fetchStats();
    }, [fetchMedia, fetchStats]);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            const response = await fetch('/api/admin/media', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ path: deleteTarget.path }),
            });

            if (response.ok) {
                setFiles(files.filter(f => f.id !== deleteTarget.id));
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
        } finally {
            setDeleteTarget(null);
        }
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Media Library</h1>
                            <p className="text-gray-400 mt-1">
                                {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                            </p>
                        </div>
                    </div>

                    {/* Storage Stats */}
                    {storageStats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-gray-400 text-sm mb-1">Total Storage</h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-white">{storageStats.totalSizeMB} MB</span>
                                    <span className="text-sm text-gray-500 mb-1">/ 1 GB</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${storageStats.usagePercent > 80 ? 'bg-red-500' : 'bg-gold'}`}
                                        style={{ width: `${Math.min(storageStats.usagePercent, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{storageStats.usagePercent}% used</p>
                            </div>

                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-gray-400 text-sm mb-1">Total Files</h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-white">{storageStats.totalFiles}</span>
                                    <span className="text-sm text-gray-500 mb-1">files</span>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Images & Videos</span>
                                        <span>{files.length} loaded</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Upload Section */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Upload New Media</h2>
                        <MediaUploader
                            onUpload={() => {
                                fetchMedia(); // Refresh the list after upload
                                fetchStats(); // Refresh stats
                            }}
                            acceptVideo={true}
                        />
                    </div>

                    {/* Gallery */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">All Media</h2>

                        {loading ? (
                            <LoadingSpinner />
                        ) : files.length === 0 ? (
                            <EmptyState
                                title="No media files"
                                message="Upload your first image or video using the uploader above."
                            />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="group relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-gold/50 transition-colors"
                                    >
                                        {/* Media Preview */}
                                        <div className="aspect-square relative">
                                            {file.name.match(/\.(mp4|webm)$/i) ? (
                                                <video
                                                    src={file.url}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    playsInline
                                                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                                                    onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
                                                />
                                            ) : (
                                                <img
                                                    src={file.url}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}

                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => copyToClipboard(file.url, file.id)}
                                                    className="p-2 bg-gold text-black rounded-lg hover:bg-gold/80 transition-colors"
                                                    title="Copy URL"
                                                >
                                                    {copiedId === file.id ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(file)}
                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* File info */}
                                        <div className="p-2">
                                            <p className="text-xs text-gray-400 truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={!!deleteTarget}
                    title="Delete Media"
                    message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                    confirmLabel="Delete"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    variant="danger"
                />
            </AdminLayout>
        </ProtectedRoute>
    );
}
