import { Phone } from 'lucide-react';
import { business } from '../config/site';
import { useBooking } from '../store/BookingContext';

export default function FinalCTA() {
  const { openBooking } = useBooking();

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(50% 80% at 50% 0%, rgba(221,111,135,0.25) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />
      <div className="container-xl relative px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
          Ready when you are
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-200">
          Book a no-obligation consultation and we'll talk through what will actually suit you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => openBooking()} className="btn-primary-lg">
            Book a consultation
          </button>
          {business.phone && (
            <a href={`tel:${business.phoneHref || business.phone}`} className="btn-outline">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {business.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
