import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { formatPrice } from '../lib/format';
import ImageFrame from './ui/ImageFrame';

/** Slide-over mini basket, opened from the header or after adding an item. */
export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, setQuantity, remove, busy, error, clearError } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const items = cart?.items ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Your basket">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={closeDrawer}
        aria-label="Close basket"
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
          <h2 className="text-2xl text-ink-900">Your basket</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full p-2 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-start justify-between gap-3 bg-blush-50 px-6 py-3 text-sm text-blush-800">
            <p role="alert">{error}</p>
            <button type="button" onClick={clearError} aria-label="Dismiss" className="shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-ink-200" aria-hidden="true" />
            <p className="text-ink-500">Your basket is empty.</p>
            <Link to="/shop" onClick={closeDrawer} className="btn-outline-ink">
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink-50 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <ImageFrame
                    src={item.images[0]?.thumbnail}
                    alt={item.images[0]?.alt || item.name}
                    label="Product"
                    ratio="aspect-square"
                    className="w-20 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-ink-900">{item.name}</p>
                    <p className="mt-1 text-sm text-ink-500">
                      {formatPrice(item.prices.price, item.prices)}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setQuantity(item.key, item.quantity - 1)}
                          className="p-1.5 text-ink-600 transition-colors hover:text-blush-700 disabled:opacity-50"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setQuantity(item.key, item.quantity + 1)}
                          className="p-1.5 text-ink-600 transition-colors hover:text-blush-700 disabled:opacity-50"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void remove(item.key)}
                        className="text-ink-400 transition-colors hover:text-blush-700 disabled:opacity-50"
                        aria-label={`Remove ${item.name} from basket`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 font-semibold text-ink-900">
                    {formatPrice(item.totals.line_total, item.totals)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-100 px-6 py-5">
              {cart && (
                <div className="flex items-center justify-between text-lg font-semibold text-ink-900">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totals.total_items, cart.totals)}</span>
                </div>
              )}
              <p className="mt-1 text-xs text-ink-400">
                Shipping and taxes are calculated at checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <Link to="/checkout" onClick={closeDrawer} className="btn-primary w-full">
                  Checkout
                </Link>
                <Link to="/cart" onClick={closeDrawer} className="btn-ghost justify-center">
                  View full basket
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
