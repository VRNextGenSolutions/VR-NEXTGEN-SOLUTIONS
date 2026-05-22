import React from 'react';
import { Container } from '@/components/common';

export default function TrustSignals() {
  const signals = [
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "10+ Years",
      subtitle: "Industry Expertise"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Proven ROI",
      subtitle: "Measurable Results"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Data Secure",
      subtitle: "Enterprise Grade"
    }
  ];

  return (
    <section className="py-12 bg-black border-y border-white/5 relative z-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {signals.map((signal, idx) => (
            <div key={idx} className="flex flex-col items-center text-center pt-8 md:pt-0 first:pt-0 group">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-gold/50 transition-all duration-300 shadow-[0_0_15px_rgba(255,215,0,0.05)] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]">
                {signal.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{signal.title}</h3>
              <p className="text-gray-400">{signal.subtitle}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
