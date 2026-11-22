import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Tool } from '../registry/types';
import { getCategory } from '../registry/categories';
import { toolPath } from '../registry/tools';
import { useFavorites } from '../hooks/useFavorites';

export function ToolCard({ tool }: { tool: Tool }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(tool.slug);
  const Icon = tool.icon;
  return (
    <div className="card relative flex h-full flex-col p-5 transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => toggle(tool.slug)}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
        className="absolute right-3 top-3 rounded-full p-1.5 text-muted hover:text-rose-500"
      >
        <Heart size={18} className={fav ? 'fill-rose-500 text-rose-500' : ''} aria-hidden />
      </button>
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal-dark dark:text-teal">
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="pr-8 text-base font-semibold text-navy dark:text-white">
        <Link to={toolPath(tool)} className="after:absolute after:inset-0 after:content-['']">{tool.name}</Link>
      </h3>
      <p className="mt-1 flex-1 text-sm text-muted">{tool.description}</p>
      <span className="mt-3 inline-block w-fit rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted dark:bg-slate-800">
        {getCategory(tool.category)?.name}
      </span>
    </div>
  );
}

export function ToolGrid({ items }: { items: Tool[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <li key={t.slug}>
          <ToolCard tool={t} />
        </li>
      ))}
    </ul>
  );
}
