import { tools } from '../registry/tools';
import { getCategory } from '../registry/categories';
import type { Tool } from '../registry/types';

/** Score a tool against a query: name > keyword > category > description. */
function score(tool: Tool, terms: string[]): number {
  const name = tool.name.toLowerCase();
  const cat = (getCategory(tool.category)?.name ?? '').toLowerCase();
  const desc = tool.description.toLowerCase();
  let total = 0;
  for (const term of terms) {
    let s = 0;
    if (name.startsWith(term)) s = 100;
    else if (name.includes(term)) s = 80;
    else if (tool.keywords.some((k) => k.toLowerCase().includes(term))) s = 60;
    else if (cat.includes(term)) s = 40;
    else if (desc.includes(term)) s = 20;
    if (s === 0) return 0; // every term must match something
    total += s;
  }
  return total;
}

export function searchTools(query: string, pool: Tool[] = tools): Tool[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return pool;
  return pool
    .map((t) => ({ t, s: score(t, terms) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.t.name.localeCompare(b.t.name))
    .map((x) => x.t);
}
