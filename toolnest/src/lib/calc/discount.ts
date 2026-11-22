import { fail, ok, type Result } from './result.ts';

export interface DiscountResult {
  originalPrice: number;
  savings: number;
  priceAfterDiscount: number;
  tax: number;
  finalPrice: number;
  effectiveDiscountPct: number;
}

/** Tax is applied to the discounted price (the usual retail rule). */
export function calculateDiscount(price: number, discountPct: number, taxPct = 0): Result<DiscountResult> {
  if (!(price >= 0)) return fail('Price cannot be negative.');
  if (!(discountPct >= 0 && discountPct <= 100)) return fail('Discount must be between 0% and 100%.');
  if (!(taxPct >= 0 && taxPct <= 100)) return fail('Sales tax must be between 0% and 100%.');
  const savings = (price * discountPct) / 100;
  const priceAfterDiscount = price - savings;
  const tax = (priceAfterDiscount * taxPct) / 100;
  return ok({
    originalPrice: price,
    savings,
    priceAfterDiscount,
    tax,
    finalPrice: priceAfterDiscount + tax,
    effectiveDiscountPct: discountPct
  });
}
