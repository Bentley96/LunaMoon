// WooCommerce Store API client — the commerce half of the hybrid.
//
// The Store API (/wp-json/wc/store/v1) is WooCommerce's public, front-end API:
// it needs no consumer key, works for logged-out visitors, and owns the cart
// and checkout. That lets the React app run a real shop while WooCommerce keeps
// doing what it's good at — stock, tax, shipping, coupons, payments, orders.
//
// Two pieces of state have to be carried between requests:
//   Nonce       — rotated by the server on every response; required on writes.
//   Cart-Token  — identifies a guest's cart when cookies aren't available
//                 (page caching, Safari ITP). Persisted to localStorage.

import { bootstrap, restUrl } from './bootstrap';

const CART_TOKEN_KEY = 'lunamoon_cart_token';

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

function readCartToken(): string {
  try {
    return localStorage.getItem(CART_TOKEN_KEY) ?? '';
  } catch {
    // Private browsing / blocked storage — fall back to cookie-based carts.
    return '';
  }
}

function writeCartToken(token: string): void {
  try {
    localStorage.setItem(CART_TOKEN_KEY, token);
  } catch {
    // Non-fatal: the cart cookie still works in most browsers.
  }
}

export function clearCartToken(): void {
  try {
    localStorage.removeItem(CART_TOKEN_KEY);
  } catch {
    // Ignore.
  }
}

async function request<T>(route: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (nonce) headers.set('Nonce', nonce);
  const token = readCartToken();
  if (token) headers.set('Cart-Token', token);

  const res = await fetch(restUrl(`wc/store/v1/${route.replace(/^\/+/, '')}`), {
    credentials: 'same-origin',
    ...init,
    headers,
  });

  // Carry the rotated nonce and the guest cart token forward.
  const freshNonce = res.headers.get('Nonce');
  if (freshNonce) nonce = freshNonce;
  const freshToken = res.headers.get('Cart-Token');
  if (freshToken) writeCartToken(freshToken);

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

export interface CheckoutAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface CheckoutDraft {
  order_id: number;
  status: string;
  order_key: string;
  /** Where to send the browser once the order is placed. */
  payment_result: {
    payment_status: string;
    payment_details: { key: string; value: string }[];
    redirect_url: string;
  };
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

export interface PlaceOrderInput {
  billing_address: CheckoutAddress;
  shipping_address?: CheckoutAddress;
  customer_note?: string;
  payment_method: string;
  payment_data?: { key: string; value: string }[];
}

export const placeOrder = (input: PlaceOrderInput) =>
  request<CheckoutDraft>('checkout', {
    method: 'POST',
    body: JSON.stringify(input),
  });
