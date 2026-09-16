import { business } from '../config/site';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './ui/BrandIcons';

/**
 * The clinic's social profiles, in one place.
 *
 * Header, footer and contact page all render the same set, so the list lives
 * here: adding a network in the Customizer puts it everywhere at once rather
 * than needing the markup copied into a third place.
 *
 * Order follows where the clinic is most active.
 */
const NETWORKS = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon },
] as const;

type Variant = 'bare' | 'framed' | 'light';

const VARIANTS: Record<Variant, { link: string; icon: string }> = {
  /** The header's dark contact bar: small, unframed. */
  bare: {
    // The glyph is 16px, but padding takes the tap target to 28px — under 24px
    // it fails WCAG 2.2 target size (2.5.8) and is genuinely fiddly on a phone.
    link: 'rounded-full p-1.5 text-ink-300 transition-colors hover:bg-white/10 hover:text-white',
    icon: 'h-4 w-4',
  },
  /** The footer: circled, so they read as a group against the dark panel. */
  framed: {
    link: 'rounded-full border border-ink-700 p-2.5 text-ink-200 transition-colors hover:border-blush-500 hover:text-blush-400',
    icon: 'h-4 w-4',
  },
  /** On a light background, e.g. the contact page. */
  light: {
    link: 'rounded-full border border-ink-200 p-2.5 text-ink-600 transition-colors hover:border-blush-500 hover:text-blush-700',
    icon: 'h-5 w-5',
  },
};

export default function SocialLinks({
  variant = 'bare',
  className = '',
}: {
  variant?: Variant;
  className?: string;
}) {
  const available = NETWORKS.filter((n) => business.social[n.key]);
  if (!available.length) return null;

  const styles = VARIANTS[variant];

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {available.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={business.social[key]}
            target="_blank"
            rel="noreferrer"
            // "Facebook" alone doesn't say whose, which matters when a screen
            // reader lists the links out of context.
            aria-label={
              key === 'whatsapp'
                ? `Message ${business.name} on WhatsApp`
                : `${business.name} on ${label}`
            }
            className={`flex ${styles.link}`}
          >
            <Icon className={styles.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
