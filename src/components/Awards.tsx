import { useCallback, useEffect, useRef, useState } from 'react';
import { Award as AwardIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { awards, awardsIntro } from '../content/awards';
import SectionHeading from './ui/SectionHeading';

/**
 * The award certificates the existing homepage carries beside "What we do".
 *
 * Three of them fit on one row, so they're laid out rather than put behind the
 * carousel arrows the existing site uses — there's nothing to page through.
 * Each certificate is a button that opens it full size, because at card width
 * the wording on a certificate can't be read.
 */
export default function Awards() {
  // Index of the certificate shown full size, or null when the grid is closed.
  const [open, setOpen] = useState<number | null>(null);
  // The card that opened the lightbox, so focus can go back to it on close.
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  const step = useCallback((by: number) => {
    setOpen((i) => (i === null ? i : (i + by + awards.length) % awards.length));
  }, []);

  useEffect(() => {
    if (open === null) return;

    // Move focus into the dialog so Escape and the arrows work without a click,
    // and so a screen reader lands on the certificate rather than the page.
    closeButton.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);

    // The page behind must not scroll under the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  const shown = open === null ? null : awards[open];

  return (
    <section className="section-padding bg-blush-50">
      <div className="container-lg">
        <SectionHeading
          eyebrow="Awards & recognition"
          title="AWARD-WINNING AESTHETICS IN PRESTON"
          intro={awardsIntro}
        />

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, i) => (
            <li key={award.year}>
              <button
                type="button"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-blush-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-700"
              >
                {/* object-contain, not cover: a certificate cropped to fill the
                    frame loses the wording that makes it worth showing. */}
                <img
                  src={award.image}
                  width={award.width}
                  height={award.height}
                  alt={award.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-white object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col border-t border-blush-100 p-5">
                  <div className="flex items-center gap-2">
                    <AwardIcon className="h-4 w-4 shrink-0 text-blush-700" aria-hidden="true" />
                    <span className="font-display text-lg text-ink-900">{award.year}</span>
                  </div>
                  <p className="mt-2 font-medium text-ink-900">{award.title}</p>
                  <p className="mt-1 text-sm text-ink-600">{award.organisation}</p>
                  {award.detail && <p className="mt-1 text-sm text-ink-500">{award.detail}</p>}
                  <span
                    aria-hidden="true"
                    className="mt-4 text-sm font-medium text-blush-700 underline underline-offset-4"
                  >
                    View certificate
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {shown && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${shown.organisation} ${shown.year} certificate`}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4 sm:p-8"
        >
          <button
            type="button"
            ref={closeButton}
            onClick={close}
            aria-label="Close certificate"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          {awards.length > 1 && (
            <>
              {/* Side arrows on a wide screen, where there's room beside the
                  certificate. On a phone there isn't: they'd sit on top of it
                  and cover the wording, so they drop to a row underneath. */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous certificate"
                className="absolute bottom-6 right-1/2 mr-3 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-auto sm:right-auto sm:left-6 sm:top-1/2 sm:mr-0 sm:-translate-y-1/2"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next certificate"
                className="absolute bottom-6 left-1/2 ml-3 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:ml-0 sm:-translate-y-1/2"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          )}

          <figure
            // Clicking the certificate itself shouldn't dismiss it; only the
            // backdrop around it should.
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-3xl overflow-auto pb-20 sm:pb-0"
          >
            <img
              src={shown.image}
              width={shown.width}
              height={shown.height}
              alt={shown.alt}
              // Never wider than the overlay, and never scaled past its own
              // width, where it would only get blurrier.
              style={{ maxWidth: `min(100%, ${shown.width}px)` }}
              className="mx-auto max-h-[75vh] w-auto rounded-xl bg-white object-contain p-2"
            />
            <figcaption className="mt-4 text-center text-white">
              <span className="font-display text-lg">
                {shown.year} — {shown.title}
              </span>
              <span className="mt-1 block text-sm text-ink-200">{shown.organisation}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
