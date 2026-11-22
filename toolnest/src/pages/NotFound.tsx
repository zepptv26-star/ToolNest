import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'The page you requested could not be found.', path: '/404' });
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="btn-primary">Go to homepage</Link>
        <Link to="/tools" className="btn-secondary">Browse all tools</Link>
      </div>
    </div>
  );
}
