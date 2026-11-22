import { useState } from 'react';
import { convertTemperature, type TempUnit } from '../lib/calc/temperature.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, NumberInput, Results, SelectField, Stat, Grid } from '../components/ui';

const UNITS: { value: TempUnit; label: string; sym: string }[] = [
  { value: 'C', label: 'Celsius (°C)', sym: '°C' }, { value: 'F', label: 'Fahrenheit (°F)', sym: '°F' }, { value: 'K', label: 'Kelvin (K)', sym: 'K' }
];

export default function TemperatureConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<TempUnit>('C');
  const n = parseNumber(value);
  const results = n === null ? null : UNITS.map((u) => ({ ...u, r: convertTemperature(n, from, u.value) }));
  const firstError = results?.find((x) => !x.r.ok);

  return (
    <div>
      <Grid>
        <NumberInput label="Temperature" value={value} onChange={setValue} placeholder="e.g. 100" />
        <SelectField label="From" value={from} onChange={setFrom} options={UNITS.map((u) => ({ value: u.value, label: u.label }))} />
      </Grid>
      <ErrorNote message={value.trim() !== '' && n === null ? 'Please enter a valid number (negative numbers are allowed).' : firstError && !firstError.r.ok ? firstError.r.error : null} />
      {results && !firstError && (
        <Results>
          <Grid cols={3}>
            {results.map((x) => x.r.ok && <Stat key={x.value} big={x.value !== from} label={x.label} value={`${formatNumber(x.r.value, 4)} ${x.sym}`} />)}
          </Grid>
          <div className="flex gap-2">
            <CopyButton text={results.map((x) => (x.r.ok ? `${formatNumber(x.r.value, 4)} ${x.sym}` : '')).join(' = ')} />
            <ClearButton onClick={() => setValue('')} />
          </div>
        </Results>
      )}
      {!results && <div className="mt-4"><ClearButton onClick={() => setValue('')} /></div>}
    </div>
  );
}
