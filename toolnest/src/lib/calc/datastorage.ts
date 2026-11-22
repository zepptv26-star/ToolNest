import { fail, ok, type Result } from './result.ts';

export type DataBase = 'decimal' | 'binary';
export const dataUnits = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
export type DataUnit = (typeof dataUnits)[number];

export const unitName = (u: DataUnit, base: DataBase) =>
  base === 'decimal' ? u : u === 'B' ? 'B' : u.replace('B', 'iB');

export function toBytes(value: number, unit: DataUnit, base: DataBase): number {
  const k = base === 'decimal' ? 1000 : 1024;
  return value * Math.pow(k, dataUnits.indexOf(unit));
}

export function convertData(value: number, from: DataUnit, to: DataUnit, base: DataBase): Result<number> {
  if (!Number.isFinite(value)) return fail('Enter a valid number.');
  if (value < 0) return fail('Size cannot be negative.');
  const k = base === 'decimal' ? 1000 : 1024;
  return ok(toBytes(value, from, base) / Math.pow(k, dataUnits.indexOf(to)));
}
