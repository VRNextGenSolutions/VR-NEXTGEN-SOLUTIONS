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

// Cache validation result to avoid repeated checks
let cachedEmailConfig: EmailConfig | null = null;
let validationError: Error | null = null;

/**
 * Validates email configuration environment variables
 * Results are cached to improve performance
 */
export function validateEmailConfig(): EmailConfig {
  // Return cached config if available and valid
  if (cachedEmailConfig) {
    return cachedEmailConfig;
  }

  // Return cached error if validation already failed
  if (validationError) {
    throw validationError;
  }

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
    const errorMessage = `Missing required email environment variables: ${missing.join(', ')}. Please configure these in your Vercel project settings (Settings → Environment Variables).`;
    validationError = new Error(errorMessage);
    logger.error('Email configuration validation failed', {
      missingVariables: missing,
      error: errorMessage,
      hint: 'Add these variables in Vercel Dashboard → Settings → Environment Variables → Production',
    });
    throw validationError;
  }

  // Validate port range
  if (port < 1 || port > 65535) {
    throw new Error(`Invalid MAIL_PORT: ${port}. Must be between 1 and 65535.`);
  }

  // At this point TypeScript still considers values possibly undefined.
  // Narrow them to non-nullable strings for validation and return.
  const resolvedHost = host as string;
  const resolvedUser = user as string;
  const resolvedPass = pass as string;
  const resolvedReceiveEmail = receiveEmail as string;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(resolvedUser)) {
    throw new Error(`Invalid MAIL_USER email format: ${resolvedUser}`);
  }
  if (!emailRegex.test(resolvedReceiveEmail)) {
    throw new Error(`Invalid CONTACT_RECEIVE_EMAIL format: ${resolvedReceiveEmail}`);
  }

  // Cache the validated config
  cachedEmailConfig = {
    host: resolvedHost,
    port,
    secure,
    user: resolvedUser,
    pass: resolvedPass,
    receiveEmail: resolvedReceiveEmail,
  };

  logger.info('Email configuration validated successfully', {
    host: resolvedHost,
    port,
    secure,
    user: resolvedUser,
    receiveEmail: resolvedReceiveEmail,
  });

  return cachedEmailConfig;
}

/**
 * Clears the cached email configuration
 * Useful for testing or when environment variables change
 */
export function clearEmailConfigCache(): void {
  cachedEmailConfig = null;
  validationError = null;
}

/**
 * Gets the current validation status without throwing
 * Useful for health checks and diagnostics
 */
export function getEmailConfigStatus(): {
  configured: boolean;
  missing?: string[];
  error?: string;
} {
  try {
    validateEmailConfig();
    return { configured: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const missing = errorMessage.match(/Missing required email environment variables: ([^.]+)/)?.[1]?.split(', ') || [];
    return {
      configured: false,
      missing: missing.length > 0 ? missing : undefined,
      error: errorMessage,
    };
  }
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

