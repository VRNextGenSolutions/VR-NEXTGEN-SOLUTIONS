import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { sanitizeInput } from "@/utils/security";

const ContactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .refine((val) => sanitizeInput(val).length > 0, "Invalid characters in name"),
  email: z.string()
    .email("Valid email required")
    .max(254, "Email is too long"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long")
    .refine((val) => sanitizeInput(val).length > 0, "Invalid characters in message"),
  company: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactSchema>;
type SubmissionState = 'idle' | 'success' | 'error';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactForm() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(ContactSchema) });

  useEffect(() => {
    if (!recaptchaSiteKey || typeof window === 'undefined') return;
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [recaptchaSiteKey]);

  const executeRecaptcha = async () => {
    if (!recaptchaSiteKey || typeof window === 'undefined' || !window.grecaptcha) {
      return undefined;
    }

    await new Promise<void>((resolve) => {
      window.grecaptcha?.ready(() => resolve());
    });

    return window.grecaptcha?.execute(recaptchaSiteKey, {
      action: 'submit_contact_form',
    });
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmissionState('idle');
      setFeedbackMessage('');

      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: data.email, // Email validation handled by Zod
        message: sanitizeInput(data.message),
        honeypot: data.company?.trim() ?? '',
      };

      const recaptchaToken = await executeRecaptcha();
      const payload = {
        ...sanitizedData,
        ...(recaptchaToken ? { recaptchaToken } : {}),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let result: { success?: boolean; error?: string } = {};
      
      try {
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        // If response is not JSON (e.g., HTML error page), provide helpful error
        // Client-side logging only - don't log sensitive data
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to parse API response as JSON', {
            status: response.status,
            statusText: response.statusText,
            preview: text.substring(0, 100), // Only first 100 chars in dev
          });
        }
        throw new Error(
          response.status === 503
            ? 'Contact form is temporarily unavailable. Please try again later.'
            : 'Unable to send your message. The server returned an invalid response. Please try again later.'
        );
      }

      if (!response.ok) {
        throw new Error(result.error || `Failed to send message. Status: ${response.status}`);
      }

      setSubmissionState('success');
      setFeedbackMessage('✅ Thank you! Your message has been sent successfully. We’ll get back to you soon.');
      reset();

      return;
    } catch (error) {
      setSubmissionState('error');
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while sending your message. Please try again later.'
      );
    }
  };

  return (
    <section id="contact-form" className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl" />
      <div className="relative bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gold mb-4">Send us a Message</h2>
          <p className="text-white/70">
            Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {submissionState !== 'idle' && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-6 p-4 border rounded-lg ${
              submissionState === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <p className="text-sm">{feedbackMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-busy={isSubmitting}>
          <div>
            <Input
              {...register("name")}
              type="text"
              placeholder="Your Name"
              error={errors.name?.message}
              className="w-full"
              aria-invalid={Boolean(errors.name)}
            />
          </div>

          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Your Email"
              error={errors.email?.message}
              className="w-full"
              aria-invalid={Boolean(errors.email)}
            />
          </div>

          <div>
            <textarea
              {...register("message")}
              placeholder="Your Message"
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && (
              <p className="mt-2 text-red-400 text-sm">{errors.message.message}</p>
            )}
          </div>

          {/* Honeypot field */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="company" className="hidden">Company</label>
            <input
              id="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("company")}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full btn-enhanced"
            aria-live="polite"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
