import { treatmentBySlug } from '../content/treatments';

/**
 * The keyword-heavy treatment copy the existing site carries on its homepage,
 * below the "WHAT WE DO" cards: the Aesthetics Treatments block (Skin Boosters,
 * Lumie Eye, B Complex) and the IPL Laser Hair Removal block with its benefits.
 *
 * It ranks for the terms in it, so it belongs on the homepage rather than only
 * on an interior page. Rendered dark with gold headings to match how the
 * existing site presents it.
 *
 * Read from src/content/treatments.ts rather than copied, so the homepage and
 * the /aesthetics-treatments page can't drift apart. Note this does mean the
 * same copy is served at two URLs — see the note on that page's entry.
 */
export default function HomeTreatmentDetail() {
  const page = treatmentBySlug('aesthetics-treatments');
  if (!page) return null;

  // The last section is IPL, which the existing site gives its own block and
  // heading; everything before it sits under the Aesthetics Treatments heading.
  const aesthetics = page.sections.filter((s) => !s.title.startsWith('IPL'));
  const ipl = page.sections.find((s) => s.title.startsWith('IPL'));

  return (
    <section className="section-padding bg-ink-950 text-ink-100">
      <div className="container-lg grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="rounded-3xl bg-ink-900/60 p-8 sm:p-10">
          <span className="eyebrow text-white">Luna Moon Preston</span>
          <h2 className="mt-2 font-display text-2xl uppercase text-gold-400 sm:text-3xl">
            {page.intro.heading}
          </h2>
          {page.intro.body.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink-100">
              {p}
            </p>
          ))}

          {aesthetics.map((section) => (
            <div key={section.title} className="mt-8">
              <h3 className="font-display text-lg uppercase tracking-wide text-blush-300">
                {section.title}
              </h3>
              {section.body?.map((p) => (
                <p key={p} className="mt-2 leading-relaxed text-ink-100">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        {ipl && (
          <div className="rounded-3xl bg-ink-900/60 p-8 sm:p-10">
            <span className="eyebrow text-white">Luna Moon Preston</span>
            {/* The existing site splits this into a title and a strapline; the
                content file keeps them on one line, so split on the dash. */}
            <h2 className="mt-2 font-display text-2xl uppercase text-gold-400 sm:text-3xl">
              {ipl.title.split('—')[0].trim()}
            </h2>
            {ipl.title.includes('—') && (
              <p className="mt-1 font-display text-base uppercase tracking-wide text-blush-300">
                {ipl.title.split('—')[1].trim()}
              </p>
            )}

            {ipl.body?.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-ink-100">
                {p}
              </p>
            ))}

            {ipl.bullets && (
              <dl className="mt-6 space-y-5">
                {ipl.bullets.map((bullet) => {
                  // Each bullet is "Label — description".
                  const [label, ...rest] = bullet.split('—');
                  // The source writes each bullet as one sentence running
                  // across the dash, so the detail half starts lowercase once
                  // it's split out as its own line.
                  const raw = rest.join('—').trim();
                  const detail = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '';
                  return (
                    <div key={bullet}>
                      <dt className="font-display text-base uppercase tracking-wide text-blush-300">
                        {label.trim()}
                      </dt>
                      {detail && <dd className="mt-1 leading-relaxed text-ink-100">{detail}</dd>}
                    </div>
                  );
                })}
              </dl>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
