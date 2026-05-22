/**
 * CallToAction Component
 * "Obsidian Glass" floating card CTA with glassmorphism and gold accents
 */

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/common';

export default function CallToAction() {
  return (
    <section className="relative py-20 md:py-28 bg-black">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/8 rounded-full blur-[120px]" />
      </div>

      <Container>
        {/* Floating Glass Card */}
        <div className="relative z-10 bg-white/5 backdrop-blur-md border border-gold/30 rounded-3xl px-8 py-14 md:px-16 md:py-20 shadow-[0_0_50px_rgba(255,215,0,0.15)] transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(255,215,0,0.22)]">
          {/* Inner decorative corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-lg" />

          <div className="text-center space-y-8">
            {/* Tagline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gold leading-tight">
              Let&apos;s Build Your Success Story Together
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              From strategy to automation, we deliver end-to-end solutions that create real business impact.
            </p>

            {/* Book Now Button */}
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gold/90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
