import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdSlot } from './AdSlot';
import { ConsentBanner } from './ConsentBanner';
import { ErrorBoundary } from './ErrorBoundary';
import { useConsent } from '../hooks/useConsent';
import { trackPageView } from '../lib/thirdParty';

export function Layout() {
  const { pathname } = useLocation();
  const { status } = useConsent();
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  useEffect(() => {
    if (status !== 'granted') return;
    // Wait a tick so the page's own title is set before reporting the view.
    const t = setTimeout(() => trackPageView(pathname, document.title), 100);
    return () => clearTimeout(t);
  }, [pathname, status]);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
        <AdSlot placement="footer-banner" className="mt-10" />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}
