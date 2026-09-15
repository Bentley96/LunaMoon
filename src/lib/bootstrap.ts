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
// the blob. Keeping real-looking defaults here means the app renders standalone
// (Vite dev server, Storybook, tests) without a WordPress install behind it.
const FALLBACK: Bootstrap = {
  restUrl: '/wp-json/',
  nonce: '',
  siteUrl: '',
  basename: '',
  hasWoo: true,
  currency: {
    code: 'GBP',
    symbol: '£',
    minorUnit: 2,
    decimalSeparator: '.',
    thousandSeparator: ',',
    prefix: '£',
    suffix: '',
  },
  site: {
    name: 'Luna Moon Aesthetics',
    description: 'Aesthetics, beauty and skincare treatments in Preston.',
    phone: '',
    phoneHref: '',
    email: '',
    addressLines: ['55–56 Friargate', 'Preston', 'PR1 2AT'],
    hours: {},
    social: {},
    bookingUrl: '',
  },
};

function read(): Bootstrap {
  const injected = (typeof window !== 'undefined' && window.__LUNAMOON__) || {};
  return {
    ...FALLBACK,
    ...injected,
    currency: { ...FALLBACK.currency, ...injected.currency },
    site: { ...FALLBACK.site, ...injected.site },
  };
}

export const bootstrap: Bootstrap = read();

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
