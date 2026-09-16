import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { getProductBySlug } from '../lib/woo';
import { bootstrap } from '../lib/bootstrap';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/format';
import { useCart } from '../store/CartContext';
import { fallbackProducts } from '../content/products';
import RichText from '../components/ui/RichText';
import ContactStrip from '../components/ContactStrip';
import PageFaqs from '../components/PageFaqs';
import Spinner from '../components/ui/Spinner';

export default function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data, loading, error } = useAsync(
    () => (bootstrap.hasWoo ? getProductBySlug(slug) : Promise.reject(new Error('no shop'))),
    [slug],
  );
  const { add, busy, openDrawer } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  if (loading) {
    return <Spinner label="Loading product…" />;
  }

  // Without WooCommerce there's nothing to add to a basket, so show the listing
  // details from the existing site and point people at the clinic.
  if (error || !data) {
    const p = fallbackProducts.find((x) => x.slug === slug);
    return (
      <>
        <section className="section-padding">
          <div className="container-lg">
            <Link to="/products" className="btn-ghost mb-8">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to products
            </Link>
            {p ? (
              <div className="grid gap-12 lg:grid-cols-2">
                <img src={p.image} alt={p.name} className="aspect-square w-full rounded-2xl object-cover" />
                <div>
                  <h1 className="text-3xl sm:text-4xl">{p.name}</h1>
                  <p className="mt-5 text-2xl font-semibold text-ink-900">
                    {formatPrice(p.price)}
                    {p.priceMax ? ` – ${formatPrice(p.priceMax)}` : ''}
                  </p>
                  <p className="mt-6 rounded-lg bg-ink-50 px-4 py-3 text-ink-600">
                    Online ordering isn’t connected yet. Get in touch and we’ll sort this out for you.
                  </p>
                  <Link to="/contact" className="btn-primary mt-6">
                    Contact the clinic
                  </Link>
                </div>
              </div>
            ) : (
              <p className="py-16 text-center text-ink-500">Product not found.</p>
            )}
          </div>
        </section>
        <PageFaqs product={slug} />
        <ContactStrip />
      </>
    );
  }

  const needsOptions = data.has_options || data.type !== 'simple';

  async function onAdd() {
    setAdding(true);
    try {
      await add(data!.id, quantity);
    } catch {
      // Surfaced by the cart provider.
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      <section className="section-padding">
        <div className="container-lg">
          <Link to="/products" className="btn-ghost mb-8">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to products
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <img
                src={data.images[activeImage]?.src}
                alt={data.images[activeImage]?.alt || data.name}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              {data.images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {data.images.map((image, i) => (
                    <button key={image.id} type="button" onClick={() => setActiveImage(i)}
                            aria-label={`View image ${i + 1}`} aria-current={i === activeImage}
                            className={`w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                              i === activeImage ? 'border-blush-600' : 'border-transparent hover:border-ink-200'
                            }`}>
                      <img src={image.thumbnail} alt="" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {data.categories[0] && <span className="eyebrow">{data.categories[0].name}</span>}
              <h1 className="mt-3 text-3xl sm:text-4xl">{data.name}</h1>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-ink-900">
                  {formatPrice(data.prices.price, data.prices)}
                </span>
                {data.on_sale && data.prices.regular_price !== data.prices.price && (
                  <span className="text-lg text-ink-400 line-through">
                    {formatPrice(data.prices.regular_price, data.prices)}
                  </span>
                )}
              </div>

              {data.short_description && (
                <RichText html={data.short_description} className="mt-6 text-ink-600" />
              )}

              <div className="mt-8">
                {!data.is_in_stock ? (
                  <p className="rounded-lg bg-ink-50 px-4 py-3 text-ink-500">
                    This product is currently out of stock.
                  </p>
                ) : needsOptions ? (
                  <a href={data.permalink} className="btn-primary-lg">Choose options</a>
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-full border border-ink-200">
                      <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              className="p-3 text-ink-600 hover:text-blush-700" aria-label="Decrease quantity">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 text-center font-medium">{quantity}</span>
                      <button type="button" onClick={() => setQuantity((q) => q + 1)}
                              className="p-3 text-ink-600 hover:text-blush-700" aria-label="Increase quantity">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button type="button" onClick={() => void onAdd()}
                            disabled={busy || adding || !data.is_purchasable}
                            className="btn-primary-lg flex-1 sm:flex-none">
                      {adding ? 'Adding…' : 'Add to basket'}
                    </button>
                    <button type="button" onClick={openDrawer} className="btn-ghost">View basket</button>
                  </div>
                )}
              </div>

              {data.description && (
                <div className="mt-10 border-t border-ink-100 pt-8">
                  <h2 className="text-2xl">Details</h2>
                  <RichText html={data.description} className="mt-4 text-ink-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <PageFaqs product={slug} />
      <ContactStrip />
    </>
  );
}
