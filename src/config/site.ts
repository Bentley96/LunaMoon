// Site structure and business details.
//
// Navigation mirrors the existing site's main menu, and lives here rather than
// in a WordPress menu so routes and code stay in sync (a menu item pointing at
// a route React doesn't know about would 404).
//
// Business details are fallbacks taken from the existing site: whatever the
// theme injects via window.__LUNAMOON__ wins, so the clinic can correct a phone
// number or the opening hours in wp-admin without a rebuild.

import { bootstrap } from '../lib/bootstrap';
import { treatmentPages } from '../content/treatments';
import { IPL_ANCHOR } from './anchors';

export interface NavLink {
  label: string;
  to: string;
  /** Rendered as a dropdown parent; `to` is ignored when children exist. */
  children?: NavLink[];
  /** Opens in a new tab — used for the external booking system. */
  external?: boolean;
}

/**
 * The "Our Treatments" menu.
 *
 * Listed explicitly rather than derived from treatmentPages, because the menu
 * and the page set are no longer the same thing:
 *
 *   - IPL Laser Hair Removal has no page of its own. It's booked, so the menu
 *     item goes straight to its category on /book-online, which opens as the
 *     page loads rather than leaving it shut among the other eighteen.
 *   - Aesthetics Treatments has been removed. Its copy now lives on the
 *     homepage, in src/content/homeTreatments.ts.
 *
 * Labels still come from the page data so they can't drift; a slug that no
 * longer exists drops out of the menu rather than rendering a dead link.
 */
const MENU_SLUGS = [
  'advanced-facial-treatments',
  'laser-cosmetic-teeth-whitening',
  'skin-tightening-weight-loss',
] as const;

const treatmentLinks: NavLink[] = [
  ...MENU_SLUGS.flatMap((slug) => {
    const page = treatmentPages.find((p) => p.slug === slug);
    return page ? [{ label: page.navLabel, to: `/${page.slug}` }] : [];
  }),
  { label: 'IPL Laser Hair Removal', to: `/book-online#${IPL_ANCHOR}` },
];

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Book Online', to: '/book-online' },
  { label: 'Products', to: '/products' },
  { label: 'Our Treatments', to: '#', children: treatmentLinks },
  { label: 'FAQ’s', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
];

export const footerLinks: { heading: string; links: NavLink[] }[] = [
  { heading: 'Our Treatments', links: treatmentLinks },
  {
    heading: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Basket', to: '/cart' },
    ],
  },
  {
    heading: 'Clinic',
    links: [
      { label: 'Book Online', to: '/book-online' },
      { label: 'FAQ’s', to: '/faqs' },
      { label: 'Contact', to: '/contact' },
      { label: 'Clinic Policy', to: '/clinic-policy' },
    ],
  },
];

/**
 * External booking system.
 *
 * The clinic takes bookings through that-time.co.uk, not through WooCommerce —
 * the shop sells products, the booking system sells appointments. Every "Book
 * now" control links out to it.
 */
export const BOOKING_URL = 'https://www.that-time.co.uk/luna-moon-aesthetics';

/**
 * Where "See all our Google reviews" goes.
 *
 * The homepage shows six reviews; the clinic has far more, and they carry more
 * weight read on Google than retyped here. This is Google's documented Maps
 * URL format, which resolves the business by name and address rather than by a
 * place ID, so it works without one. If the clinic pastes the exact listing
 * link from its Google Business Profile into the Customizer, that wins.
 */
export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Luna Moon Aesthetics, 55-56 Friargate, Preston PR1 2AT');

/**
 * Opening hours, as shown on the existing site's footer.
 *
 * Insertion order is the display order, so Monday..Sunday is preserved. The
 * Customizer stores these one per line as "Label|Value"; whatever is set there
 * replaces this whole map.
 */
const DEFAULT_HOURS: Record<string, string> = {
  Monday: '10am - 6pm',
  Tuesday: '10am - 6pm',
  Wednesday: '10am - 5pm',
  Thursday: '10am - 7pm',
  Friday: '10am - 7pm',
  Saturday: '10am - 3pm',
  Sunday: 'Closed',
};

/**
 * Social profiles.
 *
 * Merged per network rather than wholesale, so setting one in the Customizer
 * doesn't blank the others. A network is shown only where it has a URL, so
 * clearing one here removes its icon everywhere.
 */
const DEFAULT_SOCIAL: Record<string, string> = {
  facebook: 'https://www.facebook.com/lunamoonaesthetics',
  instagram: 'https://www.instagram.com/luna_moon_aesthetics__/',
  tiktok: 'https://www.tiktok.com/@luna_moon_aesthetics',
  // wa.me opens a chat with the clinic's number, in the app on a phone and in
  // WhatsApp Web on a desktop.
  whatsapp: 'https://wa.me/+447592608064',
};

/**
 * The map on the contact page.
 *
 * Google's keyless embed: `?output=embed` renders a map for a search term with
 * no API key and no account, so the page works as shipped. It searches for the
 * address rather than pointing at the clinic's own listing, which is the one
 * thing it can't do — for the pin with the clinic's name and reviews on it,
 * paste the URL from Share → Embed a map on the Google Business Profile into
 * the Customizer, and that wins.
 */
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?output=embed&z=16&q=' +
  encodeURIComponent('House of Hair & Beauty, 55-56 Friargate, Preston PR1 2AT');

/** Business details, with the theme's injected values taking precedence. */
export const business = {
  name: bootstrap.site.name || 'Luna Moon Aesthetics',
  tagline:
    bootstrap.site.description || 'Professional Aesthetic Beauty Treatments In Preston',
  /** Registered company name, for the footer's copyright line. */
  legalName: 'Luna Moon LTD',
  phone: bootstrap.site.phone || '07592 608 064',
  phoneHref: bootstrap.site.phoneHref || '07592608064',
  email: bootstrap.site.email || 'info@aestheticspreston.co.uk',
  addressLines: bootstrap.site.addressLines.length
    ? bootstrap.site.addressLines
    // The clinic is on the second floor of House of Hair & Beauty — as the
    // existing site's footer and the FAQ copy both say. Without that line
    // people arrive at the right building and can't find it.
    : ['House of Hair & Beauty', '55-56 Friargate', 'Preston', 'PR1 2AT'],
  hours: Object.keys(bootstrap.site.hours).length ? bootstrap.site.hours : DEFAULT_HOURS,
  /** Footer blurb — what the clinic is, rather than how to pay for it. */
  about:
    'Luna Moon LTD provides a range of high-quality aesthetic treatments in Preston. We are fully trained, qualified and insured to guarantee peace of mind. For more information or to make a booking please get in touch.',
  social: { ...DEFAULT_SOCIAL, ...bootstrap.site.social },
  bookingUrl: bootstrap.site.bookingUrl || BOOKING_URL,
  /** Google Business Profile listing, linked from the reviews section. */
  googleReviewsUrl: bootstrap.site.googleReviewsUrl || GOOGLE_REVIEWS_URL,
  /**
   * Map iframe on the contact page. An empty Customizer field means "use the
   * default", as with every other detail here — `??` would have read the
   * empty string the theme always sends as a deliberate choice and shown no
   * map at all.
   */
  mapEmbedUrl: bootstrap.site.mapEmbedUrl || MAP_EMBED_URL,
  /** Shown beneath the contact details on the homepage and contact page. */
  finance: 'We accept pay monthly payment options as well as Klarna finance options.',
};
