import { useMemo, useState } from 'react';
import { projectGrowth } from '../lib/calc/finance.ts';
import { formatMoney } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, SelectField } from '../components/ui';
import { GrowthResults } from './FinanceShared';

const COMPOUND = { '1': 'Yearly', '2': 'Half-yearly', '4': 'Quarterly', '12': 'Monthly', '365': 'Daily' } as const;
type Comp = keyof typeof COMPOUND;

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(''); const [rate, setRate] = useState(''); const [years, setYears] = useState('');
  const [comp, setComp] = useState<Comp>('12'); const [monthly, setMonthly] = useState('');

  const out = useMemo(() => {
    if (principal.trim() === '' || rate.trim() === '' || years.trim() === '') return null;
    const p = parseNumber(principal), r = parseNumber(rate), y = parseNumber(years);
    const c = monthly.trim() === '' ? 0 : parseNumber(monthly);
    if (p === null || r === null || y === null || c === null) return { error: 'Please enter numbers only.' };
    const res = projectGrowth({ principal: p, contribution: c, contributionsPerYear: 12, annualRatePct: r, compoundsPerYear: Number(comp), years: y });
    return res.ok ? { res: res.value } : { error: res.error };
  }, [principal, rate, years, comp, monthly]);

  const reset = () => { setPrincipal(''); setRate(''); setYears(''); setMonthly(''); };
  const res = out && 'res' in out ? out.res : null;

  return (
    <div>
      <Grid>
        <NumberInput label="Initial principal" value={principal} onChange={setPrincipal} placeholder="e.g. 5000" hint="Any currency" />
        <NumberInput label="Annual interest rate" value={rate} onChange={setRate} suffix="%" placeholder="e.g. 6" />
        <SelectField label="Compounding frequency" value={comp} onChange={setComp} options={(Object.keys(COMPOUND) as Comp[]).map((k) => ({ value: k, label: COMPOUND[k] }))} />
        <NumberInput label="Investment duration (years)" value={years} onChange={setYears} placeholder="e.g. 10" />
        <NumberInput label="Monthly contribution (optional)" value={monthly} onChange={setMonthly} placeholder="e.g. 100" hint="Added at the end of every month" />
      </Grid>
      {out && 'error' in out && <ErrorNote message={out.error} />}
      {res && (
        <Results>
          <GrowthResults r={res} labels={{ final: 'Estimated final balance' }} />
          <div className="flex gap-2"><CopyButton text={`Estimated final balance ${formatMoney(res.finalBalance)}; total interest ${formatMoney(res.totalInterest)}`} /><ClearButton onClick={reset} /></div>
        </Results>
      )}
      {!res && <div className="mt-4"><ClearButton onClick={reset} /></div>}
      <Note>Assumptions: a fixed annual rate that never changes, interest compounded at the frequency you choose (annual rate ÷ number of periods), monthly contributions added at the end of each month, and no taxes, fees or inflation. Real returns vary and can be negative. These results are estimates, not a promise of returns or financial advice.</Note>
    </div>
  );
}
