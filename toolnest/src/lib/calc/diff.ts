import { fail, ok, type Result } from './result.ts';

export type DiffType = 'equal' | 'add' | 'remove';
export interface DiffSegment { type: DiffType; text: string }
export interface DiffSummary { segments: DiffSegment[]; added: number; removed: number; identical: boolean }

const MAX_TOKENS = 4000;

/** Word-level diff using a longest-common-subsequence table. Whitespace is kept as separate tokens. */
export function diffText(before: string, after: string): Result<DiffSummary> {
  const a = before.match(/\s+|[^\s]+/g) ?? [];
  const b = after.match(/\s+|[^\s]+/g) ?? [];
  if (a.length > MAX_TOKENS || b.length > MAX_TOKENS) {
    return fail(`Texts are too long to compare in the browser (limit about ${MAX_TOKENS / 2} words each).`);
  }
  const n = a.length, m = b.length, w = m + 1;
  const lcs = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * w + j] = a[i] === b[j] ? lcs[(i + 1) * w + j + 1] + 1 : Math.max(lcs[(i + 1) * w + j], lcs[i * w + j + 1]);
    }
  }
  const raw: DiffSegment[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { raw.push({ type: 'equal', text: a[i] }); i++; j++; }
    else if (lcs[(i + 1) * w + j] >= lcs[i * w + j + 1]) { raw.push({ type: 'remove', text: a[i++] }); }
    else { raw.push({ type: 'add', text: b[j++] }); }
  }
  while (i < n) raw.push({ type: 'remove', text: a[i++] });
  while (j < m) raw.push({ type: 'add', text: b[j++] });

  const segments: DiffSegment[] = [];
  for (const s of raw) {
    const last = segments[segments.length - 1];
    if (last && last.type === s.type) last.text += s.text; else segments.push({ ...s });
  }
  const count = (t: DiffType) =>
    segments.filter((s) => s.type === t).reduce((sum, s) => sum + (s.text.trim() === '' ? 0 : s.text.trim().split(/\s+/).length), 0);
  return ok({ segments, added: count('add'), removed: count('remove'), identical: before === after });
}
