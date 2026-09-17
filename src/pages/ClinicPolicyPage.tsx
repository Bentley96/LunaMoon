import { getPage } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import RichText from '../components/ui/RichText';
import ContactStrip from '../components/ContactStrip';
import Spinner from '../components/ui/Spinner';
import { policies } from '../content/policies';

/**
 * Renders a WordPress page by slug (clinic policy, privacy).
 *
 * WordPress wins whenever the page there has content, because a policy is the
 * thing most likely to need correcting in a hurry and that shouldn't wait on a
 * rebuild. Where it has none — and theme activation creates these pages empty,
 * so that's the state they start in — the copy in src/content/policies.ts is
 * shown instead, rather than leaving a policy page blank.
 */
export default function ClinicPolicyPage({
  slug,
  fallbackTitle,
}: {
  slug: string;
  fallbackTitle: string;
}) {
  const { data, loading } = useAsync(() => getPage(slug), [slug]);

  // An empty editor still returns a page, so the check is on the content, not
  // on whether the request succeeded.
  const wordpress = data?.content?.trim() ? data : null;
  const fallback = policies[slug];

  return (
    <>
      <PageHero
        title={wordpress?.title ?? fallback?.title ?? fallbackTitle}
        image="/images/clinic-reception.jpg"
      />

      <section className="section-padding">
        <div className="container-prose">
          {loading ? (
            <Spinner />
          ) : wordpress ? (
            <>
              <RichText html={wordpress.content} />
              {wordpress.updated && (
                <p className="mt-10 border-t border-ink-100 pt-6 text-sm text-ink-400">
                  Last updated{' '}
                  {new Date(wordpress.updated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </>
          ) : fallback ? (
            <>
              <p className="text-lg leading-relaxed text-ink-700">{fallback.intro}</p>

              <div className="mt-10 space-y-10">
                {fallback.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-xl uppercase tracking-wide text-ink-900 sm:text-2xl">
                      {section.heading}
                    </h2>
                    <div className="mt-4 space-y-4 leading-relaxed text-ink-600">
                      {section.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-ink-50 p-8 text-center">
              <p className="text-ink-600">
                This page hasn’t been added yet. Create a page with the slug{' '}
                <code className="rounded bg-white px-1.5 py-0.5 text-sm">{slug}</code> in wp-admin
                and its content will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
