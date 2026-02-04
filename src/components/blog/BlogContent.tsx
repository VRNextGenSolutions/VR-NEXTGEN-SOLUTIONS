import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

interface BlogContentProps {
    content: string;
}

export function BlogContent({ content }: BlogContentProps) {
    const sanitizedHtml = useMemo(() => {
        // 1. Convert Markdown to HTML
        const rawHtml = marked.parse(content, { async: false }) as string;

        // 2. Sanitize HTML - strict sanitization for security
        // Disallow iframes and other potentially dangerous elements
        return DOMPurify.sanitize(rawHtml, {
            FORBID_TAGS: ['iframe', 'object', 'embed', 'script', 'style'],
            FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
        });
    }, [content]);

    return (
        <article className="prose prose-invert prose-blog max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </article>
    );
}
