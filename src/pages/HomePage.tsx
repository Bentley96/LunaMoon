import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ServiceCards from '../components/ServiceCards';
import HomeTreatmentDetail from '../components/HomeTreatmentDetail';
import ContactStrip from '../components/ContactStrip';
import BookOnlineCTA from '../components/BookOnlineCTA';
import Testimonials from '../components/Testimonials';
import FeaturedProducts from '../components/FeaturedProducts';
import { about, aboutDee, faqTeaser } from '../content/home';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section-padding">
        <div className="container-lg grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Luna Moon Aesthetics Preston</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl">{about.heading}</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-600">
              {about.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <img src={about.image} alt="Treatment room at Luna Moon Aesthetics" loading="lazy"
               className="aspect-[4/3] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="section-padding bg-blush-50">
        <div className="container-lg grid items-center gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <img src={aboutDee.image} alt="Dee, owner of Luna Moon Aesthetics" loading="lazy"
               className="aspect-[4/5] w-full rounded-3xl object-cover" />
          <div>
            <span className="eyebrow">Meet the owner</span>
            <h2 className="mt-3 text-3xl sm:text-4xl">{aboutDee.heading}</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
              {aboutDee.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactStrip />
      <ServiceCards />
      {/* Sits directly under the service cards, as on the existing site. */}
      <HomeTreatmentDetail />
      <FeaturedProducts />
      <Testimonials />

      <section className="section-padding">
        <div className="container-prose text-center">
          <span className="eyebrow">FAQs</span>
          <h2 className="mt-3 text-3xl sm:text-4xl">{faqTeaser.heading}</h2>
          <p className="mt-5 leading-relaxed text-ink-600">{faqTeaser.body}</p>
          <Link to="/faqs" className="btn-outline-ink mt-8">
            Find out more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <BookOnlineCTA />
    </>
  );
}
