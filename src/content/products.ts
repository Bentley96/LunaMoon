// The shop's products, as listed on the existing site.
//
// WooCommerce is the source of truth once it's connected: ShopPage renders the
// Store API response and only falls back to this list when the API is
// unavailable (local development, or before the products have been imported).
// The ids are the real WooCommerce post ids from the existing site, so a linked
// "add to basket" keeps working after import.
//
// Source: "Existing SIte/Products - Luna Moon Aesthetics", September 2026.

export interface FallbackProduct {
  id: number;
  slug: string;
  name: string;
  /** Price in minor units (pence). */
  price: number;
  /** Set for variable products, where price is a "from" figure. */
  priceMax?: number;
  image: string;
  hasOptions: boolean;
}

export const fallbackProducts: FallbackProduct[] = [
  {
    id: 1992,
    slug: 'liquid-lipo-home-kit',
    name: 'Liquid Lipo Home Kit',
    price: 6000,
    priceMax: 13500,
    image: '/images/product-liquid-lipo-home-kit.webp',
    hasOptions: true,
  },
  {
    id: 1990,
    slug: 'the-dissolve-and-tighten-trio',
    name: 'The Dissolve and Tighten Trio',
    price: 19900,
    image: '/images/product-dissolve-tighten-trio.webp',
    hasOptions: false,
  },
  {
    id: 1982,
    slug: 'fat-blast-and-detox',
    name: 'Fat Blast and Detox 5 Day Program',
    price: 12000,
    image: '/images/product-fat-blast-detox.webp',
    hasOptions: false,
  },
  {
    id: 1944,
    slug: 'hydra-osmosis-day-cream',
    name: 'Hydra Osmosis Day Cream (50ml)',
    price: 6000,
    image: '/images/product-hydra-osmosis-day-cream.webp',
    hasOptions: false,
  },
  {
    id: 1942,
    slug: 'blepharonat-periorbital-reduction',
    name: 'Blepharonat Periorbital Reduction',
    price: 7999,
    image: '/images/product-blepharonat-periorbital.webp',
    hasOptions: false,
  },
  {
    id: 1940,
    slug: 'blepharonat-eye-bag-removal',
    name: 'Blepharonat Eye Bag Removal (Pack of 10)',
    price: 55500,
    image: '/images/product-blepharonat-eye-bag.webp',
    hasOptions: false,
  },
  {
    id: 1355,
    slug: 'rewind-night-cream',
    name: 'Rewind Night Cream (50ml)',
    price: 6000,
    image: '/images/product-rewind-night-cream.webp',
    hasOptions: false,
  },
];
