/**
 * The Luna Moon logo.
 *
 * Three variants are generated from the supplied artwork
 * (luna-moon-logo-transparent.svg at the repo root, which is the master and is
 * never served). See the "Logo" section of wordpress/README.md for how to
 * regenerate them if the master changes.
 *
 *   full  + gold   the lockup as supplied — crescent, wordmark, strapline.
 *   full  + light  the same with the strapline recoloured. The supplied
 *                  strapline is near-black (#171012) and disappears on the dark
 *                  hero and footer, so those use this instead.
 *   mark           crescent and wordmark only, cropped tight. The full lockup
 *                  is nearly square (1.19:1), so at header height the wordmark
 *                  is tiny and the strapline sub-pixel; the crop is 1.94:1 and
 *                  stays legible.
 *
 * Served as files rather than inlined: the artwork is ~42KB gzipped each (it's
 * an auto-trace, where the metallic gradient is ~30 stacked contour bands), so
 * inlining would put more weight in the JS bundle than the rest of the app.
 * As <img> they are cached separately and never block rendering.
 */

const FULL_GOLD = '/images/luna-moon-logo.svg';
const FULL_LIGHT = '/images/luna-moon-logo-light.svg';
const MARK = '/images/luna-moon-mark.svg';

export default function Logo({
  tone = 'gold',
  variant = 'full',
  className = '',
}: {
  /** "light" recolours the strapline for dark backgrounds. Ignored by "mark",
   *  which has no strapline and reads on both. */
  tone?: 'gold' | 'light';
  variant?: 'full' | 'mark';
  /** Set the height here (e.g. "h-12"); width follows the aspect ratio. */
  className?: string;
}) {
  const isMark = variant === 'mark';
  const src = isMark ? MARK : tone === 'light' ? FULL_LIGHT : FULL_GOLD;

  return (
    <img
      src={src}
      // The strapline is part of the artwork, not the business name — the
      // business is "Luna Moon Aesthetics" everywhere in copy.
      alt="Luna Moon Aesthetics"
      // Intrinsic size reserves the right box before the file loads, so the
      // header and hero don't shift.
      width={isMark ? 737 : 830}
      height={isMark ? 380 : 700}
      className={`w-auto ${className}`}
    />
  );
}
