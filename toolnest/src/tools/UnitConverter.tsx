import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { convertUnit, unitCategories } from '../lib/calc/units.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, NumberInput, Results, SelectField, Stat } from '../components/ui';

const defaults: Record<string, [string, string]> = {
  length: ['km', 'mi'], weight: ['kg', 'lb'], area: ['m2', 'ft2'], volume: ['l', 'gal'], speed: ['kmh', 'mph'], pressure: ['kpa', 'psi']
};

export default function UnitConverter() {
  const [cat, setCat] = useState('length');
  const [from, setFrom] = useState('km'); const [to, setTo] = useState('mi');
  const [value, setValue] = useState('1');
  const category = unitCategories.find((c) => c.id === cat)!;
  const options = category.units.map((u) => ({ value: u.id, label: u.label }));
  const n = parseNumber(value);
  const r = n !== null ? convertUnit(cat, n, from, to) : null;
  const fromLabel = category.units.find((u) => u.id === from)?.label ?? '';
  const toLabel = category.units.find((u) => u.id === to)?.label ?? '';

  const changeCat = (id: string) => { setCat(id); setFrom(defaults[id][0]); setTo(defaults[id][1]); };

  return (
    <div>
      <SelectField label="Category" value={cat} onChange={changeCat} options={unitCategories.map((c) => ({ value: c.id, label: c.label }))} />
      <div className="mt-4"><NumberInput label="Value" value={value} onChange={setValue} placeholder="e.g. 1" /></div>
      <div className="mt-4 grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <SelectField label="From" value={from} onChange={setFrom} options={options} />
        <button type="button" className="btn-secondary !py-3" aria-label="Swap units" onClick={() => { setFrom(to); setTo(from); }}><ArrowLeftRight size={18} aria-hidden /></button>
        <SelectField label="To" value={to} onChange={setTo} options={options} />
      </div>
      <ErrorNote message={value.trim() !== '' && n === null ? 'Please enter a valid number.' : r && !r.ok ? r.error : null} />
      {r && r.ok && n !== null && (
        <Results>
          <Stat big label={`${formatNumber(n)} ${fromLabel.replace(/ \(.*\)/, '')} equals`} value={`${formatNumber(r.value, 8)} ${toLabel.replace(/^.*\((.*)\)$/, '$1')}`} sub={toLabel} />
          <div className="flex gap-2"><CopyButton text={formatNumber(r.value, 8)} /><ClearButton onClick={() => setValue('')} /></div>
        </Results>
      )}
    </div>
  );
}
