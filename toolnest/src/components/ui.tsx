import { useId, useState, type ReactNode } from 'react';
import { AlertCircle, Check, Copy, RotateCcw } from 'lucide-react';

export function NumberInput(props: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string; hint?: string; id?: string;
}) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <div>
      <label htmlFor={id} className="label">{props.label}</label>
      <div className="relative">
        <input id={id} type="text" inputMode="decimal" autoComplete="off" className={`input ${props.suffix ? 'pr-14' : ''}`}
          value={props.value} placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} aria-describedby={props.hint ? `${id}-hint` : undefined} />
        {props.suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">{props.suffix}</span>}
      </div>
      {props.hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{props.hint}</p>}
    </div>
  );
}

export function SelectField<T extends string>(props: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; id?: string; hint?: string;
}) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <div>
      <label htmlFor={id} className="label">{props.label}</label>
      <select id={id} className="input" value={props.value} onChange={(e) => props.onChange(e.target.value as T)}>
        {props.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {props.hint && <p className="mt-1 text-xs text-muted">{props.hint}</p>}
    </div>
  );
}

export function Segmented<T extends string>(props: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div role="group" aria-label={props.label}>
      <span className="label">{props.label}</span>
      <div className="inline-flex rounded-lg border border-line p-1 dark:border-slate-600">
        {props.options.map((o) => (
          <button key={o.value} type="button" aria-pressed={props.value === o.value} onClick={() => props.onChange(o.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${props.value === o.value ? 'bg-navy text-white dark:bg-teal dark:text-navy' : 'text-ink hover:bg-surface dark:text-slate-200 dark:hover:bg-slate-800'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Stat({ label, value, big = false, sub }: { label: string; value: ReactNode; big?: boolean; sub?: string }) {
  return (
    <div className={`rounded-lg p-4 ${big ? 'bg-teal/10' : 'bg-surface dark:bg-slate-800'}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 break-words font-bold text-navy dark:text-white ${big ? 'text-3xl' : 'text-xl'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function ErrorNote({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden /> <span>{message}</span>
    </p>
  );
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <p className={`mt-4 rounded-lg border p-3 text-sm ${tone === 'warn' ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200' : 'border-line bg-surface text-muted dark:border-slate-700 dark:bg-slate-800'}`}>
      {children}
    </p>
  );
}

export function CopyButton({ text, label = 'Copy result' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false); setDone(true);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        const okCopy = document.execCommand('copy');
        document.body.removeChild(ta);
        setFailed(!okCopy); setDone(okCopy);
      } catch { setFailed(true); }
    }
    setTimeout(() => { setDone(false); setFailed(false); }, 2000);
  };
  return (
    <button type="button" onClick={copy} className="btn-secondary !py-2">
      {done ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      <span aria-live="polite">{done ? 'Copied' : failed ? 'Copy failed' : label}</span>
    </button>
  );
}

export function ClearButton({ onClick, label = 'Clear' }: { onClick: () => void; label?: string }) {
  return <button type="button" onClick={onClick} className="btn-secondary !py-2"><RotateCcw size={16} aria-hidden /> {label}</button>;
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={`grid gap-4 ${cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{children}</div>;
}

export function Results({ children }: { children: ReactNode }) {
  return <div className="mt-6 space-y-3" aria-live="polite">{children}</div>;
}
