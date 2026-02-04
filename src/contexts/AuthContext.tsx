/**
 * Authentication Context
 * Manages Supabase auth state and admin verification
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';
import type { AuthState } from '@/types/admin';

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        isAdmin: false,
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Check if user is an admin
    const checkAdminStatus = useCallback(async (email: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            return data.isAdmin === true;
        } catch {
            return false;
        }
    }, []);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const isAdmin = await checkAdminStatus(session.user.email || '');
                    setState({
                        user: session.user,
                        session,
                        isAdmin,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to initialize authentication',
                }));
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const isAdmin = await checkAdminStatus(session.user.email || '');
                    setState({
                        user: session.user,
                        session,
                        isAdmin,
                        isLoading: false,
                        error: null,
                    });
                } else if (event === 'SIGNED_OUT') {
                    setState({
                        user: null,
                        session: null,
                        isAdmin: false,
                        isLoading: false,
                        error: null,
                    });
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase, checkAdminStatus]);

    // Sign in with email and password
    const signIn = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message,
                }));
                return { success: false, error: error.message };
            }

            if (data.user) {
                const isAdmin = await checkAdminStatus(data.user.email || '');

                if (!isAdmin) {
                    await supabase.auth.signOut();
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: 'Access denied. You are not an admin.',
                    }));
                    return { success: false, error: 'Access denied. You are not an admin.' };
                }

                return { success: true };
            }

            return { success: false, error: 'Unknown error occurred' };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Sign in failed';
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            return { success: false, error: message };
        }
    }, [supabase, checkAdminStatus]);

    // Sign out
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setState({
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
            error: null,
        });
    }, [supabase]);

    // Refresh session
    const refreshSession = useCallback(async () => {
        const { data: { session } } = await supabase.auth.refreshSession();
        if (session) {
            setState(prev => ({ ...prev, session }));
        }
    }, [supabase]);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signIn,
                signOut,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
