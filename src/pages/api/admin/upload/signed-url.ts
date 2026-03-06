/**
 * Signed Upload URL API
 * POST /api/admin/upload/signed-url
 * 
 * Generates a signed URL for direct client-to-Supabase uploads.
 * Used for files > 4MB that exceed Vercel's payload limit.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/verifyAdmin';

const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const { contentType, folder = 'general', extension } = req.body;

        if (!contentType || !extension) {
            return res.status(400).json({ success: false, error: 'Missing contentType or extension' });
        }

        if (!ALLOWED_TYPES.includes(contentType)) {
            return res.status(400).json({ success: false, error: 'Invalid file type' });
        }

        const timestamp = Date.now();
        const path = `${folder}/${timestamp}.${extension}`;

        const supabase = createServiceRoleClient();
        const { data, error } = await supabase.storage
            .from('blog-media')
            .createSignedUploadUrl(path);

        if (error) {
            console.error('Signed URL error:', error);
            return res.status(500).json({ success: false, error: 'Failed to create upload URL' });
        }

        // Build the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('blog-media')
            .getPublicUrl(path);

        return res.status(200).json({
            success: true,
            signedUrl: data.signedUrl,
            token: data.token,
            path,
            publicUrl,
        });
    } catch (error) {
        console.error('Signed URL error:', error);
        return res.status(500).json({ success: false, error: 'Failed to create upload URL' });
    }
}
