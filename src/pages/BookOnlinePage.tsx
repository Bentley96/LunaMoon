import { ExternalLink } from 'lucide-react';
import PageHero from '../components/PageHero';
import PackageGrid from '../components/PackageGrid';
import ServiceAccordion from '../components/ServiceAccordion';
import { banners } from '../config/banners';
import ContactStrip from '../components/ContactStrip';
import PageFaqs from '../components/PageFaqs';
import { BOOKING_URL } from '../config/site';
import { bookOnlineCta } from '../content/home';

/**
 * Booking.
 *
 * Lists the packages and their prices so nobody has to leave the site to find
 * out what something costs, then hands off to that-time.co.uk to actually book.
 * It deliberately does not re-implement the calendar — availability, deposits
 * and rescheduling belong there, and duplicating them would mean two sources of
 * truth for whether a slot is free.
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
        {/* All three share btn-* (not btn-*-lg) so they match the homepage
            hero: same height, same font size, one line. Mixing sizes here
            stretched the shorter buttons, and the longer labels pushed the
            third onto a second row — the column is 576px wide. */}
        <div className="flex flex-wrap gap-3">
          <a href="#packages" className="btn-primary">
            Packages
          </a>
          <a href="#services" className="btn-outline">
            Treatments
          </a>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="btn-outline">
            Make a booking
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <PackageGrid />
      <ServiceAccordion />

      <section className="pb-20">
        <div className="container-lg">
          <div className="rounded-3xl bg-ink-950 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl sm:text-4xl">{bookOnlineCta.heading}</h2>
            <div className="mx-auto mt-5 max-w-2xl space-y-3 text-lg text-ink-200">
              {bookOnlineCta.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="btn-primary-lg mt-8">
              Book your sessions
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-4 text-sm text-ink-400">Opens in a new tab.</p>
          </div>
        </div>
      </section>

      <PageFaqs route="/book-online" />

      <ContactStrip />
    </>
  );
}
