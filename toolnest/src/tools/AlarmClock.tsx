import { useEffect, useMemo, useRef, useState } from 'react';
import { AlarmClock as AlarmIcon, BellOff, Plus, Trash2 } from 'lucide-react';
import { createBeeper } from '../lib/sound.ts';
import { ErrorNote, Note } from '../components/ui';

interface Alarm { id: number; time: string; label: string; target: number; ringing: boolean }

function nextOccurrence(time: string, from = new Date()): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  const d = new Date(from);
  d.setHours(+m[1], +m[2], 0, 0);
  if (d.getTime() <= from.getTime()) d.setDate(d.getDate() + 1);
  return d.getTime();
}

export default function AlarmClock() {
  const [now, setNow] = useState(() => new Date());
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(1);
  const beeper = useMemo(() => createBeeper(), []);
  const ringing = alarms.filter((a) => a.ringing);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setNow(n);
      setAlarms((prev) => prev.some((a) => !a.ringing && n.getTime() >= a.target) ? prev.map((a) => (!a.ringing && n.getTime() >= a.target ? { ...a, ringing: true } : a)) : prev);
    };
    const id = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, []);

  useEffect(() => {
    if (ringing.length === 0) return;
    beeper.beep(3);
    const id = setInterval(() => beeper.beep(3), 2000);
    return () => clearInterval(id);
  }, [ringing.length, beeper]);

  const add = () => {
    const target = nextOccurrence(time);
    if (target === null) { setError('Please choose a valid time.'); return; }
    if (alarms.length >= 10) { setError('You can set up to 10 alarms.'); return; }
    setError(null); beeper.unlock();
    setAlarms((p) => [...p, { id: idRef.current++, time, label: label.trim().slice(0, 60), target, ringing: false }].sort((a, b) => a.target - b.target));
    setTime(''); setLabel('');
  };
  const remove = (id: number) => setAlarms((p) => p.filter((a) => a.id !== id));
  const snooze = (id: number) => setAlarms((p) => p.map((a) => (a.id === id ? { ...a, ringing: false, target: Date.now() + 5 * 60 * 1000 } : a)));
  const when = (t: number) => { const d = new Date(t); const today = new Date(); return d.toDateString() === today.toDateString() ? 'today' : 'tomorrow'; };

  return (
    <div>
      <p role="timer" aria-label="Current time" className="rounded-xl bg-navy py-6 text-center font-mono text-4xl font-bold tabular-nums text-white sm:text-5xl">
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>

      {ringing.map((a) => (
        <div key={a.id} role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal bg-teal/10 p-4">
          <p className="font-semibold text-navy dark:text-white">⏰ {a.label || 'Alarm'} ({a.time})</p>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary !py-2" onClick={() => snooze(a.id)}>Snooze 5 min</button>
            <button type="button" className="btn-primary !py-2" onClick={() => remove(a.id)}><BellOff size={16} aria-hidden /> Stop</button>
          </div>
        </div>
      ))}

      <div className="mt-6 grid items-end gap-4 sm:grid-cols-[auto_1fr_auto]">
        <div><label htmlFor="al-time" className="label">Alarm time</label><input id="al-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        <div><label htmlFor="al-label" className="label">Label (optional)</label><input id="al-label" className="input" maxLength={60} value={label} placeholder="e.g. Start class" onChange={(e) => setLabel(e.target.value)} /></div>
        <button type="button" className="btn-primary" onClick={add}><Plus size={18} aria-hidden /> Set alarm</button>
      </div>
      <ErrorNote message={error} />

      {alarms.length > 0 && (
        <ul className="mt-6 divide-y divide-line rounded-lg border border-line dark:divide-slate-700 dark:border-slate-700">
          {alarms.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              <AlarmIcon size={18} className="text-teal-dark dark:text-teal" aria-hidden />
              <span className="font-mono text-lg font-semibold">{a.time}</span>
              <span className="flex-1 truncate text-sm text-muted">{a.label || 'Alarm'} · {a.ringing ? 'ringing' : when(a.target)}</span>
              <button type="button" className="rounded-lg p-2 text-muted hover:text-red-600" onClick={() => remove(a.id)} aria-label={`Delete alarm ${a.time}`}><Trash2 size={18} aria-hidden /></button>
            </li>
          ))}
        </ul>
      )}
      <Note tone="warn">Important: this alarm only rings while this page stays open in your browser, and your device must be awake with the volume on. It cannot wake a sleeping device or ring after the tab is closed, so do not rely on it for anything critical. Alarms are not saved if you reload the page.</Note>
    </div>
  );
}
