import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { useEffect } from "react";
import { register, preloadCriticalResources, trackPerformance } from "@/utils/serviceWorker";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  useEffect(() => {
    // Register service worker for PWA functionality
    register({
      onSuccess: () => {
        // Service worker registered successfully
      },
      onUpdate: () => {
        // New service worker available
        // Optionally show update notification to user
      }
    });

    // Preload critical resources
    preloadCriticalResources();

    // Track performance metrics
    trackPerformance();
  }, []);

  return (
    <ThemeProvider>
      {isAdminRoute ? (
        <AuthProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </AuthProvider>
      ) : (
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      )}
    </ThemeProvider>
  );
}
