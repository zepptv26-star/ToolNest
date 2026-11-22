import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { site } from '../config/site';
import { categories } from '../registry/categories';
import { useConsent } from '../hooks/useConsent';

export function Footer() {
  const { needed, reopen } = useConsent();
  return (
    <footer className="mt-16 bg-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo onDark />
          <p className="mt-3 text-sm">{site.tagline}</p>
          <p className="mt-2 text-sm text-slate-400">Free, practical online tools for everyday needs.</p>
        </div>
        <nav aria-label="Categories">
          <h2 className="mb-3 text-sm font-semibold text-white">Categories</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}><Link className="hover:text-teal" to={`/categories/${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="ToolNest">
          <h2 className="mb-3 text-sm font-semibold text-white">ToolNest</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-teal" to="/about">About ToolNest</Link></li>
            <li><Link className="hover:text-teal" to="/tools">All Tools</Link></li>
            <li><Link className="hover:text-teal" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-teal" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-teal" to="/terms">Terms of Use</Link></li>
            <li><Link className="hover:text-teal" to="/disclaimer">Disclaimer</Link></li>
            {needed && <li><button type="button" className="hover:text-teal" onClick={reopen}>Cookie settings</button></li>}
          </ul>
        </nav>
        {site.socials.length > 0 && (
          <nav aria-label="Social media">
            <h2 className="mb-3 text-sm font-semibold text-white">Follow</h2>
            <ul className="space-y-2 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}><a className="hover:text-teal" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
