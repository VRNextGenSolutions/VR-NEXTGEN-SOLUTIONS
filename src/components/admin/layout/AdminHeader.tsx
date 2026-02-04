/**
 * Admin Header Component
 * Top header bar with title, user info, and logout
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AdminHeaderProps {
    title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
    const { user, signOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        window.location.href = '/admin/login';
    };

    return (
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-4 md:px-6 lg:px-8">
            {/* Title */}
            <div className="lg:pl-0 pl-12">
                <h1 className="text-xl font-semibold text-white">{title}</h1>
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-gold font-medium text-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </span>
                    </div>
                    <span className="hidden md:block text-sm text-gray-300">
                        {user?.email || 'Admin'}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                        <div className="p-3 border-b border-white/10">
                            <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default AdminHeader;
