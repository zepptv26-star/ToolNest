/** Format a number for display: up to 10 significant digits, thousands separators, no float noise. */
export function formatNumber(n: number, maxFraction = 10): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs < 1e-9 || abs >= 1e15) return n.toExponential(6);
  const clean = Number(n.toPrecision(12));
  return clean.toLocaleString('en-US', { maximumFractionDigits: maxFraction });
}

/** Money-style formatting with exactly 2 decimals (no currency symbol: tools are currency-neutral). */
export function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const formatPercent = (n: number, digits = 2) =>
  Number.isFinite(n) ? `${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits })}%` : '—';
