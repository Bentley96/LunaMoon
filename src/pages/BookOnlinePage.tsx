import { CalendarCheck, CreditCard, ExternalLink, Phone } from 'lucide-react';
import PageHero from '../components/PageHero';
import { banners } from '../config/banners';
import ContactStrip from '../components/ContactStrip';
import { business, BOOKING_URL } from '../config/site';
import { bookOnlineCta } from '../content/home';

/**
 * Booking.
 *
 * The clinic takes appointments through that-time.co.uk, not WooCommerce, so
 * this page explains what's bookable and hands off. It deliberately does not
 * re-implement the booking calendar: availability, deposits and rescheduling
 * all live in that system.
 */
export default function BookOnlinePage() {
  return (
    <>
      <PageHero
        eyebrow="Luna Moon Aesthetics"
        title="BOOK NOW"
        intro="Check availability and book your appointment online, any time."
        banner={banners['book-online']}
      >
        <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="btn-primary-lg">
          Open the booking system
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </PageHero>

      <section className="section-padding">
        <div className="container-lg">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: CalendarCheck,
                title: 'Packages & treatments',
                body: 'Browse our full list of treatments and package offers, with live availability and instant confirmation.',
              },
              {
                icon: CreditCard,
                title: 'Pay monthly & Klarna',
                body: business.finance + ' Get in touch to find out more.',
              },
              {
                icon: Phone,
                title: 'Prefer to talk it through?',
                body: `Call the clinic on ${business.phone} and we'll help you pick the right treatment.`,
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-ink-100 p-7">
                <span className="inline-flex rounded-2xl bg-blush-50 p-3 text-blush-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl">{title}</h2>
                <p className="mt-2 leading-relaxed text-ink-600">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-ink-950 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl sm:text-4xl">{bookOnlineCta.heading}</h2>
            <div className="mx-auto mt-5 max-w-2xl space-y-3 text-lg text-ink-200">
              {bookOnlineCta.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="btn-primary-lg mt-8">
              Book now
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-4 text-sm text-ink-400">
              Opens our booking system in a new tab.
            </p>
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
