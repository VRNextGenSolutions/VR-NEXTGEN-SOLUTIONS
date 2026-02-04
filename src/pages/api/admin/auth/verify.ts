/**
 * Admin Auth Verification API
 * Verifies if a user email is in the admin_users table
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
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ isAdmin: false, error: 'Email is required' });
        }

        const supabase = createServiceRoleClient();

        const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', email.toLowerCase())
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
