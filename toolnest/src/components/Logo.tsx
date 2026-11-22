import { Link } from 'react-router-dom';
import { site } from '../config/site';

/**
 * Approved ToolNest logo: the symbol is an image (public/logo-icon.png) and the
 * wordmark is live text so it adapts to light/dark themes. The symbol's navy half
 * disappears on dark backgrounds, so it sits on a white tile there.
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <img
        src="/logo-icon.png"
        alt=""
        width={40}
        height={42}
        className={`h-10 w-auto rounded-lg ${onDark ? 'bg-white p-1' : 'dark:bg-white dark:p-1'}`}
      />
      <span className={`text-xl font-bold tracking-tight ${onDark ? 'text-white' : 'text-navy dark:text-white'}`}>
        Tool<span className="text-teal">Nest</span>
      </span>
    </Link>
  );
}
