// The certificates the existing homepage shows beside the "What we do" copy:
// three award shortlistings and one training qualification.
//
// The existing site ran these through a carousel at around 250px wide, where
// none of the text on a certificate is legible — so they read as decoration
// rather than as proof. Here they're shown all at once and open full size, but
// the claim is still spelled out in text beside each one so it survives being
// read by someone who never opens an image.
//
// Source: "Certificates/" in the repo root. The uploaded filenames are a year
// out (2023.jpg is the 2022 certificate), so the copies under
// public/images/awards/ are named for the year each certificate actually
// carries.

export interface Award {
  /** Stable key, independent of the year — one certificate carries no date. */
  id: string;
  /** The short line beside the icon: a year, or what kind of certificate it is. */
  badge: string;
  /** What it certifies, e.g. "Finalist — Best Salon". */
  title: string;
  /** Who gave it. */
  organisation: string;
  /** Optional extra line, e.g. the region represented. */
  detail?: string;
  image: string;
  /** Intrinsic size, so the grid reserves the right space before it loads. */
  width: number;
  height: number;
  /** Describes the certificate for anyone who can't see it. */
  alt: string;
}

export const awardsIntro =
  'Luna Moon Aesthetics has been named in the top 10 regional salons, shortlisted at the UK Hair and Beauty Awards three years running, and placed 2nd in the UK Advanced Practitioner Awards. Dee is trained and accredited in the treatments she offers.';

export const awards: Award[] = [
  {
    id: 'hba-2022',
    badge: '2022',
    title: 'Finalist',
    organisation: 'UK Hair and Beauty Awards',
    detail: 'Certificate of recognition',
    image: '/images/awards/hba-2022-finalist.webp',
    width: 731,
    height: 517,
    alt: 'UK Hair and Beauty Awards 2022 finalist certificate of recognition, shortlisting Luna Moon Aesthetics.',
  },
  {
    id: 'hba-2023',
    badge: '2023',
    title: 'Finalist, Best Salon',
    organisation: 'UK Hair and Beauty Awards',
    detail: 'Representing Preston',
    image: '/images/awards/hba-2023-finalist.webp',
    width: 1107,
    height: 815,
    alt: 'UK Hair and Beauty Awards 2023 finalist certificate, shortlisting Luna Moon Aesthetics for Best Salon representing Preston.',
  },
  {
    id: 'hba-2024',
    badge: '2024',
    title: 'Finalist, Best Salon',
    organisation: 'Official UK Hair and Beauty Awards',
    detail: 'Representing Preston',
    image: '/images/awards/hba-2024-finalist.webp',
    width: 1400,
    height: 990,
    alt: 'Official UK Hair and Beauty Awards 2024 finalist certificate, shortlisting Luna Moon Aesthetics for Best Salon representing Preston.',
  },
  {
    id: 'liquid-lipo-course',
    badge: 'Qualification',
    title: 'Liquid Lipo fat reduction course',
    organisation: 'Liquid Lipo Ltd',
    detail: 'Accredited by the IPHM',
    image: '/images/awards/liquid-lipo-certificate.webp',
    width: 683,
    height: 481,
    alt: 'Liquid Lipo Ltd certificate of completion, certifying that Diane Heaton-Moon has completed the Liquid Lipo fat reduction course on behalf of the Institute of Pharmaceutical, Holistic and Medical Practitioners.',
  },
];
