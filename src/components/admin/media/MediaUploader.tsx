/**
 * Media Uploader Component
 * Upload images and videos to Supabase Storage
 * Supports: JPEG, PNG, WebP, GIF, MP4, WebM
 * 
 * Uses hybrid upload strategy:
 * - Small files (≤4MB): API route for server-side image compression
 * - Large files (>4MB): Direct upload via signed URL (bypasses Vercel limit)
 */

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MediaUploaderProps {
    onUpload: (url: string, type: 'image' | 'video') => void;
    currentMedia?: string;
    currentType?: 'image' | 'video';
    folder?: string;
    acceptVideo?: boolean;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const DIRECT_UPLOAD_THRESHOLD = 4 * 1024 * 1024; // 4MB — above this, bypass Vercel

export function MediaUploader({
    onUpload,
    currentMedia,
    currentType,
    folder = 'general',
    acceptVideo = true
}: MediaUploaderProps) {
    const { getAuthHeader } = useAuth();

    const detectMediaType = (url: string): 'image' | 'video' => {
        if (url && url.match(/\.(mp4|webm)$/i)) return 'video';
        return 'image';
    };

    const initialType = currentType || (currentMedia ? detectMediaType(currentMedia) : 'image');

    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(currentMedia || '');
    const [mediaType, setMediaType] = useState<'image' | 'video'>(initialType);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const getAllowedTypes = () => {
        return acceptVideo
            ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
            : ALLOWED_IMAGE_TYPES;
    };

    const getAcceptString = () => {
        return acceptVideo ? 'image/*,video/mp4,video/webm' : 'image/*';
    };

    /** Upload small files through API route (benefits from server-side compression) */
    const uploadViaApi = async (file: File, authHeaders: Record<string, string>): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const response = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: authHeaders,
            body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Upload failed');
        return data.url;
    };

    /** Upload large files directly to Supabase via signed URL (bypasses Vercel limit) */
    const uploadDirectly = async (file: File, authHeaders: Record<string, string>): Promise<string> => {
        const extension = file.name.split('.').pop() || 'bin';

        // Step 1: Get signed URL from our API (lightweight JSON request)
        const signedRes = await fetch('/api/admin/upload/signed-url', {
            method: 'POST',
            headers: { ...authHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ contentType: file.type, folder, extension }),
        });

        const signedData = await signedRes.json();
        if (!signedData.success) throw new Error(signedData.error || 'Failed to get upload URL');

        // Step 2: Upload file directly to Supabase using XMLHttpRequest for progress
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', signedData.signedUrl, true);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.setRequestHeader('Cache-Control', '31536000');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error(`Upload failed with status ${xhr.status}`));
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.send(file);
        });

        return signedData.publicUrl;
    };

    const handleUpload = useCallback(async (file: File) => {
        setError('');
        setUploadProgress(0);

        const isVideo = file.type.startsWith('video/');

        // Validate file type
        if (!getAllowedTypes().includes(file.type)) {
            setError(`Invalid file type. Allowed: ${acceptVideo ? 'images & videos (MP4, WebM)' : 'images only'}`);
            return;
        }

        // Validate file size
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        if (file.size > maxSize) {
            const sizeMB = Math.round(maxSize / (1024 * 1024));
            setError(`File too large. Max size: ${sizeMB}MB for ${isVideo ? 'videos' : 'images'}`);
            return;
        }

        const type: 'image' | 'video' = isVideo ? 'video' : 'image';
        setMediaType(type);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        setIsUploading(true);

        try {
            const authHeaders = getAuthHeader();
            const useDirect = file.size > DIRECT_UPLOAD_THRESHOLD;
            const url = useDirect
                ? await uploadDirectly(file, authHeaders)
                : await uploadViaApi(file, authHeaders);

            onUpload(url, type);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setPreview(currentMedia || '');
            setMediaType(initialType);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [folder, getAuthHeader, onUpload, currentMedia, currentType, acceptVideo]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const removeMedia = () => {
        setPreview('');
        setMediaType('image');
        onUpload('', 'image');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="space-y-3">
            {preview ? (
                <div className="relative group">
                    {/* Media Preview */}
                    {mediaType === 'video' ? (
                        <video
                            src={preview}
                            className="w-full h-40 object-cover rounded-lg"
                            controls
                            muted
                        />
                    ) : (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                        />
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            title="Replace"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={removeMedia}
                            className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
                            title="Remove"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-3 border-gold/20 border-t-gold rounded-full animate-spin mb-2" />
                            <p className="text-white text-sm">{uploadProgress}%</p>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    className={`
                        h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
                        ${dragActive ? 'border-gold bg-gold/10' : 'border-white/20 hover:border-white/40'}
                    `}
                >
                    <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">
                        {acceptVideo ? 'Drop image or video, or click to upload' : 'Drop image or click to upload'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {acceptVideo ? 'Images: 10MB max | Videos: 50MB max (1 min)' : 'Max 10MB'}
                    </p>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={getAcceptString()}
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
}

export default MediaUploader;
