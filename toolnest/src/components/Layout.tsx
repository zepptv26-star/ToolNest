import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdSlot } from './AdSlot';
import { ConsentBanner } from './ConsentBanner';
import { useConsent } from '../hooks/useConsent';
import { trackPageView } from '../lib/thirdParty';

export function Layout() {
  const { pathname } = useLocation();
  const { status } = useConsent();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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
        <Outlet />
        <AdSlot placement="footer-banner" className="mt-10" />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}
