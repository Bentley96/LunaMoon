// Homepage content, transcribed from the existing site.
//
// Like src/content/treatments.ts these are DEFAULTS that WordPress overrides
// once the matching content exists. Source: "Existing SIte/" page saves,
// September 2026.

export const hero = {
  /** Rendered as two lines, the first in outline/display weight. */
  titleTop: 'LUNA',
  titleBottom: 'Moon Aesthetics',
  /** The three areas the clinic wants to be known for, under the lockup. */
  eyebrow: 'Body • Skin • Laser',
  /**
   * The page's h1. The lockup above it is artwork, so the heading has to be
   * the one piece of text on the page that says what this is and where it is.
   */
  heading: 'Luna Moon Aesthetics Clinic in Preston',
  blurb:
    'Advanced treatments designed to help you sculpt, firm, refresh and feel confident in your skin.',
  detail:
    'Based in Preston, Lancashire, Luna Moon combines advanced technology with personalised treatment programmes created around your individual goals.',
  image: '/images/clinic-reception.jpg',
};

export const about = {
  heading: 'PERSONALISED TREATMENTS. ADVANCED TECHNOLOGY. YOUR GOALS.',
  body: [
    'Luna Moon Aesthetics is a Preston clinic specialising in advanced skin, body contouring and laser treatments, led by Dee, a highly experienced and qualified aesthetician.',
    'Every treatment starts with what you want to achieve. Rather than a fixed menu to choose from, we build a programme around your skin, your body and the result you’re working towards, using the technology that will actually get you there.',
    'Book a consultation to talk it through, or take a look at the treatments and prices and book online. We’re at 55-56 Friargate, Preston, PR1 2AT.',
  ],
  // Unused since the studio carousel took this section's image slot. Kept
  // because the photo is still in public/images if the carousel ever moves.
  image: '/images/clinic-treatment-room.jpg',
};

export const aboutDee = {
  eyebrow: 'Meet Dee',
  heading: 'THE FOUNDER BEHIND LUNA MOON AESTHETICS',
  body: [
    'Luna Moon Aesthetics was created by Dee with a simple vision: to create a welcoming space where women can invest in themselves and receive personalised, professional treatments without feeling overwhelmed by endless treatment choices.',
    'With experience across advanced aesthetics, body contouring and skin treatments, Dee takes a personalised approach to every client.',
  ],
  /** Set apart from the body copy, in her own words. */
  quote:
    'I don’t believe in a one-treatment-fits-all approach. I want to understand what you want to achieve and create a treatment plan around you.',
  image: '/images/dee-owner.webp',
};

/** The four "WHAT WE DO" cards, in the order the existing site shows them. */
export const serviceCards = [
  {
    title: 'LUNA MOON AESTHETICS ONLINE SHOP',
    body: 'Explore Luna Moon Aesthetics LTD online store and shop for some of our best and most reliable brands. Indulge yourself with our exceptional range of high quality products and enjoy a luxurious pampering session without leaving the comfort of your own home! Contact us for more information.',
    to: '/products',
    image: '/images/liquid-lipo-brand.webp',
  },
  {
    title: 'BODY CONTOURING & SKIN TIGHTENING',
    body: 'Sculpt, firm and reshape with Liquid Lipo, RF skin tightening, body sculpting, EMS, pressotherapy, wood therapy, lymphatic treatments and cavitation vacuum therapy, chosen and combined around the areas you want to work on.',
    to: '/skin-tightening-weight-loss',
    image: '/images/body-contouring.webp',
  },
  {
    title: 'LASER COSMETIC TEETH WHITENING',
    body: 'Professional laser cosmetic teeth whitening at Luna Moon Aesthetics in Preston. A laser light lifts staining from the enamel for a noticeably brighter smile in a single appointment, with the result varying from person to person.',
    to: '/laser-cosmetic-teeth-whitening',
    image: '/images/teeth-whitening-smile.webp',
  },
  {
    title: 'ADVANCED SKIN & FACIAL TREATMENTS',
    body: 'Unleash your inner beauty at Luna Moon Aesthetics in Preston with our range of professional aesthetic treatments including dermaplaning, microneedling, RF microneedling, hydrofacial, skin boosters, polynucleotides, chemical peel, carboxy facial, blepharonat eye treatment, teeth whitening and IPL laser hair removal.',
    to: '/advanced-facial-treatments',
    image: '/images/facial-treatment.webp',
  },
];

