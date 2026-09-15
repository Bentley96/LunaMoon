import type { ReactNode } from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  tone = 'dark',
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'center' | 'left';
  /** "light" inverts the colours for use on an ink background. */
  tone?: 'dark' | 'light';
  children?: ReactNode;
}) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-4 ${alignment} ${align === 'center' ? 'max-w-2xl' : ''}`}>
      {eyebrow && (
        <span className={`eyebrow ${tone === 'light' ? 'text-gold-400' : ''}`}>{eyebrow}</span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl ${tone === 'light' ? 'text-white' : 'text-ink-900'}`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`text-lg leading-relaxed ${tone === 'light' ? 'text-ink-200' : 'text-ink-600'}`}>
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
