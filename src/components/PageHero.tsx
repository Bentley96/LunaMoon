import type { ReactNode } from 'react';

/**
 * Banner at the top of an interior page. Mirrors the existing site: a
 * full-bleed photo darkened behind the page title.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      {image && (
        <img src={image} alt="" aria-hidden="true"
             className="absolute inset-0 h-full w-full object-cover opacity-35" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/92 via-ink-950/75 to-ink-900/45"
           aria-hidden="true" />

      <div className="container-xl relative px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && (
            <span className="eyebrow text-blush-300">{eyebrow}</span>
          )}
          <h1 className="mt-3 text-4xl uppercase leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {intro && <div className="mt-5 text-lg leading-relaxed text-ink-100">{intro}</div>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
