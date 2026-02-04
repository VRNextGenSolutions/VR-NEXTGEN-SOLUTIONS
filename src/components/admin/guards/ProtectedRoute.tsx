/**
 * Protected Route Guard
 * Wrapper component that protects admin pages from unauthorized access
 */

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isAdmin, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.replace('/admin/login');
        }
    }, [user, isAdmin, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user || !isAdmin) {
        return null;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
