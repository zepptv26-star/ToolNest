import { formatMoney } from '../lib/calc/format.ts';
import type { GrowthResult } from '../lib/calc/finance.ts';
import { Grid, Stat } from '../components/ui';

export function GrowthResults({ r, labels }: { r: GrowthResult; labels?: { final?: string } }) {
  return (
    <>
      <Stat big label={labels?.final ?? 'Estimated future balance'} value={formatMoney(r.finalBalance)} />
      <Grid>
        <Stat label="Total contributions (including starting amount)" value={formatMoney(r.totalContributions)} />
        <Stat label="Estimated interest earned" value={formatMoney(r.totalInterest)} />
      </Grid>
      <h3 className="pt-4 text-lg font-semibold text-navy dark:text-white">Year-by-year</h3>
      <div className="max-h-80 overflow-auto rounded-lg border border-line dark:border-slate-700">
        <table className="w-full min-w-[420px] text-right text-sm">
          <thead className="sticky top-0 bg-surface dark:bg-slate-800"><tr>
            <th scope="col" className="px-3 py-2 text-left">Year</th><th scope="col" className="px-3 py-2">Added</th><th scope="col" className="px-3 py-2">Interest</th><th scope="col" className="px-3 py-2">Balance</th>
          </tr></thead>
          <tbody>
            {r.schedule.map((y) => (
              <tr key={y.year} className="border-t border-line dark:border-slate-700">
                <td className="px-3 py-1.5 text-left">{y.year}</td><td className="px-3 py-1.5">{formatMoney(y.contributions)}</td>
                <td className="px-3 py-1.5">{formatMoney(y.interest)}</td><td className="px-3 py-1.5">{formatMoney(y.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
