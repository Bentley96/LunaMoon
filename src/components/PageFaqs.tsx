import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { faqsForProduct, faqsForRoute } from '../content/faqs';
import FaqAccordion, { FaqSchema } from './FaqAccordion';
import SectionHeading from './ui/SectionHeading';

/**
 * The FAQ block that sits at the bottom of a page.
 *
 * Which questions appear is decided by src/content/faqs.ts, keyed on the route
 * (or the product slug), so a page only has to say "FAQs go here" and the
 * content file decides what they are.
 *
 * Renders nothing when a page has no questions assigned, so it's safe to drop
 * onto any page.
 */
export default function PageFaqs({
  route,
  product,
  className = '',
}: {
  /** The route whose questions to show, e.g. "/book-online". */
  route?: string;
  /** Or a product slug, for a product page. */
  product?: string;
  className?: string;
}) {
  const groups = product ? faqsForProduct(product) : route ? faqsForRoute(route) : [];
  if (!groups.length) return null;

  const all = groups.flatMap((g) => g.faqs);
  // One group needs no heading of its own — the section heading says it.
  const showGroupTitles = groups.length > 1;

  return (
    <section className={`section-padding bg-ink-50 ${className}`}>
      <div className="container-prose">
        <SectionHeading
          eyebrow="FAQs"
          title="FREQUENTLY ASKED QUESTIONS"
          intro={
            groups.length === 1
              ? `${groups[0].title}: the questions we're asked most.`
              : 'The questions we’re asked most, by treatment.'
          }
        />

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              {showGroupTitles && (
                <h3 className="mb-2 font-display text-xl uppercase tracking-wide text-ink-900">
                  {group.title}
                </h3>
              )}
              <FaqAccordion faqs={group.faqs} level={4} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/faqs" className="btn-outline-ink">
            See all FAQs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <FaqSchema faqs={all} />
    </section>
  );
}
