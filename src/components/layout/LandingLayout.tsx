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
        
        {/* Header - Logo */}
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

        {/* Footer with Socials & Email Links */}
        <footer className="bg-black/90 backdrop-blur-md border-t border-white/10 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2 text-xs text-gray-400">
              <p>© {currentYear} VR NextGEN Solutions. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                <Link href="/terms-of-service" className="hover:text-gold transition-colors">Terms of Service</Link>
              </div>
            </div>

            {/* Social & Email Icons */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/vr_nextgen_solutions?utm_source=ig_web_button_share_sheet&igsh=cHhrM3hiejI0cXRw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30 transition-all duration-300 transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://in.linkedin.com/company/vr-nextgen-solutions?trk=public_post_feed-actor-name"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 transform hover:scale-110"
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:info@vrnextgensolutions.com"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold/20 hover:text-gold hover:border-gold/30 transition-all duration-300 transform hover:scale-110"
                aria-label="Email us"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.409L12 10.728l9.955-6.907h.409c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
