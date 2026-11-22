import { site } from '../config/site';

/**
 * Third-party scripts. Nothing here runs unless the owner has configured the matching ID in the
 * environment AND the visitor has granted consent (see useConsent). With no IDs set, this file is inert.
 */
type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; adsbygoogle?: unknown[] };

let analyticsLoaded = false;
let adsLoaded = false;

export const isValidGaId = (id: string) => /^G-[A-Z0-9]{4,}$/.test(id);
export const isValidAdsenseClient = (id: string) => /^ca-pub-\d{8,}$/.test(id);

export function loadAnalytics() {
  const id = site.analyticsId;
  if (analyticsLoaded || !isValidGaId(id)) return;
  analyticsLoaded = true;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) { w.dataLayer!.push(args); };
  w.gtag('js', new Date());
  w.gtag('config', id, { send_page_view: false, anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

export function trackPageView(path: string, title: string) {
  const w = window as GtagWindow;
  if (analyticsLoaded && w.gtag) w.gtag('event', 'page_view', { page_path: path, page_title: title, page_location: window.location.href });
}

export function loadAdsense() {
  const id = site.adsenseClientId;
  if (adsLoaded || !isValidAdsenseClient(id)) return;
  adsLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}
