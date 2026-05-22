import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Singleton for browser
let browserClient: SupabaseClient | null = null;

/**
 * Returns Supabase client or null if env vars are missing.
 * Callers must handle the null case gracefully.
 */
export function getSupabaseClient(): SupabaseClient | null {
    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    if (typeof window === 'undefined') {
        // Server: always create new instance
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    // Browser: reuse singleton
    if (!browserClient) {
        browserClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return browserClient;
}

// Alias for server-side usage with anon key
export const createServerSupabase = () => createClient(supabaseUrl!, supabaseAnonKey!);

// Service role client for admin operations (server-side only)
export function createServiceRoleClient(): SupabaseClient {
    if (typeof window !== 'undefined') {
        throw new Error('Service role client cannot be used in the browser');
    }
    if (!supabaseServiceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }
    return createClient(supabaseUrl!, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// Storage URL helper
export const getStorageUrl = (path: string): string =>
    `${supabaseUrl}/storage/v1/object/public/blog-media/${path}`;

// Get featured image URL for a post
export const getFeaturedImageUrl = (slug: string, filename = 'featured.webp'): string =>
    getStorageUrl(`posts/${slug}/${filename}`);

