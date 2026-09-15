import { getPage } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import PageHero from '../components/PageHero';
import RichText from '../components/ui/RichText';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

/**
 * Renders a WordPress page by slug.
 *
 * Policy pages (privacy, terms, cancellations) change for legal reasons rather
 * than design ones, so they're edited in wp-admin and pulled in here — no
 * rebuild needed to correct a clause.
 */
export default function PolicyPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { data, loading, error, reload } = useAsync(() => getPage(slug), [slug]);

  return (
    <>
      <PageHero title={data?.title ?? fallbackTitle} />

      <section className="section-padding">
        <div className="container-prose">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorState
              message={
                error.toLowerCase().includes('not found') || error.includes('404')
                  ? `This page hasn't been written yet. Create a page with the slug "${slug}" in wp-admin and its content will appear here.`
                  : error
              }
              onRetry={reload}
            />
          ) : (
            <>
              <RichText html={data!.content} />
              {data!.updated && (
                <p className="mt-10 border-t border-ink-100 pt-6 text-sm text-ink-400">
                  Last updated{' '}
                  {new Date(data!.updated).toLocaleDateString('en-GB', {
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
    </>
  );
}
