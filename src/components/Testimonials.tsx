import { ExternalLink, Quote, Star } from 'lucide-react';
import { getTestimonials } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import { reviews as defaultReviews, reviewSummary } from '../content/home';
import { business } from '../config/site';
import SectionHeading from './ui/SectionHeading';

export default function Testimonials() {
  const { data } = useAsync(() => getTestimonials(6), []);

  // WordPress wins once testimonials exist there; until then show the reviews
  // carried over from the existing site.
  const items =
    data && data.length
      ? data.map((t) => ({ author: t.author, quote: t.quote, rating: t.rating, date: '' }))
      : defaultReviews;

  if (!items.length) return null;

  return (
    <section className="section-padding bg-ink-50">
      <div className="container-xl">
        <SectionHeading
          eyebrow={`${reviewSummary.rating}, based on ${reviewSummary.count} ${reviewSummary.source} reviews`}
          title="What our clients say"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((review) => (
            <figure key={review.author + review.quote.slice(0, 20)}
                    className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
              <Quote className="h-7 w-7 text-blush-200" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">
                {review.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-ink-50 pt-4">
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-ink-200'}`}
                          aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-2 font-medium text-ink-900">{review.author}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Only six fit here, and the rest are more persuasive read on Google
            than retyped by us, so send people to the listing for the full set. */}
        {business.googleReviewsUrl && (
          <div className="mt-10 text-center">
            <a
              href={business.googleReviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              See all our Google reviews
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
