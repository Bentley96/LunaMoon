import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { WooProduct } from '../lib/woo';
import { formatPrice, toPlainText } from '../lib/format';
import { useCart } from '../store/CartContext';
import ImageFrame from './ui/ImageFrame';

export default function ProductCard({ product }: { product: WooProduct }) {
  const { add, busy } = useCart();
  const [adding, setAdding] = useState(false);

  // Variable products can't be added straight from a card — they need options
  // picking, so the card links through to the product page instead.
  const needsOptions = product.has_options || product.type !== 'simple';

  async function onAdd() {
    setAdding(true);
    try {
      await add(product.id, 1);
    } catch {
      // The provider surfaces the message; nothing to do here.
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="card card-hover flex flex-col">
      <Link to={`/shop/${product.slug}`} className="block">
        <ImageFrame
          src={product.images[0]?.src}
          alt={product.images[0]?.alt || product.name}
          label="Product image"
          ratio="aspect-square"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.on_sale && (
          <span className="mb-2 self-start rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-gold-800">
            Sale
          </span>
        )}

        <h3 className="text-xl leading-snug">
          <Link to={`/shop/${product.slug}`} className="text-ink-900 transition-colors hover:text-blush-700">
            {product.name}
          </Link>
        </h3>

        {product.short_description && (
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {toPlainText(product.short_description, 110)}
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-ink-900">
            {formatPrice(product.prices.price, product.prices)}
          </span>
          {product.on_sale && product.prices.regular_price !== product.prices.price && (
            <span className="text-sm text-ink-400 line-through">
              {formatPrice(product.prices.regular_price, product.prices)}
            </span>
          )}
        </div>

        <div className="mt-5 pt-1">
          {!product.is_in_stock ? (
            <p className="text-sm font-medium text-ink-400">Out of stock</p>
          ) : needsOptions ? (
            <Link to={`/shop/${product.slug}`} className="btn-outline-ink w-full">
              Choose options
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void onAdd()}
              disabled={busy || adding || !product.is_purchasable}
              className="btn-primary w-full"
            >
              {adding ? 'Adding…' : 'Add to basket'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
