/** Page titles and descriptions shared by the React pages and the build-time SEO script (no imports, so Node can load it). */
export interface PageMeta { title: string; description: string }

export const HOME_META: PageMeta = {
  title: 'ToolNest | Smart Tools. Simple Solutions.',
  description: 'Free, easy-to-use online tools: calculators, converters, text and image tools, finance and productivity. No sign-up needed.'
};

export const staticPageMeta: Record<string, PageMeta> = {
  '/tools': { title: 'All Tools', description: 'Browse every free ToolNest tool: calculators, converters, text and image tools, finance and productivity.' },
  '/categories': { title: 'Tool Categories', description: 'Browse ToolNest by category: calculators, converters, text, image, finance and productivity tools.' },
  '/about': { title: 'About Us', description: 'ToolNest provides free, practical online tools for everyday needs, with no sign-up required.' },
  '/contact': { title: 'Contact', description: 'Get in touch with the ToolNest team with questions, feedback or tool suggestions.' },
  '/privacy': { title: 'Privacy Policy', description: 'How ToolNest handles your data: tools run in your browser, no accounts, minimal local storage.' },
  '/terms': { title: 'Terms of Use', description: "The terms for using ToolNest's free online tools." },
  '/disclaimer': { title: 'Disclaimer', description: 'Important limits on the information and results provided by ToolNest tools.' }
};

export const categoryPageMeta = (name: string, description: string): PageMeta => ({
  title: `${name} Tools`,
  description: `Free online ${name.toLowerCase()} tools. ${description}`
});

export const toolPageMeta = (name: string, intro: string): PageMeta => ({ title: `${name} (Free Online)`, description: intro });

/** Final <title> text for a page (the home page already contains the brand). */
export const fullTitle = (title: string, isHome = false) => (isHome ? title : `${title} | ToolNest`);
