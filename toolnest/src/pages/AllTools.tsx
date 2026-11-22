import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ToolGrid } from '../components/ToolCard';
import { SearchBox } from '../components/SearchBox';
import { categories } from '../registry/categories';
import { tools } from '../registry/tools';
import { searchTools } from '../lib/search';
import { useSeo } from '../lib/seo';
import { staticPageMeta } from '../content/pageMeta';

export default function AllTools() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('category') ?? 'all';
  const sort = params.get('sort') === 'za' ? 'za' : 'az';

  useSeo({ ...staticPageMeta['/tools'], path: '/tools' });

  const items = useMemo(() => {
    const pool = cat === 'all' ? tools : tools.filter((t) => t.category === cat);
    const found = q ? searchTools(q, pool) : [...pool].sort((a, b) => a.name.localeCompare(b.name));
    if (!q && sort === 'za') found.reverse();
    return found;
  }, [q, cat, sort]);

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'All Tools' }]} />
      <h1 className="text-3xl font-bold text-navy dark:text-white">All Tools</h1>
      <p className="mt-2 text-muted">{tools.length} free tools. Filter by category or search by name or keyword.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="filter" className="label">Filter this list</label>
          <input id="filter" type="search" className="input" placeholder="e.g. mortgage, resize, timer" value={q} onChange={(e) => set('q', e.target.value)} />
        </div>
        <div>
          <label htmlFor="sort" className="label">Sort</label>
          <select id="sort" className="input" value={sort} onChange={(e) => set('sort', e.target.value)} disabled={Boolean(q)}>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Category filter">
        {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
          <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => set('category', c.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${cat === c.id ? 'border-teal bg-teal text-navy' : 'border-line bg-white hover:bg-surface dark:border-slate-600 dark:bg-transparent'}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-medium">No tools match your search.</p>
            <p className="mt-1 text-sm text-muted">Try a different keyword or clear the category filter.</p>
            <div className="mx-auto mt-4 max-w-sm"><SearchBox /></div>
          </div>
        ) : <ToolGrid items={items} />}
      </div>
    </>
  );
}
