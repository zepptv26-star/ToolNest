import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { fetchCurrencies, fetchRates, type RatesData } from '../services/exchangeRates';
import { formatNumber } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, SelectField, Stat } from '../components/ui';

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Record<string, string> | null>(null);
  const [from, setFrom] = useState('USD'); const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState(false);
  const [manualRate, setManualRate] = useState('');
  const [manualFrom, setManualFrom] = useState(''); const [manualTo, setManualTo] = useState('');

  const load = useCallback(async (base: string) => {
    setLoading(true); setError(null);
    try {
      const [list, data] = await Promise.all([fetchCurrencies(), fetchRates(base)]);
      setCurrencies(list); setRates(data);
    } catch (e) {
      setRates(null);
      setError(e instanceof Error ? e.message : 'Exchange rates are unavailable.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (!manual) void load(from); }, [from, manual, load]);

  const options = useMemo(() => {
    const codes = currencies ? Object.keys(currencies).sort() : ['USD', 'EUR'];
    return codes.map((c) => ({ value: c, label: currencies?.[c] ? `${c} · ${currencies[c]}` : c }));
  }, [currencies]);

  const amt = parseNumber(amount);
  const rate = manual ? parseNumber(manualRate) : rates?.rates[to] ?? null;
  const converted = amt !== null && rate !== null && rate > 0 && amt >= 0 ? amt * rate : null;
  const label = manual ? `${manualFrom || 'from'} → ${manualTo || 'to'}` : `${from} → ${to}`;
  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className={manual ? 'btn-secondary !py-2' : 'btn-primary !py-2'} aria-pressed={!manual} onClick={() => setManual(false)}>Live rates</button>
        <button type="button" className={manual ? 'btn-primary !py-2' : 'btn-secondary !py-2'} aria-pressed={manual} onClick={() => setManual(true)}>Enter my own rate</button>
      </div>

      <NumberInput label="Amount" value={amount} onChange={setAmount} placeholder="e.g. 100" />

      {!manual ? (
        <div className="mt-4 grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <SelectField label="From" value={from} onChange={setFrom} options={options} />
          <button type="button" onClick={swap} className="btn-secondary !py-3" aria-label="Swap currencies"><ArrowLeftRight size={18} aria-hidden /></button>
          <SelectField label="To" value={to} onChange={setTo} options={options} />
        </div>
      ) : (
        <div className="mt-4">
          <Grid cols={3}>
            <div><label htmlFor="mf" className="label">From currency (label)</label><input id="mf" className="input" value={manualFrom} maxLength={10} placeholder="e.g. USD" onChange={(e) => setManualFrom(e.target.value.toUpperCase())} /></div>
            <div><label htmlFor="mt" className="label">To currency (label)</label><input id="mt" className="input" value={manualTo} maxLength={10} placeholder="e.g. EUR" onChange={(e) => setManualTo(e.target.value.toUpperCase())} /></div>
            <NumberInput label="Exchange rate" value={manualRate} onChange={setManualRate} placeholder="1 from = ? to" hint={`1 ${manualFrom || 'from'} = ? ${manualTo || 'to'}`} />
          </Grid>
        </div>
      )}

      {loading && !manual && <p className="mt-4 text-sm text-muted" role="status">Loading exchange rates…</p>}
      {!manual && error && (
        <>
          <ErrorNote message={`${error} Live rates are unavailable right now, so no conversion is shown. You can retry, or switch to “Enter my own rate”.`} />
          <button type="button" className="btn-secondary mt-3 !py-2" onClick={() => void load(from)}><RefreshCw size={16} aria-hidden /> Retry</button>
        </>
      )}
      {!manual && rates && !error && rate === null && <ErrorNote message={`No rate is available for ${from} → ${to}.`} />}
      <ErrorNote message={amount.trim() !== '' && amt === null ? 'Please enter a valid amount.' : amt !== null && amt < 0 ? 'Amount cannot be negative.' : manual && manualRate.trim() !== '' && (rate === null || rate <= 0) ? 'Enter an exchange rate greater than zero.' : null} />

      {converted !== null && amt !== null && rate !== null && (
        <Results>
          <Stat big label={`${formatNumber(amt)} ${manual ? manualFrom : from} equals`} value={`${converted.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${manual ? manualTo : to}`}
            sub={`Rate used (${label}): 1 = ${formatNumber(rate, 6)}`} />
          <div className="flex gap-2">
            <CopyButton text={`${formatNumber(amt)} ${manual ? manualFrom : from} = ${converted.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${manual ? manualTo : to}`} />
            <ClearButton onClick={() => setAmount('')} />
          </div>
        </Results>
      )}

      {!manual && rates && !error && (
        <Note>
          Source: European Central Bank reference rates via the Frankfurter service. Rates are for the working day <strong>{rates.date}</strong> (published about 16:00 CET on working days; not updated on weekends). Fetched {new Date(rates.fetchedAt).toLocaleString()}.
          They are reference rates, not live trading quotes. Banks and card providers use different rates and add fees.
        </Note>
      )}
      {manual && <Note>Manual mode uses only the rate you type. No exchange-rate data is fetched.</Note>}
    </div>
  );
}
