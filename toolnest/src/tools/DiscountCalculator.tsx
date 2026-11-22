import { useState } from 'react';
import { calculateDiscount } from '../lib/calc/discount.ts';
import { formatMoney } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, Stat } from '../components/ui';

export default function DiscountCalculator() {
  const [price, setPrice] = useState(''); const [disc, setDisc] = useState(''); const [tax, setTax] = useState('');
  const p = parseNumber(price), d = parseNumber(disc), t = tax.trim() === '' ? 0 : parseNumber(tax);
  const typed = price.trim() !== '' && disc.trim() !== '';
  const bad = (price.trim() !== '' && p === null) || (disc.trim() !== '' && d === null) || t === null;
  const r = typed && !bad && p !== null && d !== null && t !== null ? calculateDiscount(p, d, t) : null;
  const reset = () => { setPrice(''); setDisc(''); setTax(''); };

  return (
    <div>
      <Grid cols={3}>
        <NumberInput label="Original price" value={price} onChange={setPrice} placeholder="e.g. 200" hint="Any currency" />
        <NumberInput label="Discount" value={disc} onChange={setDisc} suffix="%" placeholder="e.g. 25" />
        <NumberInput label="Sales tax (optional)" value={tax} onChange={setTax} suffix="%" placeholder="e.g. 10" hint="Applied after the discount" />
      </Grid>
      <ErrorNote message={bad ? 'Please enter numbers only.' : r && !r.ok ? r.error : null} />
      {r && r.ok && (
        <Results>
          <Grid>
            <Stat big label="You save" value={formatMoney(r.value.savings)} />
            <Stat big label={t ? 'Final price (with tax)' : 'Final price'} value={formatMoney(r.value.finalPrice)} />
          </Grid>
          {t ? (
            <Grid>
              <Stat label="Price after discount" value={formatMoney(r.value.priceAfterDiscount)} />
              <Stat label="Sales tax" value={formatMoney(r.value.tax)} />
            </Grid>
          ) : null}
          <div className="flex gap-2">
            <CopyButton text={`Original ${formatMoney(r.value.originalPrice)}, save ${formatMoney(r.value.savings)}, final price ${formatMoney(r.value.finalPrice)}`} />
            <ClearButton onClick={reset} />
          </div>
        </Results>
      )}
      {!r && <div className="mt-4"><ClearButton onClick={reset} /></div>}
      <Note>Results are rounded to 2 decimal places for display. Shops may round each step differently, so the till total can differ by a cent.</Note>
    </div>
  );
}
