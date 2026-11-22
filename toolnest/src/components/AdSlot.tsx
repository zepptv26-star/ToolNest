import { useEffect, useRef } from 'react';
import { site } from '../config/site';
import { useConsent } from '../hooks/useConsent';
import { isValidAdsenseClient } from '../lib/thirdParty';

export type AdPlacement = 'header-banner' | 'in-content' | 'sidebar' | 'footer-banner';

const sizes: Record<AdPlacement, string> = {
  'header-banner': 'min-h-[90px]',
  'in-content': 'min-h-[250px]',
  sidebar: 'min-h-[250px]',
  'footer-banner': 'min-h-[90px]'
};

/**
 * Reserved advertisement area. It renders NOTHING (no box, no fake ad) unless an AdSense client ID,
 * a slot ID for this placement and visitor consent are all present. Placing it in a layout is safe
 * to do now; it simply appears later when the owner configures an approved account.
 */
export function AdSlot({ placement, className = '' }: { placement: AdPlacement; className?: string }) {
  const { status } = useConsent();
  const slot = site.adSlots[placement];
  const pushed = useRef(false);
  const active = isValidAdsenseClient(site.adsenseClientId) && Boolean(slot) && status === 'granted';

  useEffect(() => {
    if (!active || pushed.current) return;
    pushed.current = true;
    try { ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* ad blocker or script unavailable */ }
  }, [active]);

  if (!active) return null;
  return (
    <aside aria-label="Advertisement" data-ad-placement={placement} className={`${sizes[placement]} w-full overflow-hidden ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wide text-muted">Advertisement</p>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={site.adsenseClientId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
