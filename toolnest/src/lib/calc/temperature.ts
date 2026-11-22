import { fail, ok, type Result } from './result.ts';

export type TempUnit = 'C' | 'F' | 'K';
const ABS_ZERO_C = -273.15;

const toCelsius = (v: number, u: TempUnit) => (u === 'C' ? v : u === 'F' ? ((v - 32) * 5) / 9 : v + ABS_ZERO_C);
const fromCelsius = (c: number, u: TempUnit) => (u === 'C' ? c : u === 'F' ? (c * 9) / 5 + 32 : c - ABS_ZERO_C);

export function convertTemperature(value: number, from: TempUnit, to: TempUnit): Result<number> {
  if (!Number.isFinite(value)) return fail('Enter a valid number.');
  const c = toCelsius(value, from);
  if (c < ABS_ZERO_C - 1e-9) return fail('That is below absolute zero (−273.15 °C), which is not physically possible.');
  return ok(fromCelsius(c, to));
}
