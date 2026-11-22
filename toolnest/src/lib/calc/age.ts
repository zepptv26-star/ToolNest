import { fail, ok, type Result } from './result.ts';

export interface YMD { y: number; m: number; d: number } // m is 1-12

const DAY = 86_400_000;
const utc = (p: YMD) => Date.UTC(p.y, p.m - 1, p.d);
export const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

export function parseISODate(s: string): YMD | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const p = { y: +m[1], m: +m[2], d: +m[3] };
  if (p.m < 1 || p.m > 12 || p.d < 1 || p.d > daysInMonth(p.y, p.m)) return null;
  return p;
}

export function todayYMD(now = new Date()): YMD {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  nextBirthday: YMD;
  daysToNextBirthday: number;
  isBirthdayToday: boolean;
}

export function calculateAge(dob: YMD, today: YMD): Result<AgeResult> {
  if (dob.y < 1900) return fail('Please enter a birth year of 1900 or later.');
  if (utc(dob) > utc(today)) return fail('Date of birth cannot be in the future.');

  let months = (today.y - dob.y) * 12 + (today.m - dob.m);
  if (today.d < Math.min(dob.d, daysInMonth(today.y, today.m))) months -= 1;
  const idx = dob.y * 12 + (dob.m - 1) + months;
  const ay = Math.floor(idx / 12);
  const am = (idx % 12) + 1;
  const anchor: YMD = { y: ay, m: am, d: Math.min(dob.d, daysInMonth(ay, am)) };
  const days = Math.round((utc(today) - utc(anchor)) / DAY);
  const totalDays = Math.round((utc(today) - utc(dob)) / DAY);

  // Next birthday. A 29 February birthday is observed on 28 February in non-leap years,
  // matching how the age above is counted.
  const birthdayIn = (y: number): YMD =>
    dob.m === 2 && dob.d === 29 && !isLeapYear(y) ? { y, m: 2, d: 28 } : { y, m: dob.m, d: dob.d };
  let next = birthdayIn(today.y);
  if (utc(next) < utc(today)) next = birthdayIn(today.y + 1);
  const daysToNextBirthday = Math.round((utc(next) - utc(today)) / DAY);

  return ok({
    years: Math.floor(months / 12),
    months: months % 12,
    days,
    totalDays,
    totalMonths: months,
    totalWeeks: Math.floor(totalDays / 7),
    nextBirthday: next,
    daysToNextBirthday,
    isBirthdayToday: daysToNextBirthday === 0
  });
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const weekdayOf = (p: YMD) => WEEKDAYS[new Date(utc(p)).getUTCDay()];
