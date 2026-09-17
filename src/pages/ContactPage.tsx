import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '../components/PageHero';
import { banners } from '../config/banners';
import BookingForm from '../components/BookingForm';
import { business, BOOKING_URL } from '../config/site';
import SocialLinks from '../components/SocialLinks';
import PageFaqs from '../components/PageFaqs';
import ClinicMap from '../components/ClinicMap';
import { WhatsAppIcon } from '../components/ui/BrandIcons';
import KlarnaBadge from '../components/KlarnaBadge';

export default function ContactPage() {
  const hours = Object.entries(business.hours);

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="CONTACT LUNA MOON PRESTON"
        intro="For more information about our services and products, or to book an appointment, don’t hesitate to get in touch with Dee today."
        banner={banners['contact']}
      />

      <section className="section-padding">
        <div className="container-lg grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">Find us</h2>

            <dl className="mt-6 space-y-5">
              <div className="flex gap-4">
                <dt><MapPin className="h-5 w-5 text-blush-600" aria-hidden="true" /><span className="sr-only">Address</span></dt>
                <dd className="leading-relaxed text-ink-700">
                  {business.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </dd>
              </div>

              <div className="flex gap-4">
                <dt><Phone className="h-5 w-5 text-blush-600" aria-hidden="true" /><span className="sr-only">Phone</span></dt>
                <dd>
                  <a href={`tel:${business.phoneHref}`} className="text-ink-700 hover:text-blush-700">
                    {business.phone}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt><Mail className="h-5 w-5 text-blush-600" aria-hidden="true" /><span className="sr-only">Email</span></dt>
                <dd>
                  <a href={`mailto:${business.email}`} className="text-ink-700 hover:text-blush-700">
                    {business.email}
                  </a>
                </dd>
              </div>

              {hours.length > 0 && (
                <div className="flex gap-4">
                  <dt><Clock className="h-5 w-5 text-blush-600" aria-hidden="true" /><span className="sr-only">Opening hours</span></dt>
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

            <div className="mt-8 rounded-2xl bg-blush-50 p-5">
              <KlarnaBadge className="h-7" />
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {business.finance} Get in touch to find out more.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="btn-outline-ink">
                Book online
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              {business.social.whatsapp && (
                <a
                  href={business.social.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-ink"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp us
                </a>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-display text-lg uppercase tracking-wide text-ink-900">
                Follow us
              </h3>
              <p className="mt-2 text-sm text-ink-600">
                See our latest work, offers and before-and-afters.
              </p>
              <SocialLinks variant="light" className="mt-4" />
            </div>

            <ClinicMap />
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

      <PageFaqs route="/contact" />
    </>
  );
}
