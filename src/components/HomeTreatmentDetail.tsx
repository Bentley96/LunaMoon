import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { treatmentCategories, treatmentsIntro } from '../content/homeTreatments';

/**
 * The three things the clinic does, on the homepage below the service cards.
 *
 * This replaced several paragraphs that ran every treatment together — the part
 * of the page the clinic said felt cluttered. Cards make the same content
 * scannable: the category, a line on what it's for, and the treatments in it.
 *
 * Still dark with gold headings, which is how the existing site presents this
 * band and what separates it from the white sections either side.
 */
export default function HomeTreatmentDetail() {
  return (
    <section className="section-padding bg-ink-950 text-ink-100">
      <div className="container-lg">
        <div className="container-prose text-center">
          <span className="eyebrow text-gold-400">{treatmentsIntro.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl uppercase text-white sm:text-4xl">
            {treatmentsIntro.heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-200">{treatmentsIntro.body}</p>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {treatmentCategories.map((category) => (
            <li key={category.id} className="flex">
              <div className="flex flex-1 flex-col rounded-3xl bg-ink-900/60 p-8">
                <h3 className="font-display text-xl uppercase tracking-wide text-gold-400 sm:text-2xl">
                  {category.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-200">{category.blurb}</p>

                <ul className="mt-6 space-y-2.5">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-ink-100">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-blush-300"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* mt-auto, so the links sit on one line across the three cards
                    however many treatments each of them carries. */}
                <Link
                  to={category.to}
                  className="mt-auto pt-8 text-sm font-semibold uppercase tracking-wide text-blush-300 underline-offset-4 hover:underline"
                >
                  See treatments
                  <ArrowRight className="ml-2 inline h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
