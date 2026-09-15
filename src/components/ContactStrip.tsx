import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { business } from '../config/site';
import { contactBlock } from '../content/home';

/**
 * The "CONTACT AESTHETICS CLINIC IN PRESTON" band that appears on every page of
 * the existing site, between the intro copy and the services list.
 */
export default function ContactStrip() {
  return (
    <section className="bg-blush-50">
      <div className="container-lg px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h2 className="mt-3 text-3xl sm:text-4xl">{contactBlock.heading}</h2>
            {contactBlock.body.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-ink-600">
                {p}
              </p>
            ))}
            <p className="mt-4 text-sm font-medium text-ink-700">{contactBlock.finance}</p>
          </div>

          <div className="flex flex-col gap-3">
            <a href={`tel:${business.phoneHref}`} className="btn-primary">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {business.phone}
            </a>
            <a href={`mailto:${business.email}`} className="btn-outline-ink">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
            <Link to="/book-online" className="btn-ghost justify-center">
              Book online
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
