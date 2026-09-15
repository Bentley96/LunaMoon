import type { ReactNode } from 'react';

/** Compact banner at the top of an interior page. */
export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-ink-950 text-white">
      <div className="container-xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && <span className="eyebrow text-gold-400">{eyebrow}</span>}
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
          {intro && <div className="mt-5 text-lg leading-relaxed text-ink-200">{intro}</div>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
