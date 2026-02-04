/**
 * Markdown Preview Component
 * Renders markdown content as HTML
 */

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

interface MarkdownPreviewProps {
    content: string;
    minHeight?: number;
}

export function MarkdownPreview({ content, minHeight = 400 }: MarkdownPreviewProps) {
    const html = useMemo(() => {
        if (typeof window === 'undefined') return '';

        const rawHtml = marked(content, { breaks: true, gfm: true }) as string;
        return DOMPurify.sanitize(rawHtml, {
            FORBID_TAGS: ['iframe', 'object', 'embed', 'script', 'style'],
            FORBID_ATTR: ['onerror', 'onclick', 'onload'],
        });
    }, [content]);

    if (!content) {
        return (
            <div
                className="p-4 text-gray-500 italic"
                style={{ minHeight }}
            >
                Nothing to preview yet...
            </div>
        );
    }

    return (
        <div
            className="p-4 prose prose-invert prose-sm max-w-none overflow-auto"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default MarkdownPreview;
