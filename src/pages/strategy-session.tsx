import React, { useRef } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import LandingHero from '@/components/landing/LandingHero';
import TrustSignals from '@/components/landing/TrustSignals';
import RegistrationForm from '@/components/landing/RegistrationForm';
import { Container } from '@/components/common';
import { SEOHead } from '@/components/seo';

export default function StrategySessionPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <LandingLayout 
      title="Exclusive Strategy Session | VR NextGen Solutions"
      description="Register for an exclusive business strategy session to unlock data-driven growth."
    >
      <SEOHead 
        title="Exclusive Strategy Session | VR NextGen Solutions"
        description="Register for an exclusive business strategy session to unlock data-driven growth."
        canonical="/strategy-session"
        // Prevent indexing of landing pages meant for ads
        noindex={true} 
      />

      {/* Hero Section */}
      <LandingHero onScrollToForm={scrollToForm} />

      {/* Social Proof Bar */}
      <TrustSignals />

      {/* Booking/Registration Section */}
      <section className="py-20 bg-[#050505] relative overflow-hidden" id="register">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left side: Value Prop */}
            <div className="lg:w-1/2 space-y-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                What You Get In Your <span className="text-gold">Free Strategy Session</span>
              </h2>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Custom Data Audit</h4>
                    <p className="text-gray-400">We analyze your current operations and identify where you are leaking profit.</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Automation Roadmap</h4>
                    <p className="text-gray-400">A clear, step-by-step plan on how to automate your most time-consuming processes.</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Expert Consultation</h4>
                    <p className="text-gray-400">Direct 1-on-1 time with our senior business strategists to ask any questions.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right side: The Form */}
            <div className="lg:w-1/2 w-full max-w-lg mx-auto" ref={formRef}>
              <RegistrationForm />
            </div>
          </div>
        </Container>
      </section>
    </LandingLayout>
  );
}
