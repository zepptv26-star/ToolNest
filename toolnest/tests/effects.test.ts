import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Regression guard. A React effect must return nothing or a cleanup function. Browsers' window.scrollTo()
 * now returns a Promise, so `useEffect(() => window.scrollTo(0, 0))` makes React crash on the next navigation
 * ("destroy is not a function") and the whole page goes blank. Effects must use a block body.
 */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

test('no effect returns an expression by accident', () => {
  const bad: string[] = [];
  for (const f of files('src')) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/use(?:Layout)?Effect\(\(\)\s*=>\s*([^\n]{0,60})/g)) {
      const body = m[1].trimStart();
      // allowed: a block body "{", or a deliberate cleanup function "() =>"
      if (!body.startsWith('{') && !body.startsWith('() =>')) bad.push(`${f}: ${m[0]}`);
    }
  }
  assert.deepEqual(bad, []);
});
