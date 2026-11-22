import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchRates, RatesError } from '../src/services/exchangeRates.ts';

const mockFetch = (impl: () => Promise<unknown>) => { (globalThis as unknown as { fetch: unknown }).fetch = impl; };
const json = (body: unknown, status = 200) => Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });

test('rates: network failure gives a clear error', async () => {
  mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
  await assert.rejects(() => fetchRates('USD'), (e: unknown) => e instanceof RatesError && /Could not reach/.test(e.message));
});

test('rates: HTTP error gives a clear error', async () => {
  mockFetch(() => json({}, 503));
  await assert.rejects(() => fetchRates('GBP'), (e: unknown) => e instanceof RatesError && /503/.test(e.message));
});

test('rates: malformed response is rejected, not trusted', async () => {
  mockFetch(() => json({ hello: 'world' }));
  await assert.rejects(() => fetchRates('JPY'), (e: unknown) => e instanceof RatesError && /unexpected data/.test(e.message));
});

test('rates: success adds base=1 and caches', async () => {
  let calls = 0;
  mockFetch(() => { calls++; return json({ base: 'PHP', date: '2026-11-20', rates: { USD: 0.017 } }); });
  const r = await fetchRates('PHP');
  assert.equal(r.rates.PHP, 1); assert.equal(r.rates.USD, 0.017); assert.equal(r.date, '2026-11-20');
  await fetchRates('PHP');
  assert.equal(calls, 1);
});
