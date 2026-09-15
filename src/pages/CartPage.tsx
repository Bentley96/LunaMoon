import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { formatPrice } from '../lib/format';
import PageHero from '../components/PageHero';
import ImageFrame from '../components/ui/ImageFrame';
import Spinner from '../components/ui/Spinner';

export default function CartPage() {
  const { cart, loading, busy, error, setQuantity, remove, applyCoupon, removeCoupon } = useCart();
  const [coupon, setCoupon] = useState('');

  if (loading) {
    return (
      <>
        <PageHero title="Your basket" />
        <Spinner label="Loading basket…" />
      </>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <>
        <PageHero title="Your basket" />
        <section className="section-padding">
          <div className="container-prose flex flex-col items-center gap-5 text-center">
            <ShoppingBag className="h-12 w-12 text-ink-200" aria-hidden="true" />
            <p className="text-lg text-ink-500">Your basket is empty.</p>
            <Link to="/shop" className="btn-primary">
              Browse the shop
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero title="Your basket" />

      <section className="section-padding">
        <div className="container-xl grid gap-12 lg:grid-cols-[1fr_22rem]">
          <div>
            {error && (
              <p role="alert" className="mb-6 rounded-lg bg-blush-50 px-4 py-3 text-sm text-blush-800">
                {error}
              </p>
            )}

            <ul className="divide-y divide-ink-100 border-y border-ink-100">
              {items.map((item) => (
                <li key={item.key} className="flex flex-wrap gap-5 py-6">
                  <ImageFrame
                    src={item.images[0]?.thumbnail}
                    alt={item.images[0]?.alt || item.name}
                    label="Product"
                    ratio="aspect-square"
                    className="w-24 shrink-0 rounded-xl"
                  />

                  <div className="min-w-48 flex-1">
                    <h2 className="text-lg leading-snug">
                      <Link
                        to={`/shop/${item.permalink.split('/').filter(Boolean).pop()}`}
                        className="text-ink-900 hover:text-blush-700"
                      >
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-ink-500">
                      {formatPrice(item.prices.price, item.prices)} each
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setQuantity(item.key, item.quantity - 1)}
                          className="p-2 text-ink-600 hover:text-blush-700 disabled:opacity-50"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setQuantity(item.key, item.quantity + 1)}
                          className="p-2 text-ink-600 hover:text-blush-700 disabled:opacity-50"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void remove(item.key)}
                        className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-blush-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="text-lg font-semibold text-ink-900">
                    {formatPrice(item.totals.line_total, item.totals)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="card p-6">
              <h2 className="text-2xl">Summary</h2>

              {cart && (
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Subtotal</dt>
                    <dd className="font-medium">{formatPrice(cart.totals.total_items, cart.totals)}</dd>
                  </div>
                  {cart.totals.total_discount !== '0' && (
                    <div className="flex justify-between text-blush-700">
                      <dt>Discount</dt>
                      <dd>−{formatPrice(cart.totals.total_discount, cart.totals)}</dd>
                    </div>
                  )}
                  {cart.needs_shipping && (
                    <div className="flex justify-between">
                      <dt className="text-ink-500">Shipping</dt>
                      <dd className="font-medium">
                        {cart.totals.total_shipping === null
                          ? 'Calculated at checkout'
                          : formatPrice(cart.totals.total_shipping, cart.totals)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-ink-100 pt-3 text-lg font-semibold text-ink-900">
                    <dt>Total</dt>
                    <dd>{formatPrice(cart.totals.total_price, cart.totals)}</dd>
                  </div>
                </dl>
              )}

              <form
                className="mt-6 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!coupon.trim()) return;
                  void applyCoupon(coupon.trim())
                    .then(() => setCoupon(''))
                    .catch(() => {});
                }}
              >
                <label className="sr-only" htmlFor="coupon">
                  Discount code
                </label>
                <input
                  id="coupon"
                  className="field-input"
                  placeholder="Discount code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button type="submit" className="btn-outline-ink shrink-0" disabled={busy}>
                  Apply
                </button>
              </form>

              {cart && cart.coupons.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {cart.coupons.map((c) => (
                    <li key={c.code} className="flex items-center justify-between gap-3">
                      <span className="font-medium uppercase text-ink-700">{c.code}</span>
                      <button
                        type="button"
                        onClick={() => void removeCoupon(c.code).catch(() => {})}
                        className="text-ink-400 hover:text-blush-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Link to="/checkout" className="btn-primary mt-6 w-full">
                Proceed to checkout
              </Link>
              <Link to="/shop" className="btn-ghost mt-3 w-full justify-center">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
