/**
 * Klarna's brand mark, shown wherever the site mentions paying monthly.
 *
 * It's a supplied asset and stays as supplied — the pink badge is Klarna's
 * trademark, so it isn't recoloured to match the site or set on a background
 * that fights it. The dark wordmark on that pink is 11.6:1, so it carries its
 * own contrast wherever it lands.
 *
 * Decorative by default: every place it appears already says "Klarna" in the
 * text beside it, and a screen reader announcing the name twice is noise. Pass
 * a label where the badge stands alone.
 */
export default function KlarnaBadge({
  className = 'h-7',
  label = '',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <img
      src="/images/klarna-badge.webp"
      width={280}
      height={120}
      alt={label}
      loading="lazy"
      aria-hidden={label ? undefined : true}
      className={`w-auto ${className}`}
    />
  );
}
