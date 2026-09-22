import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fullTitle, metaForRoute } from '../config/seo';
import { bootstrap } from '../lib/bootstrap';

/** Set (or create) a <meta> tag in the head. */
function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Keeps the title, description and canonical in step with the route.
 *
 * WordPress prints all three server-side, which is what a crawler sees first.
 * This is for everything after that: moving between pages inside the app never
 * reloads the document, so without it every page after the first would keep
 * the title of the one the visitor arrived on, including in their history,
 * their bookmarks and anything they share.
 *
 * Where the values come from is decided in src/config/seo.ts: an SEO plugin's
 * per-page settings when there is one, the app's own wording when there isn't.
 * Either way this sets the same thing the server would have.
 *
 * A route with nothing listed for it (a product page, a 404) is left alone
 * rather than given a wrong title; the page that owns it sets its own.
 */
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForRoute(pathname);
    if (!meta) return;

    const title = fullTitle(meta);
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', meta.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);

    // Canonical, so the same page reached with tracking parameters on the URL
    // isn't treated as a second copy of it. A canonical the clinic has set on
    // the page itself in its SEO plugin wins, since that's a deliberate choice
    // about where the page's authority should go.
    const base = bootstrap.siteUrl || window.location.origin;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = meta.canonical || new URL(pathname, base).href;
  }, [pathname]);

  return null;
}
