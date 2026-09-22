// WooCommerce Store API client — the commerce half of the hybrid.
//
// The Store API (/wp-json/wc/store/v1) is WooCommerce's public, front-end API:
// it needs no consumer key, works for logged-out visitors, and owns the cart.
// That lets the React app run a real shop while WooCommerce keeps doing what
// it's good at — stock, tax, shipping, coupons, payments, orders.
//
// Checkout is deliberately NOT here: the visitor is handed to WooCommerce's own
// checkout page, which reads the same cart from the WooCommerce session.
//
// One piece of state has to be carried between requests: the Nonce, which the
// server rotates on every response and which writes require.
//
// The cart itself is carried by WooCommerce's session cookie, and deliberately
// nothing else. The Store API will also identify a cart by a Cart-Token header,
// which is how a genuinely headless shop on another domain keeps a basket, and
// this client used to send one. It cost us the hand-off: a cart reached by
// token lives under that token, the checkout page is ordinary PHP and reads
// only the cookie, so a device whose cookie went missing once kept a basket the
// app could see and the checkout could not. Checkout then bounced back to the
// basket, every time, on that device only. See forgetCartToken() below.

import { bootstrap, restUrl } from './bootstrap';

const CART_TOKEN_KEY = 'lunamoon_cart_token';

/**
 * Drop a Cart-Token this app stored before it stopped using them.
 *
 * A device that kept one would otherwise keep sending it for as long as the
 * browser held the key, and keep the basket in a cart its own checkout can't
 * read. Runs once, when the module loads.
 */
function forgetCartToken(): void {
  try {
    localStorage.removeItem(CART_TOKEN_KEY);
  } catch {
    // Storage blocked: then there's no token to forget.
  }
}

forgetCartToken();

export class WooError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'WooError';
  }
}

// The nonce starts as the page nonce and is replaced by whatever the Store API
// hands back, so a long-lived session keeps working.
let nonce: string = bootstrap.nonce;

async function request<T>(route: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (nonce) headers.set('Nonce', nonce);

  const res = await fetch(restUrl(`wc/store/v1/${route.replace(/^\/+/, '')}`), {
    credentials: 'same-origin',
    ...init,
    headers,
  });

  // Carry the rotated nonce forward. The Cart-Token the response also carries
  // is ignored on purpose: the session cookie, which this request sent and the
  // checkout page reads, is what holds the basket.
  const freshNonce = res.headers.get('Nonce');
  if (freshNonce) nonce = freshNonce;

  if (!res.ok) {
    let message = `Shop request failed (${res.status})`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as { message?: string; code?: string };
      if (body?.message) message = stripTags(body.message);
      code = body?.code;
    } catch {
      // Non-JSON error body — keep the status-based message.
    }
    throw new WooError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Store API error messages may contain markup; forms render them as text. */
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export interface WooPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WooImage {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: WooPrices;
  images: WooImage[];
  categories: { id: number; name: string; slug: string }[];
  is_purchasable: boolean;
  is_in_stock: boolean;
  variation?: string;
  has_options: boolean;
  type: string;
}

export interface WooProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image: WooImage | null;
}

export interface WooCartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  images: WooImage[];
  prices: WooPrices & { raw_prices?: { price: string } };
  totals: {
    line_subtotal: string;
    line_total: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
  };
  quantity_limits?: { minimum: number; maximum: number; multiple_of: number };
}

export interface WooCart {
  items: WooCartItem[];
  items_count: number;
  needs_shipping: boolean;
  coupons: { code: string; totals: { total_discount: string } }[];
  totals: {
    total_items: string;
    total_discount: string;
    total_shipping: string | null;
    total_tax: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
  };
  errors: { code: string; message: string }[];
}

export interface ProductQuery {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: 'date' | 'price' | 'popularity' | 'rating' | 'menu_order' | 'title';
  order?: 'asc' | 'desc';
}

export function getProducts(query: ProductQuery = {}) {
  const q = new URLSearchParams();
  q.set('per_page', String(query.per_page ?? 24));
  if (query.page) q.set('page', String(query.page));
  if (query.category) q.set('category', query.category);
  if (query.search) q.set('search', query.search);
  if (query.orderby) q.set('orderby', query.orderby);
  if (query.order) q.set('order', query.order);
  return request<WooProduct[]>(`products?${q.toString()}`);
}

export const getProductBySlug = async (slug: string): Promise<WooProduct> => {
  const found = await request<WooProduct[]>(`products?slug=${encodeURIComponent(slug)}`);
  if (!found.length) throw new WooError('Product not found', 404, 'not_found');
  return found[0];
};

export const getProductCategories = () =>
  request<WooProductCategory[]>('products/categories?per_page=100');

export const getCart = () => request<WooCart>('cart');

export const addToCart = (id: number, quantity = 1) =>
  request<WooCart>('cart/add-item', {
    method: 'POST',
    body: JSON.stringify({ id, quantity }),
  });

export const updateCartItem = (key: string, quantity: number) =>
  request<WooCart>('cart/update-item', {
    method: 'POST',
    body: JSON.stringify({ key, quantity }),
  });

export const removeCartItem = (key: string) =>
  request<WooCart>('cart/remove-item', {
    method: 'POST',
    body: JSON.stringify({ key }),
  });

export const applyCoupon = (code: string) =>
  request<WooCart>('cart/apply-coupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

export const removeCoupon = (code: string) =>
  request<WooCart>('cart/remove-coupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