export const whatWeDo = {
  heading: 'OUR AESTHETICS SERVICES',
  // `body` is the existing site's wording, left exactly as it was — it's what
  // the homepage already ranks on. `body2` is added underneath rather than
  // rewritten into it, so nothing that earned those rankings is disturbed.
  body: 'Advanced skin treatments, body contouring and laser, delivered with clinical technology and a plan built around you. Luna Moon Aesthetics have won awards for the top 10 regional salons, finalists at the UK Hair and Beauty Awards in 2022 and 2023 and 2nd in the UK Advanced practitioner awards.',
  body2:
    'Alongside our laser treatments (cosmetic teeth whitening and IPL laser hair removal) we offer facial treatments including dermaplaning, microneedling, chemical peels and polynucleotides skin booster courses.',
};

export const bookOnlineCta = {
  heading: 'BOOK ONLINE',
  body: [
    'Luna Moon Aesthetics Preston invite you to take the first step towards a happier, healthier you.',
    'Together, let’s unlock your full potential and unveil the best version of yourself!',
    'Take a look at our services, packages and special offers and book online.',
  ],
};

export const contactBlock = {
  heading: 'CONTACT AESTHETICS CLINIC IN PRESTON',
  body: [
    'We have made it easier than ever to check availability and book appointments with our secure online booking form.',
    'If you have any questions or need advice please get in touch and we will be more than happy to help.',
  ],
  finance:
    'We accept pay monthly payment options as well as Klarna finance options. Get in touch to find out more.',
};

export const faqTeaser = {
  heading: 'FREQUENTLY ASKED QUESTIONS',
  body: 'Take a look at a few of our frequently asked questions, you will also find our clinic policy in the footer. If you do not see what you are looking for, please contact the clinic and we will be more than happy to answer any questions.',
};

/**
 * Google reviews as shown by the existing site's Trustindex widget.
 *
 * Reproduced here so the section renders without the third-party script. If the
 * clinic wants these kept live, the right move is to re-add the Trustindex
 * embed rather than to hand-maintain this list.
 */
export const reviewSummary = { rating: 'EXCELLENT', count: 32, source: 'Google' };

export const reviews = [
  {
    author: 'Helen Smith',
    date: '2026-01-25',
    rating: 5,
    quote:
      'I came in for an eye treatment with Amanda on Wednesday. She made me feel so welcome, and at ease. The treatment was wonderfully relaxing, and gave me a lovely confidence boost. I wouldn’t hesitate to recommend Luna Moon Aesthetics to others, (in fact I already have!) and I can’t wait to come back and try out other treatments.',
  },
  {
    author: 'Fiona Hutchinson',
    date: '2026-01-06',
    rating: 5,
    quote:
      'Second visit, and there will be many more! I was feeling down when I went and these ladies cheered me up no end! And that’s just who they are. The Ultimate Collagen treatment is AMAZING. Also they won’t do something if they don’t think you’ll benefit from it! They won’t just take your money.',
  },
  {
    author: 'doa',
    date: '2026-05-27',
    rating: 5,
    quote:
      'An absolute dream! This place is incredibly comforting and welcoming! I will definitely be returning :) I loved the energy and atmosphere!',
  },
  {
    author: 'Sahida Patel',
    date: '2025-10-21',
    rating: 5,
    quote:
      'I’ve had several treatments, most recently body contouring. Dee’s amazing, the treatments relaxing and the results are visible! Thanks Dee xxx',
  },
  {
    author: 'Elsa Hernandez',
    date: '2025-07-28',
    rating: 5,
    quote:
      'Had a great microdermabrasion facial by the lovely Amanda this weekend, my skin has never felt better! I can’t wait for my next treatments, see you soon xx',
  },
  {
    author: 'Emma Kristina Watt',
    date: '2025-05-20',
    rating: 5,
    quote:
      'Highly recommend. I had the Hour Glass package and have seen big improvements. As a mum of four I struggle with the mum tummy, and my waist and tummy look so much better. Very friendly, would be coming back for more treatments.',
  },
];
