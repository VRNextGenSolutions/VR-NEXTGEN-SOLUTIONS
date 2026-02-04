import { z } from 'zod';
import { sanitizeInput } from '@/utils/security';

const commentSchema = z.object({
    postId: z.string().uuid(),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    content: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
    honeypot: z.string().max(0).optional().or(z.literal('')),
});

export class CommentValidationError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'CommentValidationError';
    }
}

export function validateCommentPayload(payload: unknown) {
    const result = commentSchema.safeParse(payload);

    if (!result.success) {
        // Zod v4 uses .issues instead of .errors
        const errorMsg = result.error.issues[0]?.message || 'Invalid request';
        throw new CommentValidationError(errorMsg);
    }

    return {
        ...result.data,
        // Sanitize user visible content
        name: sanitizeInput(result.data.name),
        content: sanitizeInput(result.data.content),
    };
}
