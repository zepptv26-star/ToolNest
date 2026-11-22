import { useMemo, useState } from 'react';
import { projectGrowth } from '../lib/calc/finance.ts';
import { formatMoney } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, SelectField } from '../components/ui';
import { GrowthResults } from './FinanceShared';

const FREQ = { '52': 'Weekly', '26': 'Every 2 weeks', '12': 'Monthly', '4': 'Quarterly', '1': 'Yearly' } as const;
type Freq = keyof typeof FREQ;

export default function SavingsCalculator() {
  const [initial, setInitial] = useState(''); const [contrib, setContrib] = useState('');
  const [freq, setFreq] = useState<Freq>('12'); const [rate, setRate] = useState(''); const [years, setYears] = useState('');

  const out = useMemo(() => {
    if (rate.trim() === '' || years.trim() === '' || (initial.trim() === '' && contrib.trim() === '')) return null;
    const p = initial.trim() === '' ? 0 : parseNumber(initial), c = contrib.trim() === '' ? 0 : parseNumber(contrib);
    const r = parseNumber(rate), y = parseNumber(years);
    if (p === null || c === null || r === null || y === null) return { error: 'Please enter numbers only.' };
    const m = Number(freq);
    const res = projectGrowth({ principal: p, contribution: c, contributionsPerYear: m, annualRatePct: r, compoundsPerYear: m, years: y });
    return res.ok ? { res: res.value } : { error: res.error };
  }, [initial, contrib, freq, rate, years]);

  const reset = () => { setInitial(''); setContrib(''); setRate(''); setYears(''); };
  const res = out && 'res' in out ? out.res : null;

  return (
    <div>
      <Grid>
        <NumberInput label="Initial savings" value={initial} onChange={setInitial} placeholder="e.g. 1000" hint="Any currency. Can be 0." />
        <NumberInput label="Regular contribution" value={contrib} onChange={setContrib} placeholder="e.g. 100" />
        <SelectField label="Contribution frequency" value={freq} onChange={setFreq} options={(Object.keys(FREQ) as Freq[]).map((k) => ({ value: k, label: FREQ[k] }))} />
        <NumberInput label="Annual interest rate" value={rate} onChange={setRate} suffix="%" placeholder="e.g. 5" />
        <NumberInput label="Savings duration (years)" value={years} onChange={setYears} placeholder="e.g. 10" />
      </Grid>
      {out && 'error' in out && <ErrorNote message={out.error} />}
      {res && (
        <Results>
          <GrowthResults r={res} />
          <div className="flex gap-2"><CopyButton text={`Estimated balance ${formatMoney(res.finalBalance)}; contributions ${formatMoney(res.totalContributions)}; interest ${formatMoney(res.totalInterest)}`} /><ClearButton onClick={reset} /></div>
        </Results>
      )}
      {!res && <div className="mt-4"><ClearButton onClick={reset} /></div>}
      <Note>Assumptions: a constant annual interest rate, interest added at the same frequency as your contributions, and each contribution made at the end of its period. No taxes, fees or inflation are included. Real savings accounts and investments vary. These results are estimates, not a promise of returns or financial advice.</Note>
    </div>
  );
}
