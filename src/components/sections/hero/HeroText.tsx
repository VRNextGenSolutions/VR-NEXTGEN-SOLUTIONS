/**
 * HeroText Component
 * Original TypeScript-based animated hero text content
 */

import React from 'react';
import { Container } from '@/components/common';
import FloatingElements from '@/components/common/FloatingElements';

export default function HeroText() {
  const heroText = "Data-Driven Business Consulting for Smarter Decisions";

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <Container size="lg">
        <div className="text-center space-y-8 -mt-20 md:-mt-32 relative z-20">
          {/* Main Hero Title - static (no animation) */}
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-gold leading-tight">
            {heroText}
          </h1>

          {/* Subtitle / Description */}
          <div className="animate-fade-in-up delay-1000">
            <p className="text-base md:text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
              At <span className="text-gold font-semibold">VR NextGen Solutions</span>, we empower businesses to achieve excellence through data, process, and strategy. Our end-to-end consulting approach helps organizations optimize operations, automate workflows, and make smarter, data-driven decisions. By aligning people, processes, and technology, we transform challenges into opportunities for sustainable growth.
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="animate-fade-in-up delay-[1500ms] pt-6">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-black font-bold py-3.5 px-8 rounded-full transition-all duration-300 btn-enhanced btn-primary text-lg"
            >
              Book Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </Container>

      {/* Floating Elements for Visual Appeal */}
      <FloatingElements
        elements={[
          { size: 'sm', position: { top: '20%', left: '10%' }, color: 'bg-gold/30' },
          { size: 'xs', position: { top: '40%', right: '20%' }, color: 'bg-gold/40', delay: 1000 },
          { size: 'md', position: { bottom: '40%', left: '20%' }, color: 'bg-gold/20', delay: 2000 },
          { size: 'sm', position: { bottom: '20%', right: '10%' }, color: 'bg-gold/30', delay: 500 }
        ]}
      />

      {/* CSS moved to src/styles/components/hero.css */}
    </div>
  );
}
