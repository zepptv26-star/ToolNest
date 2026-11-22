const pad = (n: number) => String(n).padStart(2, '0');

/** mm:ss.cc, or hh:mm:ss.cc from one hour up. */
export function formatStopwatch(ms: number): string {
  const total = Math.max(0, Math.floor(ms));
  const cs = Math.floor((total % 1000) / 10);
  const s = Math.floor(total / 1000) % 60;
  const m = Math.floor(total / 60000) % 60;
  const h = Math.floor(total / 3600000);
  return `${h > 0 ? `${pad(h)}:` : ''}${pad(m)}:${pad(s)}.${pad(cs)}`;
}

/** hh:mm:ss, rounding up so the display reaches 00:00:00 only when time is really up. */
export function formatCountdown(ms: number): string {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
}
