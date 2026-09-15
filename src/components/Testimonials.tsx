import { Quote, Star } from 'lucide-react';
import { getTestimonials } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import SectionHeading from './ui/SectionHeading';

export default function Testimonials() {
  const { data, loading, error } = useAsync(() => getTestimonials(6), []);

  // Reviews are a nice-to-have on the homepage: if WordPress has none yet (or
  // the request fails) the section hides rather than showing an error.
  if (loading || error || !data || data.length === 0) return null;

  return (
    <section className="section-padding bg-blush-50">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Reviews"
          title="What our clients say"
          intro="Real words from people who've been through our doors."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((review) => (
            <figure key={review.id} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
              <Quote className="h-7 w-7 text-blush-200" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">
                {review.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-ink-50 pt-4">
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-ink-200'}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-2 font-medium text-ink-900">{review.author}</p>
                {review.treatment && <p className="text-sm text-ink-400">{review.treatment}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
