import type { LucideIcon } from 'lucide-react';

export type CategoryId =
  | 'calculators'
  | 'converters'
  | 'text-writing'
  | 'image-tools'
  | 'money-finance'
  | 'productivity';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Tool {
  slug: string;
  name: string;
  category: CategoryId;
  /** One-line card description. */
  description: string;
  /** Longer intro shown at the top of the tool page. */
  intro: string;
  keywords: string[];
  icon: LucideIcon;
  popular?: boolean;
  /** ISO date the tool was published; drives "Recently added". */
  addedAt: string;
  /** False until the tool's working component is implemented (Phase 3). */
  ready: boolean;
}
