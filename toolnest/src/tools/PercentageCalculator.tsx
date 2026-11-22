import { useState } from 'react';
import { decreaseBy, increaseBy, percentChange, percentOf, whatPercent } from '../lib/calc/percent.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { parseNumber, type Result } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, NumberInput, Results, SelectField, Stat } from '../components/ui';

type Mode = 'of' | 'what' | 'change' | 'inc' | 'dec';
const MODES: Record<Mode, { label: string; a: string; b: string; unitA?: string; describe: (a: number, b: number, r: number) => string; calc: (a: number, b: number) => Result<number>; resultLabel: string; suffix?: string }> = {
  of: { label: 'What is X% of Y?', a: 'Percentage (X)', b: 'Number (Y)', unitA: '%', calc: percentOf, resultLabel: 'Result', describe: (a, b, r) => `${formatNumber(a)}% of ${formatNumber(b)} = ${formatNumber(r)}` },
  what: { label: 'X is what % of Y?', a: 'Number (X)', b: 'Total (Y)', calc: whatPercent, resultLabel: 'Percentage', suffix: '%', describe: (a, b, r) => `${formatNumber(a)} is ${formatNumber(r)}% of ${formatNumber(b)}` },
  change: { label: 'Percentage change from X to Y', a: 'From (X)', b: 'To (Y)', calc: percentChange, resultLabel: 'Change', suffix: '%', describe: (a, b, r) => `Change from ${formatNumber(a)} to ${formatNumber(b)} = ${formatNumber(r)}%` },
  inc: { label: 'Increase X by Y%', a: 'Number (X)', b: 'Increase (Y)', calc: increaseBy, resultLabel: 'New value', describe: (a, b, r) => `${formatNumber(a)} increased by ${formatNumber(b)}% = ${formatNumber(r)}` },
  dec: { label: 'Decrease X by Y%', a: 'Number (X)', b: 'Decrease (Y)', calc: decreaseBy, resultLabel: 'New value', describe: (a, b, r) => `${formatNumber(a)} decreased by ${formatNumber(b)}% = ${formatNumber(r)}` }
};

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of');
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const m = MODES[mode];
  const na = parseNumber(a), nb = parseNumber(b);
  const typed = a.trim() !== '' && b.trim() !== '';
  const bad = typed && (na === null || nb === null);
  const r = typed && na !== null && nb !== null ? m.calc(na, nb) : null;
  const pctB = mode === 'inc' || mode === 'dec';

  return (
    <div>
      <SelectField label="What do you want to calculate?" value={mode} onChange={(v) => { setMode(v); setA(''); setB(''); }}
        options={(Object.keys(MODES) as Mode[]).map((k) => ({ value: k, label: MODES[k].label }))} />
      <div className="mt-4">
        <Grid>
          <NumberInput label={m.a} value={a} onChange={setA} suffix={m.unitA} placeholder="e.g. 15" />
          <NumberInput label={m.b} value={b} onChange={setB} suffix={pctB ? '%' : undefined} placeholder="e.g. 200" />
        </Grid>
      </div>
      <ErrorNote message={bad ? 'Please enter numbers only.' : r && !r.ok ? r.error : null} />
      {r && r.ok && na !== null && nb !== null && (
        <Results>
          <Stat big label={m.resultLabel} value={`${formatNumber(r.value, 6)}${m.suffix ?? ''}`} sub={m.describe(na, nb, r.value)} />
          <div className="flex gap-2"><CopyButton text={m.describe(na, nb, r.value)} /><ClearButton onClick={() => { setA(''); setB(''); }} /></div>
        </Results>
      )}
      {!r && <div className="mt-4"><ClearButton onClick={() => { setA(''); setB(''); }} /></div>}
    </div>
  );
}
