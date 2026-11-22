import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { convertCooking, cookingUnitLabels, ingredients, type CookingUnit, type CupSystem } from '../lib/calc/cooking.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, SelectField, Stat } from '../components/ui';

const unitOptions = (Object.keys(cookingUnitLabels) as CookingUnit[]).map((u) => ({ value: u, label: cookingUnitLabels[u] }));

export default function CookingConverter() {
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState<CookingUnit>('cup'); const [to, setTo] = useState<CookingUnit>('ml');
  const [cup, setCup] = useState<CupSystem>('us');
  const [ing, setIng] = useState('flour');
  const n = parseNumber(value);
  const needsIngredient = from === 'g' || to === 'g';
  const r = n !== null ? convertCooking(n, from, to, cup, needsIngredient ? ing : undefined) : null;
  const ingLabel = ingredients.find((i) => i.id === ing)?.label.toLowerCase();

  return (
    <div>
      <Grid>
        <NumberInput label="Amount" value={value} onChange={setValue} placeholder="e.g. 1" />
        <SelectField label="Cup, tablespoon and teaspoon size" value={cup} onChange={setCup}
          options={[{ value: 'us', label: 'US (cup 237 mL, tbsp 14.8 mL, tsp 4.9 mL)' }, { value: 'metric', label: 'Metric (cup 250 mL, tbsp 15 mL, tsp 5 mL)' }]} />
      </Grid>
      <div className="mt-4 grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <SelectField label="From" value={from} onChange={setFrom} options={unitOptions} />
        <button type="button" className="btn-secondary !py-3" aria-label="Swap units" onClick={() => { setFrom(to); setTo(from); }}><ArrowLeftRight size={18} aria-hidden /></button>
        <SelectField label="To" value={to} onChange={setTo} options={unitOptions} />
      </div>
      {needsIngredient && (
        <div className="mt-4 max-w-md">
          <SelectField label="Ingredient (needed to convert between volume and weight)" value={ing} onChange={setIng} options={ingredients.map((i) => ({ value: i.id, label: i.label }))} />
        </div>
      )}
      <ErrorNote message={value.trim() !== '' && n === null ? 'Please enter a valid number.' : r && !r.ok ? r.error : null} />
      {r && r.ok && n !== null && (
        <Results>
          <Stat big label={`${formatNumber(n)} ${cookingUnitLabels[from].toLowerCase()} equals`} value={`${formatNumber(r.value, 3)} ${cookingUnitLabels[to].replace(/ \(.*\)/, '').toLowerCase()}`}
            sub={needsIngredient ? `Estimated for ${ingLabel}` : undefined} />
          <div className="flex gap-2"><CopyButton text={formatNumber(r.value, 3)} /><ClearButton onClick={() => setValue('')} /></div>
        </Results>
      )}
      <Note>Volume (cups, spoons, millilitres) and weight (grams) are different things. 1 cup of flour weighs far less than 1 cup of honey, so grams need an ingredient. Ingredient weights are typical averages and vary with brand, humidity and how you scoop. Use a kitchen scale for baking accuracy.</Note>
    </div>
  );
}
