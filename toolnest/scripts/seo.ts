import { categoryMeta, toolMeta } from '../src/registry/toolMeta.ts';
import { toolContent } from '../src/content/toolContent.ts';
import { HOME_META, categoryPageMeta, fullTitle, staticPageMeta, toolPageMeta } from '../src/content/pageMeta.ts';

export interface RouteSeo { path: string; title: string; description: string; h1: string; paragraphs: string[]; links: { href: string; label: string }[]; jsonLd?: object[] }

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Prevents "</script>" inside JSON-LD from closing the tag early. */
const safeJson = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');

export function buildRoutes(siteUrl: string): RouteSeo[] {
  const routes: RouteSeo[] = [];
  const toolLinks = toolMeta.map((t) => ({ href: `/tools/${t.slug}`, label: t.name }));
  routes.push({
    path: '/', title: fullTitle(HOME_META.title, true), description: HOME_META.description, h1: 'Smart Tools. Simple Solutions.',
    paragraphs: ['Discover free, easy-to-use online tools that make everyday tasks simpler.'], links: toolLinks,
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'ToolNest', url: siteUrl }]
  });
  const staticText: Record<string, string> = {
    '/tools': 'Every free ToolNest tool in one place.', '/categories': 'Browse tools by category.',
    '/about': 'ToolNest is a free digital toolkit for everyday tasks.', '/contact': 'Questions, bug reports or ideas for new tools are welcome.',
    '/privacy': 'How ToolNest handles your data.', '/terms': 'The terms for using ToolNest.', '/disclaimer': 'Limits on the information and results provided by ToolNest.'
  };
  for (const [path, m] of Object.entries(staticPageMeta)) {
    routes.push({ path, title: fullTitle(m.title), description: m.description, h1: m.title, paragraphs: [staticText[path] ?? m.description], links: path === '/tools' ? toolLinks : [] });
  }
  for (const c of categoryMeta) {
    const m = categoryPageMeta(c.name, c.description);
    routes.push({ path: `/categories/${c.id}`, title: fullTitle(m.title), description: m.description, h1: c.name, paragraphs: [c.description],
      links: toolMeta.filter((t) => t.category === c.id).map((t) => ({ href: `/tools/${t.slug}`, label: t.name })) });
  }
  for (const t of toolMeta) {
    const m = toolPageMeta(t.name, t.intro);
    const cat = categoryMeta.find((c) => c.id === t.category)!;
    const content = toolContent[t.slug];
    const url = `${siteUrl}/tools/${t.slug}`;
    const jsonLd: object[] = [
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, description: t.intro, url, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: cat.name, item: `${siteUrl}/categories/${cat.id}` },
        { '@type': 'ListItem', position: 3, name: t.name, item: url }
      ] }
    ];
    if (content?.faq.length) jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: content.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    routes.push({
      path: `/tools/${t.slug}`, title: fullTitle(m.title), description: m.description, h1: t.name,
      paragraphs: [t.intro, ...(content ? [`How it works: ${content.howItWorks}`] : [])],
      links: (content?.related ?? []).map((s) => toolMeta.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x)).map((x) => ({ href: `/tools/${x.slug}`, label: x.name })),
      jsonLd
    });
  }
  return routes;
}

export function buildSitemap(paths: string[], siteUrl: string, lastmod: string): string {
  const urls = paths.map((p) => `  <url><loc>${escapeHtml(siteUrl + (p === '/' ? '/' : p))}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const buildRobots = (siteUrl: string) => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

/** Inject per-route SEO tags and a no-JavaScript content block into the built index.html. */
export function renderRoute(template: string, r: RouteSeo, siteUrl: string): string {
  const url = r.path === '/' ? `${siteUrl}/` : `${siteUrl}${r.path}`;
  const t = escapeHtml(r.title), d = escapeHtml(r.description), u = escapeHtml(url);
  const head = [
    `<link rel="canonical" href="${u}" />`,
    `<meta property="og:title" content="${t}" />`, `<meta property="og:description" content="${d}" />`,
    `<meta property="og:type" content="website" />`, `<meta property="og:url" content="${u}" />`,
    `<meta property="og:site_name" content="ToolNest" />`, `<meta property="og:image" content="${escapeHtml(siteUrl)}/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(r.jsonLd ? [`<script id="jsonld" type="application/ld+json">${safeJson(r.jsonLd.length === 1 ? r.jsonLd[0] : r.jsonLd)}</script>`] : [])
  ].join('\n    ');
  const links = r.links.length ? `<ul>${r.links.map((l) => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`).join('')}</ul>` : '';
  const noscript = `<noscript><main><h1>${escapeHtml(r.h1)}</h1>${r.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}${links}<p>ToolNest needs JavaScript to run its tools.</p></main></noscript>`;
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${t}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${d}" />`);
  html = html.replace('</head>', () => `    ${head}\n  </head>`);
  html = html.replace('<div id="root"></div>', () => `<div id="root"></div>\n    ${noscript}`);
  return html;
}
