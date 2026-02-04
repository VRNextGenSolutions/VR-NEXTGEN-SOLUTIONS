import type { BlogPostSummary } from '@/types/blog';
import { BlogCard } from './BlogCard';

interface BlogListProps {
    posts: BlogPostSummary[];
}

export function BlogList({ posts }: BlogListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
}
