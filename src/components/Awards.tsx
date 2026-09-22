import { Award as AwardIcon } from 'lucide-react';
import { awards, awardsIntro } from '../content/awards';
import SectionHeading from './ui/SectionHeading';
import useLightbox from '../hooks/useLightbox';
import Lightbox from './ui/Lightbox';

/**
 * The award certificates the existing homepage carries beside "What we do".
 *
 * Three of them fit on one row, so they're laid out rather than put behind the
 * carousel arrows the existing site uses — there's nothing to page through.
 * Each certificate is a button that opens it full size, because at card width
 * the wording on a certificate can't be read.
 */
export default function Awards() {
  const lightbox = useLightbox(awards.length);

  const images = awards.map((award) => ({
    src: award.image,
    width: award.width,
    height: award.height,
    alt: award.alt,
    caption: (
      <>
        <span className="font-display text-lg">
          {award.badge}: {award.title}
        </span>
        <span className="mt-1 block text-sm text-ink-200">{award.organisation}</span>
      </>
    ),
  }));

  return (
    <section className="section-padding bg-blush-50">
      <div className="container-lg">
        <SectionHeading
          eyebrow="Awards & qualifications"
          title="AWARD-WINNING AESTHETICS IN PRESTON"
          intro={awardsIntro}
        />

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award, i) => (
            <li key={award.id}>
              <button
                type="button"
                onClick={(e) => lightbox.openAt(e.currentTarget, i)}
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
                    <span className="font-display text-lg text-ink-900">{award.badge}</span>
                  </div>
                  <p className="mt-2 font-medium text-ink-900">{award.title}</p>
                  <p className="mt-1 text-sm text-ink-600">{award.organisation}</p>
                  {award.detail && <p className="mt-1 text-sm text-ink-500">{award.detail}</p>}
                  <span
                    aria-hidden="true"
                    // mt-auto, not a fixed gap: the cards carry different
                    // numbers of lines, so a fixed gap leaves the links at
                    // four different heights across the row.
                    className="mt-auto pt-4 text-sm font-medium text-blush-700 underline underline-offset-4"
                  >
                    View certificate
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        images={images}
        index={lightbox.index}
        onClose={lightbox.close}
        onStep={lightbox.step}
        label={
          lightbox.index === null
            ? 'Certificate'
            : `Certificate ${lightbox.index + 1} of ${awards.length}`
        }
      />
    </section>
  );
}
