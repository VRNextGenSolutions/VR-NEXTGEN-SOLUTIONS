/**
 * File Upload API
 * POST /api/admin/upload - Upload file to Supabase Storage
 * 
 * Features:
 * - Image compression using Sharp
 * - Video support (no compression)
 * - 1 year cache-control headers
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { compressImage, isCompressibleImage, getExtensionForFormat } from '@/utils/media';
import formidable from 'formidable';
import fs from 'fs';

// Disable body parsing, we'll use formidable
export const config = {
    api: {
        bodyParser: false,
    },
};

async function verifyAdmin(req: NextApiRequest): Promise<boolean> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];
    const supabase = createServiceRoleClient();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) return false;

    const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', user.email)
        .single();

    return !!admin;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const form = formidable({
            maxFileSize: 50 * 1024 * 1024, // 50MB for videos up to 1 min
        });

        const [fields, files] = await form.parse(req);

        const file = files.file?.[0];
        if (!file) {
            return res.status(400).json({ success: false, error: 'No file provided' });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
        const mimeType = file.mimetype || '';
        if (!allowedTypes.includes(mimeType)) {
            return res.status(400).json({ success: false, error: 'Invalid file type' });
        }

        // Read file
        let fileBuffer = fs.readFileSync(file.filepath);
        let contentType = mimeType;
        let extension = file.originalFilename?.split('.').pop() || 'webp';

        // Compress images (not videos or GIFs which don't compress well)
        if (isCompressibleImage(mimeType) && mimeType !== 'image/gif') {
            try {
                const compressed = await compressImage(fileBuffer, {
                    maxWidth: 1920,
                    maxHeight: 1080,
                    quality: 80,
                    format: 'webp',
                });

                fileBuffer = compressed.buffer;
                contentType = compressed.contentType;
                extension = 'webp';

                console.log(`Compressed image: ${compressed.originalSize} → ${compressed.compressedSize} (${compressed.compressionRatio}% reduction)`);
            } catch (compressError) {
                console.warn('Compression failed, uploading original:', compressError);
                // Continue with original file if compression fails
            }
        }

        // Generate unique filename
        const folder = fields.folder?.[0] || 'general';
        const timestamp = Date.now();
        const filename = `${folder}/${timestamp}.${extension}`;

        // Upload to Supabase Storage with cache-control
        const supabase = createServiceRoleClient();
        const { error: uploadError } = await supabase.storage
            .from('blog-media')
            .upload(filename, fileBuffer, {
                contentType,
                cacheControl: '31536000', // 1 year cache
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return res.status(500).json({ success: false, error: 'Upload failed' });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('blog-media')
            .getPublicUrl(filename);

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        return res.status(200).json({
            success: true,
            url: publicUrl,
            filename,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ success: false, error: 'Upload failed' });
    }
}
