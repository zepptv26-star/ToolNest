/**
 * Exchange-rate service layer. Uses the free Frankfurter API (European Central Bank reference rates, no API key).
 * Rates are published on working days only, so they are reference rates, not live trading quotes.
 */
const BASE_URL = 'https://api.frankfurter.dev/v1';
const TIMEOUT_MS = 10_000;
const CACHE_MS = 10 * 60 * 1000;

export interface RatesData { base: string; date: string; rates: Record<string, number>; fetchedAt: number }

export class RatesError extends Error {}

async function getJson(path: string): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: ctrl.signal });
    if (!res.ok) throw new RatesError(`The exchange-rate service returned an error (${res.status}).`);
    return await res.json();
  } catch (e) {
    if (e instanceof RatesError) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') throw new RatesError('The exchange-rate service took too long to respond.');
    throw new RatesError('Could not reach the exchange-rate service. Check your internet connection.');
  } finally {
    clearTimeout(timer);
  }
}

let currenciesCache: Record<string, string> | null = null;
export async function fetchCurrencies(): Promise<Record<string, string>> {
  if (currenciesCache) return currenciesCache;
  const data = await getJson('/currencies');
  if (!data || typeof data !== 'object') throw new RatesError('The exchange-rate service returned unexpected data.');
  currenciesCache = data as Record<string, string>;
  return currenciesCache;
}

const ratesCache = new Map<string, RatesData>();
export async function fetchRates(base: string): Promise<RatesData> {
  const hit = ratesCache.get(base);
  if (hit && Date.now() - hit.fetchedAt < CACHE_MS) return hit;
  const data = (await getJson(`/latest?base=${encodeURIComponent(base)}`)) as { base?: string; date?: string; rates?: Record<string, number> };
  if (!data?.rates || typeof data.rates !== 'object' || typeof data.date !== 'string') {
    throw new RatesError('The exchange-rate service returned unexpected data.');
  }
  const result: RatesData = { base, date: data.date, rates: { ...data.rates, [base]: 1 }, fetchedAt: Date.now() };
  ratesCache.set(base, result);
  return result;
}
