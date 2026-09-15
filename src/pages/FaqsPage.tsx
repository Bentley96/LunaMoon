import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFaqs } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import RichText from '../components/ui/RichText';
import ContactStrip from '../components/ContactStrip';
import BookOnlineCTA from '../components/BookOnlineCTA';
import Spinner from '../components/ui/Spinner';
import { faqTeaser } from '../content/home';

export default function FaqsPage() {
  const { data, loading } = useAsync(() => getFaqs(), []);
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Luna Moon Aesthetics"
        title="FREQUENTLY ASKED QUESTIONS"
        intro={faqTeaser.body}
        image="/images/facial-relaxing.webp"
      />

      <section className="section-padding">
        <div className="container-prose">
          {loading ? (
            <Spinner label="Loading FAQs…" />
          ) : data && data.length > 0 ? (
            <ul className="divide-y divide-ink-100 border-y border-ink-100">
              {data.map((faq) => {
                const open = openId === faq.id;
                return (
                  <li key={faq.id}>
                    <h2>
                      <button type="button" onClick={() => setOpenId(open ? null : faq.id)}
                              aria-expanded={open}
                              className="flex w-full items-center justify-between gap-4 py-5 text-left">
                        <span className="font-display text-xl text-ink-900">{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
                          aria-hidden="true" />
                      </button>
                    </h2>
                    {open && <RichText html={faq.answer} className="pb-6 text-ink-600" />}
                  </li>
                );
              })}
            </ul>
          ) : (
            /* The existing site's FAQ copy wasn't in the page saves supplied, so
               there is nothing to seed here — these come from wp-admin. */
            <div className="rounded-2xl bg-ink-50 p-8 text-center">
              <p className="text-ink-600">
                No FAQs have been added yet. Add them under <strong>FAQs</strong> in wp-admin and
                they’ll appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
      <BookOnlineCTA />
    </>
  );
}
