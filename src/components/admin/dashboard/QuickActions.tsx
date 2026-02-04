/**
 * Quick Actions Component
 * Shortcuts for common admin tasks
 */

import Link from 'next/link';

interface QuickAction {
    label: string;
    href: string;
    icon: React.ReactNode;
    description: string;
}

const actions: QuickAction[] = [
    {
        label: 'New Post',
        href: '/admin/posts/new',
        description: 'Create a new blog article',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
    {
        label: 'Moderate Comments',
        href: '/admin/comments?filter=pending',
        description: 'Review pending comments',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: 'Upload Media',
        href: '/admin/media',
        description: 'Add images or videos',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
        ),
    },
];

export function QuickActions() {
    return (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="flex items-center gap-4 p-4 bg-black rounded-lg border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-colors group"
                    >
                        <div className="p-2 bg-gold/10 rounded-lg text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                            {action.icon}
                        </div>
                        <div>
                            <p className="font-medium text-white">{action.label}</p>
                            <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;
