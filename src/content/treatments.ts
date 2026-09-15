// Treatment page content, transcribed from the existing site.
//
// These are the DEFAULTS. Once the matching `treatment` posts exist in
// WordPress, the REST response wins and the clinic edits copy in wp-admin
// (see src/lib/wp.ts and wordpress/lunamoon/inc/content.php). Shipping the copy
// here means the site renders correctly on a fresh install, before anyone has
// typed anything into wp-admin, and keeps `npm run dev` useful without a
// WordPress behind it.
//
// Source: "Existing SIte/" page saves, September 2026.

export interface TreatmentSection {
  title: string;
  /** One entry per paragraph. */
  body?: string[];
  bullets?: string[];
  image?: string;
}

export interface TreatmentPageData {
  slug: string;
  /** Label used in the "Our Treatments" dropdown. */
  navLabel: string;
  /** Large hero heading. */
  title: string;
  heroBlurb: string;
  heroImage: string;
  /** The opening "what this is" block. */
  intro: { heading: string; body: string[]; image?: string };
  /** The optional second editorial block above the section list. */
  secondary?: { heading: string; body: string[]; image?: string };
  sections: TreatmentSection[];
}

const SERVICES_BLURB =
  'From laser cosmetic teeth whitening and skin and facial treatments to skin tightening and weight loss, we have something for everyone, all at affordable prices. Luna Moon Aesthetics have won awards for the top 10 regional salons, finalists at the UK Hair and Beauty Awards in 2022 and 2023 and 2nd in the UK Advanced practitioner awards.';

