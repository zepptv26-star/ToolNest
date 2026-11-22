import { Link } from 'react-router-dom';
import { useConsent } from '../hooks/useConsent';

/** Shown only when analytics or advertising is configured and the visitor has not chosen yet. */
export function ConsentBanner() {
  const { needed, status, grant, deny } = useConsent();
  if (!needed || status !== 'unset') return null;
  return (
    <div role="dialog" aria-label="Cookie and privacy choices" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-[#14243B]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm">
          We would like to use cookies for analytics and advertising. The tools work fully without them. See our <Link to="/privacy" className="font-medium text-teal-dark underline dark:text-teal">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary !py-2" onClick={deny}>Decline</button>
          <button type="button" className="btn-primary !py-2" onClick={grant}>Accept</button>
        </div>
      </div>
    </div>
  );
}
