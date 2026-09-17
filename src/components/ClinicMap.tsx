import { ExternalLink } from 'lucide-react';
import { business } from '../config/site';

/**
 * Where the clinic is, on a map.
 *
 * The iframe is lazy — it's below the contact details and most visitors are
 * there for the phone number, so it shouldn't cost them a Google request on
 * load. It also carries a title: an untitled iframe is announced as "frame"
 * and nothing else.
 *
 * The directions link underneath isn't decoration. An embedded map can be
 * blocked outright by a tracker blocker or a strict privacy setting, and when
 * it is, the address and a working link are what's left — so they're real
 * content rather than something drawn inside the frame.
 *
 * An empty URL renders nothing, so the page degrades rather than showing a
 * broken frame; in practice that only happens if MAP_EMBED_URL in site.ts is
 * emptied too, since a blank Customizer field falls back to it.
 */
export default function ClinicMap() {
  if (!business.mapEmbedUrl) return null;

  const address = business.addressLines.join(', ');
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50">
        <iframe
          src={business.mapEmbedUrl}
          title={`Map showing ${business.name}, ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block aspect-[4/3] w-full border-0 sm:aspect-[16/10]"
        />
      </div>

      <a
        href={directions}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost mt-3"
      >
        Get directions
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
