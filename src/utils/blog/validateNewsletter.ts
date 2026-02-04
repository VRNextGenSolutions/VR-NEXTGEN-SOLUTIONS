import { z } from 'zod';

const newsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().max(100).optional(),
    honeypot: z.string().max(0).optional().or(z.literal('')),
});

export class NewsletterValidationError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'NewsletterValidationError';
    }
}

export function validateNewsletterPayload(payload: unknown) {
    const result = newsletterSchema.safeParse(payload);

    if (!result.success) {
        // Zod v4 uses .issues instead of .errors
        const errorMsg = result.error.issues[0]?.message || 'Invalid request';
        throw new NewsletterValidationError(errorMsg);
    }

    return result.data;
}
