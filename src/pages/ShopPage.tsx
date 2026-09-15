import { useState } from 'react';
import { getProductCategories, getProducts, type ProductQuery } from '../lib/woo';
import { bootstrap } from '../lib/bootstrap';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

const SORT_OPTIONS: { label: string; orderby: ProductQuery['orderby']; order: ProductQuery['order'] }[] = [
  { label: 'Most popular', orderby: 'popularity', order: 'desc' },
  { label: 'Newest', orderby: 'date', order: 'desc' },
  { label: 'Price: low to high', orderby: 'price', order: 'asc' },
  { label: 'Price: high to low', orderby: 'price', order: 'desc' },
];

export default function ShopPage() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState(0);

  const categories = useAsync(
    () => (bootstrap.hasWoo ? getProductCategories() : Promise.resolve([])),
    [],
  );

  const products = useAsync(
    () =>
      bootstrap.hasWoo
        ? getProducts({
            category: category || undefined,
            orderby: SORT_OPTIONS[sort].orderby,
            order: SORT_OPTIONS[sort].order,
            per_page: 24,
          })
        : Promise.resolve([]),
    [category, sort],
  );

  if (!bootstrap.hasWoo) {
    return (
      <>
        <PageHero title="Shop" />
        <section className="section-padding">
          <p className="container-prose text-center text-ink-500">
            The shop isn't available yet — activate WooCommerce in WordPress to switch it on.
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Skincare, aftercare & gift vouchers"
        intro="The same professional products we use in clinic, plus vouchers that can be spent on any treatment."
      />

      <section className="section-padding">
        <div className="container-xl">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <nav className="flex flex-wrap gap-2" aria-label="Product categories">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !category
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-50 text-ink-700 hover:bg-blush-50 hover:text-blush-700'
                }`}
              >
                All
              </button>
              {(categories.data ?? [])
                .filter((c) => c.count > 0)
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(String(c.id))}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      category === String(c.id)
                        ? 'bg-ink-900 text-white'
                        : 'bg-ink-50 text-ink-700 hover:bg-blush-50 hover:text-blush-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
            </nav>

            <label className="flex items-center gap-2 text-sm text-ink-600">
              <span className="sr-only sm:not-sr-only">Sort by</span>
              <select
                className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                value={sort}
                onChange={(e) => setSort(Number(e.target.value))}
              >
                {SORT_OPTIONS.map((option, i) => (
                  <option key={option.label} value={i}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {products.loading ? (
            <Spinner label="Loading products…" />
          ) : products.error ? (
            <ErrorState message={products.error} onRetry={products.reload} />
          ) : products.data && products.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-ink-500">
              No products found. Add them under <strong>Products</strong> in wp-admin.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
