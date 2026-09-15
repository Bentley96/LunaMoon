import { getPage } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import RichText from '../components/ui/RichText';
import ContactStrip from '../components/ContactStrip';
import Spinner from '../components/ui/Spinner';

/**
 * Renders a WordPress page by slug (clinic policy, privacy, terms).
 *
 * These change for legal reasons rather than design ones, so they're edited in
 * wp-admin and pulled in here — no rebuild to correct a clause.
 */
export default function ClinicPolicyPage({
  slug,
  fallbackTitle,
}: {
  slug: string;
  fallbackTitle: string;
}) {
  const { data, loading, error } = useAsync(() => getPage(slug), [slug]);

  return (
    <>
      <PageHero title={data?.title ?? fallbackTitle} image="/images/clinic-reception.jpg" />

      <section className="section-padding">
        <div className="container-prose">
          {loading ? (
            <Spinner />
          ) : error || !data ? (
            <div className="rounded-2xl bg-ink-50 p-8 text-center">
              <p className="text-ink-600">
                This page hasn’t been added yet. Create a page with the slug{' '}
                <code className="rounded bg-white px-1.5 py-0.5 text-sm">{slug}</code> in wp-admin
                and its content will appear here.
              </p>
            </div>
          ) : (
            <>
              <RichText html={data.content} />
              {data.updated && (
                <p className="mt-10 border-t border-ink-100 pt-6 text-sm text-ink-400">
                  Last updated{' '}
                  {new Date(data.updated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
