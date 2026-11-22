import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSeo } from '../lib/seo';
import { site } from '../config/site';
import { staticPageMeta } from '../content/pageMeta';

export function About() {
  useSeo({ ...staticPageMeta['/about'], path: '/about' });
  return (
    <article className="prose-content max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
      <h1 className="text-3xl font-bold text-navy dark:text-white">About ToolNest</h1>
      <p className="mt-4 text-lg text-muted">{site.tagline}</p>
      <p className="mt-4">ToolNest is a free digital toolkit for everyday tasks: calculators, converters, text and image tools, finance helpers and productivity utilities. It is built for students, teachers, freelancers, business owners, travelers and anyone who wants a quick answer without creating an account.</p>
      <h2 className="mt-8 text-xl font-bold text-navy dark:text-white">Our approach</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6">
        <li>Calculations and image processing run in your browser whenever possible.</li>
        <li>No registration is needed to use any tool.</li>
        <li>Financial and health results are estimates for general information, not advice.</li>
      </ul>
    </article>
  );
}

export function Contact() {
  useSeo({ ...staticPageMeta['/contact'], path: '/contact' });
  return (
    <article className="max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <h1 className="text-3xl font-bold text-navy dark:text-white">Contact</h1>
      <p className="mt-4">Questions, bug reports or ideas for new tools are welcome.</p>
      {site.contactEmail ? (
        <p className="mt-4"><a className="btn-primary" href={`mailto:${site.contactEmail}`}>Email {site.contactEmail}</a></p>
      ) : (
        <p className="mt-4 rounded-lg border border-line p-4 text-sm text-muted dark:border-slate-700">
          A contact email has not been configured yet. The site owner can set <code>VITE_CONTACT_EMAIL</code> in the environment settings.
        </p>
      )}
    </article>
  );
}
