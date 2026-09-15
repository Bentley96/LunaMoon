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

export interface NavLink {
  label: string;
  to: string;
  /** Rendered as a dropdown parent; `to` is ignored when children exist. */
  children?: NavLink[];
  /** Opens in a new tab — used for the external booking system. */
  external?: boolean;
}

const treatmentLinks: NavLink[] = treatmentPages.map((t) => ({
  label: t.navLabel,
  to: `/${t.slug}`,
}));

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
    : ['55-56 Friargate', 'Preston', 'PR1 2AT'],
  hours: Object.keys(bootstrap.site.hours).length ? bootstrap.site.hours : DEFAULT_HOURS,
  /** Footer blurb — what the clinic is, rather than how to pay for it. */
  about:
    'Luna Moon LTD provides a range of high-quality aesthetic treatments in Preston. We are fully trained, qualified and insured to guarantee peace of mind. For more information or to make a booking please get in touch.',
  social: bootstrap.site.social,
  bookingUrl: bootstrap.site.bookingUrl || BOOKING_URL,
  /** Shown beneath the contact details on the homepage and contact page. */
  finance: 'We accept pay monthly payment options as well as Klarna finance options.',
};
