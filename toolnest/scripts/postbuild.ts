// Runs after `vite build`: writes sitemap.xml, robots.txt and one HTML file per route with its own SEO tags.
// Requires Node 22.6+ (run with --experimental-strip-types, see package.json).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildRobots, buildRoutes, buildSitemap, renderRoute } from './seo.ts';

const DIST = 'dist';

function readEnvFile(name: string): Record<string, string> {
  if (!existsSync(name)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(name, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = { ...readEnvFile('.env'), ...readEnvFile('.env.production'), ...process.env } as Record<string, string | undefined>;
const siteUrl = (env.VITE_SITE_URL || 'https://www.example.com').replace(/\/$/, '');
if (siteUrl === 'https://www.example.com') console.warn('WARNING: VITE_SITE_URL is not set, so the sitemap and canonical URLs use https://www.example.com. Set it before deploying.');

const templatePath = join(DIST, 'index.html');
if (!existsSync(templatePath)) { console.error('dist/index.html not found. Run `vite build` first.'); process.exit(1); }
const template = readFileSync(templatePath, 'utf8');

const routes = buildRoutes(siteUrl);
for (const r of routes) {
  const file = r.path === '/' ? templatePath : join(DIST, r.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, renderRoute(template, r, siteUrl));
}
writeFileSync(join(DIST, 'sitemap.xml'), buildSitemap(routes.map((r) => r.path), siteUrl, new Date().toISOString().slice(0, 10)));
writeFileSync(join(DIST, 'robots.txt'), buildRobots(siteUrl));
console.log(`SEO: wrote ${routes.length} pages, sitemap.xml and robots.txt for ${siteUrl}`);
