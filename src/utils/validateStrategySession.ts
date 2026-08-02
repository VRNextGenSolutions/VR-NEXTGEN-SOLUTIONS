import { z } from 'zod';

/**
 * Schema enforcing server-side strategy session registration validation.
 */
const StrategySessionValidationSchema = z.object({
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
  phone: z
    .string()
    .trim()
    .min(5, 'Please provide a valid phone number')
    .max(30, 'Phone number cannot exceed 30 characters'),
  city: z
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters'),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type StrategySessionPayload = z.infer<typeof StrategySessionValidationSchema>;

export class StrategySessionValidationError extends Error {
  public statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'StrategySessionValidationError';
  }
}

/**
 * Validate and sanitize incoming strategy session payload.
 */
export function validateStrategySessionPayload(payload: unknown) {
  const result = StrategySessionValidationSchema.safeParse(payload);

  if (!result.success) {
    const issue = result.error.issues[0];
    throw new StrategySessionValidationError(issue?.message || 'Invalid form submission');
  }

  const { name, email, phone, city, honeypot, recaptchaToken } = result.data;

  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    city: city.trim(),
    honeypot: honeypot?.trim() ?? '',
    recaptchaToken: recaptchaToken?.trim(),
  };
}
