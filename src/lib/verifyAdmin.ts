/**
 * Shared Admin Verification Middleware
 * Validates JWT token and checks admin_users table.
 * Used by all /api/admin/* endpoints.
 */

import type { NextApiRequest } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';

/**
 * Verifies that the request contains a valid Bearer JWT token
 * belonging to a user listed in the admin_users table.
 */
export async function verifyAdmin(req: NextApiRequest): Promise<boolean> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];
    const supabase = createServiceRoleClient();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) return false;

    const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', user.email.toLowerCase())
        .maybeSingle();

    return !!admin;
}
