/**
 * Admin Layout Component
 * Main wrapper for all admin pages with sidebar and header
 */

import { ReactNode } from 'react';
import Head from 'next/head';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export function AdminLayout({ children, title = 'Admin Portal' }: AdminLayoutProps) {
    const pageTitle = `${title} | VR NextGEN Admin`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="min-h-screen bg-black flex">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:ml-64">
                    <AdminHeader title={title} />

                    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-white/10 p-4 text-center text-sm text-gray-500">
                        VR NextGEN Solutions Admin Portal
                    </footer>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;
