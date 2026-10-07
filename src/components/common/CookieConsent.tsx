import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'vr_nextgen_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: true,
    marketing: true,
    functional: true,
  });

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for a smoother page load experience
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = useCallback((consentData: ConsentPreferences) => {
    const data = {
      preferences: consentData,
      timestamp: new Date().toISOString(),
      expiry: new Date(Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    setIsVisible(false);

    // Update Google Analytics consent based on preferences
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        analytics_storage: consentData.analytics ? 'granted' : 'denied',
        ad_storage: consentData.marketing ? 'granted' : 'denied',
        functionality_storage: consentData.functional ? 'granted' : 'denied',
      });
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const allAccepted = { analytics: true, marketing: true, functional: true };
    saveConsent(allAccepted);
  }, [saveConsent]);

  const handleSavePreferences = useCallback(() => {
    saveConsent(preferences);
  }, [preferences, saveConsent]);

  const handleRejectNonEssential = useCallback(() => {
    const essentialOnly = { analytics: false, marketing: false, functional: false };
    saveConsent(essentialOnly);
  }, [saveConsent]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[9999] transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      role="dialog"
      aria-label="Cookie consent"
      id="cookie-consent-banner"
    >
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Glass card */}
        <div className="bg-gray-night-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
          {/* Header with icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-heading text-lg md:text-xl font-semibold mb-1">
                We value your privacy
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
                We use cookies to enhance your browsing experience, serve personalized content, and
                analyze our traffic. By clicking &ldquo;Accept all cookies&rdquo;, you consent to our use of
                cookies.{' '}
                <Link
                  href="/privacy-policy"
                  className="text-gold hover:text-gold-dark underline underline-offset-2 transition-colors"
                >
                  Cookie policy
                </Link>
              </p>
            </div>
          </div>

          {/* Customization panel */}
          {showCustomize && (
            <div className="mt-4 mb-6 p-4 md:p-5 bg-black/40 border border-white/5 rounded-xl space-y-4 animate-fade-in">
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
                Cookie Preferences
              </h3>

              {/* Essential - always on */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white text-sm font-medium">Essential Cookies</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <div className="relative">
                  <div className="w-11 h-6 bg-gold/30 rounded-full flex items-center cursor-not-allowed">
                    <div className="w-5 h-5 bg-gold rounded-full ml-auto mr-0.5 shadow-md" />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Analytics Cookies</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))
                  }
                  className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-gray-night-black"
                  style={{
                    backgroundColor: preferences.analytics
                      ? 'rgba(255, 215, 0, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                  }}
                  role="switch"
                  aria-checked={preferences.analytics}
                  aria-label="Toggle analytics cookies"
                  id="cookie-toggle-analytics"
                >
                  <div
                    className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                      preferences.analytics
                        ? 'bg-gold translate-x-[22px]'
                        : 'bg-gray-400 translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Marketing Cookies</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Used to deliver relevant advertisements and track campaign performance.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))
                  }
                  className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-gray-night-black"
                  style={{
                    backgroundColor: preferences.marketing
                      ? 'rgba(255, 215, 0, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                  }}
                  role="switch"
                  aria-checked={preferences.marketing}
                  aria-label="Toggle marketing cookies"
                  id="cookie-toggle-marketing"
                >
                  <div
                    className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                      preferences.marketing
                        ? 'bg-gold translate-x-[22px]'
                        : 'bg-gray-400 translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>

              {/* Functional */}
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Functional Cookies</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Enable enhanced functionality and personalization features.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, functional: !prev.functional }))
                  }
                  className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-gray-night-black"
                  style={{
                    backgroundColor: preferences.functional
                      ? 'rgba(255, 215, 0, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                  }}
                  role="switch"
                  aria-checked={preferences.functional}
                  aria-label="Toggle functional cookies"
                  id="cookie-toggle-functional"
                >
                  <div
                    className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                      preferences.functional
                        ? 'bg-gold translate-x-[22px]'
                        : 'bg-gray-400 translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold/50"
              id="cookie-customize-btn"
            >
              {showCustomize ? 'Hide options' : 'Customize cookies'}
            </button>

            {showCustomize && (
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-gold/30 rounded-lg transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold/50"
                id="cookie-save-preferences-btn"
              >
                Save preferences
              </button>
            )}

            {showCustomize && (
              <button
                onClick={handleRejectNonEssential}
                className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold/50"
                id="cookie-reject-btn"
              >
                Reject non-essential
              </button>
            )}

            <button
              onClick={handleAcceptAll}
              className="sm:ml-auto px-8 py-2.5 text-sm font-semibold bg-gold hover:bg-gold-dark text-black rounded-lg transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gold/50"
              id="cookie-accept-all-btn"
            >
              Accept all cookies
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
