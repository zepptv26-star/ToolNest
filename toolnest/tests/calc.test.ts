import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAge, isLeapYear, parseISODate } from '../src/lib/calc/age.ts';
import { bmiImperial, bmiMetric, classifyBmi } from '../src/lib/calc/bmi.ts';
import { decreaseBy, increaseBy, percentChange, percentOf, whatPercent } from '../src/lib/calc/percent.ts';
import { calculateDiscount } from '../src/lib/calc/discount.ts';
import { calculateLoan } from '../src/lib/calc/loan.ts';
import { convertUnit } from '../src/lib/calc/units.ts';
import { convertTemperature } from '../src/lib/calc/temperature.ts';
import { convertCooking } from '../src/lib/calc/cooking.ts';
import { convertData } from '../src/lib/calc/datastorage.ts';
import { analyzeText } from '../src/lib/calc/text.ts';
import { diffText } from '../src/lib/calc/diff.ts';
import { profitMargin, projectGrowth } from '../src/lib/calc/finance.ts';
import { formatCountdown, formatStopwatch } from '../src/lib/calc/time.ts';
import { parseNumber } from '../src/lib/calc/result.ts';

const near = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} !~ ${b}`);
const val = <T>(r: { ok: boolean; value?: T; error?: string }): T => { assert.ok(r.ok, r.error); return r.value as T; };

test('parseNumber', () => {
  assert.equal(parseNumber('1,000.5'), 1000.5);
  assert.equal(parseNumber(' -3 '), -3);
  assert.equal(parseNumber(''), null);
  assert.equal(parseNumber('abc'), null);
  assert.equal(parseNumber('1e5'), null);
});

test('age: known values and leap years', () => {
  const a = val(calculateAge({ y: 1990, m: 5, d: 15 }, { y: 2026, m: 11, d: 22 }));
  assert.deepEqual([a.years, a.months, a.days], [36, 6, 7]);
  assert.equal(a.daysToNextBirthday, 174); // 22 Nov 2026 -> 15 May 2027
  const leap = val(calculateAge({ y: 2000, m: 2, d: 29 }, { y: 2024, m: 2, d: 29 }));
  assert.deepEqual([leap.years, leap.months, leap.days, leap.isBirthdayToday], [24, 0, 0, true]);
  const leap2 = val(calculateAge({ y: 2000, m: 2, d: 29 }, { y: 2025, m: 2, d: 28 }));
  assert.deepEqual([leap2.years, leap2.months, leap2.days], [25, 0, 0]);
  const leap3 = val(calculateAge({ y: 2000, m: 2, d: 29 }, { y: 2025, m: 2, d: 27 }));
  assert.deepEqual([leap3.years, leap3.months, leap3.days], [24, 11, 29]);
  const nb = val(calculateAge({ y: 2000, m: 2, d: 29 }, { y: 2026, m: 11, d: 22 }));
  assert.deepEqual(nb.nextBirthday, { y: 2027, m: 2, d: 28 });
  const edge = val(calculateAge({ y: 2023, m: 1, d: 31 }, { y: 2023, m: 3, d: 1 }));
  assert.deepEqual([edge.years, edge.months, edge.days], [0, 1, 1]);
  assert.equal(val(calculateAge({ y: 2000, m: 1, d: 1 }, { y: 2000, m: 12, d: 31 })).totalDays, 365);
  assert.equal(val(calculateAge({ y: 2020, m: 1, d: 1 }, { y: 2020, m: 1, d: 1 })).totalDays, 0);
});
test('age: validation', () => {
  assert.equal(calculateAge({ y: 2030, m: 1, d: 1 }, { y: 2026, m: 11, d: 22 }).ok, false);
  assert.equal(parseISODate('2023-02-29'), null);
  assert.deepEqual(parseISODate('2024-02-29'), { y: 2024, m: 2, d: 29 });
  assert.equal(parseISODate('garbage'), null);
  assert.ok(isLeapYear(2000) && !isLeapYear(1900) && isLeapYear(2024) && !isLeapYear(2023));
});

test('bmi', () => {
  near(val(bmiMetric(70, 175)).bmi, 22.86);
  near(val(bmiImperial(150, 5, 6)).bmi, 24.21);
  assert.equal(classifyBmi(18.4), 'Underweight');
  assert.equal(classifyBmi(18.5), 'Normal weight');
  assert.equal(classifyBmi(25), 'Overweight');
  assert.equal(classifyBmi(30), 'Obesity');
  assert.equal(bmiMetric(0, 170).ok, false);
  assert.equal(bmiMetric(70, 0).ok, false);
  assert.equal(bmiMetric(-5, 170).ok, false);
});

test('percentage', () => {
  assert.equal(val(percentOf(15, 200)), 30);
  assert.equal(val(whatPercent(50, 200)), 25);
  assert.equal(whatPercent(5, 0).ok, false);
  assert.equal(val(percentChange(80, 100)), 25);
  assert.equal(val(percentChange(100, 80)), -20);
  assert.equal(percentChange(0, 5).ok, false);
  near(val(increaseBy(200, 10)), 220);
  near(val(decreaseBy(200, 10)), 180);
});

test('discount', () => {
  const d = val(calculateDiscount(200, 25, 10));
  near(d.savings, 50); near(d.priceAfterDiscount, 150); near(d.tax, 15); near(d.finalPrice, 165);
  assert.equal(calculateDiscount(100, 120).ok, false);
  assert.equal(calculateDiscount(-1, 10).ok, false);
  near(val(calculateDiscount(0, 10)).finalPrice, 0);
  near(val(calculateDiscount(100, 100)).finalPrice, 0);
});

test('loan', () => {
  const l = val(calculateLoan(200000, 6, 360));
  near(l.monthlyPayment, 1199.10, 0.01);
  near(l.totalRepayment, 431676.38, 1);
  near(l.totalInterest, 231676.38, 1);
  assert.equal(l.schedule.length, 360);
  near(l.schedule[359].balance, 0, 1e-6);
  near(l.schedule[0].interest, 1000, 1e-6);
  const z = val(calculateLoan(1200, 0, 12));
  near(z.monthlyPayment, 100); near(z.totalInterest, 0);
  assert.equal(calculateLoan(0, 5, 12).ok, false);
  assert.equal(calculateLoan(1000, -1, 12).ok, false);
  assert.equal(calculateLoan(1000, 5, 0).ok, false);
});

test('unit conversion', () => {
  near(val(convertUnit('length', 1, 'mi', 'km')), 1.609344, 1e-9);
  near(val(convertUnit('weight', 1, 'lb', 'g')), 453.59237, 1e-6);
  near(val(convertUnit('pressure', 1, 'atm', 'psi')), 14.6959, 1e-3);
  near(val(convertUnit('speed', 100, 'kmh', 'mph')), 62.1371, 1e-3);
  near(val(convertUnit('area', 1, 'ac', 'm2')), 4046.8564, 1e-3);
  near(val(convertUnit('volume', 1, 'gal', 'l')), 3.785411784, 1e-9);
  near(val(convertUnit('length', 0, 'm', 'ft')), 0);
  near(val(convertUnit('length', -5, 'm', 'cm')), -500);
  assert.equal(convertUnit('length', 1, 'm', 'nope').ok, false);
});

test('temperature', () => {
  near(val(convertTemperature(100, 'C', 'F')), 212);
  near(val(convertTemperature(100, 'C', 'K')), 373.15);
  near(val(convertTemperature(-40, 'C', 'F')), -40);
  near(val(convertTemperature(32, 'F', 'C')), 0);
  near(val(convertTemperature(0, 'K', 'C')), -273.15);
  assert.equal(convertTemperature(-300, 'C', 'F').ok, false);
  assert.equal(convertTemperature(-1, 'K', 'C').ok, false);
  assert.equal(convertTemperature(-460, 'F', 'C').ok, false);
});

test('cooking', () => {
  near(val(convertCooking(1, 'cup', 'ml', 'us')), 236.588, 1e-3);
  near(val(convertCooking(1, 'cup', 'ml', 'metric')), 250);
  near(val(convertCooking(3, 'tsp', 'tbsp', 'us')), 1, 1e-6);
  near(val(convertCooking(1, 'cup', 'g', 'us', 'flour')), 125, 1e-6);
  near(val(convertCooking(250, 'g', 'cup', 'us', 'sugar')), 1.25, 1e-6);
  assert.equal(convertCooking(1, 'cup', 'g', 'us').ok, false);
  assert.equal(convertCooking(-1, 'cup', 'ml', 'us').ok, false);
  near(val(convertCooking(5, 'g', 'g', 'us')), 5);
});

test('data storage', () => {
  assert.equal(val(convertData(1, 'GB', 'B', 'decimal')), 1e9);
  assert.equal(val(convertData(1, 'GB', 'B', 'binary')), 1073741824);
  assert.equal(val(convertData(1024, 'MB', 'GB', 'binary')), 1);
  assert.equal(val(convertData(1500, 'KB', 'MB', 'decimal')), 1.5);
  assert.equal(convertData(-1, 'MB', 'KB', 'decimal').ok, false);
});

test('word counter', () => {
  const s = analyzeText('Hello world. How are you?\n\nSecond paragraph here!');
  assert.deepEqual([s.words, s.sentences, s.paragraphs], [8, 3, 2]);
  assert.equal(analyzeText('a b').charactersNoSpaces, 2);
  assert.equal(analyzeText('a b').characters, 3);
  const e = analyzeText('   ');
  assert.deepEqual([e.words, e.sentences, e.paragraphs], [0, 0, 0]);
  assert.equal(analyzeText('こんにちは。元気ですか？').sentences, 2);
  assert.equal(analyzeText('😀 😀').characters, 3);
});

test('text diff', () => {
  const d = val(diffText('the quick brown fox', 'the slow brown fox jumps'));
  assert.equal(d.removed, 1); assert.equal(d.added, 2);
  assert.ok(d.segments.some((s) => s.type === 'remove' && s.text.includes('quick')));
  assert.ok(d.segments.some((s) => s.type === 'add' && s.text.includes('slow')));
  assert.equal(val(diffText('same text', 'same text')).identical, true);
  assert.equal(val(diffText('', 'new')).added, 1);
  assert.equal(val(diffText('', '')).segments.length, 0);
  assert.equal(diffText('word '.repeat(5000), 'x').ok, false);
});

test('savings and compound interest', () => {
  const s = val(projectGrowth({ principal: 1000, contribution: 100, contributionsPerYear: 12, annualRatePct: 5, compoundsPerYear: 12, years: 10 }));
  near(s.finalBalance, 17175.24, 1);
  near(s.totalContributions, 13000);
  near(s.totalInterest, s.finalBalance - 13000);
  assert.equal(s.schedule.length, 10);
  const c = val(projectGrowth({ principal: 1000, contribution: 0, contributionsPerYear: 12, annualRatePct: 5, compoundsPerYear: 1, years: 10 }));
  near(c.finalBalance, 1628.89, 0.01);
  const c2 = val(projectGrowth({ principal: 1000, contribution: 0, contributionsPerYear: 12, annualRatePct: 5, compoundsPerYear: 12, years: 10 }));
  near(c2.finalBalance, 1647.01, 0.01);
  const z = val(projectGrowth({ principal: 1000, contribution: 50, contributionsPerYear: 12, annualRatePct: 0, compoundsPerYear: 12, years: 2 }));
  near(z.finalBalance, 2200); near(z.totalInterest, 0);
  assert.equal(projectGrowth({ principal: -1, contribution: 0, contributionsPerYear: 12, annualRatePct: 5, compoundsPerYear: 1, years: 1 }).ok, false);
  assert.equal(projectGrowth({ principal: 0, contribution: 0, contributionsPerYear: 12, annualRatePct: 5, compoundsPerYear: 1, years: 1 }).ok, false);
  assert.equal(projectGrowth({ principal: 100, contribution: 0, contributionsPerYear: 12, annualRatePct: 5, compoundsPerYear: 1, years: 0 }).ok, false);
});

test('profit margin', () => {
  const m = val(profitMargin(60, 100));
  near(m.grossProfit, 40); near(m.marginPct, 40); near(m.markupPct as number, 66.67);
  const q = val(profitMargin(60, 100, 10));
  near(q.revenue, 1000); near(q.grossProfit, 400);
  const loss = val(profitMargin(120, 100));
  near(loss.marginPct, -20);
  assert.equal(val(profitMargin(0, 50)).markupPct, null);
  assert.equal(profitMargin(10, 0).ok, false);
  assert.equal(profitMargin(-1, 10).ok, false);
});

test('timer formatting', () => {
  assert.equal(formatStopwatch(0), '00:00.00');
  assert.equal(formatStopwatch(61_230), '01:01.23');
  assert.equal(formatStopwatch(3_600_000 + 5_000), '01:00:05.00');
  assert.equal(formatStopwatch(-50), '00:00.00');
  assert.equal(formatCountdown(300_000), '00:05:00');
  assert.equal(formatCountdown(1), '00:00:01');
  assert.equal(formatCountdown(0), '00:00:00');
  assert.equal(formatCountdown(3_661_000), '01:01:01');
});
