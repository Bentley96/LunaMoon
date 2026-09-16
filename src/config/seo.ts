// Per-route page titles and meta descriptions.
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

import data from './seo.json';

export interface PageMeta {
  title: string;
  description: string;
}

const routes = data.routes as Record<string, PageMeta>;

/** Appended to every title, as "Page — Luna Moon Aesthetics". */
export const TITLE_SUFFIX = data._suffix;

export function metaForRoute(pathname: string): PageMeta | null {
  // Trailing slashes are equivalent, but "/" itself must stay "/".
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return routes[path] ?? null;
}

/** "Advanced Facial Treatments Preston — Luna Moon Aesthetics" */
export function fullTitle(title: string): string {
  return title === TITLE_SUFFIX ? title : `${title} — ${TITLE_SUFFIX}`;
}
