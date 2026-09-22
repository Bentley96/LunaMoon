import { useState } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { packages } from '../content/packages';
import { formatPrice } from '../lib/format';
import { BOOKING_URL } from '../config/site';
import KlarnaBadge from './KlarnaBadge';

const STEP = 12;

/**
 * The clinic's booking packages, with prices, so nobody has to leave the site
 * to find out what something costs.
 *
 * Booking still happens on that-time.co.uk. There's no per-package URL to link
 * to — the booking page is a JS app with checkboxes rather than a page per
 * service — so every button goes to the same place.
 */
export default function PackageGrid() {
  const [shown, setShown] = useState(STEP);
  const visible = packages.slice(0, shown);
  const remaining = packages.length - shown;

  return (
    <section id="packages" className="section-padding scroll-mt-32">
      <div className="container-xl">
        <div className="container-prose text-center">
          <span className="eyebrow">Packages</span>
          <h2 className="mt-3 text-3xl sm:text-4xl">Our packages &amp; prices</h2>
          <p className="mt-5 leading-relaxed text-ink-600">
            {packages.length} packages, from {formatPrice(packages[0].price)}, across laser
            treatments, facial treatments and body contouring. Pick the one that suits you and book
            your sessions online, any time.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((pkg) => (
            <li key={pkg.name} className="card card-hover flex flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl leading-snug text-ink-900">{pkg.name}</h3>
                <p className="shrink-0 font-display text-2xl font-semibold text-blush-800">
                  {formatPrice(pkg.price)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                {pkg.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {pkg.duration}
                  </span>
                )}
                {pkg.deposit && <span className="text-ink-400">Deposit required</span>}
              </div>

              {/* Always-present grower, so the button sits on the card's
                  bottom edge whether or not there's a summary — without it,
                  cards with no description leave the button floating mid-card
                  and the row looks ragged. */}
              <div className="mt-4 flex-1">
                {pkg.summary && (
                  <p className="text-sm leading-relaxed text-ink-600">{pkg.summary}</p>
                )}
              </div>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-6 w-full"
              >
                Book this package
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        {remaining > 0 && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setShown(packages.length)} className="btn-outline-ink">
              Show all {packages.length} packages
            </button>
          </div>
        )}

        {/* Packages run to several hundred pounds, so how to spread the cost
            belongs with the prices rather than only on the contact page. It
            says "ask" rather than "pay with", because the clinic arranges it
            rather than the booking system taking it. */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          <KlarnaBadge className="h-6" />
          <p className="text-sm text-ink-600">
            Pay monthly options available. Ask us about Klarna when you book.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-ink-400">
          Prices correct at the time of publishing. Availability and final prices are confirmed when
          you book.
        </p>
      </div>
    </section>
  );
}
