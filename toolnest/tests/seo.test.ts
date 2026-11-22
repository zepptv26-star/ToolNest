import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRobots, buildRoutes, buildSitemap, escapeHtml, renderRoute } from '../scripts/seo.ts';
import { toolMeta } from '../src/registry/toolMeta.ts';
import { toolContent } from '../src/content/toolContent.ts';

const SITE = 'https://toolnest.test';
const template = '<!doctype html><html><head><title>x</title>\n<meta name="description" content="old" />\n</head><body><div id="root"></div></body></html>';

test('every tool has a route, content and a unique title and description', () => {
  const routes = buildRoutes(SITE);
  assert.equal(toolMeta.length, 20);
  for (const t of toolMeta) {
    assert.ok(routes.some((r) => r.path === `/tools/${t.slug}`), `route for ${t.slug}`);
    assert.ok(toolContent[t.slug], `content for ${t.slug}`);
    assert.ok(toolContent[t.slug].faq.length >= 3, `faq for ${t.slug}`);
  }
  assert.equal(new Set(routes.map((r) => r.title)).size, routes.length, 'unique titles');
  assert.equal(new Set(routes.map((r) => r.description)).size, routes.length, 'unique descriptions');
  assert.equal(new Set(routes.map((r) => r.path)).size, routes.length, 'unique paths');
});

test('descriptions are a sensible length for search results', () => {
  for (const r of buildRoutes(SITE)) {
    assert.ok(r.description.length >= 40 && r.description.length <= 200, `${r.path}: ${r.description.length}`);
  }
});

test('sitemap lists every route as an absolute URL and is valid-looking XML', () => {
  const routes = buildRoutes(SITE);
  const xml = buildSitemap(routes.map((r) => r.path), SITE, '2026-11-22');
  assert.ok(xml.startsWith('<?xml'));
  assert.equal((xml.match(/<url>/g) ?? []).length, routes.length);
  assert.ok(xml.includes(`<loc>${SITE}/tools/age-calculator</loc>`));
  assert.ok(xml.includes(`<loc>${SITE}/</loc>`));
  assert.ok(!xml.includes('//tools'));
});

test('robots.txt points to the sitemap', () => {
  assert.match(buildRobots(SITE), /Sitemap: https:\/\/toolnest\.test\/sitemap\.xml/);
});

test('renderRoute injects canonical, OG tags, title and JSON-LD safely', () => {
  const r = buildRoutes(SITE).find((x) => x.path === '/tools/loan-calculator')!;
  const html = renderRoute(template, r, SITE);
  assert.ok(html.includes(`<link rel="canonical" href="${SITE}/tools/loan-calculator" />`));
  assert.ok(html.includes('property="og:title"'));
  assert.ok(html.includes('<title>Loan Calculator (Free Online) | ToolNest</title>'));
  assert.ok(!html.includes('content="old"'));
  assert.ok(html.includes('application/ld+json') && html.includes('FAQPage') && html.includes('BreadcrumbList'));
  assert.ok(html.includes('<noscript>') && html.includes('<h1>Loan Calculator</h1>'));
  const ld = /<script id="jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)![1];
  assert.doesNotThrow(() => JSON.parse(ld));
});

test('escaping prevents HTML injection', () => {
  assert.equal(escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
  const evil = { path: '/x', title: 'T"<b>', description: 'D"<i>', h1: '<script>', paragraphs: ['</noscript><script>alert(1)</script>'], links: [], jsonLd: [{ a: '</script><script>alert(1)' }] };
  const html = renderRoute(template, evil, SITE);
  assert.ok(!html.includes('<script>alert(1)'));
  assert.ok(!html.includes('</script><script>'));
});

test('home page uses the brand title without duplication', () => {
  const home = buildRoutes(SITE)[0];
  assert.equal(home.title, 'ToolNest | Smart Tools. Simple Solutions.');
});
