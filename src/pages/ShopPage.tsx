import { Link } from 'react-router-dom';
import { getProducts } from '../lib/woo';
import { bootstrap } from '../lib/bootstrap';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/format';
import { fallbackProducts } from '../content/products';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import ContactStrip from '../components/ContactStrip';
import Spinner from '../components/ui/Spinner';

const INTRO =
  'Hi, Dee here again. I hope you’re enjoying browsing my site as much as I enjoy helping you achieve the best you that you can be — feel free to drop me a message if you need anything. We all love the salon experience, but sometimes it’s nice to get that in the comfort of your own home. These are my at-home treatments: visit my shop and treat yourself to a pamper session without leaving your living room.';

export default function ShopPage() {
  const { data, loading } = useAsync(
    () => (bootstrap.hasWoo ? getProducts({ per_page: 24 }) : Promise.resolve([])),
    [],
  );

  const live = data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Luna Moon Aesthetics"
        title="PRODUCTS"
        intro="View our range of beauty products. For more information, or to make a booking, get in touch now!"
        image="/images/liquid-lipo-brand.webp"
      />

      <section className="section-padding">
        <div className="container-xl">
          <div className="container-prose text-center">
            <span className="eyebrow">Our products</span>
            <h2 className="mt-3 text-3xl sm:text-4xl">Treat yourself at home</h2>
            <p className="mt-5 leading-relaxed text-ink-600">{INTRO}</p>
          </div>

          {loading ? (
            <Spinner label="Loading products…" />
          ) : live.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {live.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* WooCommerce isn't reachable (local dev, or products not imported
               yet) — show the catalogue from the existing site so the page is
               never empty. These cards link out rather than adding to a basket,
               since there's no Store API behind them. */
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {fallbackProducts.map((p) => (
                <article key={p.id} className="card card-hover flex flex-col">
                  <Link to={`/product/${p.slug}`} className="block">
                    <img src={p.image} alt={p.name} loading="lazy"
                         className="aspect-square w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg leading-snug">
                      <Link to={`/product/${p.slug}`} className="text-ink-900 hover:text-blush-700">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-3 text-lg font-semibold text-ink-900">
                      {formatPrice(p.price)}
                      {p.priceMax ? ` – ${formatPrice(p.priceMax)}` : ''}
                    </p>
                    <Link to={`/product/${p.slug}`} className="btn-outline-ink mt-5 w-full">
                      {p.hasOptions ? 'Select options' : 'View product'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
