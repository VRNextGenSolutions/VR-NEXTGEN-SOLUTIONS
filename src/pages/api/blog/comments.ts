import type { NextApiRequest, NextApiResponse } from 'next';
import { SECURE_HEADERS } from '@/utils/security';
import { checkRateLimit } from '@/utils/rateLimiter';
import { logger } from '@/utils/logger';
import { createServerSupabase } from '@/lib/supabase';
import { validateCommentPayload, CommentValidationError } from '@/utils/blog/validateComment';

type Response = { success: true } | { success: false; error: string };

function getClientIp(req: NextApiRequest) {
    const header = (req.headers['x-forwarded-for'] || req.headers['x-real-ip']) as string | undefined;
    if (header) return header.split(',')[0]?.trim();
    return (req.socket?.remoteAddress || 'unknown').replace('::ffff:', '');
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    try {
        res.setHeader('Content-Type', 'application/json');
        Object.entries(SECURE_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ success: false, error: 'Method not allowed' });
        }

        if (!req.headers['content-type']?.includes('application/json')) {
            return res.status(415).json({ success: false, error: 'Unsupported Media Type' });
        }

        const clientIp = getClientIp(req);

        // Rate limit: 5 comments per 15 minutes (default window) per IP
        const rateCheck = checkRateLimit(clientIp);
        if (!rateCheck.allowed) {
            return res.status(429).json({
                success: false,
                error: 'Too many comments. Please wait a few minutes.'
            });
        }

        try {
            const { postId, name, email, content, honeypot } = validateCommentPayload(req.body);

            if (honeypot) {
                logger.warn('Comment honeypot triggered', { ip: clientIp });
                return res.status(204).end();
            }

            const supabase = createServerSupabase();
            const { error } = await supabase.from('blog_comments').insert({
                post_id: postId,
                author_name: name,
                author_email: email,
                content,
                is_approved: false, // Must be approved by admin
            });

            if (error) throw error;

            logger.info('Comment submitted', { ip: clientIp, postId });
            return res.status(200).json({ success: true });

        } catch (error) {
            if (error instanceof CommentValidationError) {
                return res.status(error.statusCode).json({ success: false, error: error.message });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Comment submission failed', {
            error: error instanceof Error ? error.message : String(error),
        });
        return res.status(500).json({
            success: false,
            error: 'Unable to submit comment. Please try again later.'
        });
    }
}
