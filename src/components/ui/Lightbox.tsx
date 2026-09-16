import { useEffect, useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Shown under the image; omitted when there's nothing to say. */
  caption?: ReactNode;
}

/**
 * Full-size image over a dimmed page.
 *
 * Closes on Escape or a click on the backdrop, steps with the arrow keys, locks
 * the page behind it from scrolling, and puts focus on the close button so none
 * of that needs a mouse.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onStep,
  label,
}: {
  images: LightboxImage[];
  /** Which image is showing. The component renders nothing when null. */
  index: number | null;
  onClose: () => void;
  onStep: (by: number) => void;
  /** Describes the dialog, e.g. "Studio photo 3 of 14". */
  label: string;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;

    closeButton.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, onStep]);

  if (index === null) return null;
  const shown = images[index];
  if (!shown) return null;

  const arrow =
    'absolute rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4 sm:p-8"
    >
      <button
        type="button"
        ref={closeButton}
        onClick={onClose}
        aria-label="Close"
        className={`${arrow} right-4 top-4`}
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          {/* Side arrows where there's room beside the image. On a phone there
              isn't: they'd sit on top of it, so they drop to a row underneath. */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            aria-label="Previous"
            className={`${arrow} bottom-6 right-1/2 mr-3 sm:bottom-auto sm:right-auto sm:left-6 sm:top-1/2 sm:mr-0 sm:-translate-y-1/2`}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            aria-label="Next"
            className={`${arrow} bottom-6 left-1/2 ml-3 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:ml-0 sm:-translate-y-1/2`}
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}

      <figure
        // Clicking the image itself shouldn't dismiss it; only the backdrop.
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-3xl overflow-auto pb-20 sm:pb-0"
      >
        <img
          src={shown.src}
          width={shown.width}
          height={shown.height}
          alt={shown.alt}
          // Never wider than the overlay, and never scaled past its own width,
          // where it would only get blurrier.
          style={{ maxWidth: `min(100%, ${shown.width}px)` }}
          className="mx-auto max-h-[75vh] w-auto rounded-xl bg-white object-contain p-2"
        />
        {shown.caption && (
          <figcaption className="mt-4 text-center text-white">{shown.caption}</figcaption>
        )}
      </figure>
    </div>
  );
}
