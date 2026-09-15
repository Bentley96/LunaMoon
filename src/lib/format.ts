// Money and text formatting.
//
// The Store API returns every amount as a string of *minor units* ("12000")
// plus the separators and affixes configured in WooCommerce, so formatting must
// go through the shop's own settings rather than Intl guesswork — otherwise a
// site selling in GBP but displaying in another locale drifts.

import { bootstrap } from './bootstrap';

export interface CurrencyLike {
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

const siteCurrency: CurrencyLike = {
  currency_minor_unit: bootstrap.currency.minorUnit,
  currency_decimal_separator: bootstrap.currency.decimalSeparator,
  currency_thousand_separator: bootstrap.currency.thousandSeparator,
  currency_prefix: bootstrap.currency.prefix,
  currency_suffix: bootstrap.currency.suffix,
};

/**
 * Format an amount in minor units using the shop's currency settings.
 *
 * `amount` accepts the Store API's strings as-is. Whole amounts drop the
 * decimals ("£120" not "£120.00"), which reads better on a price list.
 */
export function formatPrice(
  amount: string | number | null | undefined,
  currency: CurrencyLike = siteCurrency,
): string {
  if (amount === null || amount === undefined || amount === '') return '';
  const minor = typeof amount === 'string' ? parseInt(amount, 10) : Math.round(amount);
  if (!Number.isFinite(minor)) return '';

  const unit = currency.currency_minor_unit ?? 2;
  const divisor = 10 ** unit;
  const negative = minor < 0;
  const abs = Math.abs(minor);
  const whole = Math.floor(abs / divisor);
  const fraction = abs % divisor;

  const groupedWhole = String(whole).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    currency.currency_thousand_separator || '',
  );

  const body =
    fraction === 0
      ? groupedWhole
      : `${groupedWhole}${currency.currency_decimal_separator || '.'}${String(fraction).padStart(unit, '0')}`;

  return `${negative ? '-' : ''}${currency.currency_prefix ?? ''}${body}${currency.currency_suffix ?? ''}`;
}

/** Strip HTML to plain text — for card excerpts and meta descriptions. */
export function toPlainText(html: string, maxLength?: number): string {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/\s+/g, ' ')
    .trim();
  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}