export const treatmentPages: TreatmentPageData[] = [
  {
    // NOT in the "Our Treatments" menu — see MENU_SLUGS in src/config/site.ts.
    // The route still resolves so existing links keep working, but nothing
    // links here any more. Skin Boosters, Lumie Eye and B Complex appear only
    // on this page, so deleting it would lose that copy; the IPL section is
    // also covered on the Advanced Facial Treatments page.
    slug: 'aesthetics-treatments',
    navLabel: 'Aesthetics Treatments',
    title: 'AESTHETICS TREATMENTS',
    heroBlurb:
      'We provide professional aesthetics treatments in Preston. For more information, or to make a booking get in touch now!',
    heroImage: '/images/injectable-treatment.webp',
    intro: {
      heading: 'AESTHETICS TREATMENTS PRESTON',
      body: [
        'Luna Moon Aesthetics in Preston offer a range of cutting-edge treatments designed to leave you feeling refreshed, revitalised and confident.',
      ],
      image: '/images/skin-boosters.webp',
    },
    secondary: {
      heading: 'OUR AESTHETICS SERVICES',
      body: [SERVICES_BLURB],
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
        title: 'LUMIE EYE',
        body: [
          'Say hello to brighter, radiant eyes that sparkle with vitality. Lumie Eye is here to brighten and rejuvenate your delicate under-eye area. This non-invasive treatment uses advanced technology to target dark circles, puffiness and fine lines, leaving you with a more youthful and refreshed appearance.',
        ],
        image: '/images/lumie-eye-treatment.webp',
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
  },

  {
    slug: 'advanced-facial-treatments',
    navLabel: 'Advanced Facial Treatments',
    title: 'ADVANCED FACIAL TREATMENTS',
    heroBlurb:
      'We provide professional laser advanced facial treatment services in Preston. For more information, or to make a booking get in touch now!',
    heroImage: '/images/facial-treatment.webp',
    intro: {
      heading: 'ADVANCED SKIN AND FACIAL TREATMENTS',
      body: [
        'Luna Moon Aesthetics is a Preston based clinic offering everything you need to keep you looking fabulous and feeling fantastic. We are based at 55-56 Friargate, Preston, PR1 2AT. Please visit our online booking form for services and availability.',
        'Unleash your inner beauty at Luna Moon Aesthetics Preston with treatments including dermaplaning, microneedling, chemical peel, carboxy facial, blepharonat eye treatment, teeth whitening and IPL laser hair removal.',
      ],
      image: '/images/facial-relaxing.webp',
    },
    secondary: {
      heading: 'BE THE BEST YOU THAT YOU CAN BE',
      body: [
        'Indulge in the array of skin and facial treatments offered at Luna Moon Aesthetics in Preston. We provide safe and effective procedures tailored to enhance your natural beauty. From rejuvenating facials to advanced skincare solutions, our expert team ensures safe and effective procedures to rejuvenate your appearance and leave you glowing with confidence.',
      ],
      image: '/images/facial-massage.webp',
    },
    sections: [
      {
        title: 'DERMAPLANING',
        body: [
          'Dermaplaning is a popular treatment that exfoliates the skin by using a fine blade to remove dead cells and vellus hair. This treatment helps to reveal a brighter, softer complexion, it will leave skin smooth and perfectly prepped for make up to look flawless. It is a safe, effective exfoliation treatment that promotes deeper product penetration, boosting the effects of skin care products. It can also reduce the look of fine lines, wrinkles, and acne scarring.',
        ],
        image: '/images/facial-dermaplaning.webp',
      },
      {
        title: 'MICRONEEDLING TREATMENTS',
        body: [
          'Microneedling is otherwise known as collagen induction therapy and uses tiny needles in a pen or a roller to prick the skin. This safe and effective treatment allows new tissue and collagen to develop, it smooths, firms and tones the skin and can reduce the appearance of fine lines, wrinkles and large pores. As one of our most popular cosmetic procedures, this treatment has helped countless clients feel more confident and happier in their own skin.',
        ],
        image: '/images/facial-microneedling.webp',
      },
      {
        title: 'CHEMICAL PEELS',
        body: [
          'A chemical peel is a technique used to improve and smooth the texture of the skin. Chemical peels remove the outermost layers of the skin and involve the application of a chemical solution to the skin, which causes it to exfoliate and eventually peel off. This results in skin rejuvenation and reduces scarring, fine lines and wrinkles. Chemical peels can also even out skin tone by fading areas of hyperpigmentation, such as sun spots, age spots and melasma.',
        ],
        image: '/images/facial-chemical-peel.webp',
      },
      {
        title: 'CARBOXY FACIAL',
        body: [
          'Carboxy facial uses high concentration of carbon dioxide to restore skin health. A mask is used to infuse this into your skin to detoxify the surface layers. It reduces inflammation and maintains oil and moisture balance, it enhances skin elasticity brightening and improving dull skin. The treatment reinforces skin tone and improves barrier function, it minimises fine lines and wrinkles, improves congested skin and refines pores.',
        ],
        image: '/images/facial-carboxy-mask.webp',
      },
      {
        title: 'BLEPHARONAT EYE TREATMENT',
        body: [
          'Blepharonat is a new product from the minds that brought you Liquid Lipo fat dissolve gel. The gel is applied, covered and left for up to half an hour. It’s as simple and painless as that! Depending on the severity of the eye bags multiple applications may be required, but results can be seen from the very first application, where it flushes the build-up of fluid retention (or fat) from the under-eye bags within just 5 days!',
        ],
        image: '/images/facial-blepharonat-eye.webp',
      },
      {
        title: 'IPL LASER HAIR REMOVAL',
        body: [
          'IPL hair removal is a popular method for reducing unwanted hair. It works by emitting a broad spectrum of light that targets the melanin in the hair follicles, heating them up and damaging the follicles to inhibit future hair growth, results can vary from person to person. It is less painful than waxing or traditional laser hair removal and can be used on various body areas, including the legs, arms, bikini line, underarms, and face.',
        ],
        image: '/images/ipl-hair-removal-underarm.webp',
      },
    ],
  },

  {
    slug: 'laser-cosmetic-teeth-whitening',
    navLabel: 'Laser Cosmetic Teeth Whitening',
    title: 'LASER COSMETIC TEETH WHITENING',
    heroBlurb:
      'We provide professional laser cosmetic teeth whitening services in Preston. For more information, or to make a booking get in touch now!',
    heroImage: '/images/teeth-whitening-smile.webp',
    intro: {
      heading: 'LASER COSMETIC TEETH WHITENING',
      body: [
        'Get instant results with cosmetic teeth whitening at Luna Moon Aesthetics Preston! We can take your teeth up to 8-12 shades whiter than your natural tooth shade by utilising a laser light to enhance the whiteness of teeth.',
        'Luna Moon Aesthetics is a Preston based clinic offering everything you need to keep you looking and feeling glamorous for that special occasion in your life. We are at 55-56 Friargate, Preston, PR1 2AT. Please visit our online booking form for services and availability. We hope to see you soon.',
      ],
      image: '/images/teeth-whitening-1.webp',
    },
    secondary: {
      heading: 'NATURAWHITE — SMILE YOUR BEST SMILE',
      body: [
        'Treat yourself to safe, effective teeth whitening at Luna Moon Aesthetics clinic in Preston. Laser cosmetic teeth whitening is a procedure that uses a teeth whitening gel and powerful laser light to improve the appearance of teeth by lightening their colour by up to 12 shades.',
      ],
      image: '/images/teeth-whitening-2.webp',
    },
    sections: [
      {
        title: 'PROFESSIONAL TEETH WHITENING PRESTON',
        bullets: [
          'No recovery time',
          'Treatment time — 1 hour',
          'Immediate visible results',
          'Result duration — permanent',
        ],
        image: '/images/teeth-whitening-3.webp',
      },
      {
        title: 'TEETH WHITENING BENEFITS',
        bullets: [
          'Boosts confidence — smile with pride',
          'A radiant, youthful, healthier smile',
          'Look your best in photographs',
          'Our service is cost effective',
        ],
        image: '/images/teeth-whitening-4.webp',
      },
      {
        title: 'SPREAD THE LOVE WITH A LUNA MOON SMILE',
        body: [
          'When you arrive for your first treatment, we will carry out an initial consultation. The teeth whitening procedure is painless and takes an hour.',
          'We apply a teeth whitening gel to your teeth and this results in the release of oxygen ions, this gently removes stains from your teeth.',
          'We then use a powerful laser to optimise the stain removal process. At the end of the treatment, you will see a visible improvement in the whiteness of your teeth.',
        ],
        image: '/images/teeth-whitening-5.webp',
      },
    ],
  },

  {
    slug: 'skin-tightening-weight-loss',
    navLabel: 'Skin Tightening & Weight Loss',
    title: 'SKIN TIGHTENING & WEIGHT LOSS',
    heroBlurb:
      'We provide professional skin tightening & weight loss services in Preston. For more information, or to make a booking get in touch now!',
    heroImage: '/images/body-contouring.webp',
    intro: {
      heading: 'SKIN TIGHTENING & WEIGHT LOSS',
      body: [
        'Luna Moon Aesthetics is a Preston based clinic offering everything you need to keep you looking fabulous and feeling fantastic. We are based at 55-56 Friargate, Preston, PR1 2AT. Please visit our online booking form for services and availability.',
        'Whether you are seeking to tighten sagging skin or embark on a journey to a slimmer, sculpted body, Luna Moon Aesthetics Preston offer radio frequency skin tightening and body sculpting, lemon bottle injections, sauna blanket with essential oils, liquid lipo, cavitation and vacuum therapy.',
      ],
      image: '/images/liquid-lipo-brand.webp',
    },
    secondary: {
      heading: 'OUR AESTHETICS SERVICES',
      body: [SERVICES_BLURB],
      image: '/images/body-waist-measure.webp',
    },
    sections: [
      {
        title: 'LIQUID LIPO',
        body: [
          'Offering a non-invasive alternative to fat dissolving injections, Liquid Lipo can target larger areas. It acts on fat deposits by causing fat cells to shrink, forcing the fat into the blood stream, this is then naturally excreted through urine — please drink 2-4 litres of water following treatment. This allows for significantly faster weight loss, slimmer body shape and a reduction in fat levels. It can reduce the risk of diabetes, high blood pressure and other conditions associated with being obese. Liquid Lipo is used with cavitation & radio frequency to enhance the results.',
        ],
        image: '/images/body-cavitation-tummy.webp',
      },
      {
        title: 'LEMON BOTTLE FAT DISSOLVING',
        body: [
          'Lemon Bottle fat dissolving injections at Luna Moon Aesthetics are an advanced procedure designed to target and reduce stubborn fat, resulting in a more sculpted physique. Lemon Bottle breaks down fat cells and enhances metabolism. Following the treatment, the body takes over with its natural waste removal mechanisms. The fatty acids are gradually flushed out of the body through the urine. To accelerate the process, clients should drink a minimum of two litres of water daily post-treatment so your body can flush out the dissolved fats.',
        ],
        image: '/images/body-lemon-bottle-thigh.webp',
      },
      {
        title: 'CAVITATION',
        body: [
          'Ultrasonic cavitation is a cosmetic procedure that breaks apart stubborn areas of fat in your body. The cavitation treatment works as an effective, less invasive alternative to liposuction. It is extremely convenient and effective because recovery time is minimal and side effects are rare. It can be used to sculpt and firm areas of the body, it works well alongside RF skin tightening and alongside Liquid Lipo. Why not treat yourself to a package of all 3 treatments — if this is something that would interest you, contact me to discuss a treatment package and let’s firm and tone your body.',
        ],
        image: '/images/body-cavitation-2.webp',
      },
      {
        title: 'VACUUM THERAPY',
        body: [
          'Professional vacuum-therapy treatments work by stimulating muscles and breaking down cellulite and fatty deposits in the body, eliminating toxins, improving lymphatic drainage and taking inches off your body. Vacuum therapy also helps restore the skin’s natural elasticity to smooth the appearance of facial wrinkles and “orange-peel” dimpling in the thighs and buttocks. This therapy is painless, safe and highly effective. For more information about our vacuum therapy treatments, do not hesitate to get in touch with Dee at Luna Moon Aesthetics in Preston today.',
        ],
        image: '/images/body-vacuum-therapy.webp',
      },
      {
        title: 'RADIO FREQUENCY SKIN TIGHTENING & BODY SCULPTING',
        body: [
          'Radio frequency (RF) is used to tighten, firm and sculpt the skin. RF energy is directed into the skin via an optical gel which is applied before treatment. This heats the lower layers of your skin without having to pass directly through the surface skin so that skin is optimally protected.',
          'The heat being delivered to the lower layers is absorbed by water molecules present in this area. It is ideal to use on the face following a course of our Rewind and Osmosis creams (see our shop) as this will increase the water content in the skin. The water molecules then begin to vibrate from the energy delivered, causing additional frictional heat.',
          'The brain then interprets this heat as being a perceived threat and potential injury, so the body responds by stimulating collagen with the further benefit of tightening elastin fibres. This allows RF to be used on areas of the body such as the bottom, stomach and breasts to sculpt, lift and firm.',
          'The result of RF treatment is tighter, firmer, younger looking skin. The excitation of the water molecules leaves skin feeling fresh and youthful, and also allows for optimal oxidisation of the skin. Oxygen stimulation below the skin surface promotes skin health (assisting with acne and scarring) in addition to the lifting and tightening the technology is best known for.',
        ],
        image: '/images/body-rf-sculpting.webp',
      },
      {
        title: 'PRESSOTHERAPY TREATMENTS',
        body: [
          'Pressotherapy is a therapeutic technique that involves applying pressure to specific areas of the body using specialised equipment.',
          'This technique can improve circulation, reduce swelling and promote lymphatic drainage. Pressotherapy can help in the treatment of various conditions such as lymphedema, venous insufficiency and cellulite.',
        ],
        image: '/images/body-pressotherapy.webp',
      },
      {
        title: 'SAUNA BLANKET WITH ESSENTIAL OILS',
        bullets: ['Clearer skin', 'Better sleep', 'Calorie burn', 'Detoxification', 'Reduce stress'],
        image: '/images/body-tummy-result.webp',
      },
    ],
  },
];

export const treatmentBySlug = (slug: string): TreatmentPageData | undefined =>
  treatmentPages.find((t) => t.slug === slug);
