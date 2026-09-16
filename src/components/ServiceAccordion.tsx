import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Clock, ExternalLink } from 'lucide-react';
import { categoryId, categoryIndexForAnchor, serviceCategories, serviceCount } from '../content/services';
import { formatPrice } from '../lib/format';
import { BOOKING_URL } from '../config/site';

/**
 * Individual services, grouped into the same categories the booking page uses.
 *
 * An accordion rather than a grid: 147 services would be an unreadable wall
 * laid out flat, and grouping matches how people actually look — by the kind of
 * treatment they're after. Everything starts collapsed so the page opens short.
 *
 * Rows rather than cards, too. At this count a card each would be enormous
 * scrolling; a dense row puts name, duration and price on one line where they
 * can be compared down the column.
 */
export default function ServiceAccordion() {
  // Index of the open panel, or null. Single-open keeps the page navigable —
  // with 19 categories, allowing all of them open loses the overview entirely.
  const [open, setOpen] = useState<number | null>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  // A link can name a category in its hash — the "IPL Laser Hair Removal" menu
  // item is /book-online#ipl-laser-hair-removal. Landing on the page with the
  // category still shut would leave the visitor to find it among 19 others, so
  // open it and bring it into view.
  //
  // Keyed on location.key, not the hash, so clicking the same menu item again
  // while already here still scrolls back to it.
  const { hash, key } = useLocation();
  useEffect(() => {
    const anchor = decodeURIComponent(hash.replace(/^#/, ''));
    if (!anchor) return;

    const index = categoryIndexForAnchor(anchor);
    if (index === -1) return;

    setOpen(index);
    // After paint, so the panel it scrolls to is the open one.
    const id = requestAnimationFrame(() => {
      items.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [hash, key]);

  const cheapest = Math.min(
    ...serviceCategories.flatMap((c) => c.services.map((s) => s.price)),
  );

  return (
    <section id="services" className="section-padding bg-ink-50 scroll-mt-32">
      <div className="container-lg">
        <div className="container-prose text-center">
          <span className="eyebrow">Services</span>
          <h2 className="mt-3 text-3xl sm:text-4xl">Individual treatments</h2>
          <p className="mt-5 leading-relaxed text-ink-600">
            {serviceCount} treatments across {serviceCategories.length} categories — laser
            treatments, facial treatments, microneedling, skin boosters, body contouring and more,
            from {formatPrice(cheapest)}. Choose a category to see prices.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-ink-200 bg-white">
          {serviceCategories.map((category, i) => {
            const isOpen = open === i;
            const panelId = `service-panel-${i}`;
            const from = Math.min(...category.services.map((s) => s.price));

            return (
              <div
                key={category.name}
                id={categoryId(category.name)}
                ref={(el) => {
                  items.current[i] = el;
                }}
                // Clears the fixed header when a link jumps straight here.
                className="scroll-mt-40 border-b border-ink-100 last:border-b-0"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-blush-50 sm:px-6"
                  >
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-blush-700 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                    <span className="flex-1 font-display text-lg text-ink-900 sm:text-xl">
                      {category.name}
                    </span>
                    <span className="shrink-0 text-right text-sm text-ink-500">
                      <span className="hidden sm:inline">
                        {category.services.length} treatment
                        {category.services.length === 1 ? '' : 's'} ·{' '}
                      </span>
                      from <span className="font-semibold text-ink-900">{formatPrice(from)}</span>
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div id={panelId} className="border-t border-ink-100 bg-ink-50/40">
                    <ul className="divide-y divide-ink-100">
                      {category.services.map((service) => (
                        <li
                          key={service.name}
                          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4 sm:px-6"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-ink-900">{service.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                              {service.duration && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                  {service.duration}
                                </span>
                              )}
                              {service.deposit && (
                                <span className="text-ink-400">Deposit required</span>
                              )}
                            </div>
                            {service.summary && (
                              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                                {service.summary}
                              </p>
                            )}
                          </div>
                          <p className="font-display text-xl font-semibold text-blush-800">
                            {formatPrice(service.price)}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <div className="px-5 py-5 sm:px-6">
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary w-full sm:w-auto"
                      >
                        Book {category.name.toLowerCase()}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-ink-400">
          Prices correct at the time of publishing. Availability and final prices are confirmed when
          you book.
        </p>
      </div>
    </section>
  );
}
