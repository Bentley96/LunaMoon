// Per-route page titles and meta descriptions.
//
// These are the fallback. When an SEO plugin is active, WordPress sends the
// per-page values it holds and those win — see metaForRoute below, and
// wordpress/lunamoon/inc/seo.php for the producing side.
//
// The wording lives in seo.json rather than here because two things need it:
// this module, and the WordPress theme. The build copies the file to
// dist/seo.json and inc/seo.php reads it, so the server-rendered <title> and
// the one React sets on a client-side route change always say the same thing.
//
// WordPress is the one that matters for search: a crawler gets the theme's
// <title> and <meta name="description"> in the HTML, without running any JS.
// The React side keeps them right as visitors move around the app.
//
// Product pages aren't listed — their titles come from the product itself.

import { bootstrap } from '../lib/bootstrap';
import data from './seo.json';

export interface PageMeta {
  title: string;
  description: string;
  /** A canonical the SEO plugin has set for that page, if any. */
  canonical?: string;
  /**
   * True when WordPress supplied this, which means an SEO plugin wrote it.
   * Those titles are complete as typed, so nothing is appended to them.
   */
  managed?: boolean;
}

const routes = data.routes as Record<string, PageMeta>;

/** Appended to every title, as "Page — Luna Moon Aesthetics". */
export const TITLE_SUFFIX = data._suffix;

export function metaForRoute(pathname: string): PageMeta | null {
  // Trailing slashes are equivalent, but "/" itself must stay "/".
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  // WordPress first. When an SEO plugin is installed, what it sends is what
  // the clinic typed into that page's SEO fields, and that has to beat the
  // wording built into the app — otherwise the first client-side click would
  // put the app's title back over the plugin's.
  const fromWordPress = bootstrap.seo[path];
  if (fromWordPress) return { ...fromWordPress, managed: true };

  return routes[path] ?? null;
}

/**
 * "Advanced Facial Treatments Preston | Luna Moon Aesthetics"
 *
 * Left alone when the title came from an SEO plugin: those are written whole,
 * usually with the site name already on the end, and appending it again gives
 * you the business name twice in the browser tab.
 */
export function fullTitle(meta: PageMeta): string {
  const { title } = meta;
  if (meta.managed || title === TITLE_SUFFIX || title.endsWith(TITLE_SUFFIX)) {
    return title;
  }
  return `${title} | ${TITLE_SUFFIX}`;
}
