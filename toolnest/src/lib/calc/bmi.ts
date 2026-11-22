import { fail, ok, type Result } from './result.ts';

export type BmiCategory = 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';
export interface BmiResult { bmi: number; category: BmiCategory }

export function classifyBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}

export function bmiMetric(kg: number, cm: number): Result<BmiResult> {
  if (!(kg >= 2 && kg <= 700)) return fail('Enter a weight between 2 and 700 kg.');
  if (!(cm >= 50 && cm <= 272)) return fail('Enter a height between 50 and 272 cm.');
  const m = cm / 100;
  const bmi = kg / (m * m);
  return ok({ bmi, category: classifyBmi(bmi) });
}

export function bmiImperial(lb: number, feet: number, inches: number): Result<BmiResult> {
  if (!(lb >= 4 && lb <= 1500)) return fail('Enter a weight between 4 and 1,500 lb.');
  if (!(feet >= 0 && inches >= 0)) return fail('Height cannot be negative.');
  const totalIn = feet * 12 + inches;
  if (!(totalIn >= 20 && totalIn <= 107)) return fail('Enter a height between 1 ft 8 in and 8 ft 11 in.');
  const bmi = (703 * lb) / (totalIn * totalIn);
  return ok({ bmi, category: classifyBmi(bmi) });
}
