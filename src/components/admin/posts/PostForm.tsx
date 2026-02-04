/**
 * Post Form Component
 * Create/Edit blog post form
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { BLOG_CATEGORIES } from '@/types/blog';
import type { AdminBlogPost, CreatePostPayload } from '@/types/admin';
import { TagInput } from './TagInput';
import { MarkdownEditor } from '@/components/admin/editor/MarkdownEditor';
import { MediaUploader } from '@/components/admin/media/MediaUploader';
import { slugify } from '@/utils/admin/slugify';
import { useAuth } from '@/hooks/useAuth';

interface PostFormProps {
    post?: AdminBlogPost;
    onSuccess?: () => void;
}

export function PostForm({ post, onSuccess }: PostFormProps) {
    const router = useRouter();
    const { getAuthHeader } = useAuth();
    const isEditing = !!post;

    // Form state
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [slugEdited, setSlugEdited] = useState(false);
    const [excerpt, setExcerpt] = useState(post?.excerpt || '');
    const [content, setContent] = useState(post?.content || '');
    const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
    const [authorName, setAuthorName] = useState(post?.author_name || 'VR NextGEN Team');
    const [category, setCategory] = useState(post?.category || 'Insights');
    const [tags, setTags] = useState<string[]>(post?.tags || []);
    const [isPublished, setIsPublished] = useState(post?.is_published || false);
    const [isFeatured, setIsFeatured] = useState(post?.is_featured || false);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugEdited && title) {
            setSlug(slugify(title));
        }
    }, [title, slugEdited]);

    const handleSlugChange = (value: string) => {
        setSlug(slugify(value));
        setSlugEdited(true);
    };

    const handleMediaUpload = useCallback((url: string) => {
        setFeaturedImage(url);
    }, []);

    const handleSubmit = async (e: React.FormEvent, publish = false) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setIsSubmitting(true);

        const shouldPublish = publish ? true : isPublished;

        try {
            const payload: CreatePostPayload = {
                title,
                slug,
                excerpt,
                content,
                featured_image: featuredImage || null,
                author_name: authorName,
                category,
                tags,
                is_published: shouldPublish,
                is_featured: isFeatured,
                published_at: shouldPublish ? new Date().toISOString() : null,
            };

            const url = isEditing ? `/api/admin/posts/${post.id}` : '/api/admin/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!data.success) {
                if (data.field) {
                    setFieldErrors({ [data.field]: data.error });
                } else {
                    setError(data.error || 'Failed to save post');
                }
                return;
            }

            onSuccess?.();
            router.push('/admin/posts');
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors ${fieldErrors.title ? 'border-red-500' : 'border-white/10'}`}
                            placeholder="Enter post title"
                            required
                        />
                        {fieldErrors.title && <p className="mt-1 text-sm text-red-400">{fieldErrors.title}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                            Slug
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 bg-white/5 border border-r-0 border-white/10 rounded-l-lg text-gray-500 text-sm">
                                /nextgen-blog/
                            </span>
                            <input
                                id="slug"
                                type="text"
                                value={slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-r-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
                                placeholder="post-slug"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                            Excerpt * <span className="text-gray-500">({excerpt.length}/300)</span>
                        </label>
                        <textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            maxLength={300}
                            rows={3}
                            className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors resize-none ${fieldErrors.excerpt ? 'border-red-500' : 'border-white/10'}`}
                            placeholder="Brief summary of the post"
                            required
                        />
                        {fieldErrors.excerpt && <p className="mt-1 text-sm text-red-400">{fieldErrors.excerpt}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content *
                        </label>
                        <MarkdownEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Write your post content in Markdown..."
                        />
                        {fieldErrors.content && <p className="mt-1 text-sm text-red-400">{fieldErrors.content}</p>}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Actions */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                        <h3 className="font-medium text-white mb-4">Publish</h3>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-transparent text-gold focus:ring-gold/20"
                                />
                                <span className="text-sm text-gray-300">Published</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-transparent text-gold focus:ring-gold/20"
                                />
                                <span className="text-sm text-gray-300">Featured</span>
                            </label>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Save Draft'}
                            </button>
                            {!isPublished && (
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={isSubmitting}
                                    className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    Publish Now
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Featured Media */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                        <h3 className="font-medium text-white mb-4">Featured Image / Video</h3>
                        <MediaUploader
                            onUpload={handleMediaUpload}
                            currentMedia={featuredImage}
                            folder={`posts/${slug || 'drafts'}`}
                            acceptVideo={true}
                        />
                    </div>

                    {/* Category */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                        <label htmlFor="category" className="block font-medium text-white mb-3">
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                        >
                            {BLOG_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                        <label className="block font-medium text-white mb-3">Tags</label>
                        <TagInput value={tags} onChange={setTags} />
                    </div>

                    {/* Author */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                        <label htmlFor="author" className="block font-medium text-white mb-3">
                            Author
                        </label>
                        <input
                            id="author"
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PostForm;
