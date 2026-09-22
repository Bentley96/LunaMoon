// reCAPTCHA v3 helper. Loads Google's script on demand and returns a token for
// a given action, which the server verifies.
//
// The site key is public by design, but it is site-specific, so it comes from
// WordPress: Appearance, Customize, Clinic details. That way turning reCAPTCHA
// on is a field in wp-admin and the matching secret in wp-config.php, with no
// rebuild of the app. VITE_RECAPTCHA_SITE_KEY still works as a build-time
// default, which is what a preview deploy with no WordPress behind it uses.
//
// Empty means reCAPTCHA is off; the honeypot still guards the forms.

import { bootstrap } from './bootstrap';

export const RECAPTCHA_SITE_KEY =
  bootstrap.site.recaptchaSiteKey ||
  ((import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) ?? '');

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('reCAPTCHA failed to load'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Eagerly load the reCAPTCHA script so the badge is visible on every page. */
export function preloadRecaptcha(): void {
  if (RECAPTCHA_SITE_KEY) void loadScript().catch(() => {});
}

/** Returns a fresh reCAPTCHA v3 token for the given action (e.g. "enquiry"). */
export async function getRecaptchaToken(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) return '';
  await loadScript();
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) throw new Error('reCAPTCHA unavailable');
  return new Promise<string>((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve, reject);
    });
  });
}
