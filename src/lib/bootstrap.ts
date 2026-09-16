// Server-injected bootstrap data.
//
// This is what makes the site "hybrid" rather than a plain SPA: the WordPress
// theme prints a small JSON blob into <head> before the bundle loads, so the
// app knows the REST root, the REST nonce, the shop's currency and the site's
// contact details on the very first paint — no round-trip, no flash of empty
// header/footer. Everything else is fetched from the REST API on demand.
//
// See wordpress/lunamoon/inc/bootstrap.php for the producing side.

export interface CurrencyInfo {
  code: string;
  symbol: string;
  minorUnit: number;
  decimalSeparator: string;
  thousandSeparator: string;
  prefix: string;
  suffix: string;
}

export interface SiteInfo {
  name: string;
  description: string;
  phone: string;
  /** Digits only, for tel: links. */
  phoneHref: string;
  email: string;
  addressLines: string[];
  /** Pre-formatted opening hours, e.g. { "Mon–Fri": "9am–7pm" }. */
  hours: Record<string, string>;
  social: Partial<Record<'facebook' | 'instagram' | 'tiktok' | 'whatsapp', string>>;
  bookingUrl: string;
  /** Google Business Profile listing, for the "read more reviews" link. */
  googleReviewsUrl: string;
}

/** Permalinks of the pages WooCommerce renders itself. */
export interface WooUrls {
  checkout: string;
  myAccount: string;
}

export interface Bootstrap {
  /** Absolute REST root, always ending in a slash. */
  restUrl: string;
  /** REST nonce for the current visitor (empty for logged-out page caches). */
  nonce: string;
  siteUrl: string;
  /** Router basename — non-empty when WordPress lives in a subdirectory. */
  basename: string;
  /** True when WooCommerce is active and the Store API is available. */
  hasWoo: boolean;
  wooUrls: WooUrls;
  currency: CurrencyInfo;
  site: SiteInfo;
}

declare global {
  interface Window {
    __LUNAMOON__?: Partial<Bootstrap>;
    __LUNAMOON_DIST__?: string;
  }
}

// Used in `npm run dev` and as a safety net if the theme ever fails to print
// the blob, so the app renders standalone (Vite dev server, tests) without a
// WordPress install behind it. Only infrastructure defaults belong here —
// business details live in src/config/site.ts.
const FALLBACK: Bootstrap = {
  restUrl: '/wp-json/',
  nonce: '',
  siteUrl: '',
  basename: '',
  hasWoo: true,
  wooUrls: { checkout: '/checkout/', myAccount: '/my-account/' },
  currency: {
    code: 'GBP',
    symbol: '£',
    minorUnit: 2,
    decimalSeparator: '.',
    thousandSeparator: ',',
    prefix: '£',
    suffix: '',
  },
  // Deliberately empty. The business details have exactly one default, in
  // src/config/site.ts, which reads these and falls back when they're blank —
  // so anything set here would silently shadow that and become a second source
  // of truth for the same values.
  site: {
    name: '',
    description: '',
    phone: '',
    phoneHref: '',
    email: '',
    addressLines: [],
    hours: {},
    social: {},
    bookingUrl: '',
    googleReviewsUrl: '',
  },
};

function read(): Bootstrap {
  const injected = (typeof window !== 'undefined' && window.__LUNAMOON__) || {};
  return {
    ...FALLBACK,
    ...injected,
    wooUrls: { ...FALLBACK.wooUrls, ...injected.wooUrls },
    currency: { ...FALLBACK.currency, ...injected.currency },
    site: { ...FALLBACK.site, ...injected.site },
  };
}

export const bootstrap: Bootstrap = read();

/**
 * Where the "Checkout" buttons send the visitor.
 *
 * WooCommerce renders checkout itself, so this is a full page navigation out of
 * the app rather than a router link. The basket carries over because the Store
 * API writes to the same WooCommerce session the checkout page reads.
 */
export function checkoutUrl(): string {
  return bootstrap.wooUrls.checkout || '/checkout/';
}

/** Absolute URL for a REST route, e.g. restUrl('wc/store/v1/cart'). */
export function restUrl(route: string): string {
  const base = bootstrap.restUrl.endsWith('/') ? bootstrap.restUrl : `${bootstrap.restUrl}/`;
  return base + route.replace(/^\/+/, '');
}

/**
 * Resolve a brand image to its deployed URL.
 *
 * In dev this is just the path. In a build, the Vite plugin in vite.config.ts
 * has already rewritten the "/images/" literal to read from
 * window.__LUNAMOON_DIST__, so this passes through unchanged.
 */
export function asset(path: string): string {
  return path;
}
