import React, { useRef } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import LandingHero from '@/components/landing/LandingHero';
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

  const benefits = [
    { text: "Sales Dashboard Review", icon: "✔️" },
    { text: "Process Optimization", icon: "✔️" },
    { text: "Automation Roadmap", icon: "✔️" },
    { text: "SOP Assessment", icon: "✔️" },
    { text: "Growth Recommendations", icon: "✔️" },
    { text: "Identified Bottlenecks", icon: "✔️" },
    { text: "Identify Hidden Profit Leakage", icon: "✔️" }
  ];

  return (
    <LandingLayout 
      title="Exclusive Strategy Session | VR NextGen Solutions"
      description="Register for an exclusive 60-minute business growth strategy session to unlock data-driven growth."
    >
      <SEOHead 
        title="Exclusive Strategy Session | VR NextGen Solutions"
        description="Register for an exclusive 60-minute business growth strategy session to unlock data-driven growth."
        canonical="/strategy-session"
        noindex={true} 
      />

      {/* Hero Section */}
      <LandingHero onScrollToForm={scrollToForm} />

      {/* Booking/Registration Section */}
      <section className="py-20 bg-[#050505] relative overflow-hidden" id="register">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left side: Value Prop */}
            <div className="lg:w-1/2 space-y-8 relative z-10">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-semibold">
                <span className="w-2 h-2 bg-gold rounded-full animate-ping" />
                Exclusive Strategy Session: Only Limited Free Sessions Available
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Unlock Your Business Potential With <span className="text-gold">Data-Driven Strategy</span>
                <span className="block text-2xl md:text-3xl text-gold mt-2 font-semibold">FREE 60-Minute Business Growth Strategy Session</span>
              </h2>

              <p className="text-xl text-gray-300 font-medium leading-relaxed">
                Discover Hidden Growth Opportunities, Process Gaps &amp; Automation Ideas
              </p>

              {/* Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-gold/30 transition-colors">
                    <span className="text-gold text-lg flex-shrink-0">{benefit.icon}</span>
                    <span className="text-gray-200 font-semibold text-base">{benefit.text}</span>
                  </div>
                ))}
              </div>

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
