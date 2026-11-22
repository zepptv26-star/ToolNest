const env = import.meta.env;

export const site = {
  name: 'ToolNest',
  tagline: 'Smart Tools. Simple Solutions.',
  description: 'Discover free, easy-to-use online tools that make everyday tasks simpler.',
  url: ((env.VITE_SITE_URL as string) || 'https://www.example.com').replace(/\/$/, ''),
  contactEmail: (env.VITE_CONTACT_EMAIL as string) || '',
  adSlots: {
    'header-banner': (env.VITE_ADSENSE_SLOT_HEADER as string) || '',
    'in-content': (env.VITE_ADSENSE_SLOT_IN_CONTENT as string) || '',
    sidebar: (env.VITE_ADSENSE_SLOT_SIDEBAR as string) || '',
    'footer-banner': (env.VITE_ADSENSE_SLOT_FOOTER as string) || ''
  } as Record<string, string>,
  analyticsId: (env.VITE_GA_MEASUREMENT_ID as string) || '',
  adsenseClientId: (env.VITE_ADSENSE_CLIENT_ID as string) || '',
  lastUpdated: '22 November 2026',
  socials: [
    { label: 'X', href: (env.VITE_SOCIAL_X as string) || '' },
    { label: 'Facebook', href: (env.VITE_SOCIAL_FACEBOOK as string) || '' },
    { label: 'LinkedIn', href: (env.VITE_SOCIAL_LINKEDIN as string) || '' },
    { label: 'YouTube', href: (env.VITE_SOCIAL_YOUTUBE as string) || '' }
  ].filter((s) => s.href)
};
