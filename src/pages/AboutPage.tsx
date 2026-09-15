import { Heart, ShieldCheck, Users } from 'lucide-react';
import PageHero from '../components/PageHero';
import FinalCTA from '../components/FinalCTA';
import SectionHeading from '../components/ui/SectionHeading';
import ImageFrame from '../components/ui/ImageFrame';

// TODO(content): replace with the About copy from the live site.
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Luna Moon Aesthetics"
        intro="A Preston clinic offering affordable, professional beauty, aesthetics and skincare treatments."
      />

      <section className="section-padding">
        <div className="container-lg grid items-center gap-12 lg:grid-cols-2">
          <ImageFrame
            label="Practitioner portrait"
            alt="Luna Moon Aesthetics practitioner"
            ratio="aspect-[4/5]"
            className="rounded-3xl"
          />
          <div>
            <SectionHeading
              eyebrow="Meet the team"
              align="left"
              title="Run by Dee"
              intro="Luna Moon is owned and run by Dee, a highly experienced and qualified aesthetician."
            />
            <div className="mt-6 space-y-4 leading-relaxed text-ink-600">
              <p>
                The goal has always been simple: professional beauty, aesthetics and skincare
                treatments at prices that don't put them out of reach — delivered properly, by
                someone who knows what they're doing.
              </p>
              <p>
                Every client gets a consultation before anything begins, so you leave knowing what
                was done, why, and how to look after it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink-50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="How we work"
            title="What you can expect"
            intro="The things we won't compromise on."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Safety first',
                body: 'Qualified, insured, and working to clinical standards — with a full consultation and patch testing where it applies.',
              },
              {
                icon: Heart,
                title: 'Natural results',
                body: "We aim for you, refreshed — not someone else's face. If something won't suit you, we'll tell you.",
              },
              {
                icon: Users,
                title: 'Inclusive by default',
                body: 'A safe, welcoming space for everyone. We proudly support our LGBTQ+ clients, including treatments that play a part in gender affirmation.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white p-8">
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

      <FinalCTA />
    </>
  );
}
