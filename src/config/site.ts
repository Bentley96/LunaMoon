// Site structure and fallback business details.
//
// Navigation lives here rather than in a WordPress menu so routes and code stay
// in sync (a menu item pointing at a route React doesn't know about would 404).
// Business details are *fallbacks*: whatever the theme injects via
// window.__LUNAMOON__ wins, so the clinic can correct a phone number or the
// opening hours in wp-admin without a rebuild.
//
// TODO(content): confirm every value below against the live site before launch.

import { bootstrap } from '../lib/bootstrap';

export interface NavLink {
  label: string;
  to: string;
  children?: NavLink[];
}

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Treatments',
    to: '/treatments',
    children: [
      { label: 'All treatments', to: '/treatments' },
      { label: 'Anti-wrinkle injections', to: '/treatments/category/anti-wrinkle' },
      { label: 'Dermal fillers', to: '/treatments/category/dermal-fillers' },
      { label: 'Skin treatments', to: '/treatments/category/skin' },
      { label: 'Hair removal', to: '/treatments/category/hair-removal' },
    ],
  },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
];

export const footerLinks: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Treatments',
    links: [
      { label: 'Anti-wrinkle injections', to: '/treatments/category/anti-wrinkle' },
      { label: 'Dermal fillers', to: '/treatments/category/dermal-fillers' },
      { label: 'Skin treatments', to: '/treatments/category/skin' },
      { label: 'Hair removal', to: '/treatments/category/hair-removal' },
      { label: 'All treatments', to: '/treatments' },
    ],
  },
  {
    heading: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Basket', to: '/cart' },
    ],
  },
  {
    heading: 'Clinic',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy policy', to: '/privacy-policy' },
      { label: 'Terms & conditions', to: '/terms-conditions' },
      { label: 'Cancellation policy', to: '/cancellation-policy' },
    ],
  },
];

/** Business details, with the theme's injected values taking precedence. */
export const business = {
  name: bootstrap.site.name || 'Luna Moon Aesthetics',
  tagline: bootstrap.site.description || 'Aesthetics, beauty and skincare in Preston',
  phone: bootstrap.site.phone,
  phoneHref: bootstrap.site.phoneHref,
  email: bootstrap.site.email,
  addressLines: bootstrap.site.addressLines,
  hours: bootstrap.site.hours,
  social: bootstrap.site.social,
  bookingUrl: bootstrap.site.bookingUrl,
};
