import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { z } from "zod";

const schema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().max(100).optional(),
    honeypot: z.string().max(0).optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
    const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        if (data.honeypot) return;

        try {
            const res = await fetch('/api/blog/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            setState('success');
            setMsg('Thank you for subscribing!');
            reset();
        } catch (err) {
            setState('error');
            setMsg(err instanceof Error ? err.message : 'Subscription failed');
        }
    };

    if (state === 'success') {
        return (
            <div className={`p-6 rounded-xl border border-green-500/30 bg-green-500/10 text-center ${compact ? 'text-sm' : ''}`}>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-green-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h4 className="text-white font-bold mb-1">Subscribed!</h4>
                <p className="text-green-300">You've successfully joined our newsletter.</p>
            </div>
        );
    }

    return (
        <div className={compact ? "" : "bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-2xl p-8 md:p-12"}>
            {!compact && (
                <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Stay in the <span className="text-gold">Loop</span>
                    </h3>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Get the latest insights, trends, and tech news delivered directly to your inbox. No spam, just value.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
                <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="space-y-4">
                    <Input
                        placeholder="Your Email Address"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        className="bg-white/5 border-white/10 focus:border-gold"
                    />
                    {!compact && (
                        <Input
                            placeholder="Your Name (Optional)"
                            {...register('name')}
                            className="bg-white/5 border-white/10 focus:border-gold"
                        />
                    )}
                </div>

                {state === 'error' && (
                    <p className="text-red-400 text-sm text-center">{msg}</p>
                )}

                <Button type="submit" isLoading={isSubmitting} className="w-full">
                    Subscribe Now
                </Button>
            </form>
        </div>
    );
}
