/**
 * Health Check Endpoint for Contact Form
 * Verifies email configuration without sending actual emails
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { validateEmailConfig } from '@/utils/env/validateEnv';
import { logger } from '@/utils/logger';
import nodemailer from 'nodemailer';

type HealthResponse =
  | { status: 'healthy'; email: { configured: true; verified: boolean } }
  | { status: 'unhealthy'; error: string; email: { configured: boolean } };

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
    // Validate configuration
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
      logger.info('Contact form health check: SMTP connection verified');
      return res.status(200).json({
        status: 'healthy',
        email: {
          configured: true,
          verified: true,
        },
      });
    } catch (verifyError) {
      logger.warn('Contact form health check: SMTP verification failed', {
        error:
          verifyError instanceof Error ? verifyError.message : String(verifyError),
      });
      return res.status(200).json({
        status: 'healthy',
        email: {
          configured: true,
          verified: false,
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
      email: { configured: false },
    });
  }
}

