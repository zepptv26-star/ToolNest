import {
  AlarmClock, BarChart3, CalendarDays, Coins, CookingPot, FileDown, FileText, GitCompare, HardDrive, HeartPulse, Hourglass, Landmark, Minimize2, Percent, PiggyBank, Ruler, Tag, Thermometer, Timer, TrendingUp
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toolMeta } from './toolMeta.ts';
import type { Tool } from './types.ts';

/** Icon for each tool slug. */
const icons: Record<string, LucideIcon> = {
  'age-calculator': CalendarDays,
  'bmi-calculator': HeartPulse,
  'percentage-calculator': Percent,
  'discount-calculator': Tag,
  'loan-calculator': Landmark,
  'currency-converter': Coins,
  'unit-converter': Ruler,
  'temperature-converter': Thermometer,
  'cooking-converter': CookingPot,
  'data-storage-converter': HardDrive,
  'word-counter': FileText,
  'text-comparison': GitCompare,
  'image-resizer': Minimize2,
  'image-compressor': FileDown,
  'savings-calculator': PiggyBank,
  'compound-interest-calculator': TrendingUp,
  'profit-margin-calculator': BarChart3,
  'stopwatch': Timer,
  'countdown-timer': Hourglass,
  'alarm-clock': AlarmClock,
};

/**
 * Central tool registry: the single source of truth for the homepage, search, category pages,
 * related tools and the sitemap. To add a tool: add metadata in toolMeta.ts, an icon above,
 * and the component in src/tools/ (mapped in src/tools/index.ts).
 */
export const tools: Tool[] = toolMeta.map((m) => ({ ...m, icon: icons[m.slug], ready: true }));

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const toolsByCategory = (id: string) => tools.filter((t) => t.category === id);
export const toolPath = (t: Pick<Tool, 'slug'>) => `/tools/${t.slug}`;
