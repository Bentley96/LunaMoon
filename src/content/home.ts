// Homepage content, transcribed from the existing site.
//
// Like src/content/treatments.ts these are DEFAULTS that WordPress overrides
// once the matching content exists. Source: "Existing SIte/" page saves,
// September 2026.

export const hero = {
  /** Rendered as two lines, the first in outline/display weight. */
  titleTop: 'LUNA',
  titleBottom: 'Moon Aesthetics',
  blurb:
    'Professional Aesthetic Beauty Treatments In Preston. For more information, or to make a booking get in touch now!',
  image: '/images/clinic-reception.jpg',
};

export const about = {
  heading: 'BE THE BEST YOU THAT YOU CAN BE',
  body: [
    'Luna Moon Aesthetics Preston is owned by Dee, a highly experienced and qualified aesthetician. Our goal is simple — to provide affordable and professional beauty, aesthetics and skincare treatments.',
    'Luna Moon Aesthetics is a Preston based clinic offering everything you need to keep you looking and feeling glamorous for that special occasion in your life. Based at 55-56 Friargate, Preston, PR1 2AT.',
    'Please visit our online booking form for services and availability. We hope to see you soon. Get in touch to find out more.',
  ],
  image: '/images/clinic-treatment-room.jpg',
};

export const aboutDee = {
  heading: 'ABOUT DEE, OWNER AT LUNA MOON AESTHETICS IN PRESTON',
  body: [
    'My goal and my passion is to provide every single client with VIP treatment so they leave our clinic looking and feeling amazing. I want to give you the confidence to take over the world!',
    'If I can help with anything at all please get in touch and we can have a chat about your requirements and help you to choose the best services for you, because everyone deserves to feel special!',
  ],
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
    title: 'LIQUID LIPO SKIN TIGHTENING & WEIGHT LOSS',
    body: 'Whether you are seeking to tighten sagging skin or embark on a journey to a slimmer, sculpted body, Luna Moon Aesthetics Preston offer Liquid Lipo, RF skin tightening, body sculpting, lemon bottle injections, sauna blanket with essential oils, cavitation vacuum therapy and more.',
    to: '/skin-tightening-weight-loss',
    image: '/images/body-contouring.webp',
  },
  {
    title: 'LASER COSMETIC TEETH WHITENING',
    body: 'Get instant results with our professional cosmetic teeth whitening treatment at Luna Moon Aesthetics clinic in Preston! We can brighten your teeth 8-12 shades whiter than your natural tooth shade by utilising a laser light to enhance the whiteness of your teeth.',
    to: '/laser-cosmetic-teeth-whitening',
    image: '/images/teeth-whitening-smile.webp',
  },
  {
    title: 'ADVANCED SKIN AND FACIAL TREATMENTS',
    body: 'Unleash your inner beauty at Luna Moon Aesthetics in Preston with our range of professional aesthetic treatments including dermaplaning, microneedling, RF microneedling, hydrofacial, skin boosters, polynucleotides, chemical peel, carboxy facial, blepharonat eye treatment, teeth whitening and IPL laser hair removal.',
    to: '/advanced-facial-treatments',
    image: '/images/facial-treatment.webp',
  },
];

export const whatWeDo = {
  heading: 'OUR AESTHETICS SERVICES',
  body: 'From laser cosmetic teeth whitening and skin and facial treatments to skin tightening and weight loss, we have something for everyone, all at affordable prices. Luna Moon Aesthetics have won awards for the top 10 regional salons, finalists at the UK Hair and Beauty Awards in 2022 and 2023 and 2nd in the UK Advanced practitioner awards.',
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
  body: 'Take a look at a few of our frequently asked questions, you will also find our clinic policy in the footer. If you do not see what you are looking for, please contact the clinic — we will be more than happy to answer any questions.',
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
      'Second visit — there will be many more! I was feeling down when I went and these ladies cheered me up no end! And that’s just who they are. The Ultimate Collagen treatment is AMAZING. Also they won’t do something if they don’t think you’ll benefit from it! They won’t just take your money.',
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
      'Highly recommend. I had the Hour Glass package and have seen big improvements — as a mum of four I struggle with the mum tummy, and my waist and tummy look so much better. Very friendly, would be coming back for more treatments.',
  },
];
