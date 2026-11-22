import { Suspense, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ToolGrid } from '../components/ToolCard';
import { AdSlot } from '../components/AdSlot';
import { getCategory } from '../registry/categories';
import { getTool, toolPath, toolsByCategory } from '../registry/tools';
import { toolContent } from '../content/toolContent';
import { toolPageMeta } from '../content/pageMeta';
import { toolComponents } from '../tools';
import { useFavorites } from '../hooks/useFavorites';
import { useUsage } from '../hooks/useUsage';
import { useSeo } from '../lib/seo';
import { site } from '../config/site';
import type { Tool } from '../registry/types';
import NotFound from './NotFound';

export default function ToolPage() {
  const { slug = '' } = useParams();
  const tool = getTool(slug);
  const { isFavorite, toggle } = useFavorites();
  const { record } = useUsage();
  const category = tool ? getCategory(tool.category) : undefined;
  const content = tool ? toolContent[tool.slug] : undefined;

  const jsonLd = useMemo(() => {
    if (!tool || !category) return undefined;
    const url = `${site.url}${toolPath(tool)}`;
    const graph: object[] = [
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.name, description: tool.intro, url, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: category.name, item: `${site.url}/categories/${category.id}` },
        { '@type': 'ListItem', position: 3, name: tool.name, item: url }
      ] }
    ];
    if (content?.faq.length) {
      graph.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: content.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    }
    return graph;
  }, [tool, category, content]);

  const meta = tool ? toolPageMeta(tool.name, tool.intro) : { title: 'Tool not found', description: 'This tool does not exist.' };
  useSeo({ ...meta, path: tool ? toolPath(tool) : `/tools/${slug}`, jsonLd });

  useEffect(() => { if (tool) record(tool.slug); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tool?.slug]);

  if (!tool || !category) return <NotFound />;
  const Component = toolComponents[tool.slug];
  const fav = isFavorite(tool.slug);
  const related: Tool[] = (content?.related ?? [])
    .map(getTool).filter((t): t is Tool => Boolean(t))
    .concat(toolsByCategory(tool.category).filter((t) => t.slug !== tool.slug))
    .filter((t, i, arr) => t.slug !== tool.slug && arr.findIndex((x) => x.slug === t.slug) === i)
    .slice(0, 3);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: category.name, to: `/categories/${category.id}` }, { label: tool.name }]} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-muted">{tool.intro}</p>
        </div>
        <button type="button" onClick={() => toggle(tool.slug)} aria-pressed={fav} className="btn-secondary shrink-0">
          <Heart size={16} className={fav ? 'fill-rose-500 text-rose-500' : ''} aria-hidden /> {fav ? 'Saved' : 'Save'}
        </button>
      </div>

      <section className="card mt-6 p-5 sm:p-8" aria-label={`${tool.name} tool`}>
        {Component ? (
          <Suspense fallback={<p className="text-muted" role="status">Loading tool…</p>}><Component /></Suspense>
        ) : (
          <p className="text-sm text-muted" role="status">This tool is not available yet.</p>
        )}
      </section>

      <AdSlot placement="in-content" className="mt-8" />

      {content && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-10">
            <section aria-labelledby="how-to">
              <h2 id="how-to" className="text-xl font-bold text-navy dark:text-white">How to use the {tool.name}</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-6">
                {content.howTo.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </section>
            <section aria-labelledby="how-works">
              <h2 id="how-works" className="text-xl font-bold text-navy dark:text-white">How the calculation works</h2>
              <p className="mt-3">{content.howItWorks}</p>
            </section>
            <section aria-labelledby="faq">
              <h2 id="faq" className="text-xl font-bold text-navy dark:text-white">Frequently asked questions</h2>
              <div className="mt-3 space-y-3">
                {content.faq.map((f) => (
                  <details key={f.q} className="card group p-4">
                    <summary className="cursor-pointer font-medium text-navy dark:text-white">{f.q}</summary>
                    <p className="mt-2 text-sm text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
          <aside aria-label="Sidebar"><AdSlot placement="sidebar" /></aside>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="mb-4 text-xl font-bold text-navy dark:text-white">Related tools</h2>
          <ToolGrid items={related} />
        </section>
      )}
      <p className="mt-8 text-sm"><Link to="/tools" className="text-teal-dark hover:underline dark:text-teal">← Back to all tools</Link></p>
    </>
  );
}
