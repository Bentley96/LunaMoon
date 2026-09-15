import type { ReactNode } from 'react';
import type { Banner } from '../config/banners';

/**
 * Banner at the top of an interior page.
 *
 * The supplied photography is bright, with the subject on the right and open
 * space on the left for the heading. So the image runs at full exposure and the
 * scrim is a horizontal gradient that only darkens the left — enough to hold
 * white text, fading out before it reaches the subject. Dimming the whole image
 * would have flattened photography that was framed deliberately.
 *
 * `banner` supplies two crops (1920x650 desktop, 360x620 mobile) which differ in
 * framing, so they go through <picture> with a media query rather than one image
 * stretched to both shapes. `image` is the single-image fallback for pages with
 * no banner artwork yet.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  banner,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  banner?: Banner;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="
        relative isolate flex items-end overflow-hidden bg-ink-950 sm:items-center
        min-h-[26rem] sm:min-h-[22rem] lg:min-h-[27rem]
      "
    >
      {banner ? (
        <picture>
          {banner.mobile && <source media="(max-width: 639px)" srcSet={banner.mobile} />}
          <img
            src={banner.desktop}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      ) : (
        image && (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
        )
      )}

      {/* Left-weighted scrim. Vertical on mobile, where the portrait crops put
          the subject in the middle and the heading sits over the lower half. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/75 to-ink-950/25 sm:bg-gradient-to-r sm:from-ink-950/95 sm:via-ink-950/82 sm:to-transparent"
        aria-hidden="true"
      />

      <div className="container-xl relative w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-xl">
          {eyebrow && <span className="eyebrow text-blush-300">{eyebrow}</span>}
          <h1 className="mt-3 text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro && <div className="mt-5 text-lg leading-relaxed text-ink-100">{intro}</div>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
