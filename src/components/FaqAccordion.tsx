import { ChevronDown } from 'lucide-react';
import type { Faq } from '../content/faqs';
import RichText from './ui/RichText';

/**
 * An answer written in wp-admin arrives as HTML; the ones in src/content are
 * plain text. `html` says which, so an editor's links and lists survive and a
 * plain answer is never parsed as markup.
 */
export type FaqItem = Faq & { html?: boolean };

/**
 * A list of questions, each opening to its answer.
 *
 * Built on <details>/<summary> rather than buttons and state: the answers stay
 * in the DOM when collapsed, so they're searchable with the browser's own find
 * and indexable, and the open/close behaviour, keyboard handling and ARIA come
 * from the browser rather than from code that has to get them right.
 */
export default function FaqAccordion({
  faqs,
  /** Heading level for the questions, so each page keeps a sane outline. */
  level = 3,
}: {
  faqs: FaqItem[];
  level?: 2 | 3 | 4;
}) {
  const Heading = `h${level}` as 'h2' | 'h3' | 'h4';

  return (
    <ul className="divide-y divide-ink-100 border-y border-ink-100">
      {faqs.map((faq) => (
        <li key={faq.question}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
              <Heading className="font-display text-lg text-ink-900 sm:text-xl">
                {faq.question}
              </Heading>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            {faq.html ? (
              <RichText html={faq.answer} className="pb-6 pr-9 text-ink-600" />
            ) : (
              <p className="pb-6 pr-9 leading-relaxed text-ink-600">{faq.answer}</p>
            )}
          </details>
        </li>
      ))}
    </ul>
  );
}

/**
 * FAQPage structured data for the questions on the current page.
 *
 * Only the ones actually rendered: schema that describes content a visitor
 * can't see on the page is a guidelines violation, not a shortcut.
 */
export function FaqSchema({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      // Schema takes the words, not the markup around them.
      acceptedAnswer: { '@type': 'Answer', text: faq.answer.replace(/<[^>]*>/g, '').trim() },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Escaped so a "<" in an answer can't close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
