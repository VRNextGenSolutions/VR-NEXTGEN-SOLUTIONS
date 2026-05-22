import React, { useState } from 'react';

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-gold/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(255,215,0,0.1)]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Request Received!</h3>
        <p className="text-gray-300 text-lg">
          Thank you for reaching out. One of our strategy experts will contact you shortly to schedule your session.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Glow effect inside form */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
      
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 relative z-10">Request Your Session</h3>
      <p className="text-gray-400 mb-8 relative z-10">Fill out the details below and we&apos;ll be in touch within 24 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
          <input 
            type="text" 
            id="name" 
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="Tirth Raval"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
          <input 
            type="email" 
            id="email" 
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="tirth@gmail.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1.5">City</label>
          <input 
            type="text" 
            id="city" 
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors"
            placeholder="Mumbai, Maharashtra"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gold text-black font-bold text-lg py-4 rounded-xl mt-6 hover:bg-gold/90 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(255,215,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,215,0,0.3)] disabled:opacity-70 disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Submit Request"}
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting this form, you agree to our privacy policy. Your data is secure.
        </p>
      </form>
    </div>
  );
}
