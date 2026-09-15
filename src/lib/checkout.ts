// Payment gateways available at checkout.
//
// The Store API doesn't expose the enabled gateway list (WooCommerce Blocks
// reads it from a PHP-registered JS data store), so the theme publishes a small
// endpoint of its own. See wordpress/lunamoon/inc/commerce.php.

import { bootstrap, restUrl } from './bootstrap';

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  /** True when the gateway captures card details on-page and therefore needs
   *  WooCommerce's own checkout rather than the Store API POST. */
  needsHostedFields: boolean;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  if (!bootstrap.hasWoo) return [];
  const headers = new Headers();
  if (bootstrap.nonce) headers.set('X-WP-Nonce', bootstrap.nonce);

  const res = await fetch(restUrl('lunamoon/v1/payment-methods'), {
    credentials: 'same-origin',
    headers,
  });
  if (!res.ok) return [];
  return (await res.json()) as PaymentMethod[];
}
