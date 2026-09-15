// Page banner artwork.
//
// Supplied as two crops per page, not one image scaled: desktop is 1920x650
// (wide and short) and mobile is 360x620 (portrait), each framed on a different
// part of the subject. That's art direction, so they're rendered through
// <picture> with a media query rather than a single <img> — see PageHero.
//
// The photography is deliberately bright, with the subject on the right and
// open space on the left for the heading to sit in. PageHero darkens only that
// left side, so the heading stays white and legible while the subject keeps its
// exposure.
//
// Source: "Banner Images/" in the repo root (the masters, not served).

export interface Banner {
  /** 1920x650. */
  desktop: string;
  /** 360x620. Omitted where only one crop was supplied; the desktop image is
   *  then used at every width. */
  mobile?: string;
  alt: string;
}

const B = '/images/banners';

export const banners: Record<string, Banner> = {
  home: {
    desktop: `${B}/home-desktop.webp`,
    mobile: `${B}/home-mobile.webp`,
    alt: 'A client with clear, glowing skin',
  },
  'advanced-facial-treatments': {
    desktop: `${B}/advanced-facial-treatments-desktop.webp`,
    mobile: `${B}/advanced-facial-treatments-mobile.webp`,
    alt: 'An advanced facial treatment in progress',
  },
  'laser-cosmetic-teeth-whitening': {
    desktop: `${B}/laser-cosmetic-teeth-whitening-desktop.webp`,
    mobile: `${B}/laser-cosmetic-teeth-whitening-mobile.webp`,
    alt: 'A laser cosmetic teeth whitening treatment',
  },
  'skin-tightening-weight-loss': {
    desktop: `${B}/skin-tightening-weight-loss-desktop.webp`,
    mobile: `${B}/skin-tightening-weight-loss-mobile.webp`,
    alt: 'A body contouring treatment in progress',
  },
  products: {
    desktop: `${B}/products-desktop.webp`,
    mobile: `${B}/products-mobile.webp`,
    alt: 'A relaxing skincare treatment',
  },
  faqs: {
    desktop: `${B}/faqs-desktop.webp`,
    mobile: `${B}/faqs-mobile.webp`,
    alt: 'A facial treatment being applied',
  },
  // Supplied as a single 2048x1366 crop rather than a desktop/mobile pair.
  'book-online': {
    desktop: `${B}/book-online-desktop.webp`,
    alt: 'A facial treatment at the clinic',
  },
  contact: {
    desktop: `${B}/contact-desktop.webp`,
    alt: 'A skin treatment at the clinic',
  },
};

export const bannerFor = (slug: string): Banner | undefined => banners[slug];
