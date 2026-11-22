import { fail, ok, type Result } from './result.ts';

export interface ScheduleRow { period: number; payment: number; principal: number; interest: number; balance: number }
export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  months: number;
  schedule: ScheduleRow[];
}

/** Fixed-rate, monthly-payment, fully amortizing loan with payments at the end of each month. */
export function calculateLoan(principal: number, annualRatePct: number, months: number): Result<LoanResult> {
  if (!(principal > 0)) return fail('Loan amount must be greater than zero.');
  if (!(annualRatePct >= 0 && annualRatePct <= 100)) return fail('Interest rate must be between 0% and 100%.');
  if (!Number.isInteger(months) || months < 1) return fail('Loan term must be at least 1 month.');
  if (months > 1200) return fail('Loan term cannot exceed 100 years.');

  const i = annualRatePct / 100 / 12;
  const payment = i === 0 ? principal / months : (principal * i) / (1 - Math.pow(1 + i, -months));

  const schedule: ScheduleRow[] = [];
  let balance = principal;
  for (let k = 1; k <= months; k++) {
    const interest = balance * i;
    let princ = payment - interest;
    if (k === months) princ = balance; // clear tiny floating-point remainder
    balance = Math.max(balance - princ, 0);
    schedule.push({ period: k, payment: princ + interest, principal: princ, interest, balance });
  }
  const totalRepayment = schedule.reduce((s, r) => s + r.payment, 0);
  return ok({ monthlyPayment: payment, totalInterest: totalRepayment - principal, totalRepayment, months, schedule });
}
