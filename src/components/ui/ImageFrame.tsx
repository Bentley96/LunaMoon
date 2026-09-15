// A fixed-ratio image slot that degrades to a branded placeholder.
//
// Photography for the rebuild hasn't been supplied yet, so every image slot in
// the site renders the placeholder until a real `src` is passed. That keeps the
// layout honest (correct aspect ratios, no collapsed boxes) while the assets
// are outstanding.
export default function ImageFrame({
  src,
  alt,
  label,
  ratio = 'aspect-[4/3]',
  className = '',
}: {
  src?: string;
  alt?: string;
  /** Shown inside the placeholder to say what image belongs here. */
  label?: string;
  ratio?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`${ratio} overflow-hidden ${className}`}>
        <img src={src} alt={alt ?? ''} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${ratio} img-placeholder ${className}`} role="img" aria-label={alt ?? label ?? 'Image placeholder'}>
      <span className="px-4 text-center">{label ?? 'Image'}</span>
    </div>
  );
}
