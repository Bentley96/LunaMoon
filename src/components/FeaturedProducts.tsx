import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { bootstrap } from '../lib/bootstrap';
import { getProducts } from '../lib/woo';
import { useAsync } from '../hooks/useAsync';
import ProductCard from './ProductCard';
import SectionHeading from './ui/SectionHeading';
import Spinner from './ui/Spinner';

/** Homepage shop teaser. Hidden entirely when WooCommerce isn't active. */
export default function FeaturedProducts() {
  const { data, loading, error } = useAsync(
    () => (bootstrap.hasWoo ? getProducts({ per_page: 4, orderby: 'popularity' }) : Promise.resolve([])),
    [],
  );

  if (!bootstrap.hasWoo || error || (!loading && (!data || data.length === 0))) return null;

  return (
    <section className="section-padding">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Shop"
          title="Take the results home"
          intro="Professional skincare and aftercare, plus gift vouchers for someone who deserves one."
        />

        {loading ? (
          <Spinner label="Loading products…" />
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data!.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/shop" className="btn-outline-ink">
                Visit the shop
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
