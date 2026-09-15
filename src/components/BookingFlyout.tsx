import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';
import { useBooking } from '../store/BookingContext';

export default function BookingFlyout() {
  const { open, treatment, closeBooking } = useBooking();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBooking();
    };
    document.addEventListener('keydown', onKey);
    // Move focus into the panel so keyboard and screen-reader users land there.
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeBooking]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Book a treatment">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={closeBooking}
        aria-label="Close booking form"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="text-2xl text-ink-900">Book a treatment</h2>
            <p className="mt-1 text-sm text-ink-500">
              Tell us what you're after and we'll come back to you with availability.
            </p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            className="rounded-full p-2 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-6">
          <BookingForm treatment={treatment} compact />
        </div>
      </div>
    </div>
  );
}
