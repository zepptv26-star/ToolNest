# ToolNest

**Smart Tools. Simple Solutions.** A free online toolkit of 20 practical tools, built with React, TypeScript, Vite and Tailwind CSS. Everything runs in the browser; there is no backend and no sign-up.

> **Status:** Phases 1 to 4 are written. All calculation logic and the SEO build step have automated tests (27 passing). The React screens have **not yet been built or tested in a real browser**; do the checklist in *Before you launch* first.

## Tools
Calculators: Age, BMI, Percentage, Discount, Loan. Converters: Currency, Unit, Temperature, Cooking, Data Storage. Text: Word Counter, Text Comparison. Image: Resizer, Compressor. Finance: Savings, Compound Interest, Profit Margin. Productivity: Stopwatch, Countdown Timer, Alarm Clock.

## Technology stack
React 18, TypeScript (strict), Vite 5, Tailwind CSS 3, React Router 6, Lucide icons. Node 22.6 or newer is needed for tests and the build's SEO step (`.nvmrc` pins 22).

## Install and run
```bash
npm install
cp .env.example .env      # optional: fill in what you need
npm run dev               # http://localhost:5173
```

## Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm test` | Unit tests: calculations, rate service, SEO output |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Type-check, build to `dist/`, then generate sitemap, robots.txt and per-page SEO HTML |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build and deploy to Cloudflare (see Deployment) |

## Environment variables
All are optional and **public** (Vite bundles `VITE_` variables into the browser code). Never put secret keys in them.

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Your final domain, e.g. `https://www.yourdomain.com`. **Set this before deploying**: it feeds canonical URLs, the sitemap and social tags. |
| `VITE_CONTACT_EMAIL` | Shown on Contact, Privacy, Terms and Disclaimer pages |
| `VITE_SOCIAL_X`, `_FACEBOOK`, `_LINKEDIN`, `_YOUTUBE` | Footer social links (only set ones appear) |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID (`G-XXXXXXXX`). Loads only after visitor consent. |
| `VITE_ADSENSE_CLIENT_ID` | AdSense publisher ID (`ca-pub-...`) |
| `VITE_ADSENSE_SLOT_HEADER`, `_IN_CONTENT`, `_SIDEBAR`, `_FOOTER` | Ad unit IDs per placement |

## API configuration
Only the Currency Converter calls an external service: the free **Frankfurter** API (European Central Bank reference rates, no key). The service layer is `src/services/exchangeRates.ts`. It handles timeouts, HTTP errors and malformed responses, caches rates for 10 minutes, and the tool shows an error plus manual rate entry if rates are unavailable. Rates update on working days and are reference rates, not live quotes. To use another provider, change that one file. If you ever need an API with a secret key, put it behind your own server or a Cloudflare Worker, never in frontend code.

## Deployment (Cloudflare Workers with static assets)
1. Create a free Cloudflare account and push this project to a Git repository.
2. **Dashboard method:** Workers & Pages → Create → connect your repo. Build command `npm run build`, output/assets directory `dist`. Add `VITE_SITE_URL` (and any other variables) under Build variables. Set `NODE_VERSION` to `22`.
3. **Command-line method:** `npx wrangler login`, then `npm run deploy`. `wrangler.jsonc` already points at `dist` and enables the single-page-app fallback.
4. Add your custom domain in the Cloudflare dashboard (HTTPS is automatic).
5. Static hosting on Cloudflare Pages also works: build command `npm run build`, output `dist`, plus a `_redirects` file containing `/* /index.html 200`. Any other static host (Netlify, Vercel, GitHub Pages) works the same way with an SPA fallback.

`public/_headers` adds basic security headers and long-term caching for hashed assets. A Content-Security-Policy is deliberately not enabled because it could not be tested here, and a wrong policy silently breaks features. Once the site is running, consider adding one, allowing `connect-src https://api.frankfurter.dev`, `img-src 'self' data: blob:`, inline styles, and the Google domains only if you enable analytics or ads.

## SEO
- `npm run build` writes `sitemap.xml`, `robots.txt` and a separate HTML file per page (34 pages) with its own title, meta description, canonical URL, Open Graph tags, JSON-LD (WebApplication, BreadcrumbList, FAQPage) and a short no-JavaScript text block. The React app then takes over in the browser.
- Search engines still need JavaScript to see the tools' full page content. Google handles this, but this setup does not guarantee rankings. A framework with full server-side rendering (for example Astro or Next.js) could be considered if SEO becomes the main growth channel.
- **Google Search Console:** add your domain, verify it (DNS record is easiest with Cloudflare), then submit `https://yourdomain/sitemap.xml`.
- **Google Analytics:** create a GA4 property, put its `G-` ID in `VITE_GA_MEASUREMENT_ID`, rebuild. The script loads only after a visitor accepts, and page views are sent on route changes.

## Monetization readiness
- `AdSlot` renders four reserved placements (header, in-content, sidebar, footer). It shows **nothing** until an AdSense client ID, the slot ID for that placement and visitor consent are all present. No ad script is loaded before then. Do not enable ads until your AdSense account is approved.
- **Important:** for visitors in the EEA, UK and Switzerland, Google requires a Google-certified consent management platform for AdSense. The built-in banner is a simple accept/decline for this site's own scripts and is **not** a certified CMP. Set up Google's Privacy & messaging tool (or another certified CMP) before turning ads on.
- Affiliate links, sponsored listings and premium features can be added later without restructuring: add entries to the tool registry and new components in `src/components/`.

## Legal pages
`/privacy`, `/terms` and `/disclaimer` are written to match what the site actually does today (the Privacy Policy adapts automatically if analytics or ads are configured). They are general-purpose drafts, **not legal advice**. Have a lawyer review them before launch, especially to add the business's legal name, a governing-law clause and any rules for the countries you target.

## Adding a new tool
1. Add its metadata to `src/registry/toolMeta.ts` and an icon in `src/registry/tools.ts`.
2. Create the component in `src/tools/` and map its slug in `src/tools/index.ts`.
3. Add help content (how to use, how it works, FAQ, related) in `src/content/toolContent.ts`.
4. Put any calculation logic in `src/lib/calc/` with tests in `tests/`. Home, search, categories, sitemap and SEO pages update automatically; `npm test` checks that every tool has content, a unique title and description.
New categories are added in `toolMeta.ts` (`categoryMeta`) and `categories.ts`.

## Privacy by design
Tool inputs stay in the browser. Local storage holds only favorites, local visit counts, theme and the cookie choice. No financial inputs are stored. Images are processed on-device.

## Project layout
`src/registry` (tool and category data) · `src/tools` (the 20 tools) · `src/lib/calc` (tested logic) · `src/services` (exchange rates) · `src/content` (help text and page metadata) · `src/components`, `src/pages`, `src/hooks` · `scripts` (build-time SEO) · `tests`.

## Before you launch (manual browser checklist)
Automated tests cover calculations, the rate service and SEO output. Please also check by hand with `npm run dev` and `npm run preview`:
- Browser console is free of errors on every page; every link and button works.
- Search, category filters, sorting and favorites; mobile, tablet and desktop layouts; dark mode.
- Image Resizer and Compressor: upload a JPEG, PNG and WebP, check preview and download, and try a non-image file.
- Currency Converter: works online, shows the error state offline, and manual rate entry works.
- Timers: stopwatch laps, countdown pause and resume, sound, and the alarm ringing while the tab is open.
- Keyboard-only navigation and screen-reader labels on forms.
- Run Lighthouse (performance, accessibility, SEO) on the home page and two tool pages.
