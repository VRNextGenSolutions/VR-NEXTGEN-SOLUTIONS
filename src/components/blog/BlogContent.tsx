import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

interface BlogContentProps {
    content: string;
}

/** Trusted iframe sources for embedded media */
const ALLOWED_IFRAME_HOSTS = [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
    'player.vimeo.com',
    'open.spotify.com',
    'www.google.com', // Google Maps
];

/**
 * Checks whether a URL belongs to a whitelisted host.
 * Returns true only for https:// URLs whose host exactly matches.
 */
function isAllowedIframeSrc(src: string): boolean {
    try {
        const url = new URL(src);
        return url.protocol === 'https:' && ALLOWED_IFRAME_HOSTS.includes(url.hostname);
    } catch {
        return false;
    }
}

export function BlogContent({ content }: BlogContentProps) {
    const sanitizedHtml = useMemo(() => {
        // 1. Convert Markdown → HTML
        const rawHtml = marked.parse(content, { async: false }) as string;

        // 2. Sanitize — allow <iframe> but only from trusted sources
        return DOMPurify.sanitize(rawHtml, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'src', 'title', 'loading'],
            FORBID_TAGS: ['object', 'embed', 'script', 'style'],
            FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
        }).replace(
            // Post-sanitization: strip any iframes whose src is not whitelisted
            /<iframe[^>]*\ssrc=["']([^"']*)["'][^>]*>[\s\S]*?<\/iframe>/gi,
            (match, src) => (isAllowedIframeSrc(src) ? match : '')
        );
    }, [content]);

    return (
        <article className="prose prose-invert prose-blog max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </article>
    );
}
