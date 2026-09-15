// WordPress REST client — the content half of the hybrid.
//
// Editable content (treatments, testimonials, FAQs, policy pages) lives in
// WordPress so the clinic can change it in wp-admin without a rebuild. The
// React app fetches it from the theme's own `lunamoon/v1` namespace, which
// returns flat, render-ready shapes instead of raw WP post objects.
//
// See wordpress/lunamoon/inc/content.php for the producing side.

import { bootstrap, restUrl } from './bootstrap';

export class WpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'WpError';
  }
}

async function request<T>(route: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  // Authenticates the request as the current visitor so WordPress treats it as
  // same-session (needed for nonce-protected routes).
  if (bootstrap.nonce) headers.set('X-WP-Nonce', bootstrap.nonce);

  const res = await fetch(restUrl(route), {
    credentials: 'same-origin',
    ...init,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body?.message) message = body.message;
    } catch {
      // Non-JSON error body — keep the status-based message.
    }
    throw new WpError(message, res.status);
  }

  return (await res.json()) as T;
}

export interface Treatment {
  id: number;
  slug: string;
  title: string;
  /** Short plain-text summary for cards and meta descriptions. */
  summary: string;
  /** Rendered HTML body for the treatment's own page. */
  content: string;
  image: string;
  categories: { slug: string; name: string }[];
  /** Lowest price in minor units (pence), or null when "price on consultation". */
  priceFrom: number | null;
  /** Human duration, e.g. "45 mins". */
  duration: string;
  /** WooCommerce product id, when the treatment is bookable/purchasable. */
  productId: number | null;
  /** External booking link (e.g. Fresha/Treatwell) when there's no product. */
  bookingUrl: string;
}

export interface TreatmentCategory {
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface Testimonial {
  id: number;
  author: string;
  quote: string;
  rating: number;
  treatment: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface PageContent {
  slug: string;
  title: string;
  content: string;
  updated: string;
}

export const getTreatments = (params: { category?: string; limit?: number } = {}) => {
  const q = new URLSearchParams();
  if (params.category) q.set('category', params.category);
  if (params.limit) q.set('per_page', String(params.limit));
  const qs = q.toString();
  return request<Treatment[]>(`lunamoon/v1/treatments${qs ? `?${qs}` : ''}`);
};

export const getTreatment = (slug: string) =>
  request<Treatment>(`lunamoon/v1/treatments/${encodeURIComponent(slug)}`);

export const getTreatmentCategories = () =>
  request<TreatmentCategory[]>('lunamoon/v1/treatment-categories');

export const getTestimonials = (limit = 12) =>
  request<Testimonial[]>(`lunamoon/v1/testimonials?per_page=${limit}`);

export const getFaqs = () => request<Faq[]>('lunamoon/v1/faqs');

export const getPage = (slug: string) =>
  request<PageContent>(`lunamoon/v1/page/${encodeURIComponent(slug)}`);

export interface EnquiryPayload {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message?: string;
  /** Honeypot — must stay empty; real users never fill it. */
  website?: string;
  recaptcha_token?: string;
}

export const submitEnquiry = (payload: EnquiryPayload) =>
  request<{ success: true }>('lunamoon/v1/enquiry', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
