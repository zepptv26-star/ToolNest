import { Calculator, ArrowLeftRight, Type, Image, Wallet, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { categoryMeta } from './toolMeta.ts';
import type { Category } from './types.ts';

const icons: Record<string, LucideIcon> = {
  calculators: Calculator, converters: ArrowLeftRight, 'text-writing': Type,
  'image-tools': Image, 'money-finance': Wallet, productivity: Timer
};

export const categories: Category[] = categoryMeta.map((c) => ({ ...c, icon: icons[c.id] }));

export const getCategory = (id: string) => categories.find((c) => c.id === id);
