import { useMemo, useState } from 'react';
import { bmiImperial, bmiMetric, type BmiCategory } from '../lib/calc/bmi.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, Segmented, Stat } from '../components/ui';

const RANGES: { cat: BmiCategory; range: string }[] = [
  { cat: 'Underweight', range: 'below 18.5' }, { cat: 'Normal weight', range: '18.5 to 24.9' },
  { cat: 'Overweight', range: '25 to 29.9' }, { cat: 'Obesity', range: '30 or above' }
];

export default function BmiCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [kg, setKg] = useState(''); const [cm, setCm] = useState('');
  const [lb, setLb] = useState(''); const [ft, setFt] = useState(''); const [inch, setInch] = useState('');

  const out = useMemo(() => {
    if (units === 'metric') {
      if (kg.trim() === '' || cm.trim() === '') return null;
      const w = parseNumber(kg), h = parseNumber(cm);
      if (w === null || h === null) return { error: 'Please enter numbers only.' };
      const r = bmiMetric(w, h);
      return r.ok ? { res: r.value } : { error: r.error };
    }
    if (lb.trim() === '' || ft.trim() === '') return null;
    const w = parseNumber(lb), f = parseNumber(ft), i = inch.trim() === '' ? 0 : parseNumber(inch);
    if (w === null || f === null || i === null) return { error: 'Please enter numbers only.' };
    const r = bmiImperial(w, f, i);
    return r.ok ? { res: r.value } : { error: r.error };
  }, [units, kg, cm, lb, ft, inch]);

  const reset = () => { setKg(''); setCm(''); setLb(''); setFt(''); setInch(''); };
  const res = out && 'res' in out ? out.res : null;

  return (
    <div>
      <Segmented label="Units" value={units} onChange={setUnits} options={[{ value: 'metric', label: 'Metric (kg, cm)' }, { value: 'imperial', label: 'Imperial (lb, ft, in)' }]} />
      <div className="mt-4">
        {units === 'metric' ? (
          <Grid>
            <NumberInput label="Weight" value={kg} onChange={setKg} suffix="kg" placeholder="e.g. 70" />
            <NumberInput label="Height" value={cm} onChange={setCm} suffix="cm" placeholder="e.g. 175" />
          </Grid>
        ) : (
          <Grid cols={3}>
            <NumberInput label="Weight" value={lb} onChange={setLb} suffix="lb" placeholder="e.g. 150" />
            <NumberInput label="Height (feet)" value={ft} onChange={setFt} suffix="ft" placeholder="e.g. 5" />
            <NumberInput label="Height (inches)" value={inch} onChange={setInch} suffix="in" placeholder="e.g. 6" />
          </Grid>
        )}
      </div>
      {out && 'error' in out && <ErrorNote message={out.error} />}
      {res && (
        <Results>
          <Grid>
            <Stat big label="Your BMI" value={res.bmi.toFixed(1)} />
            <Stat big label="Standard category" value={res.category} />
          </Grid>
          <div className="flex gap-2"><CopyButton text={`BMI ${res.bmi.toFixed(1)} (${res.category})`} /><ClearButton onClick={reset} /></div>
        </Results>
      )}
      {!res && <div className="mt-4"><ClearButton onClick={reset} /></div>}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="mb-2 text-left text-sm font-medium">Standard adult BMI categories</caption>
          <tbody>
            {RANGES.map((r) => (
              <tr key={r.cat} className={`border-t border-line dark:border-slate-700 ${res?.category === r.cat ? 'bg-teal/10 font-semibold' : ''}`}>
                <td className="px-3 py-2">{r.cat}</td><td className="px-3 py-2 text-muted">{r.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note tone="warn">BMI is a general screening number for adults, not a medical diagnosis. It does not account for muscle mass, age, sex or body composition, and the categories may not suit children, athletes or pregnant people. Talk to a health professional about your health.</Note>
    </div>
  );
}
