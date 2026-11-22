import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Maps a tool slug to its working component (lazy-loaded so each tool is its own small chunk). */
export const toolComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  'age-calculator': lazy(() => import('./AgeCalculator')),
  'bmi-calculator': lazy(() => import('./BmiCalculator')),
  'percentage-calculator': lazy(() => import('./PercentageCalculator')),
  'discount-calculator': lazy(() => import('./DiscountCalculator')),
  'loan-calculator': lazy(() => import('./LoanCalculator')),
  'currency-converter': lazy(() => import('./CurrencyConverter')),
  'unit-converter': lazy(() => import('./UnitConverter')),
  'temperature-converter': lazy(() => import('./TemperatureConverter')),
  'cooking-converter': lazy(() => import('./CookingConverter')),
  'data-storage-converter': lazy(() => import('./DataStorageConverter')),
  'word-counter': lazy(() => import('./WordCounter')),
  'text-comparison': lazy(() => import('./TextComparison')),
  'image-resizer': lazy(() => import('./ImageResizer')),
  'image-compressor': lazy(() => import('./ImageCompressor')),
  'savings-calculator': lazy(() => import('./SavingsCalculator')),
  'compound-interest-calculator': lazy(() => import('./CompoundInterestCalculator')),
  'profit-margin-calculator': lazy(() => import('./ProfitMarginCalculator')),
  'stopwatch': lazy(() => import('./Stopwatch')),
  'countdown-timer': lazy(() => import('./CountdownTimer')),
  'alarm-clock': lazy(() => import('./AlarmClock'))
};

export const hasComponent = (slug: string) => slug in toolComponents;
