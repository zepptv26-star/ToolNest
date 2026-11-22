import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Logo } from './Logo';
import { SearchBox } from './SearchBox';
import { useTheme } from '../hooks/useTheme';

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/tools', label: 'All Tools' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { dark, toggle } = useTheme();
  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'text-teal-dark dark:text-teal' : 'text-ink hover:text-teal-dark dark:text-slate-200'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white dark:border-slate-700 dark:bg-[#0E1A2B]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-white focus:p-2">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Logo />
        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={link}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden w-64 lg:block"><SearchBox placeholder="Search tools" /></div>
          <button type="button" className="rounded-lg p-2.5 hover:bg-surface dark:hover:bg-slate-800 lg:hidden" onClick={() => setSearch((s) => !s)} aria-label="Toggle search" aria-expanded={search}>
            <Search size={20} aria-hidden />
          </button>
          <button type="button" className="rounded-lg p-2.5 hover:bg-surface dark:hover:bg-slate-800" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
          </button>
          <button type="button" className="rounded-lg p-2.5 hover:bg-surface dark:hover:bg-slate-800 md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Toggle menu" aria-expanded={menu}>
            {menu ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>
      {search && <div className="border-t border-line px-4 py-3 lg:hidden dark:border-slate-700"><SearchBox autoFocus /></div>}
      {menu && (
        <nav aria-label="Mobile" className="border-t border-line px-4 py-2 md:hidden dark:border-slate-700">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="block rounded-md px-3 py-3 text-base font-medium hover:bg-surface dark:hover:bg-slate-800">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
