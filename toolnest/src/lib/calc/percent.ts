import { fail, ok, type Result } from './result.ts';

/** What is p% of x? */
export const percentOf = (p: number, x: number): Result<number> => ok((p / 100) * x);

/** x is what percent of y? */
export function whatPercent(x: number, y: number): Result<number> {
  if (y === 0) return fail('The second number cannot be zero.');
  return ok((x / y) * 100);
}

/** Percentage change from `from` to `to`; positive = increase, negative = decrease. */
export function percentChange(from: number, to: number): Result<number> {
  if (from === 0) return fail('The starting value cannot be zero.');
  return ok(((to - from) / Math.abs(from)) * 100);
}

/** Increase x by p%. */
export const increaseBy = (x: number, p: number): Result<number> => ok(x * (1 + p / 100));

/** Decrease x by p%. */
export const decreaseBy = (x: number, p: number): Result<number> => ok(x * (1 - p / 100));
