import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { business, footerLinks } from '../config/site';
import Logo from './Logo';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const year = new Date().getFullYear();
  const hours = Object.entries(business.hours);

  return (
    <footer className="bg-ink-950 text-ink-200">
      <div className="container-xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 7 columns: logo 2 + three link columns + hours 2. The hours need the
            extra width so "Wednesday: 10am - 5pm" stays on one line. */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <Logo tone="light" className="h-24" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">{business.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-400">{business.about}</p>

            <div className="mt-6 space-y-2.5 text-sm">
              {business.addressLines.length > 0 && (
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blush-400" aria-hidden="true" />
                  <span>{business.addressLines.join(', ')}</span>
                </p>
              )}
              {business.phone && (
                <p className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-blush-400" aria-hidden="true" />
                  <a href={`tel:${business.phoneHref || business.phone}`} className="hover:text-white">
                    {business.phone}
                  </a>
                </p>
              )}
              {business.email && (
                <p className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-blush-400" aria-hidden="true" />
                  <a href={`mailto:${business.email}`} className="hover:text-white">
                    {business.email}
                  </a>
                </p>
              )}
            </div>

            <SocialLinks variant="framed" className="mt-6" />
          </div>

          {footerLinks.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="font-display text-lg text-white">{column.heading}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-ink-300 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {hours.length > 0 && (
            <div className="lg:col-span-2">
              <h3 className="font-display text-lg uppercase tracking-wide text-white">
                Opening hours
              </h3>
              <dl className="mt-4 space-y-2.5 text-sm">
                {hours.map(([day, time]) => (
                  <div key={day} className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-blush-300" aria-hidden="true" />
                    <dt className="text-ink-200">{day}:</dt>
                    <dd className="text-white">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-xl flex flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ink-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {business.legalName}. All rights reserved.
          </p>
          <p>
            <Link to="/clinic-policy" className="hover:text-white">
              Clinic Policy
            </Link>
            <span className="mx-2">·</span>
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
