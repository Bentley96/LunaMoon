// Frequently asked questions, grouped by the page each set belongs to.
//
// Source: the clinic's "FAQs for each page" document, September 2026. The Lumi
// Eye and B Complex groups have since been removed with those treatments. Each
// group there is labelled with the page it should appear at the bottom of, and
// that label is what `route` holds — so moving a group to a different page is a
// one-line change here rather than an edit to the page itself.
//
// The existing site's FAQ page is worth knowing about: it has 18 accordion
// headings and not one answer behind them — every panel is empty. So none of
// this could be carried over from it; this document is the content.
//
// Everything appears on /faqs. A group with a route also appears at the bottom
// of that page, and a group with `products` appears on those product pages.
// A group with neither only shows on /faqs.

export interface Faq {
  question: string;
  answer: string;
}

export interface FaqGroup {
  /** Stable id, used for anchors and React keys. */
  id: string;
  title: string;
  /** Page this group appears at the bottom of, or null for /faqs only. */
  route: string | null;
  /** Product page slugs this group belongs to. */
  products?: string[];
  faqs: Faq[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'aesthetics-treatments',
    title: 'Aesthetics treatments in Preston',
    route: '/',
    faqs: [
      {
        question: 'What aesthetic treatments does Luna Moon Aesthetics offer in Preston?',
        answer:
          'Luna Moon Aesthetics offers a wide range of aesthetic and beauty treatments, including skin boosters, facial treatments, skin rejuvenation, IPL laser hair removal, body contouring, skin tightening, teeth whitening and weight-loss treatments.',
      },
      {
        question: 'Are aesthetic treatments suitable for everyone?',
        answer:
          'Not every treatment is suitable for every person. Your suitability will depend on factors such as your health, skin type, treatment goals, and medical history. A consultation can help determine which treatment is appropriate for you.',
      },
      {
        question: 'Will I need a consultation before treatment?',
        answer:
          'Some treatments may require a consultation before they can be carried out. Your practitioner will discuss your requirements, assess your suitability, and explain what you can expect.',
      },
      {
        question: 'Are aesthetic treatments painful?',
        answer:
          'The level of discomfort varies depending on the treatment. Your practitioner will explain what you may feel during the procedure and discuss ways to make your treatment as comfortable as possible.',
      },
      {
        question: 'How long do aesthetic treatment results last?',
        answer:
          'Results vary depending on the treatment, your individual circumstances and how your skin or body responds. Your practitioner can provide more specific information during your consultation.',
      },
      {
        question: 'How do I choose the right treatment?',
        answer:
          'If you are unsure which treatment is right for you, contact Luna Moon Aesthetics. The team can discuss your concerns and recommend suitable options based on your individual goals.',
      },
      {
        question: 'Are treatments available for men and women?',
        answer:
          'Yes. Aesthetic treatments can be suitable for people of different genders and backgrounds. Luna Moon Aesthetics provides a welcoming and inclusive environment.',
      },
      {
        question: 'Where is Luna Moon Aesthetics located?',
        answer: 'The clinic is based at House of Hair & Beauty, 55-56 Friargate, Preston, PR1 2AT.',
      },
    ],
  },
  {
    id: 'skin-boosters',
    title: 'Skin boosters: Profhilo & Seventy Hyal',
    route: '/',
    faqs: [
      {
        question: 'What are skin boosters?',
        answer:
          'Skin boosters are injectable treatments designed to improve skin hydration and overall appearance. They can help support smoother, fresher-looking, and more radiant skin.',
      },
      {
        question: 'What is Profhilo?',
        answer:
          'Profhilo is an injectable hyaluronic acid treatment designed to provide intense hydration and support improvements in skin quality, elasticity, and firmness.',
      },
      {
        question: 'What is Seventy Hyal?',
        answer:
          'Seventy Hyal is a skin booster containing hyaluronic acid, designed to hydrate the skin and improve its overall appearance.',
      },
      {
        question: 'What skin concerns can skin boosters help with?',
        answer:
          'Skin boosters may be suitable for people concerned about dehydration, dull-looking skin, fine lines, and reduced skin elasticity.',
      },
      {
        question: 'Are skin boosters suitable for mature skin?',
        answer:
          'They may be suitable for mature skin, although treatment suitability will always depend on your individual circumstances and will be discussed during your consultation.',
      },
      {
        question: 'How many skin booster treatments will I need?',
        answer:
          'The recommended number of treatments varies between individuals. Your practitioner will discuss an appropriate treatment plan based on your skin and desired results.',
      },
      {
        question: 'Are skin boosters painful?',
        answer:
          'Some temporary discomfort may occur during injectable treatments. Your practitioner will explain the procedure and what you can expect before treatment.',
      },
      {
        question: 'How soon will I see results from skin boosters?',
        answer:
          'Results can develop gradually as the treatment works within the skin. Your practitioner will explain the expected treatment timeline during your consultation.',
      },
    ],
  },
  {
    id: 'ipl-laser-hair-removal',
    title: 'IPL laser hair removal',
    route: '/book-online',
    faqs: [
      {
        question: 'What is IPL laser hair removal?',
        answer:
          'IPL, or intense pulsed light, uses controlled pulses of light to target hair follicles and help reduce unwanted hair growth.',
      },
      {
        question: 'Which areas can be treated with IPL hair removal?',
        answer:
          'IPL can be used on a number of areas, including the face, legs, arms, bikini area and back, subject to suitability.',
      },
      {
        question: 'Does IPL permanently remove hair?',
        answer:
          'IPL is designed to provide long-term hair reduction rather than guaranteeing permanent removal. Multiple treatments are normally required.',
      },
      {
        question: 'How many IPL treatments will I need?',
        answer:
          'The number of sessions varies depending on factors such as the treatment area, hair growth, and individual response.',
      },
      {
        question: 'Is IPL hair removal painful?',
        answer:
          'Most people tolerate IPL well, although you may experience some warmth or mild discomfort during treatment.',
      },
      {
        question: 'Can IPL help with ingrown hairs?',
        answer:
          'IPL hair reduction may help reduce the occurrence of ingrown hairs associated with repeated shaving or other hair-removal methods.',
      },
      {
        question: 'Can IPL be used on the face?',
        answer:
          'IPL can be used on suitable facial areas. Your practitioner will assess your skin and hair before treatment.',
      },
      {
        question: 'Can men have IPL hair removal?',
        answer:
          'Yes. IPL hair removal can be suitable for men as well as women, subject to an individual suitability assessment.',
      },
      {
        question: 'What should I do before an IPL appointment?',
        answer:
          'Your practitioner will provide preparation instructions based on the area being treated and your individual circumstances.',
      },
      {
        question: 'Is IPL suitable for every skin type?',
        answer:
          'IPL suitability depends on factors including skin tone, hair colour, and other individual characteristics. A consultation or assessment is important before treatment.',
      },
    ],
  },
  {
    id: 'skin-tightening-weight-loss',
    title: 'Body contouring & skin tightening',
    route: '/skin-tightening-weight-loss',
    faqs: [
      {
        question: 'What body treatments does Luna Moon Aesthetics offer?',
        answer:
          'The clinic offers treatments including Liquid Lipo, RF skin tightening, body sculpting, Lemon Bottle injections, sauna blanket treatments, and cavitation vacuum therapy.',
      },
      {
        question: 'What is RF skin tightening?',
        answer:
          'RF, or radiofrequency, skin tightening uses radiofrequency energy as part of a treatment designed to improve the appearance and firmness of the skin.',
      },
      {
        question: 'What is body sculpting?',
        answer:
          'Body sculpting treatments are designed to target specific areas of the body and improve their overall appearance and contour.',
      },
      {
        question: 'What is Liquid Lipo?',
        answer:
          "Liquid Lipo is a treatment offered as part of the clinic's body-contouring and weight-management services. Your practitioner can explain the treatment and its suitability for your individual goals.",
      },
      {
        question: 'Can body treatments help with loose skin?',
        answer:
          'Certain treatments may help improve the appearance of loose or less firm skin. The most appropriate option depends on the individual and the area being treated.',
      },
      {
        question: 'Can aesthetic treatments replace diet and exercise?',
        answer:
          "Aesthetic treatments should not be considered a replacement for a balanced diet, physical activity, or professional medical advice. They can be discussed as part of an individual's wider goals.",
      },
      {
        question: 'How many body treatments will I need?',
        answer:
          'The number of sessions depends on the treatment selected and your individual goals. Your practitioner can recommend a suitable treatment plan.',
      },
      {
        question: 'Are body contouring treatments suitable for everyone?',
        answer:
          'No. Suitability varies between individuals and depends on factors including health, medical history and the treatment being considered.',
      },
    ],
  },
  {
    id: 'laser-teeth-whitening',
    title: 'Laser cosmetic teeth whitening',
    route: '/laser-cosmetic-teeth-whitening',
    faqs: [
      {
        question: 'What is laser cosmetic teeth whitening?',
        answer:
          'Laser cosmetic teeth whitening is a professional cosmetic treatment designed to brighten the appearance of the teeth.',
      },
      {
        question: 'How much brighter will my teeth look?',
        answer:
          'Laser whitening lifts staining from the enamel for a noticeably brighter smile, usually in a single appointment. How much lighter your teeth go depends on your enamel and the staining you start with.',
      },
      {
        question: 'How quickly will I see results?',
        answer:
          'Teeth whitening can produce a noticeable improvement following treatment, although the final result varies between individuals.',
      },
      {
        question: 'How long do teeth whitening results last?',
        answer:
          'Results vary depending on factors such as your diet, lifestyle, and oral care routine.',
      },
      {
        question: 'Is teeth whitening painful?',
        answer:
          'Some people can experience temporary sensitivity following teeth whitening. Your practitioner can explain potential side effects before treatment.',
      },
      {
        question: 'Can anyone have cosmetic teeth whitening?',
        answer:
          'Not everyone is suitable for teeth whitening. Your dental and oral health should be considered before treatment.',
      },
      {
        question: 'Does teeth whitening work on crowns or veneers?',
        answer:
          'Whitening treatments affect natural tooth structure rather than artificial dental materials. If you have crowns, veneers, or other dental restorations, discuss these with your practitioner beforehand.',
      },
      {
        question: 'Can I eat normally after teeth whitening?',
        answer:
          'You may be given specific aftercare advice following treatment. Following those instructions can help you maintain your results.',
      },
    ],
  },
  {
    id: 'advanced-facial-treatments',
    title: 'Advanced skin & facial treatments',
    route: '/advanced-facial-treatments',
    faqs: [
      {
        question: 'What advanced facial treatments are available in Preston?',
        answer:
          'Luna Moon Aesthetics offers treatments including dermaplaning, microneedling, RF microneedling, HydraFacials, skin boosters, polynucleotides, chemical peels, carboxy facials and Blepharonat eye treatments.',
      },
      {
        question: 'What is dermaplaning?',
        answer:
          'Dermaplaning is a facial treatment that uses a specialised blade to gently remove surface dead skin cells and fine facial hair.',
      },
      {
        question: 'What is microneedling?',
        answer:
          "Microneedling uses fine needles to create controlled micro-injuries in the skin, stimulating the body's natural skin-renewal processes.",
      },
      {
        question: 'What is RF microneedling?',
        answer:
          'RF microneedling combines microneedling with radiofrequency energy to target the deeper layers of the skin.',
      },
      {
        question: 'What is a Hydrafacial?',
        answer:
          'A Hydrafacial is a multi-step facial treatment designed to cleanse, exfoliate, and hydrate the skin.',
      },
      {
        question: 'What are polynucleotides?',
        answer:
          'Polynucleotide treatments are advanced skin-rejuvenation treatments designed to support skin quality and regeneration.',
      },
      {
        question: 'What is a chemical peel?',
        answer:
          'A chemical peel uses a specially selected solution to exfoliate the skin and encourage the development of fresher-looking skin.',
      },
      {
        question: 'What is a carboxy facial?',
        answer:
          'A carboxy facial is an aesthetic facial treatment designed to improve the appearance and condition of the skin.',
      },
      {
        question: 'Which facial treatment is right for me?',
        answer:
          'The most suitable treatment depends on your skin type, concerns, and desired results. A consultation allows your practitioner to recommend an appropriate option.',
      },
    ],
  },
  {
    id: 'online-shop',
    title: 'Online shop',
    route: '/products',
    faqs: [
      {
        question: 'Can I buy skincare and aesthetic products online?',
        answer:
          'Yes. Luna Moon Aesthetics has an online shop offering a selection of products and brands.',
      },
      {
        question: 'What products are available from the Luna Moon Aesthetics online shop?',
        answer:
          'The range can include professional and home-use aesthetic and skincare products, subject to current availability.',
      },
      {
        question: 'Can I use the products at home?',
        answer:
          "Product suitability and instructions vary. Always follow the manufacturer's instructions and any advice provided by the clinic.",
      },
      {
        question: 'Does the clinic offer advice about products?',
        answer:
          'Yes. If you are unsure which product is appropriate for you, contact Luna Moon Aesthetics for advice.',
      },
      {
        question: 'Can I buy products without having a treatment?',
        answer:
          'Product requirements vary, so contact the clinic if you are unsure whether a particular product is suitable for you.',
      },
      {
        question: 'What should I do if I have questions about an online product?',
        answer:
          'Contact Luna Moon Aesthetics before purchasing if you need advice about a product, its use or suitability.',
      },
    ],
  },
  {
    id: 'blepharonat',
    title: 'Blepharonat periorbital reduction',
    route: null,
    products: ['blepharonat-periorbital-reduction', 'blepharonat-eye-bag-removal'],
    faqs: [
      {
        question: 'What is Blepharonat?',
        answer:
          'Blepharonat is a product designed for use around the eye area and is marketed for improving the appearance of under-eye bags and pockets.',
      },
      {
        question: 'What does Blepharonat target?',
        answer: 'The product is designed to target the appearance of under-eye pockets and bags.',
      },
      {
        question: 'Can Blepharonat be used around the eyes?',
        answer:
          "The product is specifically marketed for use around the eye area. Always follow the manufacturer's application instructions carefully.",
      },
      {
        question: 'Is Blepharonat suitable for everyone?',
        answer:
          'No skincare or cosmetic product is suitable for everyone. Check the product information and seek professional advice if you have concerns about using it.',
      },
      {
        question: 'How should I use Blepharonat?',
        answer:
          "Follow the manufacturer's instructions supplied with the product. Do not use it in a way that differs from the stated directions.",
      },
      {
        question: 'Can I buy Blepharonat from Luna Moon Aesthetics?',
        answer:
          "Yes, Blepharonat Periorbital Reduction is currently listed in the clinic's online shop.",
      },
    ],
  },
  {
    id: 'liquid-lipo-home-kit',
    title: 'Liquid Lipo Home Kit',
    route: null,
    products: ['liquid-lipo-home-kit'],
    faqs: [
      {
        question: 'What is the Liquid Lipo Home Kit?',
        answer:
          'The Liquid Lipo Home Kit is a topical product available through the Luna Moon Aesthetics online shop.',
      },
      {
        question: 'What sizes are available?',
        answer: 'The current online listing shows 50ml and 250ml options.',
      },
      {
        question: 'How is Liquid Lipo applied?',
        answer:
          "Follow the manufacturer's instructions supplied with the product. If you are unsure how to use it, contact the clinic before application.",
      },
      {
        question: 'Can Liquid Lipo be used at home?',
        answer:
          'The product is marketed as a home-use topical treatment. Always follow the supplied instructions and safety information.',
      },
      {
        question: 'How many applications does the Liquid Lipo Home Kit provide?',
        answer:
          'The product listing states that the home bottles contain approximately twenty applications, depending on how they are used.',
      },
      {
        question: 'Is Liquid Lipo suitable for everyone?',
        answer:
          'You should check the product information and speak to a suitably qualified professional if you are unsure whether it is appropriate for you.',
      },
      {
        question: 'How much does the Liquid Lipo Home Kit cost?',
        answer:
          'The current online listing shows prices from £60 to £135, depending on the size selected.',
      },
    ],
  },
  {
    id: 'inclusive-aesthetics',
    title: 'Inclusive & gender-affirming treatments',
    route: null,
    faqs: [
      {
        question: 'Does Luna Moon Aesthetics provide treatments for the LGBTQ+ community?',
        answer:
          'Yes. Luna Moon Aesthetics states that it provides a safe, inclusive, and welcoming environment for people regardless of gender, identity, culture, or background.',
      },
      {
        question: 'Are aesthetic treatments available as part of gender affirmation?',
        answer:
          "Aesthetic treatments may form part of an individual's gender-affirming journey. Luna Moon Aesthetics offers personalised treatment discussions based on individual goals.",
      },
      {
        question: 'Will my treatment be confidential?',
        answer:
          'The clinic states that clients will be treated with respect, sensitivity, and discretion.',
      },
      {
        question: 'Can I discuss my treatment goals before booking?',
        answer:
          'Yes. If you are unsure which treatment may be suitable, you can contact the clinic to discuss your requirements.',
      },
      {
        question: 'Do I have to identify as transgender to access these services?',
        answer:
          "No. The clinic's inclusive approach is intended to make aesthetic treatments welcoming and accessible to people from all backgrounds.",
      },
      {
        question: 'Can treatments be tailored to my individual goals?',
        answer:
          "Yes. The clinic states that treatments can be personalised according to each client's individual requirements and goals.",
      },
    ],
  },
  {
    id: 'contact-booking',
    title: 'Contact & booking',
    route: '/contact',
    faqs: [
      {
        question: 'How do I book an appointment with Luna Moon Aesthetics?',
        answer:
          "Appointments can be booked through the clinic's online booking system, which allows clients to check availability and select services.",
      },
      {
        question: 'Can I contact Luna Moon Aesthetics before booking?',
        answer:
          'Yes. You can contact the clinic if you need advice about treatments or have questions before making an appointment.',
      },
      {
        question: 'What is the phone number for Luna Moon Aesthetics?',
        answer: 'The website currently lists 07592 608 064 as the clinic telephone number.',
      },
      {
        question: 'Where is Luna Moon Aesthetics based?',
        answer:
          'The clinic is located on the second floor of House of Hair & Beauty, 55-56 Friargate, Preston, PR1 2AT.',
      },
      {
        question: 'What are the clinic opening hours?',
        answer:
          'The website lists Monday 10am to 6pm, Tuesday 10am to 6pm, Wednesday 10am to 5pm, Thursday 10am to 7pm, Friday 10am to 7pm and Saturday 10am to 3pm. The clinic is closed on Sundays.',
      },
      {
        question: 'Does Luna Moon Aesthetics offer finance options?',
        answer:
          'The website states that pay-monthly and Klarna finance options are available. Contact the clinic for current details and eligibility.',
      },
      {
        question: 'Can I ask for treatment advice before making a booking?',
        answer:
          'Yes. The clinic encourages clients to get in touch if they have questions or need advice about which treatment may be appropriate.',
      },
    ],
  },
];

/** Groups shown at the bottom of a page, by route. */
export function faqsForRoute(route: string): FaqGroup[] {
  return faqGroups.filter((g) => g.route === route);
}

/** Groups shown on a product page, by product slug. */
export function faqsForProduct(slug: string): FaqGroup[] {
  return faqGroups.filter((g) => g.products?.includes(slug));
}

export const faqCount = faqGroups.reduce((n, g) => n + g.faqs.length, 0);
