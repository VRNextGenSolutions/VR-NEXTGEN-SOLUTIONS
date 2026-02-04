import Link from 'next/link';
import Image from 'next/image';
import type { BlogPostSummary } from '@/types/blog';
import { formatDate } from '@/utils/blog/helpers';

interface BlogCardProps {
    post: BlogPostSummary;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/nextgen-blog/${post.slug}`} className="block h-full">
            <div className="group relative h-full flex flex-col border border-gray-700 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300 bg-gradient-to-br from-gray-800/80 to-gray-900/90">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                    {post.featured_image ? (
                        post.featured_image.match(/\.(mp4|webm)$/i) ? (
                            <video
                                src={post.featured_image}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                muted
                                playsInline
                                loop
                                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                                onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
                            />
                        ) : (
                            <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 text-xs font-semibold text-black bg-gold rounded-full shadow-lg">
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-gold/80 mb-3">
                        <span>{formatDate(post.published_at)}</span>
                        <span>•</span>
                        <span>{post.read_time_minutes} min read</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gold font-medium mt-auto group/link">
                        Read Article
                        <svg
                            className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>

                {/* Border glow */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(255,215,0,0.15)]" />
            </div>
        </Link>
    );
}
