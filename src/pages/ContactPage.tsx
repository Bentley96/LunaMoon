import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { business } from '../config/site';
import PageHero from '../components/PageHero';
import BookingForm from '../components/BookingForm';

export default function ContactPage() {
  const hours = Object.entries(business.hours);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        intro="Questions about a treatment, or ready to book? Drop us a message and we'll come back to you."
      />

      <section className="section-padding">
        <div className="container-lg grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">Find us</h2>

            <dl className="mt-6 space-y-5">
              {business.addressLines.length > 0 && (
                <div className="flex gap-4">
                  <dt>
                    <MapPin className="h-5 w-5 text-blush-600" aria-hidden="true" />
                    <span className="sr-only">Address</span>
                  </dt>
                  <dd className="leading-relaxed text-ink-700">
                    {business.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {business.phone && (
                <div className="flex gap-4">
                  <dt>
                    <Phone className="h-5 w-5 text-blush-600" aria-hidden="true" />
                    <span className="sr-only">Phone</span>
                  </dt>
                  <dd>
                    <a
                      href={`tel:${business.phoneHref || business.phone}`}
                      className="text-ink-700 hover:text-blush-700"
                    >
                      {business.phone}
                    </a>
                  </dd>
                </div>
              )}

              {business.email && (
                <div className="flex gap-4">
                  <dt>
                    <Mail className="h-5 w-5 text-blush-600" aria-hidden="true" />
                    <span className="sr-only">Email</span>
                  </dt>
                  <dd>
                    <a href={`mailto:${business.email}`} className="text-ink-700 hover:text-blush-700">
                      {business.email}
                    </a>
                  </dd>
                </div>
              )}

              {hours.length > 0 && (
                <div className="flex gap-4">
                  <dt>
                    <Clock className="h-5 w-5 text-blush-600" aria-hidden="true" />
                    <span className="sr-only">Opening hours</span>
                  </dt>
                  <dd className="space-y-1">
                    {hours.map(([days, time]) => (
                      <div key={days} className="flex gap-4 text-ink-700">
                        <span className="min-w-28">{days}</span>
                        <span>{time}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {/* TODO(content): drop in the clinic's Google Maps embed here. */}
            <div className="img-placeholder mt-8 aspect-[4/3] rounded-2xl">
              <span>Map embed</span>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-3xl">Send a message</h2>
            <p className="mt-2 text-ink-500">We usually reply the same day.</p>
            <div className="mt-6">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
