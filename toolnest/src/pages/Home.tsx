import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SearchBox } from '../components/SearchBox';
import { ToolGrid } from '../components/ToolCard';
import { AdSlot } from '../components/AdSlot';
import { categories } from '../registry/categories';
import { getTool, tools, toolsByCategory } from '../registry/tools';
import { useFavorites } from '../hooks/useFavorites';
import { useUsage } from '../hooks/useUsage';
import { useSeo } from '../lib/seo';
import { site } from '../config/site';
import { HOME_META } from '../content/pageMeta';
import type { Tool } from '../registry/types';

export default function Home() {
  const { favorites } = useFavorites();
  const { topSlugs } = useUsage();
  useSeo({
    title: HOME_META.title,
    description: HOME_META.description,
    path: '/',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url }
  });

  const popular = tools.filter((t) => t.popular).slice(0, 6);
  const recent = [...tools].sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name)).slice(0, 6);
  const pick = (slugs: string[]) => slugs.map(getTool).filter((t): t is Tool => Boolean(t));
  const used = pick(topSlugs());
  const saved = pick(favorites);

  return (
    <>
      <section className="rounded-2xl bg-navy px-6 py-14 text-center sm:py-20">
        <h1 className="text-3xl font-bold text-white sm:text-5xl">{site.tagline}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 sm:text-lg">{site.description}</p>
        <div className="mx-auto mt-8 max-w-2xl text-left"><SearchBox large /></div>
        <Link to="/tools" className="btn-primary mt-6">Browse All Tools <ArrowRight size={16} aria-hidden /></Link>
      </section>

      {saved.length > 0 && (
        <section className="mt-12" aria-labelledby="fav">
          <h2 id="fav" className="mb-4 text-2xl font-bold text-navy dark:text-white">Your favorites</h2>
          <ToolGrid items={saved} />
        </section>
      )}

      <section className="mt-12" aria-labelledby="popular">
        <h2 id="popular" className="mb-4 text-2xl font-bold text-navy dark:text-white">Popular tools</h2>
        <ToolGrid items={popular} />
      </section>

      <AdSlot placement="in-content" className="mt-12" />

      <section className="mt-12" aria-labelledby="cats">
        <h2 id="cats" className="mb-4 text-2xl font-bold text-navy dark:text-white">Browse by category</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/categories/${c.id}`} className="card flex h-full items-start gap-4 p-5 transition-shadow hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-teal"><c.icon size={22} aria-hidden /></span>
                <span>
                  <span className="block font-semibold text-navy dark:text-white">{c.name}</span>
                  <span className="block text-sm text-muted">{c.description}</span>
                  <span className="mt-1 block text-xs font-medium text-teal-dark dark:text-teal">{toolsByCategory(c.id).length} tools</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {used.length > 0 && (
        <section className="mt-12" aria-labelledby="used">
          <h2 id="used" className="mb-1 text-2xl font-bold text-navy dark:text-white">Frequently used by you</h2>
          <p className="mb-4 text-sm text-muted">Based on visits stored only in this browser.</p>
          <ToolGrid items={used} />
        </section>
      )}

      <section className="mt-12" aria-labelledby="recent">
        <h2 id="recent" className="mb-4 text-2xl font-bold text-navy dark:text-white">Recently added</h2>
        <ToolGrid items={recent} />
      </section>
    </>
  );
}
