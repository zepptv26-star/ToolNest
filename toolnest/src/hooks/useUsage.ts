import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/** Local-only usage counts (tool slug -> visits). Never leaves the browser. */
export function useUsage() {
  const [counts, setCounts] = useLocalStorage<Record<string, number>>('toolnest:usage', {});
  const record = useCallback(
    (slug: string) => setCounts((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 })),
    [setCounts]
  );
  const topSlugs = (limit = 6) =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([slug]) => slug);
  return { counts, record, topSlugs };
}
