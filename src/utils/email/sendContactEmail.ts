import nodemailer, { Transporter } from 'nodemailer';
import { logger } from '@/utils/logger';
import { validateEmailConfig } from '@/utils/env/validateEnv';

export type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
  meta?: Record<string, unknown>;
};

let cachedTransporter: Transporter | null = null;
let emailConfig: ReturnType<typeof validateEmailConfig> | null = null;

function getEmailConfig() {
  if (!emailConfig) {
    emailConfig = validateEmailConfig();
  }
  return emailConfig;
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getEmailConfig();

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  // Verify connection asynchronously (non-blocking)
  cachedTransporter.verify().catch((error) => {
    logger.error('Nodemailer transporter verification failed', {
      error: error instanceof Error ? error.message : error,
    });
  });

  return cachedTransporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtml({ name, email, message }: ContactEmailPayload) {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #FFD700; font-size: 24px; font-weight: 700;">VR NextGen Solutions</h1>
              <p style="margin: 8px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">New Contact Form Submission</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">You have received a new message through the contact form:</p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-left: 4px solid #FFD700; border-radius: 4px; margin-bottom: 20px;">
                    <p style="margin: 0 0 12px; color: #1a1a1a; font-size: 14px;">
                      <strong style="color: #000000; display: inline-block; min-width: 80px;">Name:</strong>
                      <span style="color: #475569;">${escapeHtml(name)}</span>
                    </p>
                    <p style="margin: 0 0 12px; color: #1a1a1a; font-size: 14px;">
                      <strong style="color: #000000; display: inline-block; min-width: 80px;">Email:</strong>
                      <a href="mailto:${escapeHtml(email)}" style="color: #FFD700; text-decoration: none;">${escapeHtml(email)}</a>
                    </p>
                    <p style="margin: 0; color: #1a1a1a; font-size: 14px;">
                      <strong style="color: #000000; display: block; margin-bottom: 8px;">Message:</strong>
                      <span style="color: #475569; white-space: pre-line; display: block; line-height: 1.6;">${escapeHtml(message)}</span>
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">
                      Received on ${timestamp}
                    </p>
                    <p style="margin: 8px 0 0; color: #64748b; font-size: 12px; text-align: center;">
                      This email was sent via the VR NextGen Solutions contact form.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                © ${new Date().getFullYear()} VR NextGen Solutions. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const transporter = getTransporter();
  const config = getEmailConfig();

  const textContent = `New Contact Form Submission

Name: ${payload.name}
Email: ${payload.email}

Message:
${payload.message}

---
This email was sent via the VR NextGen Solutions contact form.
Received on ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;

  await transporter.sendMail({
    from: `VR NextGen Solutions <${config.user}>`,
    to: config.receiveEmail,
    replyTo: payload.email,
    subject: `New Contact: ${payload.name} - VR NextGen Solutions`,
    text: textContent,
    html: buildHtml(payload),
    // Add headers for better email client compatibility
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
    },
  });

  logger.info('Contact email sent successfully', {
    to: config.receiveEmail,
    from: payload.email,
    name: payload.name,
  });
}

