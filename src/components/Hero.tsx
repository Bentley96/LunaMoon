import { Link } from 'react-router-dom';
import { banners } from '../config/banners';
import { hero } from '../content/home';
import Logo from './Logo';

/**
 * Homepage hero — the full-bleed clinic photo with the wordmark, the brand
 * line under it, and the two things the clinic wants people to do: book a
 * consultation, or go and read what's on offer.
 */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      {/* Two crops, framed differently — see src/config/banners.ts. */}
      <picture>
        <source media="(max-width: 639px)" srcSet={banners.home.mobile} />
        <img
          src={banners.home.desktop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {/* Darkens only the side the lockup sits on, so the subject keeps its
          exposure. Vertical on mobile, where the crop is portrait. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/86 to-ink-950/40 sm:bg-gradient-to-r sm:from-ink-950/95 sm:via-ink-950/82 sm:to-transparent"
        aria-hidden="true"
      />

      <div className="container-xl relative px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="max-w-2xl animate-fade-up">
          {/* The lockup is artwork, so it's hidden from assistive tech and the
              heading's actual text is the business name — otherwise the h1
              would read as the logo's strapline rather than "Luna Moon
              Aesthetics", which is what the business is called in copy. */}
          <h1>
            <span aria-hidden="true">
              <Logo tone="light" className="h-40 sm:h-52 lg:h-60" />
            </span>
            <span className="sr-only">Luna Moon Aesthetics</span>
          </h1>

          <p className="mt-6 font-display text-xl uppercase tracking-[0.2em] text-gold-400 sm:text-2xl">
            {hero.eyebrow}
          </p>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-100">{hero.blurb}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-200">{hero.detail}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              Book your consultation
            </Link>
            <a href="#more" className="btn-outline">
              Explore treatments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
