import { useMemo, useState } from 'react';
import { analyzeText, formatDuration } from '../lib/calc/text.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { ClearButton, CopyButton, Grid, Note, Stat } from '../components/ui';

export default function WordCounter() {
  const [text, setText] = useState('');
  const s = useMemo(() => analyzeText(text), [text]);
  const summary = `Words: ${s.words}, characters: ${s.characters}, characters without spaces: ${s.charactersNoSpaces}, sentences: ${s.sentences}, paragraphs: ${s.paragraphs}, reading time: ${formatDuration(s.readingMinutes)}`;
  return (
    <div>
      <label htmlFor="wc-text" className="label">Your text</label>
      <textarea id="wc-text" className="input min-h-[220px] resize-y" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here…" />
      <div className="mt-6 space-y-3" aria-live="polite">
        <Grid cols={3}>
          <Stat big label="Words" value={formatNumber(s.words)} />
          <Stat big label="Characters" value={formatNumber(s.characters)} />
          <Stat big label="Characters (no spaces)" value={formatNumber(s.charactersNoSpaces)} />
        </Grid>
        <Grid cols={3}>
          <Stat label="Sentences" value={formatNumber(s.sentences)} />
          <Stat label="Paragraphs" value={formatNumber(s.paragraphs)} />
          <Stat label="Reading time" value={formatDuration(s.readingMinutes)} sub={`Speaking: ${formatDuration(s.speakingMinutes)}`} />
        </Grid>
      </div>
      <div className="mt-4 flex gap-2">
        <CopyButton text={summary} label="Copy counts" />
        <ClearButton onClick={() => setText('')} />
      </div>
      <Note>Words are separated by spaces, so languages written without spaces (such as Japanese or Chinese) are counted by their spaced groups, not by individual words. Reading time assumes about 238 words per minute; speaking time about 130.</Note>
    </div>
  );
}
