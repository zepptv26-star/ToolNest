import { useState } from 'react';
import { profitMargin } from '../lib/calc/finance.ts';
import { formatMoney, formatPercent } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, Stat } from '../components/ui';

export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState(''); const [price, setPrice] = useState(''); const [qty, setQty] = useState('1');
  const c = parseNumber(cost), p = parseNumber(price), q = qty.trim() === '' ? 1 : parseNumber(qty);
  const typed = cost.trim() !== '' && price.trim() !== '';
  const bad = (cost.trim() !== '' && c === null) || (price.trim() !== '' && p === null) || q === null;
  const r = typed && !bad && c !== null && p !== null && q !== null ? profitMargin(c, p, q) : null;
  const reset = () => { setCost(''); setPrice(''); setQty('1'); };

  return (
    <div>
      <Grid cols={3}>
        <NumberInput label="Cost price (per unit)" value={cost} onChange={setCost} placeholder="e.g. 60" hint="Any currency" />
        <NumberInput label="Selling price (per unit)" value={price} onChange={setPrice} placeholder="e.g. 100" />
        <NumberInput label="Quantity sold" value={qty} onChange={setQty} placeholder="1" />
      </Grid>
      <ErrorNote message={bad ? 'Please enter numbers only.' : r && !r.ok ? r.error : null} />
      {r && r.ok && (
        <Results>
          <Grid cols={3}>
            <Stat label="Revenue" value={formatMoney(r.value.revenue)} />
            <Stat label="Total cost" value={formatMoney(r.value.totalCost)} />
            <Stat big label={r.value.grossProfit < 0 ? 'Gross loss' : 'Gross profit'} value={formatMoney(r.value.grossProfit)} />
          </Grid>
          <Grid>
            <Stat big label="Profit margin" value={formatPercent(r.value.marginPct)} sub="Profit ÷ selling price" />
            <Stat big label="Markup" value={r.value.markupPct === null ? 'Not defined (cost is 0)' : formatPercent(r.value.markupPct)} sub="Profit ÷ cost" />
          </Grid>
          <div className="flex gap-2">
            <CopyButton text={`Revenue ${formatMoney(r.value.revenue)}; gross profit ${formatMoney(r.value.grossProfit)}; margin ${formatPercent(r.value.marginPct)}; markup ${r.value.markupPct === null ? 'n/a' : formatPercent(r.value.markupPct)}`} />
            <ClearButton onClick={reset} />
          </div>
        </Results>
      )}
      {!r && <div className="mt-4"><ClearButton onClick={reset} /></div>}
      <Note><strong>Margin vs markup:</strong> margin is profit as a share of the selling price; markup is profit as a share of the cost. Selling something for 100 that cost 60 gives a 40% margin but a 66.7% markup. Gross profit ignores other costs such as rent, wages, tax and shipping.</Note>
    </div>
  );
}
