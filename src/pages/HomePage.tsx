import { Heart, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Hero from '../components/Hero';
import FeaturedTreatments from '../components/FeaturedTreatments';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';
import FeaturedProducts from '../components/FeaturedProducts';
import SectionHeading from '../components/ui/SectionHeading';
import ImageFrame from '../components/ui/ImageFrame';

// TODO(content): all copy below is placeholder written around what the clinic
// is known to offer. Replace against the live site.
const values = [
  {
    icon: ShieldCheck,
    title: 'Qualified and insured',
    body: 'Every treatment is carried out by a trained, insured practitioner — with a consultation first, always.',
  },
  {
    icon: Heart,
    title: 'Honest advice',
    body: "If a treatment isn't right for you, we'll say so. Natural results beat overdone ones every time.",
  },
  {
    icon: Users,
    title: 'Everyone welcome',
    body: 'A safe, inclusive space. We proudly support our LGBTQ+ clients, including gender-affirming treatments.',
  },
  {
    icon: Sparkles,
    title: 'Affordable luxury',
    body: 'Professional results at prices that make sense, with finance and package options available.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section-padding">
        <div className="container-xl">
          <SectionHeading
            eyebrow="Why Luna Moon"
            title="Looked after, not sold to"
            intro="We're a small Preston clinic built on repeat clients and word of mouth."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="inline-flex rounded-2xl bg-blush-50 p-3 text-blush-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl text-ink-900">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedTreatments />

      <section className="section-padding bg-ink-50">
        <div className="container-xl grid items-center gap-12 lg:grid-cols-2">
          <ImageFrame
            label="Clinic interior / practitioner portrait"
            alt="Inside the Luna Moon Aesthetics clinic"
            ratio="aspect-[4/3]"
            className="rounded-3xl"
          />
          <div>
            <SectionHeading
              eyebrow="Our clinic"
              align="left"
              title="A calm space on Friargate"
              intro="Luna Moon Aesthetics is a Preston clinic offering affordable, professional beauty, aesthetics and skincare treatments — with time taken to understand what you actually want."
            />
            <p className="mt-6 leading-relaxed text-ink-600">
              Every appointment starts with a consultation so you know exactly what's involved,
              what it costs, and what to expect afterwards. No pressure, no upselling.
            </p>
          </div>
        </div>
      </section>

      <FeaturedProducts />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
