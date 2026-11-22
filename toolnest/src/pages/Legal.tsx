import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSeo } from '../lib/seo';
import { site } from '../config/site';
import { useConsent } from '../hooks/useConsent';
import { staticPageMeta } from '../content/pageMeta';

function LegalPage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  useSeo({ ...staticPageMeta[path], path });
  return (
    <article className="max-w-3xl [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy dark:[&_h2]:text-white [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
      <h1 className="text-3xl font-bold text-navy dark:text-white">{title}</h1>
      <p className="text-sm text-muted">Last updated: {site.lastUpdated}</p>
      {children}
    </article>
  );
}

const ContactLine = () => (
  <p>
    Questions about this page? Please use our <Link to="/contact" className="text-teal-dark underline dark:text-teal">contact page</Link>
    {site.contactEmail ? <> or email <a className="text-teal-dark underline dark:text-teal" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></> : null}.
  </p>
);

export function Privacy() {
  const { needed, reopen } = useConsent();
  const analytics = Boolean(site.analyticsId);
  const ads = Boolean(site.adsenseClientId);
  return (
    <LegalPage title="Privacy Policy" path="/privacy">
      <p>{site.name} is built to work without collecting personal information. This page explains what happens to your data when you use the site.</p>

      <h2>Your inputs stay in your browser</h2>
      <p>Calculators, converters, the word counter, text comparison, the timers and the image tools run on your device. The numbers, text and images you enter are not sent to our servers and are not stored by us. Images you choose are processed locally and never uploaded.</p>

      <h2>The one tool that contacts another service</h2>
      <p>The Currency Converter requests exchange rates from the Frankfurter service (which republishes European Central Bank reference rates). The request contains a currency code, not your amount. As with any website request, that service can see your IP address and browser details. Its own privacy practices apply.</p>

      <h2>Information stored on your device</h2>
      <p>To remember your preferences, {site.name} uses your browser's local storage for:</p>
      <ul>
        <li>your favorite tools,</li>
        <li>counts of which tools you visit, used only to show “Frequently used by you”,</li>
        <li>your light or dark theme choice{needed ? ', and' : '.'}</li>
        {needed && <li>your cookie choice.</li>}
      </ul>
      <p>This information never leaves your device. You can remove it at any time by clearing this site's data in your browser settings. We do not store financial inputs.</p>

      <h2>Accounts</h2>
      <p>No account or registration is needed to use any tool, and we do not ask for your name or email address to use the site.</p>

      <h2>Hosting and server logs</h2>
      <p>Like most websites, our hosting provider may automatically record technical information such as IP address, requested page, browser type and time for security and reliability. We do not use these logs to identify individual visitors.</p>

      <h2>Analytics and advertising</h2>
      {!analytics && !ads && <p>At the time of writing, {site.name} does not use analytics or advertising cookies or trackers. If we add them in future, we will update this page and ask for your consent first where required.</p>}
      {analytics && <p><strong>Analytics.</strong> With your consent, we use Google Analytics to understand which pages are used, in aggregate. It may set cookies and collect data such as your approximate location, device and pages viewed. It is not loaded unless you accept.</p>}
      {ads && <p><strong>Advertising.</strong> With your consent, we show ads from Google AdSense. Google and its partners may use cookies to serve and measure ads, including personalized ads where permitted. Ads are not loaded unless you accept. You can learn more and manage ad personalization at Google's ad settings pages.</p>}
      {needed && <p><button type="button" onClick={reopen} className="btn-secondary !py-2">Change my cookie choice</button></p>}

      <h2>Links to other sites</h2>
      <p>If we link to other websites, they have their own privacy practices that we do not control.</p>

      <h2>Children</h2>
      <p>{site.name} is a general-purpose utility site and is not directed at young children. We do not knowingly collect personal information from children.</p>

      <h2>Your rights</h2>
      <p>Because we do not collect personal information through the tools, there is generally nothing for us to access or delete. Depending on where you live, you may have rights over any data that is processed (for example by analytics or advertising partners, if enabled). You can exercise them through those providers' tools or by contacting us.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this page when the site changes. The date at the top shows when it was last revised.</p>
      <ContactLine />
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Use" path="/terms">
      <p>By using {site.name} you agree to these terms. If you do not agree, please do not use the site.</p>

      <h2>Use of the tools</h2>
      <p>The tools are provided free of charge for personal and business use. You agree to use them lawfully and not to misuse the site, for example by trying to disrupt it, overload it with automated requests, or attempt to gain unauthorized access.</p>

      <h2>Results are estimates</h2>
      <p>Calculators, converters and timers are designed to be accurate, but results may contain errors or differ from official figures. Check anything important with a qualified source before relying on it. See our <Link to="/disclaimer" className="text-teal-dark underline dark:text-teal">Disclaimer</Link>.</p>

      <h2>Your content</h2>
      <p>Text and images you enter or choose are processed in your browser. You remain responsible for having the right to use any images or text you work with.</p>

      <h2>Third-party services</h2>
      <p>Some features, such as exchange rates, rely on third-party services. We do not control them and cannot guarantee their availability or accuracy.</p>

      <h2>Intellectual property</h2>
      <p>The {site.name} name, logo, design and original content belong to the site owner. You may link to the site. Please do not copy or republish its content or code without permission.</p>

      <h2>No warranty</h2>
      <p>The site and tools are provided “as is” and “as available”, without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy, or uninterrupted availability.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, the site owner is not liable for any loss or damage arising from your use of, or inability to use, the site or its tools, including decisions made based on results. Nothing in these terms limits liability that cannot be limited by law.</p>

      <h2>Changes</h2>
      <p>We may change the site, the tools or these terms at any time. Continued use after a change means you accept the updated terms.</p>
      <ContactLine />
    </LegalPage>
  );
}

export function Disclaimer() {
  return (
    <LegalPage title="Disclaimer" path="/disclaimer">
      <p>The information and results on {site.name} are for general information and convenience only.</p>

      <h2>Not professional advice</h2>
      <p>Nothing on this site is financial, investment, tax, legal, medical or other professional advice. Please consult a qualified professional before making decisions that matter.</p>

      <h2>Financial calculators</h2>
      <p>The loan, savings, compound interest, discount and profit margin calculators give estimates based on the assumptions shown on each page, such as a fixed rate and regular payments. Real products have fees, taxes and changing rates. We do not promise or predict any financial return.</p>

      <h2>Health information</h2>
      <p>The BMI calculator is an educational screening tool. It is not a medical diagnosis and does not account for muscle mass, age, sex or individual health conditions. Speak to a healthcare professional about your health.</p>

      <h2>Exchange rates</h2>
      <p>Currency rates are daily reference rates from a third-party service and may be out of date. They are not live trading rates, and banks and payment providers use their own rates and fees.</p>

      <h2>Cooking measurements</h2>
      <p>Weight conversions for ingredients are typical averages. Actual weights vary, so use a scale where precision matters.</p>

      <h2>Timers and alarms</h2>
      <p>The stopwatch, countdown timer and alarm clock run only while the page is open and may be affected by your browser, device settings, battery saving or volume. Do not rely on them for safety-critical, medical or time-critical purposes.</p>

      <h2>Image tools</h2>
      <p>Resized and compressed images may lose quality. Keep your original files, and make sure you have the right to modify any image you use.</p>
      <ContactLine />
    </LegalPage>
  );
}
