import { Link } from 'react-router-dom';
import { getFaqs } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import { banners } from '../config/banners';
import ContactStrip from '../components/ContactStrip';
import BookOnlineCTA from '../components/BookOnlineCTA';
import FaqAccordion, { FaqSchema } from '../components/FaqAccordion';
import { faqCount, faqGroups } from '../content/faqs';
import { faqTeaser } from '../content/home';

/**
 * Every question the clinic answers, grouped by treatment.
 *
 * The groups come from src/content/faqs.ts, which is also what feeds the FAQ
 * block at the bottom of the individual pages — so an answer is written once
 * and can't drift between the two places it appears.
 *
 * Anything added under FAQs in wp-admin is appended at the end rather than
 * replacing these, so adding one question there can't hide the other ninety.
 */
export default function FaqsPage() {
  const { data } = useAsync(() => getFaqs(), []);
  const extra = data ?? [];

  const all = [
    ...faqGroups.flatMap((g) => g.faqs),
    ...extra.map((f) => ({ question: f.question, answer: f.answer, html: true })),
  ];

  return (
    <>
      <PageHero
        eyebrow="Luna Moon Aesthetics"
        title="FREQUENTLY ASKED QUESTIONS"
        intro={faqTeaser.body}
        banner={banners['faqs']}
      />

      <section className="section-padding">
        <div className="container-prose">
          <p className="text-center text-ink-500">
            {faqCount} questions across {faqGroups.length} treatments. Can’t see yours?{' '}
            <Link to="/contact" className="text-blush-700 underline underline-offset-4">
              Get in touch
            </Link>
            .
          </p>

          {/* A nav rather than a list: 13 groups is a long way to scroll past
              to reach the one you came for. */}
          <nav aria-label="Jump to a topic" className="mt-8 flex flex-wrap justify-center gap-2">
            {faqGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full border border-ink-200 px-4 py-1.5 text-sm text-ink-600 transition-colors hover:border-blush-500 hover:text-blush-700"
              >
                {group.title}
              </a>
            ))}
          </nav>

          <div className="mt-14 space-y-12">
            {faqGroups.map((group) => (
              // scroll-mt clears the fixed header when a chip jumps here.
              <section key={group.id} id={group.id} className="scroll-mt-40">
                <h2 className="mb-3 font-display text-2xl uppercase tracking-wide text-ink-900">
                  {group.title}
                </h2>
                <FaqAccordion faqs={group.faqs} />
              </section>
            ))}

            {extra.length > 0 && (
              <section id="more" className="scroll-mt-40">
                <h2 className="mb-3 font-display text-2xl uppercase tracking-wide text-ink-900">
                  More questions
                </h2>
                <FaqAccordion
                  faqs={extra.map((f) => ({
                    question: f.question,
                    answer: f.answer,
                    html: true,
                  }))}
                />
              </section>
            )}
          </div>
        </div>
      </section>

      <FaqSchema faqs={all} />

      <ContactStrip />
      <BookOnlineCTA />
    </>
  );
}
