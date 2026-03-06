/**
 * Admin Auth Verification API
 * Verifies if the authenticated user is in the admin_users table.
 * Requires a valid Bearer JWT — no longer accepts raw email.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';

interface VerifyResponse {
    isAdmin: boolean;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VerifyResponse>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ isAdmin: false, error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ isAdmin: false, error: 'Missing authorization' });
        }

        const token = authHeader.split(' ')[1];
        const supabase = createServiceRoleClient();

        // Validate JWT and extract user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user?.email) {
            return res.status(401).json({ isAdmin: false, error: 'Invalid token' });
        }

        // Check admin_users table
        const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', user.email.toLowerCase())
            .single();

        if (error || !data) {
            return res.status(200).json({ isAdmin: false });
        }

        return res.status(200).json({ isAdmin: true });
    } catch (error) {
        console.error('Admin verification error:', error);
        return res.status(500).json({ isAdmin: false, error: 'Verification failed' });
    }
}
