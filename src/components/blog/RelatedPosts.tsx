import { BlogCard } from './BlogCard';
import type { BlogPostSummary } from '@/types/blog';

interface RelatedPostsProps {
    posts: BlogPostSummary[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    if (posts.length === 0) return null;

    return (
        <section className="border-t border-white/10 pt-12 mt-12">
            <h3 className="text-2xl font-bold text-white mb-8">
                Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}
