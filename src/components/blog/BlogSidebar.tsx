import Link from 'next/link';
import { BLOG_CATEGORIES } from '@/types/blog';
import { NewsletterForm } from './NewsletterForm';

export function BlogSidebar() {
    return (
        <aside className="space-y-8 w-full">
            {/* Categories Widget */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                    Categories
                </h3>
                <ul className="space-y-2">
                    {BLOG_CATEGORIES.map((category) => (
                        <li key={category}>
                            <Link
                                href={`/nextgen-blog?category=${encodeURIComponent(category)}`}
                                className="flex items-center justify-between text-gray-400 hover:text-gold transition-colors group"
                            >
                                <span>{category}</span>
                                <span className="text-xs bg-white/5 px-2 py-1 rounded group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                                    View
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Newsletter Widget - reuse component */}
            <div className="p-6 bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-xl">
                <h3 className="text-lg font-bold text-gold mb-2">
                    Subscribe
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                    Get the latest insights delivered to your inbox.
                </p>
                <NewsletterForm compact />
            </div>
        </aside>
    );
}
