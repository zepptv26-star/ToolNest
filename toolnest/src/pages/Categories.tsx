import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ToolGrid } from '../components/ToolCard';
import { categories, getCategory } from '../registry/categories';
import { toolsByCategory } from '../registry/tools';
import { useSeo } from '../lib/seo';
import { categoryPageMeta, staticPageMeta } from '../content/pageMeta';
import NotFound from './NotFound';

export function CategoriesIndex() {
  useSeo({ ...staticPageMeta['/categories'], path: '/categories' });
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      <h1 className="text-3xl font-bold text-navy dark:text-white">Categories</h1>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to={`/categories/${c.id}`} className="card flex h-full items-start gap-4 p-5 hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-teal"><c.icon size={22} aria-hidden /></span>
              <span>
                <span className="block font-semibold text-navy dark:text-white">{c.name}</span>
                <span className="block text-sm text-muted">{c.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function CategoryPage() {
  const { id = '' } = useParams();
  const cat = getCategory(id);
  const meta = cat ? categoryPageMeta(cat.name, cat.description) : { title: 'Category not found', description: 'This category does not exist.' };
  useSeo({ ...meta, path: `/categories/${id}` });
  if (!cat) return <NotFound />;
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: cat.name }]} />
      <h1 className="text-3xl font-bold text-navy dark:text-white">{cat.name}</h1>
      <p className="mt-2 mb-6 text-muted">{cat.description}</p>
      <ToolGrid items={toolsByCategory(cat.id)} />
    </>
  );
}
