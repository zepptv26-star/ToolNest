export interface TextStats {
  words: number; characters: number; charactersNoSpaces: number;
  sentences: number; paragraphs: number; readingMinutes: number; speakingMinutes: number;
}

const WPM_READ = 238;
const WPM_SPEAK = 130;

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  const chars = Array.from(text);
  const characters = chars.length;
  const charactersNoSpaces = chars.filter((c) => !/\s/.test(c)).length;
  const sentences = trimmed === '' ? 0 : (trimmed.match(/[^.!?。！？…]+[.!?。！？…]+|[^.!?。！？…]+$/g) ?? []).filter((s) => /\S/.test(s)).length;
  const paragraphs = trimmed === '' ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes: words / WPM_READ, speakingMinutes: words / WPM_SPEAK };
}

/** "less than a minute", "3 min 20 sec" */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0 sec';
  const totalSec = Math.round(minutes * 60);
  if (totalSec < 60) return `${totalSec} sec`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} sec`;
}
