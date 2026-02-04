/**
 * useAuth Hook
 * Convenient wrapper for AuthContext with additional utilities
 */

import { useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
    const auth = useAuthContext();

    // Check if session is valid
    const isSessionValid = useCallback(() => {
        if (!auth.session) return false;
        const expiresAt = auth.session.expires_at;
        if (!expiresAt) return false;
        return Date.now() < expiresAt * 1000;
    }, [auth.session]);

    // Get auth header for API calls - returns Record<string, string> for fetch compatibility
    const getAuthHeader = useCallback((): Record<string, string> => {
        if (!auth.session?.access_token) return {};
        return {
            Authorization: `Bearer ${auth.session.access_token}`,
        };
    }, [auth.session]);

    return {
        ...auth,
        isSessionValid,
        getAuthHeader,
        isAuthenticated: !!auth.user && auth.isAdmin,
    };
}

export default useAuth;
