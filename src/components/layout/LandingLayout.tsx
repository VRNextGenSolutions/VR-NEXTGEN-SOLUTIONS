import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

interface LandingLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function LandingLayout({
  children,
  title = "Free Strategy Session | VR NextGen Solutions",
  description = "Book your exclusive strategy session with VR NextGen Solutions to unlock data-driven growth."
}: LandingLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-gold/30 selection:text-white">
        
        {/* Minimalist Header - Only Logo */}
        <header className="absolute top-0 w-full z-50 py-6 px-4 md:px-8 flex justify-center md:justify-start">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <Image
              src="/icons-optimized/logo-Final-png.png"
              alt="VR NextGEN Solutions"
              width={160}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Minimalist Footer - Legal Only */}
        <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {currentYear} VR NextGEN Solutions. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <Link href="/terms-of-service" className="hover:text-gold transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
