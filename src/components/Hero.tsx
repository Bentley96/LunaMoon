import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { business } from '../config/site';
import { useBooking } from '../store/BookingContext';
import ImageFrame from './ui/ImageFrame';

// TODO(content): replace the headline, sub-headline and trust pills with the
// copy from the live site once it's available.
const trustPills = [
  { icon: ShieldCheck, label: 'Fully insured & qualified' },
  { icon: Star, label: 'Five-star rated' },
  { icon: Sparkles, label: 'Inclusive, judgement-free care' },
];

export default function Hero() {
  const { openBooking } = useBooking();

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* Soft radial wash so the section reads as "night" without a photo. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 20%, rgba(221,111,135,0.28) 0%, transparent 60%), radial-gradient(50% 50% at 85% 30%, rgba(208,171,99,0.18) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="container-xl relative grid items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="animate-fade-up">
          <span className="eyebrow text-gold-400">
            {business.addressLines.length ? business.addressLines.slice(-2).join(', ') : 'Preston'}
          </span>
          <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            Beautiful, natural results from a clinic that listens
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
            Affordable, professional aesthetics, beauty and skincare treatments — delivered in a
            safe, welcoming space where everyone is looked after properly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => openBooking()} className="btn-primary-lg">
              Book a treatment
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link to="/treatments" className="btn-outline">
              View treatments
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {trustPills.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-ink-200">
                <Icon className="h-4 w-4 text-gold-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <ImageFrame
            label="Hero image — clinic / treatment photography"
            alt="Luna Moon Aesthetics clinic"
            ratio="aspect-[4/5]"
            className="rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
