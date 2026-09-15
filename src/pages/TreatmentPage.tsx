import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { getTreatment } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/format';
import { useBooking } from '../store/BookingContext';
import { useCart } from '../store/CartContext';
import PageHero from '../components/PageHero';
import RichText from '../components/ui/RichText';
import ImageFrame from '../components/ui/ImageFrame';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

export default function TreatmentPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data, loading, error, reload } = useAsync(() => getTreatment(slug), [slug]);
  const { openBooking } = useBooking();
  const { add, busy } = useCart();

  if (loading) {
    return (
      <div className="pt-20">
        <Spinner label="Loading treatment…" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="section-padding">
        <ErrorState message={error ?? 'Treatment not found.'} onRetry={reload} />
        <div className="text-center">
          <Link to="/treatments" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all treatments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={data.categories[0]?.name ?? 'Treatment'}
        title={data.title}
        intro={data.summary}
      />

      <section className="section-padding">
        <div className="container-lg grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            <ImageFrame
              src={data.image}
              alt={data.title}
              label="Treatment image"
              ratio="aspect-[16/9]"
              className="mb-10 rounded-2xl"
            />
            {data.content ? (
              <RichText html={data.content} />
            ) : (
              <p className="text-ink-500">
                Add the treatment description in wp-admin and it will appear here.
              </p>
            )}
          </div>

          {/* Booking panel — sticky on desktop so the CTA is always in reach. */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="card p-6 shadow-sm">
              <dl className="space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-500">Price from</dt>
                  <dd className="text-xl font-semibold text-ink-900">
                    {data.priceFrom === null ? 'On consultation' : formatPrice(data.priceFrom)}
                  </dd>
                </div>
                {data.duration && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-ink-500">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      Duration
                    </dt>
                    <dd className="font-medium text-ink-900">{data.duration}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={() => openBooking(data.title)}
                  className="btn-primary w-full"
                >
                  Request appointment
                </button>

                {/* When the treatment is linked to a WooCommerce product it can
                    also be paid for up front (deposit or full price). */}
                {data.productId && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void add(data.productId!, 1).catch(() => {})}
                    className="btn-outline-ink w-full"
                  >
                    Book & pay online
                  </button>
                )}

                {!data.productId && data.bookingUrl && (
                  <a
                    href={data.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline-ink w-full"
                  >
                    Book online
                  </a>
                )}
              </div>
            </div>

            <Link to="/treatments" className="btn-ghost mt-6 justify-center">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All treatments
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
