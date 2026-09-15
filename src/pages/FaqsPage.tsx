import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFaqs } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import RichText from '../components/ui/RichText';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import FinalCTA from '../components/FinalCTA';

export default function FaqsPage() {
  const { data, loading, error, reload } = useAsync(() => getFaqs(), []);
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Questions, answered"
        intro="The things clients ask most. If yours isn't here, just ask."
      />

      <section className="section-padding">
        <div className="container-prose">
          {loading ? (
            <Spinner label="Loading FAQs…" />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : data && data.length > 0 ? (
            <ul className="divide-y divide-ink-100 border-y border-ink-100">
              {data.map((faq) => {
                const open = openId === faq.id;
                return (
                  <li key={faq.id}>
                    <h2>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : faq.id)}
                        aria-expanded={open}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="font-display text-xl text-ink-900">{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </h2>
                    {open && <RichText html={faq.answer} className="pb-6 text-ink-600" />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-16 text-center text-ink-500">
              No FAQs have been published yet. Add them under <strong>FAQs</strong> in wp-admin.
            </p>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
