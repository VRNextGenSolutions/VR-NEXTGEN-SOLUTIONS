/**
 * Environment Variable Validation
 * Validates required environment variables on application startup
 */

import { logger } from '@/utils/logger';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  receiveEmail: string;
}

export interface ContactConfig {
  email: EmailConfig;
  recaptcha?: {
    secret: string;
    siteKey: string;
  };
  rateLimit: {
    max: number;
    windowMs: number;
  };
}

/**
 * Validates email configuration environment variables
 */
export function validateEmailConfig(): EmailConfig {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT ?? 465);
  const secure =
    process.env.MAIL_SECURE !== undefined
      ? process.env.MAIL_SECURE === 'true'
      : port === 465;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  const receiveEmail = process.env.CONTACT_RECEIVE_EMAIL || user;

  const missing: string[] = [];
  if (!host) missing.push('MAIL_HOST');
  if (!user) missing.push('MAIL_USER');
  if (!pass) missing.push('MAIL_PASS');
  if (!receiveEmail) missing.push('CONTACT_RECEIVE_EMAIL');

  if (missing.length > 0) {
    const error = `Missing required email environment variables: ${missing.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }

  // Validate port range
  if (port < 1 || port > 65535) {
    throw new Error(`Invalid MAIL_PORT: ${port}. Must be between 1 and 65535.`);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user)) {
    throw new Error(`Invalid MAIL_USER email format: ${user}`);
  }
  if (!emailRegex.test(receiveEmail)) {
    throw new Error(`Invalid CONTACT_RECEIVE_EMAIL format: ${receiveEmail}`);
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    receiveEmail,
  };
}

/**
 * Validates contact form configuration
 */
export function validateContactConfig(): ContactConfig {
  const email = validateEmailConfig();

  const rateLimit = {
    max: Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5),
    windowMs: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000),
  };

  if (rateLimit.max < 1 || rateLimit.max > 100) {
    throw new Error(
      `Invalid CONTACT_RATE_LIMIT_MAX: ${rateLimit.max}. Must be between 1 and 100.`
    );
  }

  if (rateLimit.windowMs < 1000 || rateLimit.windowMs > 3600000) {
    throw new Error(
      `Invalid CONTACT_RATE_LIMIT_WINDOW_MS: ${rateLimit.windowMs}. Must be between 1000ms and 3600000ms (1 hour).`
    );
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET;
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const config: ContactConfig = {
    email,
    rateLimit,
  };

  // reCAPTCHA is optional, but if one is set, both should be set
  if (recaptchaSecret || recaptchaSiteKey) {
    if (!recaptchaSecret || !recaptchaSiteKey) {
      logger.warn(
        'reCAPTCHA partially configured. Both RECAPTCHA_SECRET and NEXT_PUBLIC_RECAPTCHA_SITE_KEY must be set for reCAPTCHA to work.'
      );
    } else {
      config.recaptcha = {
        secret: recaptchaSecret,
        siteKey: recaptchaSiteKey,
      };
    }
  }

  return config;
}

/**
 * Validates environment variables on startup (non-blocking)
 * Logs warnings but doesn't throw to allow graceful degradation
 */
export function validateEnvOnStartup(): void {
  try {
    const config = validateContactConfig();
    logger.info('Contact form configuration validated', {
      emailConfigured: true,
      recaptchaConfigured: !!config.recaptcha,
      rateLimit: `${config.rateLimit.max} per ${config.rateLimit.windowMs / 1000}s`,
    });
  } catch (error) {
    logger.error('Contact form configuration validation failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    // Don't throw - allow app to start but contact form will fail gracefully
  }
}

