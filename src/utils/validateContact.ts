import { z } from 'zod';

/**
 * Schema enforcing server-side contact validation.
 */
const ContactValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254, 'Email cannot exceed 254 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message cannot exceed 5000 characters'),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type ContactPayload = z.infer<typeof ContactValidationSchema>;

export class ContactValidationError extends Error {
  public statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'ContactValidationError';
  }
}

/**
 * Validate and sanitize incoming payload.
 */
export function validateContactPayload(payload: unknown) {
  const result = ContactValidationSchema.safeParse(payload);

  if (!result.success) {
    const issue = result.error.issues[0];
    throw new ContactValidationError(issue?.message || 'Invalid form submission');
  }

  const { name, email, message, honeypot, recaptchaToken } = result.data;

  return {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    honeypot: honeypot?.trim() ?? '',
    recaptchaToken: recaptchaToken?.trim(),
  };
}

