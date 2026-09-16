import { Navigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ContactStrip from '../components/ContactStrip';
import BookOnlineCTA from '../components/BookOnlineCTA';
import PageFaqs from '../components/PageFaqs';
import SectionHeading from '../components/ui/SectionHeading';
import { treatmentBySlug, type TreatmentSection } from '../content/treatments';
import { bannerFor } from '../config/banners';

/**
 * One template for all four treatment pages.
 *
 * The existing site repeats the same shape on each — hero, intro, a second
 * editorial block, the contact band, then an alternating list of individual
 * treatments — so the page is data-driven from src/content/treatments.ts rather
 * than duplicated four times.
 */
export default function TreatmentPage({ slug }: { slug: string }) {
  const page = treatmentBySlug(slug);

  // Only reachable if a route is registered for a slug with no content behind
  // it, which would be a bug rather than a visitor error.
  if (!page) return <Navigate to="/" replace />;

  return (
    <>
      {/* Treatment pages with supplied banner artwork use it; the rest fall
          back to the single hero image in src/content/treatments.ts. */}
      <PageHero
        eyebrow="Luna Moon Aesthetics"
        title={page.title}
        intro={page.heroBlurb}
        banner={bannerFor(slug)}
        image={page.heroImage}
      />

      <section className="section-padding">
        <div className="container-lg grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl sm:text-4xl">{page.intro.heading}</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-600">
              {page.intro.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {page.intro.image && (
            <img src={page.intro.image} alt={page.intro.heading} loading="lazy"
                 className="aspect-[4/3] w-full rounded-3xl object-cover" />
          )}
        </div>
      </section>

      {page.secondary && (
        <section className="section-padding bg-blush-50">
          <div className="container-lg grid items-center gap-12 lg:grid-cols-2">
            {/* order-last at every width: stacked on a phone the heading
                should come first, and from lg the image belongs in the right
                column anyway. */}
            {page.secondary.image && (
              <img src={page.secondary.image} alt={page.secondary.heading} loading="lazy"
                   className="order-last aspect-[4/3] w-full rounded-3xl object-cover" />
            )}
            <div>
              <h2 className="text-3xl sm:text-4xl">{page.secondary.heading}</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-ink-600">
                {page.secondary.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <ContactStrip />

      <section className="section-padding">
        <div className="container-xl">
          <SectionHeading eyebrow="What we do" title="Our treatments" />
          <div className="mt-16 space-y-20">
            {page.sections.map((section, i) => (
              <TreatmentSectionBlock key={section.title} section={section} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <PageFaqs route={`/${page.slug}`} />

      <BookOnlineCTA />
    </>
  );
}

/** Alternating image/text row. */
function TreatmentSectionBlock({ section, flip }: { section: TreatmentSection; flip: boolean }) {
  return (
    <article className="grid items-center gap-10 lg:grid-cols-2">
      {section.image && (
        <img src={section.image} alt={section.title} loading="lazy"
             className={`aspect-[4/3] w-full rounded-3xl object-cover ${flip ? 'lg:order-last' : ''}`} />
      )}
      <div>
        <h3 className="text-2xl sm:text-3xl">{section.title}</h3>
        {section.body?.map((p) => (
          <p key={p} className="mt-4 leading-relaxed text-ink-600">
            {p}
          </p>
        ))}
        {section.bullets && (
          <ul className="mt-5 space-y-2.5">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-3 leading-relaxed text-ink-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blush-500" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
