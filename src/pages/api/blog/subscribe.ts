import type { NextApiRequest, NextApiResponse } from 'next';
import { SECURE_HEADERS } from '@/utils/security';
import { checkRateLimit } from '@/utils/rateLimiter';
import { logger } from '@/utils/logger';
import { subscribeToNewsletter } from '@/services/blog';
import { validateNewsletterPayload, NewsletterValidationError } from '@/utils/blog/validateNewsletter';

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

        const clientIp = getClientIp(req);
        const rateCheck = checkRateLimit(clientIp);
        if (!rateCheck.allowed) {
            return res.status(429).json({
                success: false,
                error: 'Too many attempts. Please try again later.'
            });
        }

        try {
            const { email, name, honeypot } = validateNewsletterPayload(req.body);

            if (honeypot) {
                logger.warn('Newsletter honeypot triggered', { ip: clientIp });
                return res.status(204).end();
            }

            const result = await subscribeToNewsletter(email, name);

            if (!result.success) {
                throw new Error(result.error || 'Failed to subscribe');
            }

            logger.info('Newsletter subscription', { ip: clientIp, email: email.replace(/(?<=^.{3}).*@/, '***@') });
            return res.status(200).json({ success: true });

        } catch (error) {
            if (error instanceof NewsletterValidationError) {
                return res.status(error.statusCode).json({ success: false, error: error.message });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Newsletter subscription failed', {
            error: error instanceof Error ? error.message : String(error),
        });
        return res.status(500).json({
            success: false,
            error: 'Unable to subscribe. Please try again later.'
        });
    }
}
