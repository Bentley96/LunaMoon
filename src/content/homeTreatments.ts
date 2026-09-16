// The treatment detail the existing site carries on its homepage, below the
// "WHAT WE DO" cards.
//
// This used to live on an /aesthetics-treatments page. That page is gone: the
// copy belongs on the homepage, which is where the existing site has it and
// where it earned its rankings, and serving it at two URLs would have had the
// two competing. Nothing linked to the old URL and the domain isn't live yet,
// so no redirect was needed.
//
// Source: "Existing SIte/" homepage save, September 2026.

export interface DetailSection {
  title: string;
  /** One entry per paragraph. */
  body?: string[];
  /** Rendered as "Label — description" pairs. */
  bullets?: string[];
  /** Not currently rendered on the homepage; kept for future use. */
  image?: string;
}

export interface HomeTreatmentDetailContent {
  intro: { heading: string; body: string[] };
  sections: DetailSection[];
}

export const homeTreatmentDetail: HomeTreatmentDetailContent = {
  intro: {
    heading: 'AESTHETICS TREATMENTS PRESTON',
    body: [
      'Luna Moon Aesthetics in Preston offer a range of cutting-edge treatments designed to leave you feeling refreshed, revitalised and confident.',
    ],
  },
  sections: [
    {
      title: 'SKIN BOOSTERS: PROFHILO & SEVENTY HYAL',
      body: [
        'Say goodbye to dry fine lines and dullness as your skin becomes plump, hydrated and radiant with Profhilo and Seventy Hyal skin boosters. These injectable treatments deliver a powerful combination of hyaluronic acid and other skin-loving nutrients deep into the skin, promoting collagen production and improving elasticity.',
      ],
      image: '/images/skin-boosters.webp',
    },
    {
      title: 'LUMI EYE',
      body: [
        'Say hello to brighter, radiant eyes that sparkle with vitality. Lumi Eye is here to brighten and rejuvenate your delicate under-eye area. This non-invasive treatment uses advanced technology to target dark circles, puffiness and fine lines, leaving you with a more youthful and refreshed appearance.',
      ],
      image: '/images/lumi-eye-treatment.webp',
    },
    {
      title: 'B COMPLEX',
      body: [
        'Unlock the power of the B vitamins with our B Complex injections. This blend of essential B vitamins, including B1, B2, B3, B5, and B6, offers a range of health benefits, from supporting nerve function and metabolism to promoting healthy skin and hair. Whether you’re looking to boost your immune system, improve your mood or enhance your overall health, our B Complex injections are the perfect solution.',
      ],
      image: '/images/mature-skin-glow.webp',
    },
    {
      title: 'IPL LASER HAIR REMOVAL PRESTON — HAIR FREE, CARE FREE',
      body: [
        'Luna Moon Aesthetics in Preston specialise in IPL laser hair removal. It is a popular method of hair removal providing long-lasting results with minimal discomfort. This cosmetic procedure uses intense pulses of light to remove unwanted hair, it damages the follicles and inhibits future regrowth. IPL targets hair follicles precisely, leaving the surrounding skin undamaged. It is effective for reducing hair growth on any part of the body, including the face, legs, arms, bikini line and back.',
      ],
      bullets: [
        'Long-lasting results — IPL can significantly reduce hair growth over time, leading to long-lasting smoothness.',
        'Fast hair removal — IPL can treat large areas of skin quickly due to its wide treatment applicator.',
        'Reduction in ingrown hairs — IPL can help reduce the occurrence of ingrown hairs, a common problem with other methods.',
        'Minimal discomfort — while some people may experience mild discomfort during the procedure, it is generally well-tolerated.',
        'Improved skin appearance — some people notice improvements in the texture and appearance of their skin after IPL treatments.',
      ],
      image: '/images/ipl-hair-removal-legs.webp',
    },
  ],
};
