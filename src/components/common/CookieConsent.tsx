import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'vr_nextgen_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: true,
    marketing: true,
    functional: true,
  });

  useEffect(() => {
    setMounted(true);

    try {
      // Expose a helper to easily test or reset consent from browser console
      if (typeof window !== 'undefined') {
        (window as any).__resetCookieConsent = () => {
          localStorage.removeItem(COOKIE_CONSENT_KEY);
          window.location.reload();
        };
        (window as any).__showCookieConsent = () => {
          setIsVisible(true);
        };
      }

      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Show after a brief delay for a smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 400);
        return () => clearTimeout(timer);
      }
    } catch {
      // If localStorage is blocked or restricted, show banner safely
      setIsVisible(true);
    }
  }, []);

  const saveConsent = useCallback((consentData: ConsentPreferences) => {
    try {
      const data = {
        preferences: consentData,
        timestamp: new Date().toISOString(),
        expiry: new Date(Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    } catch {
      // ignore write errors if storage disabled
    }

    setIsVisible(false);

    // Update Google Analytics consent based on user choice
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      try {
        (window as any).gtag('consent', 'update', {
          analytics_storage: consentData.analytics ? 'granted' : 'denied',
          ad_storage: consentData.marketing ? 'granted' : 'denied',
          functionality_storage: consentData.functional ? 'granted' : 'denied',
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    saveConsent({ analytics: true, marketing: true, functional: true });
  }, [saveConsent]);

  const handleSavePreferences = useCallback(() => {
    saveConsent(preferences);
  }, [preferences, saveConsent]);

  const handleRejectNonEssential = useCallback(() => {
    saveConsent({ analytics: false, marketing: false, functional: false });
  }, [saveConsent]);

  if (!mounted || !isVisible) return null;

  const content = (
    <aside
      id="cookie-consent-banner"
      role="dialog"
      aria-label="Cookie consent banner"
      aria-modal="false"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647, // Maximum z-index
        pointerEvents: 'auto',
      }}
      className="p-3 sm:p-5 md:p-6 transition-transform duration-500 ease-out"
    >
      <div className="max-w-5xl mx-auto">
        <div
          style={{
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          className="rounded-2xl border p-5 md:p-7 text-white"
        >
          {/* Main banner row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
                className="flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center mt-0.5"
              >
                <svg
                  className="w-5 h-5 text-gold"
                  style={{ color: '#ffd700' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-white text-base md:text-lg font-semibold tracking-wide mb-1">
                  We value your privacy
                </h3>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-3xl">
                  We use cookies and analytics tools (including Microsoft Clarity &amp; Google Analytics) to improve your experience, analyze traffic, and ensure site security. You can accept all or customize your preferences.{' '}
                  <Link
                    href="/privacy-policy"
                    style={{ color: '#ffd700' }}
                    className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowCustomize((prev) => !prev)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs md:text-sm font-medium text-gray-200 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
                id="cookie-customize-btn"
              >
                {showCustomize ? 'Hide options' : 'Customize'}
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2.5 text-xs md:text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
                id="cookie-reject-btn"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                style={{
                  backgroundColor: '#ffd700',
                  color: '#000000',
                  boxShadow: '0 4px 14px 0 rgba(255, 215, 0, 0.35)',
                }}
                className="w-full sm:w-auto px-6 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                id="cookie-accept-all-btn"
              >
                Accept All Cookies
              </button>
            </div>
          </div>

          {/* Expandable Preferences Drawer */}
          {showCustomize && (
            <div
              style={{
                backgroundColor: 'rgba(10, 10, 10, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
              className="mt-5 p-4 md:p-5 rounded-xl border space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Cookie Categories
                </span>
                <span className="text-xs text-gray-500">Manage your preferences</span>
              </div>

              {/* Essential */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-white text-sm font-medium">Essential &amp; Security</p>
                  <p className="text-gray-400 text-xs">Required for core website functionality and security.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 text-gray-300">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Analytics &amp; Performance</p>
                  <p className="text-gray-400 text-xs">
                    Measures site traffic and interactions (Clarity, Google Analytics).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}
                  style={{
                    backgroundColor: preferences.analytics ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
                  }}
                  className="relative w-11 h-6 rounded-full transition-colors flex items-center px-0.5"
                  role="switch"
                  aria-checked={preferences.analytics}
                  aria-label="Toggle analytics cookies"
                >
                  <span
                    style={{
                      transform: preferences.analytics ? 'translateX(20px)' : 'translateX(0)',
                      backgroundColor: preferences.analytics ? '#000000' : '#ffffff',
                    }}
                    className="w-5 h-5 rounded-full transition-transform shadow-md"
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Marketing &amp; Targeting</p>
                  <p className="text-gray-400 text-xs">Used to deliver relevant information and campaigns.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, marketing: !p.marketing }))}
                  style={{
                    backgroundColor: preferences.marketing ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
                  }}
                  className="relative w-11 h-6 rounded-full transition-colors flex items-center px-0.5"
                  role="switch"
                  aria-checked={preferences.marketing}
                  aria-label="Toggle marketing cookies"
                >
                  <span
                    style={{
                      transform: preferences.marketing ? 'translateX(20px)' : 'translateX(0)',
                      backgroundColor: preferences.marketing ? '#000000' : '#ffffff',
                    }}
                    className="w-5 h-5 rounded-full transition-transform shadow-md"
                  />
                </button>
              </div>

              {/* Save Preferences Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  style={{ backgroundColor: '#ffd700', color: '#000000' }}
                  className="px-5 py-2 text-xs font-bold rounded-lg transition-transform hover:scale-[1.02]"
                >
                  Save My Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return createPortal(content, document.body);
}
