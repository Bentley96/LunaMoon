import { Link, useParams } from 'react-router-dom';
import { getTreatmentCategories, getTreatments } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import TreatmentCard from '../components/TreatmentCard';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

export default function TreatmentsPage() {
  // The same component serves /treatments and /treatments/category/:category.
  const { category } = useParams<{ category?: string }>();

  const treatments = useAsync(() => getTreatments({ category }), [category]);
  const categories = useAsync(() => getTreatmentCategories(), []);

  const active = categories.data?.find((c) => c.slug === category);

  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title={active?.name ?? 'Our treatments'}
        intro={
          active?.description ||
          'Every treatment begins with a consultation, so you know what to expect before anything starts.'
        }
      />

      <section className="section-padding">
        <div className="container-xl">
          {categories.data && categories.data.length > 0 && (
            <nav className="mb-10 flex flex-wrap gap-2" aria-label="Treatment categories">
              <Link
                to="/treatments"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !category
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-50 text-ink-700 hover:bg-blush-50 hover:text-blush-700'
                }`}
              >
                All
              </Link>
              {categories.data.map((c) => (
                <Link
                  key={c.slug}
                  to={`/treatments/category/${c.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === c.slug
                      ? 'bg-ink-900 text-white'
                      : 'bg-ink-50 text-ink-700 hover:bg-blush-50 hover:text-blush-700'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}

          {treatments.loading ? (
            <Spinner label="Loading treatments…" />
          ) : treatments.error ? (
            <ErrorState message={treatments.error} onRetry={treatments.reload} />
          ) : treatments.data && treatments.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.data.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-ink-500">
              No treatments have been published yet. Add them under{' '}
              <strong>Treatments</strong> in wp-admin.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
