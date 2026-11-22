import { useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchTools } from '../lib/search';
import { toolPath } from '../registry/tools';
import { getCategory } from '../registry/categories';

interface Props { large?: boolean; placeholder?: string; autoFocus?: boolean }

/** Global search combobox: instant results, keyboard navigable, jumps straight to a tool. */
export function SearchBox({ large = false, placeholder = 'What do you need help with?', autoFocus }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (query.trim() ? searchTools(query).slice(0, 6) : []), [query]);

  const go = (slug: string) => {
    setOpen(false);
    setQuery('');
    navigate(toolPath({ slug }));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) go(results[active].slug);
      else if (query.trim()) { setOpen(false); navigate(`/tools?q=${encodeURIComponent(query.trim())}`); }
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      <Search size={large ? 22 : 18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
      <input
        type="search"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label="Search tools"
        autoFocus={autoFocus}
        value={query}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        className={`input pl-12 ${large ? 'py-4 text-lg shadow-card' : ''}`}
      />
      {open && query.trim() && (
        <ul id={listId} role="listbox" className="card absolute z-30 mt-2 w-full overflow-hidden p-1">
          {results.length === 0 && <li className="px-4 py-3 text-sm text-muted">No tools match “{query}”.</li>}
          {results.map((t, i) => (
            <li key={t.slug} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t.slug)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${i === active ? 'bg-teal/10' : ''}`}
              >
                <t.icon size={18} className="text-teal-dark dark:text-teal" aria-hidden />
                <span className="flex-1 text-sm font-medium">{t.name}</span>
                <span className="text-xs text-muted">{getCategory(t.category)?.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
