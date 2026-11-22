import { useEffect } from 'react';
import { site } from '../config/site';

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets title, description, canonical, Open Graph and JSON-LD for the current route. */
export function useSeo({ title, description, path, jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} | ${site.name}`;
    const url = `${site.url}${path === '/' ? '' : path}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', `${site.url}/og-image.png`);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', site.name);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const old = document.getElementById('jsonld');
    old?.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.id = 'jsonld';
      s.type = 'application/ld+json';
      s.text = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
    return () => document.getElementById('jsonld')?.remove();
  }, [title, description, path, jsonLd]);
}
