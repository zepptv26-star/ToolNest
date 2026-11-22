import { useState } from 'react';
import { diffText } from '../lib/calc/diff.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, Stat } from '../components/ui';

export default function TextComparison() {
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const r = a !== '' || b !== '' ? diffText(a, b) : null;
  const clear = () => { setA(''); setB(''); };
  const plain = r && r.ok ? r.value.segments.map((s) => (s.type === 'add' ? `[+${s.text}+]` : s.type === 'remove' ? `[-${s.text}-]` : s.text)).join('') : '';

  return (
    <div>
      <Grid>
        <div><label htmlFor="orig" className="label">Original text</label><textarea id="orig" className="input min-h-[180px] resize-y" value={a} onChange={(e) => setA(e.target.value)} placeholder="Paste the original text…" /></div>
        <div><label htmlFor="mod" className="label">Changed text</label><textarea id="mod" className="input min-h-[180px] resize-y" value={b} onChange={(e) => setB(e.target.value)} placeholder="Paste the changed text…" /></div>
      </Grid>
      {r && !r.ok && <ErrorNote message={r.error} />}
      {r && r.ok && (
        <div className="mt-6 space-y-3" aria-live="polite">
          {r.value.identical ? <Note>The two texts are identical.</Note> : (
            <Grid cols={3}>
              <Stat label="Words added" value={r.value.added} />
              <Stat label="Words removed" value={r.value.removed} />
            </Grid>
          )}
          <div className="rounded-lg border border-line p-4 text-base leading-relaxed dark:border-slate-700" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {r.value.segments.map((s, i) =>
              s.type === 'add' ? <ins key={i} className="rounded bg-green-100 px-0.5 text-green-900 no-underline dark:bg-green-900/50 dark:text-green-100">{s.text}</ins>
              : s.type === 'remove' ? <del key={i} className="rounded bg-red-100 px-0.5 text-red-900 dark:bg-red-900/50 dark:text-red-100">{s.text}</del>
              : <span key={i}>{s.text}</span>)}
          </div>
          <p className="text-xs text-muted"><ins className="rounded bg-green-100 px-1 text-green-900 no-underline dark:bg-green-900/50 dark:text-green-100">Green</ins> = added, <del className="rounded bg-red-100 px-1 text-red-900 dark:bg-red-900/50 dark:text-red-100">red strikethrough</del> = removed. Text comparison is word by word and case-sensitive.</p>
        </div>
      )}
      <div className="mt-4 flex gap-2"><CopyButton text={plain} label="Copy marked-up result" /><ClearButton onClick={clear} /></div>
    </div>
  );
}
