import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const RELOAD_FLAG = 'toolnest:chunk-reload';

/**
 * lazy() with one automatic recovery step. After a new deployment, a browser that still has the old
 * page open may request a tool file that no longer exists. In that case, reload once to pick up the new version.
 */
function lazyTool(loader: () => Promise<{ default: ComponentType }>): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    try {
      const mod = await loader();
      try { sessionStorage.removeItem(RELOAD_FLAG); } catch { /* ignore */ }
      return mod;
    } catch (err) {
      let alreadyTried = true;
      try { alreadyTried = sessionStorage.getItem(RELOAD_FLAG) === '1'; if (!alreadyTried) sessionStorage.setItem(RELOAD_FLAG, '1'); } catch { /* ignore */ }
      if (!alreadyTried) {
        window.location.reload();
        return new Promise<never>(() => { /* page is reloading */ });
      }
      throw err;
    }
  });
}

/** Maps a tool slug to its working component (lazy-loaded so each tool is its own small chunk). */
export const toolComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  'age-calculator': lazyTool(() => import('./AgeCalculator')),
  'bmi-calculator': lazyTool(() => import('./BmiCalculator')),
  'percentage-calculator': lazyTool(() => import('./PercentageCalculator')),
  'discount-calculator': lazyTool(() => import('./DiscountCalculator')),
  'loan-calculator': lazyTool(() => import('./LoanCalculator')),
  'currency-converter': lazyTool(() => import('./CurrencyConverter')),
  'unit-converter': lazyTool(() => import('./UnitConverter')),
  'temperature-converter': lazyTool(() => import('./TemperatureConverter')),
  'cooking-converter': lazyTool(() => import('./CookingConverter')),
  'data-storage-converter': lazyTool(() => import('./DataStorageConverter')),
  'word-counter': lazyTool(() => import('./WordCounter')),
  'text-comparison': lazyTool(() => import('./TextComparison')),
  'image-resizer': lazyTool(() => import('./ImageResizer')),
  'image-compressor': lazyTool(() => import('./ImageCompressor')),
  'savings-calculator': lazyTool(() => import('./SavingsCalculator')),
  'compound-interest-calculator': lazyTool(() => import('./CompoundInterestCalculator')),
  'profit-margin-calculator': lazyTool(() => import('./ProfitMarginCalculator')),
  'stopwatch': lazyTool(() => import('./Stopwatch')),
  'countdown-timer': lazyTool(() => import('./CountdownTimer')),
  'alarm-clock': lazyTool(() => import('./AlarmClock'))
};

export const hasComponent = (slug: string) => slug in toolComponents;
