import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { site } from '../config/site';
import { loadAdsense, loadAnalytics } from '../lib/thirdParty';

export type ConsentStatus = 'unset' | 'granted' | 'denied';
interface Ctx {
  status: ConsentStatus;
  /** True only when analytics or ads are configured, i.e. when a consent choice is actually needed. */
  needed: boolean;
  grant: () => void;
  deny: () => void;
  reopen: () => void;
}

const KEY = 'toolnest:consent';
const ConsentContext = createContext<Ctx | null>(null);

function readStored(): ConsentStatus {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : 'unset';
  } catch { return 'unset'; }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const needed = Boolean(site.analyticsId || site.adsenseClientId);
  const [status, setStatus] = useState<ConsentStatus>(readStored);

  const save = useCallback((v: ConsentStatus) => {
    setStatus(v);
    try { if (v === 'unset') localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (needed && status === 'granted') { loadAnalytics(); loadAdsense(); }
  }, [needed, status]);

  const value = useMemo<Ctx>(() => ({
    status, needed,
    grant: () => save('granted'),
    deny: () => { save('denied'); /* scripts already loaded this session stop being used after reload */ },
    reopen: () => save('unset')
  }), [status, needed, save]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside ConsentProvider');
  return ctx;
}
