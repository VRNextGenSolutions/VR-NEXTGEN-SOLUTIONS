import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema } from "@/components/seo";
import { useParallax } from "@/hooks/useParallax";
import {
  BlogHero,
  BlogList,
  BlogEmpty,
  NewsletterForm,
  BlogSidebar
} from "@/components/blog";
import type { GetStaticProps } from "next";
import type { BlogPostSummary } from "@/types/blog";
import { getBlogPosts } from "@/services/blog";
import { BLOG_CATEGORIES } from "@/types/blog";

interface Props {
  posts: BlogPostSummary[];
}

export default function BlogPage({ posts }: Props) {
  const parallax = useParallax(0.25);
  const router = useRouter();
  const { category, search } = router.query;

  // Client-side filtering state
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with URL query params
  useEffect(() => {
    if (typeof category === 'string') {
      // Try exact match first (for sidebar links with full category name)
      const exactMatch = BLOG_CATEGORIES.find(c => c === category);
      if (exactMatch) {
        setActiveCategory(exactMatch);
      } else {
        // Fallback: try slug match (for backward compatibility)
        const slugMatch = BLOG_CATEGORIES.find(c =>
          c.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
        );
        setActiveCategory(slugMatch || 'All');
      }
    } else {
      setActiveCategory('All');
    }

    if (typeof search === 'string') {
      setSearchQuery(search);
    }
  }, [category, search]);

  // Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/nextgen-blog" }
    ])
  ];

  return (
    <Layout title="NextGen Insights" description="Explore the latest trends in digital transformation, business strategy, and technology innovation.">
      <SEOHead
        title="NextGen Blog | VR NextGEN Solutions"
        description="Latest insights, trends, and thought leadership articles from our team of experts and industry leaders."
        canonical="/nextgen-blog"
        keywords={["blog", "insights", "technology", "digital transformation", "business strategy"]}
        structuredData={structuredData}
      />

      <ErrorBoundary>
        <BlogHero parallax={parallax} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Mobile/Tablet Filter Controls */}
              <div className="lg:hidden mb-8 space-y-4">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none transition-colors"
                />

                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  <button
                    onClick={() => {
                      setActiveCategory('All');
                      router.push('/nextgen-blog', undefined, { shallow: true });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'All'
                      ? 'bg-gold text-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                  >
                    All
                  </button>
                  {BLOG_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        const slug = cat.toLowerCase().replace(/\s+/g, '-');
                        router.push(`/nextgen-blog?category=${slug}`, undefined, { shallow: true });
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                        ? 'bg-gold text-black'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredPosts.length > 0 ? (
                <BlogList posts={filteredPosts} />
              ) : (
                <BlogEmpty />
              )}
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-1 space-y-8">
              <div className="sticky top-24 space-y-8">
                {/* Desktop Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      const query: any = { ...router.query };
                      if (e.target.value) query.search = e.target.value;
                      else delete query.search;
                      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white focus:border-gold outline-none transition-colors"
                  />
                  <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>

        <section className="bg-black py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4">
            <NewsletterForm />
          </div>
        </section>
      </ErrorBoundary>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const { posts } = await getBlogPosts({}, 1, 100);
    return {
      props: { posts },
      revalidate: 60
    };
  } catch (error) {
    console.error('getStaticProps failed:', error);
    return {
      props: { posts: [] },
      revalidate: 60
    };
  }
};
