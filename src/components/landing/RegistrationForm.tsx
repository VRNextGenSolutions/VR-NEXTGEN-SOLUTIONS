import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sanitizeInput } from '@/utils/security';

const StrategySessionSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .refine((val) => sanitizeInput(val).length > 0, 'Invalid characters in name'),
  email: z
    .string()
    .email('Valid email required')
    .max(254, 'Email is too long'),
  phone: z
    .string()
    .min(5, 'Valid phone number required')
    .max(30, 'Phone number is too long'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City name is too long'),
  companyName: z
    .string()
    .min(2, 'Company Name is required')
    .max(100, 'Company Name is too long'),
  currentChallenge: z
    .string()
    .max(1000, 'Challenge description is too long')
    .optional(),
  company: z.string().optional(),
});

type StrategySessionFormData = z.infer<typeof StrategySessionSchema>;

export default function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StrategySessionFormData>({
    resolver: zodResolver(StrategySessionSchema),
  });

  const onSubmit = async (data: StrategySessionFormData) => {
    try {
      setErrorMessage('');

      const sanitizedName = sanitizeInput(data.name);
      const sanitizedPhone = sanitizeInput(data.phone);
      const sanitizedCity = sanitizeInput(data.city);
      const sanitizedCompanyName = sanitizeInput(data.companyName);
      const sanitizedChallenge = data.currentChallenge ? sanitizeInput(data.currentChallenge) : 'N/A';

      const payload = {
        name: sanitizedName,
        email: data.email,
        message: `Strategy Session Request\nCompany Name: ${sanitizedCompanyName}\nPhone: ${sanitizedPhone}\nCity: ${sanitizedCity}\nCurrent Challenge: ${sanitizedChallenge}`,
        honeypot: data.company?.trim() ?? '',
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
      } catch {
        throw new Error('Unable to send request. Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(result.error || `Submission failed. Status: ${response.status}`);
      }

      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again later.'
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-gold/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(255,215,0,0.1)] relative z-10">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">Thank You!</h3>
        <p className="text-gold text-xl font-semibold mb-4">Your request has been received</p>
        <p className="text-gray-300 text-base leading-relaxed">
          Thank you for reaching out. One of our strategy experts will contact you shortly to schedule your 60-minute session.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Glow effect inside form */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
      
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 relative z-10">Request Your Session</h3>
      <p className="text-gray-400 mb-6 relative z-10">Fill out the details below and we&apos;ll be in touch within 24 hours.</p>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 border rounded-xl bg-red-500/10 border-red-500/30 text-red-300 relative z-10 text-sm"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" aria-busy={isSubmitting}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
          <input 
            type="text" 
            id="name"
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="Tirth Raval"
          />
          {errors.name && (
            <p className="mt-1 text-red-400 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
          <input 
            type="email" 
            id="email" 
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="tirthraval@gmail.com"
          />
          {errors.email && (
            <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
          <input 
            type="tel" 
            id="phone" 
            {...register('phone')}
            aria-invalid={Boolean(errors.phone)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="+91 98765 43210"
          />
          {errors.phone && (
            <p className="mt-1 text-red-400 text-xs">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">City *</label>
          <input 
            type="text" 
            id="city" 
            {...register('city')}
            aria-invalid={Boolean(errors.city)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="Mumbai, Maharashtra"
          />
          {errors.city && (
            <p className="mt-1 text-red-400 text-xs">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">Company Name *</label>
          <input 
            type="text" 
            id="companyName" 
            {...register('companyName')}
            aria-invalid={Boolean(errors.companyName)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="VR NextGen Solutions"
          />
          {errors.companyName && (
            <p className="mt-1 text-red-400 text-xs">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="currentChallenge" className="block text-sm font-medium text-gray-300 mb-1">Current Challenge</label>
          <textarea 
            id="currentChallenge" 
            rows={3}
            {...register('currentChallenge')}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors resize-none"
            placeholder="Briefly describe your biggest operational or growth bottleneck..."
          />
          {errors.currentChallenge && (
            <p className="mt-1 text-red-400 text-xs">{errors.currentChallenge.message}</p>
          )}
        </div>

        {/* Honeypot field for bot prevention */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="company" className="hidden">Company</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('company')}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gold text-black font-bold text-base md:text-lg py-4 rounded-xl mt-4 hover:bg-gold/90 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(255,215,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,215,0,0.3)] disabled:opacity-70 disabled:transform-none cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Book My 60-Minute Strategy Session"}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          By submitting this form, you agree to our privacy policy. Your data is secure.
        </p>
      </form>
    </div>
  );
}
