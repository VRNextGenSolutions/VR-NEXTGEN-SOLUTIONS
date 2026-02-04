import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { validateCommentPayload } from "@/utils/blog/validateComment";
import { z } from "zod";

// Schema must match backend validation but client-side friendly
const schema = z.object({
    author_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    author_email: z.string().email('Invalid email address'),
    content: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
    honeypot: z.string().max(0).optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function CommentForm({ postId }: { postId: string }) {
    const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
    const [feedback, setFeedback] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        if (data.honeypot) return; // Silent fail for bots

        try {
            const res = await fetch('/api/blog/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    name: data.author_name, // Validated on server too
                    email: data.author_email,
                    content: data.content,
                }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Failed to submit comment');

            setState('success');
            setFeedback('Comment submitted! It will appear after moderation.');
            reset();
        } catch (err) {
            setState('error');
            setFeedback(err instanceof Error ? err.message : 'Failed to submit');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Honeypot - hidden from users */}
            <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Name"
                    placeholder="Your Name"
                    {...register('author_name')}
                    error={errors.author_name?.message}
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    helperText="Your email will not be published."
                    {...register('author_email')}
                    error={errors.author_email?.message}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm text-white/80 font-medium">Comment</label>
                <textarea
                    {...register('content')}
                    rows={4}
                    placeholder="Share your thoughts..."
                    className="bg-black border border-white/20 rounded px-3 py-2 text-white 
                     placeholder-white/50 focus:outline-none focus:ring-2 
                     focus:ring-gold focus:border-transparent transition-colors resize-y"
                />
                {errors.content && (
                    <span className="text-red-400 text-xs">{errors.content.message}</span>
                )}
            </div>

            {/* Inline Feedback */}
            {state !== 'idle' && (
                <div className={`p-4 rounded-lg border flex items-center gap-3 ${state === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                    {state === 'success' ? (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <p className="text-sm">{feedback}</p>
                </div>
            )}

            <Button type="submit" isLoading={isSubmitting}>
                Submit Comment
            </Button>
        </form>
    );
}
