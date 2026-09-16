import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { serviceCards, whatWeDo } from '../content/home';
import SectionHeading from './ui/SectionHeading';

/** The "WHAT WE DO" grid of four service cards from the existing homepage. */
export default function ServiceCards() {
  return (
    <section id="more" className="section-padding scroll-mt-28">
      <div className="container-xl">
        {/* The second paragraph is a child rather than part of `intro` because
            SectionHeading wraps intro in its own <p>. */}
        <SectionHeading eyebrow="What we do" title={whatWeDo.heading} intro={whatWeDo.body}>
          <p className="text-lg leading-relaxed text-ink-600">{whatWeDo.body2}</p>
        </SectionHeading>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {serviceCards.map((card) => (
            <article key={card.title} className="card card-hover flex flex-col">
              <Link to={card.to} className="block overflow-hidden">
                <img src={card.image} alt={card.title} loading="lazy"
                     className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105" />
              </Link>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-xl leading-snug sm:text-2xl">
                  <Link to={card.to} className="text-ink-900 transition-colors hover:text-blush-700">
                    {card.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-600">{card.body}</p>
                <Link to={card.to} className="btn-ghost mt-5 self-start">
                  Read more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
