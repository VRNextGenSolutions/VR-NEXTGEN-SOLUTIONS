/**
 * Health Check Endpoint for Contact Form
 * Verifies email configuration without sending actual emails
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { validateEmailConfig, getEmailConfigStatus } from '@/utils/env/validateEnv';
import { logger } from '@/utils/logger';
import nodemailer from 'nodemailer';

type HealthResponse =
  | {
      status: 'healthy';
      email: {
        configured: true;
        verified: boolean;
        recipient?: string;
        smtpHost?: string;
      };
    }
  | {
      status: 'unhealthy';
      error: string;
      email: {
        configured: boolean;
        missing?: string[];
        hint?: string;
      };
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      status: 'unhealthy',
      error: 'Method not allowed',
      email: { configured: false },
    });
  }

  try {
    // Get configuration status first (non-throwing)
    const configStatus = getEmailConfigStatus();

    if (!configStatus.configured) {
      logger.warn('Contact form health check: Email not configured', {
        missing: configStatus.missing,
        error: configStatus.error,
      });
      return res.status(503).json({
        status: 'unhealthy',
        error: configStatus.error || 'Email configuration is missing',
        email: {
          configured: false,
          missing: configStatus.missing,
          hint: 'Add environment variables in Vercel Dashboard → Settings → Environment Variables → Production',
        },
      });
    }

    // Validate configuration (will throw if invalid, but we already checked)
    const emailConfig = validateEmailConfig();

    // Try to verify SMTP connection (without sending email)
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    try {
      await transporter.verify();
      logger.info('Contact form health check: SMTP connection verified', {
        host: emailConfig.host,
        port: emailConfig.port,
        recipient: emailConfig.receiveEmail,
      });
      return res.status(200).json({
        status: 'healthy',
        email: {
          configured: true,
          verified: true,
          recipient: emailConfig.receiveEmail,
          smtpHost: emailConfig.host,
        },
      });
    } catch (verifyError) {
      const verifyErrorMessage =
        verifyError instanceof Error ? verifyError.message : String(verifyError);
      logger.warn('Contact form health check: SMTP verification failed', {
        error: verifyErrorMessage,
        host: emailConfig.host,
        port: emailConfig.port,
        hint: 'Check SMTP credentials and network connectivity',
      });
      return res.status(200).json({
        status: 'healthy',
        email: {
          configured: true,
          verified: false,
          recipient: emailConfig.receiveEmail,
          smtpHost: emailConfig.host,
        },
      });
    }
  } catch (error) {
    logger.error('Contact form health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      email: {
        configured: false,
        hint: 'Check Vercel Dashboard → Settings → Environment Variables',
      },
    });
  }
}

