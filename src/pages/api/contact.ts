import type { NextApiRequest, NextApiResponse } from 'next';
import { SECURE_HEADERS } from '@/utils/security';
import { validateContactPayload, ContactValidationError } from '@/utils/validateContact';
import { checkRateLimit } from '@/utils/rateLimiter';
import { sendContactEmail } from '@/utils/email/sendContactEmail';
import { logger } from '@/utils/logger';
import { validateEmailConfig } from '@/utils/env/validateEnv';

type SuccessResponse = { success: true };
type ErrorResponse = { success: false; error: string };

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

function getClientIp(req: NextApiRequest) {
  const header = (req.headers['x-forwarded-for'] || req.headers['x-real-ip']) as string | undefined;
  if (header) {
    return header.split(',')[0]?.trim();
  }
  return (req.socket?.remoteAddress || 'unknown').replace('::ffff:', '');
}

async function verifyRecaptcha(token: string, ip?: string | null) {
  if (!RECAPTCHA_SECRET) return true;

  const params = new URLSearchParams();
  params.append('secret', RECAPTCHA_SECRET);
  params.append('response', token);
  if (ip) params.append('remoteip', ip);

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    logger.warn('reCAPTCHA verification failed to reach Google', { status: response.status });
    return false;
  }

  const data = (await response.json()) as { success: boolean; score?: number };
  if (!data.success) return false;

  // For v3, enforce minimal score if provided
  if (typeof data.score === 'number' && data.score < 0.5) {
    return false;
  }

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessResponse | ErrorResponse>) {
  Object.entries(SECURE_HEADERS).forEach(([key, value]) => res.setHeader(key, value));

  // Validate email configuration (cached, so efficient)
  try {
    validateEmailConfig();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Email configuration invalid - contact form unavailable', {
      error: errorMessage,
      hint: 'Check Vercel Dashboard → Settings → Environment Variables',
      timestamp: new Date().toISOString(),
    });
    return res.status(503).json({
      success: false,
      error: 'Contact form is temporarily unavailable. Please try again later.',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ success: false, error: 'Unsupported Media Type' });
  }

  const clientIp = getClientIp(req);
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res
      .status(429)
      .json({ success: false, error: 'Too many messages. Please wait a few minutes and try again.' });
  }

  try {
    const { name, email, message, honeypot, recaptchaToken } = validateContactPayload(req.body);

    if (honeypot) {
      logger.warn('Honeypot triggered', { ip: clientIp });
      return res.status(204).end();
    }

    if (RECAPTCHA_SECRET) {
      if (!recaptchaToken) {
        return res.status(400).json({ success: false, error: 'reCAPTCHA validation failed. Please try again.' });
    }

      const recaptchaPassed = await verifyRecaptcha(recaptchaToken, clientIp);
      if (!recaptchaPassed) {
        return res.status(400).json({ success: false, error: 'reCAPTCHA validation failed. Please try again.' });
    }
    }

    await sendContactEmail({
      name,
      email,
      message,
      meta: { ip: clientIp },
    });

    logger.info('Contact form submitted', { ip: clientIp });
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof ContactValidationError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }

    logger.error('Contact form submission failed', {
      ip: clientIp,
      error: error instanceof Error ? error.message : String(error),
    });

    return res.status(500).json({
      success: false,
      error: 'Unable to send your message right now. Please try again later.',
    });
  }
}
