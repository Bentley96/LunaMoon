import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Honeypot from './Honeypot';
import { getRecaptchaToken } from '../lib/recaptcha';
import { submitEnquiry } from '../lib/wp';

// Mirrors the "Our Treatments" menu on the existing site, plus a catch-all.
const TREATMENT_OPTIONS = [
  'Aesthetics Treatments',
  'Advanced Facial Treatments',
  'Laser Cosmetic Teeth Whitening',
  'Body Contouring & Skin Tightening',
  'IPL Laser Hair Removal',
  'Products',
  'Something else',
];

export default function BookingForm({
  treatment = '',
  compact = false,
}: {
  /** Pre-selects a treatment when opened from a treatment card. */
  treatment?: string;
  compact?: boolean;
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    treatment,
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Re-sync when the flyout is reopened for a different treatment.
  useEffect(() => {
    setForm((prev) => ({ ...prev, treatment }));
  }, [treatment]);

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError(null);

    try {
      // A missing token is not fatal — the server decides how to treat it, and
      // the honeypot still applies.
      let recaptcha_token = '';
      try {
        recaptcha_token = await getRecaptchaToken('enquiry');
      } catch {
        // Script blocked or unavailable; submit without a token.
      }
      await submitEnquiry({ ...form, recaptcha_token });
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'Sorry, something went wrong. Please call us.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-blush-50 px-6 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-blush-600" aria-hidden="true" />
        <h3 className="text-2xl text-ink-900">Thank you</h3>
        <p className="text-ink-600">
          Your enquiry is with us. We'll be in touch shortly to confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div>
          <label className="field-label" htmlFor="booking-name">
            Name
          </label>
          <input
            id="booking-name"
            className="field-input"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="booking-phone">
            Phone
          </label>
          <input
            id="booking-phone"
            className="field-input"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update('phone')(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="booking-email">
          Email
        </label>
        <input
          id="booking-email"
          className="field-input"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => update('email')(e.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="booking-treatment">
          Treatment
        </label>
        <select
          id="booking-treatment"
          className="field-input"
          value={form.treatment}
          onChange={(e) => update('treatment')(e.target.value)}
        >
          <option value="">Please choose…</option>
          {TREATMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="booking-message">
          Anything we should know? <span className="font-normal text-ink-400">(optional)</span>
        </label>
        <textarea
          id="booking-message"
          className="field-input"
          rows={compact ? 3 : 4}
          value={form.message}
          onChange={(e) => update('message')(e.target.value)}
        />
      </div>

      <Honeypot value={form.website} onChange={update('website')} />

      {error && (
        <p role="alert" className="rounded-lg bg-blush-50 px-4 py-3 text-sm text-blush-800">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Request appointment'}
      </button>

      <p className="text-xs leading-relaxed text-ink-400">
        We'll only use your details to respond to this enquiry. See our{' '}
        <a href="/privacy-policy" className="underline hover:text-ink-600">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
