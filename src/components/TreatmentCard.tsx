import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Treatment } from '../lib/wp';
import { formatPrice } from '../lib/format';
import { useBooking } from '../store/BookingContext';
import ImageFrame from './ui/ImageFrame';

export default function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const { openBooking } = useBooking();

  return (
    <article className="card card-hover flex flex-col">
      <Link to={`/treatments/${treatment.slug}`} className="block">
        <ImageFrame
          src={treatment.image}
          alt={treatment.title}
          label="Treatment image"
          ratio="aspect-[4/3]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {treatment.categories[0] && (
          <span className="eyebrow mb-2">{treatment.categories[0].name}</span>
        )}

        <h3 className="text-xl leading-snug">
          <Link
            to={`/treatments/${treatment.slug}`}
            className="text-ink-900 transition-colors hover:text-blush-700"
          >
            {treatment.title}
          </Link>
        </h3>

        {treatment.summary && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{treatment.summary}</p>
        )}

        <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-ink-400">From</dt>
            <dd className="font-semibold text-ink-900">
              {treatment.priceFrom === null
                ? 'On consultation'
                : formatPrice(treatment.priceFrom)}
            </dd>
          </div>
          {treatment.duration && (
            <div className="flex items-center gap-1.5 text-ink-500">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <dd>{treatment.duration}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={() => openBooking(treatment.title)}
          className="btn-primary mt-5 w-full"
        >
          Book this treatment
        </button>
      </div>
    </article>
  );
}
