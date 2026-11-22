import { useMemo, useState } from 'react';
import { calculateLoan } from '../lib/calc/loan.ts';
import { formatMoney } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, Stat } from '../components/ui';

export default function LoanCalculator() {
  const [amount, setAmount] = useState(''); const [rate, setRate] = useState('');
  const [years, setYears] = useState(''); const [extraMonths, setExtraMonths] = useState('');
  const [showAll, setShowAll] = useState(false);

  const out = useMemo(() => {
    if (amount.trim() === '' || rate.trim() === '' || (years.trim() === '' && extraMonths.trim() === '')) return null;
    const a = parseNumber(amount), r = parseNumber(rate);
    const y = years.trim() === '' ? 0 : parseNumber(years), mo = extraMonths.trim() === '' ? 0 : parseNumber(extraMonths);
    if (a === null || r === null || y === null || mo === null) return { error: 'Please enter numbers only.' };
    const months = Math.round(y * 12 + mo);
    const res = calculateLoan(a, r, months);
    return res.ok ? { loan: res.value } : { error: res.error };
  }, [amount, rate, years, extraMonths]);

  const reset = () => { setAmount(''); setRate(''); setYears(''); setExtraMonths(''); setShowAll(false); };
  const loan = out && 'loan' in out ? out.loan : null;
  const rows = loan ? (showAll ? loan.schedule : loan.schedule.slice(0, 12)) : [];

  return (
    <div>
      <Grid>
        <NumberInput label="Loan amount" value={amount} onChange={setAmount} placeholder="e.g. 200000" hint="Any currency" />
        <NumberInput label="Annual interest rate" value={rate} onChange={setRate} suffix="%" placeholder="e.g. 6" />
        <NumberInput label="Term (years)" value={years} onChange={setYears} placeholder="e.g. 30" />
        <NumberInput label="Extra months (optional)" value={extraMonths} onChange={setExtraMonths} placeholder="e.g. 6" />
      </Grid>
      {out && 'error' in out && <ErrorNote message={out.error} />}
      {loan && (
        <Results>
          <Stat big label="Monthly payment" value={formatMoney(loan.monthlyPayment)} />
          <Grid>
            <Stat label="Total interest" value={formatMoney(loan.totalInterest)} />
            <Stat label="Total repayment" value={formatMoney(loan.totalRepayment)} />
          </Grid>
          <div className="flex gap-2">
            <CopyButton text={`Monthly payment ${formatMoney(loan.monthlyPayment)}; total interest ${formatMoney(loan.totalInterest)}; total repayment ${formatMoney(loan.totalRepayment)}`} />
            <ClearButton onClick={reset} />
          </div>
          <h3 className="pt-4 text-lg font-semibold text-navy dark:text-white">Amortization schedule</h3>
          <div className="max-h-96 overflow-auto rounded-lg border border-line dark:border-slate-700">
            <table className="w-full min-w-[480px] text-right text-sm">
              <thead className="sticky top-0 bg-surface dark:bg-slate-800"><tr>
                <th scope="col" className="px-3 py-2 text-left">Month</th><th scope="col" className="px-3 py-2">Payment</th>
                <th scope="col" className="px-3 py-2">Principal</th><th scope="col" className="px-3 py-2">Interest</th><th scope="col" className="px-3 py-2">Balance</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.period} className="border-t border-line dark:border-slate-700">
                    <td className="px-3 py-1.5 text-left">{r.period}</td><td className="px-3 py-1.5">{formatMoney(r.payment)}</td>
                    <td className="px-3 py-1.5">{formatMoney(r.principal)}</td><td className="px-3 py-1.5">{formatMoney(r.interest)}</td><td className="px-3 py-1.5">{formatMoney(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loan.schedule.length > 12 && (
            <button type="button" className="btn-secondary !py-2" onClick={() => setShowAll((s) => !s)}>
              {showAll ? 'Show first 12 months only' : `Show all ${loan.schedule.length} months`}
            </button>
          )}
        </Results>
      )}
      {!loan && <div className="mt-4"><ClearButton onClick={reset} /></div>}
      <Note>Assumptions: fixed interest rate, equal monthly payments made at the end of each month, interest calculated monthly (annual rate ÷ 12). Fees, insurance, taxes and rate changes are not included, so your lender's figures may differ. This is an estimate, not financial advice.</Note>
    </div>
  );
}
