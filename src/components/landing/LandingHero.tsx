import React from 'react';
import { Container } from '@/components/common';

interface LandingHeroProps {
  onScrollToForm: () => void;
}

export default function LandingHero({ onScrollToForm }: LandingHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Eyebrow */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm md:text-base font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <span className="w-2 h-2 bg-gold rounded-full animate-ping" />
              Exclusive Strategy Session
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Unlock Your Business Potential With <span className="text-gold">Data-Driven Strategy</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stop guessing and start growing. Discover hidden bottlenecks and automate your operations with our proven end-to-end consulting framework.
          </p>

          {/* Action Button */}
          <div className="animate-fade-in-up delay-300 pt-8">
            <button 
              onClick={onScrollToForm}
              className="inline-flex items-center gap-3 bg-gold text-black px-10 py-5 rounded-full font-bold text-lg md:text-xl hover:bg-gold/90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] group"
            >
              Claim Your Free Consultation
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <p className="mt-4 text-sm text-gray-500 font-medium">Limited spots available this week.</p>
          </div>

        </div>
      </Container>
    </section>
  );
}
