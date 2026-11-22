import { fail, ok, type Result } from './result.ts';

export interface GrowthInput {
  principal: number;
  contribution: number;       // amount added at the end of each contribution period
  contributionsPerYear: number;
  annualRatePct: number;
  compoundsPerYear: number;
  years: number;
}
export interface YearRow { year: number; contributions: number; interest: number; balance: number }
export interface GrowthResult {
  finalBalance: number;
  totalContributions: number; // principal + all regular contributions
  totalInterest: number;
  schedule: YearRow[];
}

/**
 * Compound growth with regular contributions.
 * Interest compounds `compoundsPerYear` times a year at rate/compoundsPerYear. It is converted
 * to an equivalent rate per contribution period, and contributions are added at the END of each period.
 */
export function projectGrowth(inp: GrowthInput): Result<GrowthResult> {
  const { principal, contribution, contributionsPerYear: m, annualRatePct, compoundsPerYear: n, years } = inp;
  if (!(principal >= 0)) return fail('Starting amount cannot be negative.');
  if (!(contribution >= 0)) return fail('Contribution cannot be negative.');
  if (!(annualRatePct >= 0 && annualRatePct <= 100)) return fail('Interest rate must be between 0% and 100%.');
  if (!(years > 0 && years <= 100)) return fail('Duration must be more than 0 and at most 100 years.');
  if (principal === 0 && contribution === 0) return fail('Enter a starting amount or a regular contribution.');

  const j = Math.pow(1 + annualRatePct / 100 / n, n / m) - 1;
  const periods = Math.round(years * m);
  if (periods < 1) return fail('Duration is too short for the chosen contribution frequency.');

  let balance = principal;
  const schedule: YearRow[] = [];
  let contribTotal = principal;
  let yearStart = principal;
  let yearContrib = 0;
  for (let p = 1; p <= periods; p++) {
    balance = balance * (1 + j) + contribution;
    contribTotal += contribution;
    yearContrib += contribution;
    if (p % m === 0 || p === periods) {
      const yr = Math.ceil(p / m);
      schedule.push({ year: yr, contributions: yearContrib, interest: balance - yearStart - yearContrib, balance });
      yearStart = balance;
      yearContrib = 0;
    }
  }
  return ok({ finalBalance: balance, totalContributions: contribTotal, totalInterest: balance - contribTotal, schedule });
}

export interface MarginResult { revenue: number; totalCost: number; grossProfit: number; marginPct: number; markupPct: number | null }

export function profitMargin(unitCost: number, unitPrice: number, quantity = 1): Result<MarginResult> {
  if (!(unitCost >= 0)) return fail('Cost cannot be negative.');
  if (!(unitPrice > 0)) return fail('Selling price must be greater than zero.');
  if (!(quantity > 0)) return fail('Quantity must be greater than zero.');
  const revenue = unitPrice * quantity;
  const totalCost = unitCost * quantity;
  const grossProfit = revenue - totalCost;
  return ok({ revenue, totalCost, grossProfit, marginPct: (grossProfit / revenue) * 100, markupPct: totalCost === 0 ? null : (grossProfit / totalCost) * 100 });
}
