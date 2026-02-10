import Head from "next/head";
import Image from "next/image";
import Layout from "@/components/layout/Layout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { SEOHead, getBlogPostSchema, getBreadcrumbSchema } from "@/components/seo";
import { useParallax } from "@/hooks/useParallax";
import {
    BlogContent,
    BlogSidebar,
    CommentList,
    CommentForm,
    ShareButtons,
    RelatedPosts,
    NewsletterForm
} from "@/components/blog";
import { getBlogPosts, getBlogPostBySlug, getRelatedPosts, getComments } from "@/services/blog";
import { formatDate } from "@/utils/blog/helpers";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { BlogPost, BlogPostSummary, BlogComment } from "@/types/blog";

interface Props {
    post: BlogPost;
    relatedPosts: BlogPostSummary[];
    comments: BlogComment[];
}

export default function BlogPostPage({ post, relatedPosts, comments }: Props) {
    const parallax = useParallax(0.25);

    const structuredData = [
        getBlogPostSchema({
            title: post.title,
            excerpt: post.excerpt,
            featuredImage: post.featured_image,
            authorName: post.author_name,
            publishedAt: post.published_at || new Date().toISOString(),
            modifiedAt: post.updated_at,
            url: `https://vrnextgensolutions.com/nextgen-blog/${post.slug}`,
            wordCount: post.content.split(/\s+/).length,
        }),
        getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/nextgen-blog" },
            { name: post.title, url: `/nextgen-blog/${post.slug}` }
        ])
    ];

    if (!post) return null; // Fallback

    return (
        <Layout title={post.title} description={post.excerpt}>
            <SEOHead
                title={`${post.title} | NextGen Blog`}
                description={post.excerpt}
                canonical={`/nextgen-blog/${post.slug}`}
                keywords={[...post.tags, post.category]}
                ogImage={post.featured_image || undefined}
                ogType="article"
                structuredData={structuredData}
            />

            <ErrorBoundary>
                <div className="pt-24 min-h-screen">
                    {/* Header Section */}
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-12">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <div className="flex items-center justify-center gap-2">
                                <span className="px-3 py-1 text-sm font-semibold text-black bg-gold rounded-full">
                                    {post.category}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {post.read_time_minutes} min read
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                                <span className="font-medium text-white">{post.author_name}</span>
                                <span>•</span>
                                <time dateTime={post.published_at || undefined}>
                                    {formatDate(post.published_at)}
                                </time>
                            </div>
                        </div>
                    </div>

                    {/* Featured Media (Image or Video) */}
                    {post.featured_image && (
                        <div className="max-w-6xl mx-auto px-4 mb-16">
                            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                {post.featured_image.match(/\.(mp4|webm)$/i) ? (
                                    <video
                                        src={post.featured_image}
                                        className="w-full h-full object-cover"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <Image
                                        src={post.featured_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 1200px) 100vw, 1200px"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                <BlogContent content={post.content} />

                                <div className="mt-12 py-8 border-t border-white/10">
                                    <ShareButtons title={post.title} slug={post.slug} />
                                </div>

                                {/* Comments Section */}
                                <section className="mt-12 space-y-12">
                                    <CommentList comments={comments} />
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                                        <h3 className="text-xl font-bold text-white mb-6">Leave a Comment</h3>
                                        <CommentForm postId={post.id} />
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar */}
                            <div className="hidden lg:block lg:col-span-1 space-y-8">
                                <div className="sticky top-24">
                                    <BlogSidebar />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-20">
                        <RelatedPosts posts={relatedPosts} />
                    </div>

                    <section className="bg-black py-20 border-t border-white/10">
                        <div className="max-w-4xl mx-auto px-4">
                            <NewsletterForm />
                        </div>
                    </section>
                </div>
            </ErrorBoundary>
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { posts } = await getBlogPosts({}, 1, 100);
    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }));

    return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const slug = params?.slug as string;
    if (!slug) return { notFound: true };

    const post = await getBlogPostBySlug(slug);
    if (!post) return { notFound: true };

    const relatedPosts = await getRelatedPosts(post.slug, post.category);
    const comments = await getComments(post.id);

    return {
        props: {
            post,
            relatedPosts,
            comments,
        },
        revalidate: 60, // ISR: 1 minute for detailed pages
    };
};
