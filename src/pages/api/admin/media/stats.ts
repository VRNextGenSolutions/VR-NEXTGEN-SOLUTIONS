/**
 * Storage Stats API
 * GET /api/admin/media/stats - Get storage usage statistics
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';
import { getStorageStats } from '@/utils/media/mediaCleanup';
import { verifyAdmin } from '@/lib/verifyAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Verify admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const supabase = createServiceRoleClient();
        const stats = await getStorageStats(supabase);

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({ success: false, error: 'Failed to get stats' });
    }
}
