import { fail, ok, type Result } from './result.ts';

/** Volume units in millilitres. Cup size differs by country, so it is selectable. */
export type CupSystem = 'us' | 'metric';
export const CUP_ML: Record<CupSystem, number> = { us: 236.5882365, metric: 250 };

export const volumeUnits = ['cup', 'tbsp', 'tsp', 'ml', 'l', 'floz'] as const;
export type CookingUnit = (typeof volumeUnits)[number] | 'g';

export const cookingUnitLabels: Record<CookingUnit, string> = {
  cup: 'Cups', tbsp: 'Tablespoons', tsp: 'Teaspoons', ml: 'Millilitres (mL)', l: 'Litres (L)', floz: 'Fluid ounces (US)', g: 'Grams (weight)'
};

/** Approximate weight of one US cup of each ingredient. These are typical kitchen values, not exact. */
export interface Ingredient { id: string; label: string; gramsPerUSCup: number }
export const ingredients: Ingredient[] = [
  { id: 'water', label: 'Water', gramsPerUSCup: 236.6 },
  { id: 'milk', label: 'Milk', gramsPerUSCup: 244 },
  { id: 'flour', label: 'All-purpose flour (spooned)', gramsPerUSCup: 125 },
  { id: 'sugar', label: 'Granulated sugar', gramsPerUSCup: 200 },
  { id: 'brown-sugar', label: 'Brown sugar (packed)', gramsPerUSCup: 213 },
  { id: 'powdered-sugar', label: 'Powdered sugar', gramsPerUSCup: 120 },
  { id: 'butter', label: 'Butter', gramsPerUSCup: 227 },
  { id: 'oil', label: 'Vegetable oil', gramsPerUSCup: 218 },
  { id: 'honey', label: 'Honey', gramsPerUSCup: 340 },
  { id: 'rice', label: 'Uncooked white rice', gramsPerUSCup: 185 },
  { id: 'oats', label: 'Rolled oats', gramsPerUSCup: 90 },
  { id: 'cocoa', label: 'Cocoa powder', gramsPerUSCup: 85 }
];

const volumeMl = (unit: (typeof volumeUnits)[number], cup: CupSystem): number => {
  switch (unit) {
    case 'cup': return CUP_ML[cup];
    case 'tbsp': return cup === 'metric' ? 15 : 14.78676478125;
    case 'tsp': return cup === 'metric' ? 5 : 4.92892159375;
    case 'ml': return 1;
    case 'l': return 1000;
    case 'floz': return 29.5735295625;
  }
};

/**
 * Convert between kitchen measures. Converting to or from grams needs an ingredient,
 * because weight depends on density. Volume-to-volume conversions never need one.
 */
export function convertCooking(
  value: number, from: CookingUnit, to: CookingUnit, cup: CupSystem, ingredientId?: string
): Result<number> {
  if (!Number.isFinite(value)) return fail('Enter a valid number.');
  if (value < 0) return fail('Amount cannot be negative.');
  if (from === to) return ok(value);
  const ing = ingredients.find((i) => i.id === ingredientId);
  const gPerMl = ing ? ing.gramsPerUSCup / CUP_ML.us : undefined;

  let ml: number;
  if (from === 'g') {
    if (gPerMl === undefined) return fail('Choose an ingredient to convert from grams.');
    ml = value / gPerMl;
  } else ml = value * volumeMl(from, cup);

  if (to === 'g') {
    if (gPerMl === undefined) return fail('Choose an ingredient to convert to grams.');
    return ok(ml * gPerMl);
  }
  return ok(ml / volumeMl(to, cup));
}
