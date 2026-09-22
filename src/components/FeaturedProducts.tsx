import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { bootstrap } from '../lib/bootstrap';
import { getProducts } from '../lib/woo';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/format';
import { fallbackProducts } from '../content/products';
import ProductCard from './ProductCard';
import SectionHeading from './ui/SectionHeading';
import Spinner from './ui/Spinner';

/** Homepage shop teaser: the first few products from the online store. */
export default function FeaturedProducts() {
  const { data, loading } = useAsync(
    () => (bootstrap.hasWoo ? getProducts({ per_page: 4 }) : Promise.resolve([])),
    [],
  );

  const live = data ?? [];

  return (
    <section className="section-padding bg-blush-50">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Our products"
          title="Luna Moon Aesthetics online shop"
          intro="Treat yourself to a pamper session without leaving your living room, using the same professional brands we use in clinic."
        />

        {loading ? (
          <Spinner label="Loading products…" />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {live.length > 0
              ? live.map((p) => <ProductCard key={p.id} product={p} />)
              : /* No WooCommerce behind the app yet — show the catalogue from the
                   existing site so the teaser is never an empty band. */
                fallbackProducts.slice(0, 4).map((p) => (
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
                      <p className="mt-auto pt-3 text-lg font-semibold text-ink-900">
                        {formatPrice(p.price)}
                        {p.priceMax ? ` to ${formatPrice(p.priceMax)}` : ''}
                      </p>
                    </div>
                  </article>
                ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/products" className="btn-outline-ink">
            View all products
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
