import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { createBeeper } from '../lib/sound.ts';
import { formatCountdown as fmt } from '../lib/calc/time.ts';
import { ErrorNote, Grid, Note, NumberInput } from '../components/ui';

type Phase = 'idle' | 'running' | 'paused' | 'done';

export default function CountdownTimer() {
  const [h, setH] = useState('0'); const [m, setM] = useState('5'); const [s, setS] = useState('0');
  const [phase, setPhase] = useState<Phase>('idle');
  const [remaining, setRemaining] = useState(0);
  const [sound, setSound] = useState(true);
  const [soundFailed, setSoundFailed] = useState(false);
  const endRef = useRef(0);
  const beeper = useMemo(() => createBeeper(), []);

  const parse = (v: string) => (/^\d{1,3}$/.test(v.trim()) ? Number(v.trim()) : v.trim() === '' ? 0 : NaN);
  const hh = parse(h), mm = parse(m), ss = parse(s);
  const invalid = [hh, mm, ss].some(Number.isNaN);
  const totalMs = invalid ? 0 : (hh * 3600 + mm * 60 + ss) * 1000;
  const tooLong = totalMs > 99 * 3600 * 1000;
  const error = invalid ? 'Use whole numbers only (no decimals or negative numbers).' : tooLong ? 'The maximum is 99 hours.' : null;

  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => {
      const rem = endRef.current - Date.now();
      if (rem <= 0) {
        clearInterval(id);
        setRemaining(0); setPhase('done');
        if (sound) setSoundFailed(!beeper.beep(5));
      } else setRemaining(rem);
    }, 200);
    return () => clearInterval(id);
  }, [phase, sound, beeper]);

  useEffect(() => {
    if (phase !== 'running') return;
    const old = document.title;
    document.title = `${fmt(remaining)} · Countdown Timer`;
    return () => { document.title = old; };
  }, [phase, remaining]);

  const start = () => {
    if (invalid || tooLong || totalMs <= 0) return;
    beeper.unlock(); setSoundFailed(false);
    endRef.current = Date.now() + totalMs; setRemaining(totalMs); setPhase('running');
  };
  const pause = () => { setRemaining(Math.max(0, endRef.current - Date.now())); setPhase('paused'); };
  const resume = () => { endRef.current = Date.now() + remaining; setPhase('running'); };
  const reset = () => { setPhase('idle'); setRemaining(0); setSoundFailed(false); };

  const shown = phase === 'idle' ? fmt(totalMs) : fmt(remaining);

  return (
    <div>
      {phase === 'idle' && (
        <>
          <Grid cols={3}>
            <NumberInput label="Hours" value={h} onChange={setH} placeholder="0" />
            <NumberInput label="Minutes" value={m} onChange={setM} placeholder="5" />
            <NumberInput label="Seconds" value={s} onChange={setS} placeholder="0" />
          </Grid>
          <ErrorNote message={error} />
        </>
      )}
      <p role="timer" aria-label="Time remaining" className={`mt-4 rounded-xl py-8 text-center font-mono text-5xl font-bold tabular-nums sm:text-6xl ${phase === 'done' ? 'bg-teal text-navy' : 'bg-navy text-white'}`}>
        {shown}
      </p>
      {phase === 'done' && <p role="alert" className="mt-4 rounded-lg bg-teal/10 p-4 text-center text-lg font-semibold text-navy dark:text-white">⏰ Time is up!{soundFailed && ' (Sound could not play in this browser.)'}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {phase === 'idle' && <button type="button" className="btn-primary" onClick={start} disabled={invalid || tooLong || totalMs <= 0}><Play size={18} aria-hidden /> Start</button>}
        {phase === 'running' && <button type="button" className="btn-primary" onClick={pause}><Pause size={18} aria-hidden /> Pause</button>}
        {phase === 'paused' && <button type="button" className="btn-primary" onClick={resume}><Play size={18} aria-hidden /> Resume</button>}
        <button type="button" className="btn-secondary" onClick={reset} disabled={phase === 'idle'}><RotateCcw size={18} aria-hidden /> Reset</button>
      </div>
      <label className="mt-4 flex items-center justify-center gap-2 text-sm">
        <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} className="h-4 w-4 accent-teal" /> Play a sound when time is up
      </label>
      <Note>The timer works out the remaining time from the system clock, so it stays accurate even when the browser slows down timers. Keep this tab open: browsers may delay sounds in tabs that are closed or in the background, and a sound needs your device volume on.</Note>
    </div>
  );
}
