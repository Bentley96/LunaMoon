import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { studioPhotos } from '../content/studio';
import useLightbox from '../hooks/useLightbox';
import Lightbox from './ui/Lightbox';

/**
 * A look around the studio, in the slot the homepage used to give one photo.
 *
 * The existing site shows these as a strip of thumbnails; keeping the strip
 * means the whole set is visible at a glance rather than hidden behind arrows,
 * while the large frame above it gives one photo enough size to read. Clicking
 * either opens it full size, where the portrait shots aren't cropped.
 */
export default function StudioCarousel() {
  const [current, setCurrent] = useState(0);
  const lightbox = useLightbox(studioPhotos.length);

  const photo = studioPhotos[current];
  const step = (by: number) =>
    setCurrent((i) => (i + by + studioPhotos.length) % studioPhotos.length);

  const arrow =
    'absolute top-1/2 -translate-y-1/2 rounded-full bg-ink-950/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-ink-950/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={(e) => lightbox.openAt(e.currentTarget, current)}
          className="group block w-full overflow-hidden rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-700"
          aria-label={`View full size: ${photo.alt}`}
        >
          <img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            // The first one is in the slot a single photo used to fill, high
            // enough up the page to be worth loading straight away.
            loading={current === 0 ? 'eager' : 'lazy'}
            className="aspect-[4/3] w-full bg-ink-100 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink-950/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Expand className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>

        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={`${arrow} left-3`}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" className={`${arrow} right-3`}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Horizontally scrollable so all fourteen stay reachable on a phone
          without the strip wrapping into four rows of thumbnails. */}
      <ul className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
        {studioPhotos.map((p, i) => (
          <li key={p.src} className="shrink-0 snap-start">
            <button
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show photo ${i + 1} of ${studioPhotos.length}`}
              aria-current={i === current}
              className={`block overflow-hidden rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-700 ${
                i === current ? 'ring-2 ring-blush-600' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={p.thumb}
                width={p.thumbWidth}
                height={p.thumbHeight}
                alt=""
                loading="lazy"
                className="h-16 w-20 bg-ink-100 object-cover sm:h-20 sm:w-24"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={studioPhotos}
        index={lightbox.index}
        onClose={lightbox.close}
        onStep={lightbox.step}
        label={
          lightbox.index === null
            ? 'Studio photo'
            : `Studio photo ${lightbox.index + 1} of ${studioPhotos.length}`
        }
      />
    </div>
  );
}
