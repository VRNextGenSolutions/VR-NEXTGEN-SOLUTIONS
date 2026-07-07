import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CLIENTS = [
  { name: 'Alleima', logo: '/images/testimonials/alleima.jpeg', link: '/insights#customer-stories' },
  { name: 'HG Extrusion', logo: '/images/testimonials/hg-extrusion.jpeg', link: '/insights#customer-stories' },
];

export default function Clients() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" aria-labelledby="clients-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="clients-heading" className="text-3xl md:text-5xl font-bold text-gold mb-4 drop-shadow-md">
            Our Clients
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-between group">
          {/* Left Arrow Placeholder */}
          <button className="absolute left-0 z-10 p-2 text-white/40 hover:text-white focus:outline-none transition-colors" aria-label="Previous client">
             <svg className="w-8 h-8 md:w-12 md:h-12 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
             </svg>
          </button>

          {/* Logos Track */}
          <div className="flex w-full overflow-hidden px-12 md:px-16">
            <div className="flex w-full justify-center items-center gap-8 md:gap-12 flex-nowrap overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4">
              {CLIENTS.map((client, index) => (
                <Link href={client.link} key={index} className="flex-shrink-0 snap-center flex items-center justify-center min-w-[200px] md:min-w-[280px] h-32 md:h-40 relative hover:scale-105 transition-transform duration-300 bg-white/5 border border-white/10 rounded-xl overflow-hidden p-4 group/card hover:bg-white/10 cursor-pointer">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    fill
                    className="object-contain p-4 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 opacity-70 hover:opacity-100"
                    sizes="(max-width: 768px) 200px, 280px"
                  /> 
                </Link>
              ))}
            </div>
          </div>

          {/* Right Arrow Placeholder */}
          <button className="absolute right-0 z-10 p-2 text-white/40 hover:text-white focus:outline-none transition-colors" aria-label="Next client">
             <svg className="w-8 h-8 md:w-12 md:h-12 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
             </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
