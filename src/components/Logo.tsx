/**
 * Luna Moon wordmark: crescent + stacked "LUNA / MOON" + tagline.
 *
 * Drawn rather than bitmapped so it stays crisp at every size and can be
 * recoloured for light and dark backgrounds. The crescent is two overlapping
 * circles knocked out with `evenodd`; the metallic look comes from a gradient
 * shared by the moon and the lettering.
 *
 * TODO(brand): if a vector original of the logo exists, drop it in as
 * public/images/logo.svg and render that instead — this is a faithful rebuild,
 * not the artwork itself.
 */
export default function Logo({
  tone = 'gold',
  className = '',
  showTagline = true,
}: {
  /** "gold" for light backgrounds, "light" for the dark footer/hero. */
  tone?: 'gold' | 'light';
  className?: string;
  /**
   * Show the artwork's strapline ("Body Contouring & Aesthetics").
   *
   * That line belongs to the logo only — it is NOT the business name, which is
   * "Luna Moon Aesthetics" everywhere in copy. Turn it off wherever the mark is
   * small enough that the strapline would be illegible.
   */
  showTagline?: boolean;
}) {
  // Unique per instance so two logos on one page don't share gradient ids.
  const id = `luna-${tone}`;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-[1.9em] w-[1.9em] shrink-0"
        role="img"
        aria-label="Luna Moon Aesthetics"
      >
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
            {tone === 'gold' ? (
              <>
                <stop offset="0%" stopColor="#decc8a" />
                <stop offset="38%" stopColor="#b8a051" />
                <stop offset="62%" stopColor="#8a7538" />
                <stop offset="100%" stopColor="#cdb667" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f5efd8" />
                <stop offset="50%" stopColor="#decc8a" />
                <stop offset="100%" stopColor="#b8a051" />
              </>
            )}
          </linearGradient>
        </defs>
        {/* Outer disc minus a disc offset to the right leaves the crescent. */}
        <path
          fill={`url(#${id}-grad)`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50 2a48 48 0 1 0 0 96 48 48 0 0 0 0-96Zm19 7.5a40 40 0 1 1 0 81 40 40 0 0 1 0-81Z"
        />
      </svg>

      <span className="flex flex-col leading-[0.82]">
        <span
          className="bg-clip-text font-display font-semibold uppercase tracking-[0.12em] text-transparent"
          style={{
            backgroundImage:
              tone === 'gold'
                ? 'linear-gradient(135deg,#decc8a 0%,#b8a051 38%,#8a7538 62%,#cdb667 100%)'
                : 'linear-gradient(135deg,#f5efd8 0%,#decc8a 50%,#b8a051 100%)',
          }}
        >
          Luna
        </span>
        <span
          className="bg-clip-text font-display font-semibold uppercase tracking-[0.12em] text-transparent"
          style={{
            backgroundImage:
              tone === 'gold'
                ? 'linear-gradient(135deg,#decc8a 0%,#b8a051 38%,#8a7538 62%,#cdb667 100%)'
                : 'linear-gradient(135deg,#f5efd8 0%,#decc8a 50%,#b8a051 100%)',
          }}
        >
          Moon
        </span>
        {showTagline && (
          <span
            className={`mt-[0.35em] text-[0.26em] font-medium uppercase tracking-[0.22em] ${
              tone === 'gold' ? 'text-ink-800' : 'text-ink-100'
            }`}
          >
            Body Contouring &amp; Aesthetics
          </span>
        )}
      </span>
    </span>
  );
}
