import { useEffect, useRef, useState } from 'react';
import { Flag, Pause, Play, RotateCcw } from 'lucide-react';
import { formatStopwatch } from '../lib/calc/time.ts';
import { CopyButton, Note } from '../components/ui';

interface Lap { n: number; split: number; total: number }

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const baseRef = useRef(0);      // time accumulated while previously running
  const startRef = useRef(0);     // performance.now() at the latest start

  const now = () => baseRef.current + (running ? performance.now() - startRef.current : 0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(baseRef.current + performance.now() - startRef.current), 31);
    return () => clearInterval(id);
  }, [running]);

  const start = () => { startRef.current = performance.now(); setRunning(true); };
  const stop = () => { baseRef.current += performance.now() - startRef.current; setElapsed(baseRef.current); setRunning(false); };
  const reset = () => { baseRef.current = 0; setElapsed(0); setRunning(false); setLaps([]); };
  const lap = () => {
    const total = now();
    setLaps((prev) => [{ n: prev.length + 1, total, split: total - (prev[0]?.total ?? 0) }, ...prev]);
  };

  return (
    <div>
      <p role="timer" aria-label="Elapsed time" className="rounded-xl bg-navy py-8 text-center font-mono text-5xl font-bold tabular-nums text-white sm:text-6xl">
        {formatStopwatch(elapsed)}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {!running ? <button type="button" className="btn-primary" onClick={start}><Play size={18} aria-hidden /> {elapsed > 0 ? 'Resume' : 'Start'}</button>
          : <button type="button" className="btn-primary" onClick={stop}><Pause size={18} aria-hidden /> Stop</button>}
        <button type="button" className="btn-secondary" onClick={lap} disabled={!running}><Flag size={18} aria-hidden /> Lap</button>
        <button type="button" className="btn-secondary" onClick={reset} disabled={elapsed === 0 && laps.length === 0}><RotateCcw size={18} aria-hidden /> Clear</button>
      </div>
      {laps.length > 0 && (
        <div className="mt-6">
          <div className="max-h-72 overflow-auto rounded-lg border border-line dark:border-slate-700">
            <table className="w-full text-right font-mono text-sm tabular-nums">
              <thead className="sticky top-0 bg-surface font-sans dark:bg-slate-800"><tr><th scope="col" className="px-3 py-2 text-left">Lap</th><th scope="col" className="px-3 py-2">Lap time</th><th scope="col" className="px-3 py-2">Total</th></tr></thead>
              <tbody>{laps.map((l) => <tr key={l.n} className="border-t border-line dark:border-slate-700"><td className="px-3 py-1.5 text-left">{l.n}</td><td className="px-3 py-1.5">{formatStopwatch(l.split)}</td><td className="px-3 py-1.5">{formatStopwatch(l.total)}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="mt-3"><CopyButton label="Copy laps" text={[...laps].reverse().map((l) => `Lap ${l.n}: ${formatStopwatch(l.split)} (total ${formatStopwatch(l.total)})`).join('\n')} /></div>
        </div>
      )}
      <Note>Time is measured with the browser's high-resolution clock, so it stays accurate even if the display updates slowly. Keep this tab open while timing.</Note>
    </div>
  );
}
