// Booking packages, transcribed from the clinic's booking page on that-time.co.uk.
//
// These exist so prices are visible without leaving the site. Booking itself
// still happens on that-time.co.uk — it owns availability, deposits and
// rescheduling, and there is no per-package URL to deep-link to (the booking
// page is a JS app with checkboxes, not one page per service), so every "Book"
// control goes to the same booking page.
//
// IMPORTANT: this is a snapshot, so it will drift as soon as prices change
// there. Nothing keeps the two in step automatically. Treat that-time.co.uk as
// the source of truth and update this file when it changes — or move the list
// into wp-admin so the clinic can maintain it themselves.
//
// Captured 15 September 2026.

export interface Package {
  name: string;
  /** Price in minor units (pence), so it formats through lib/format.ts. */
  price: number;
  /** Human duration, e.g. "1 hr 30 mins". Empty when none was listed. */
  duration: string;
  /** A booking deposit is taken for this package. */
  deposit: boolean;
  /** What's included. Empty for packages with no description. */
  summary: string;
}

/** Ordered cheapest first. */
export const packages: Package[] = [
  {
    name: 'Lift.Tone.Tighten',
    price: 7900,
    duration: '1 hr',
    deposit: false,
    summary: '',
  },
  {
    name: 'Teeth & tum - Special Offer',
    price: 8500,
    duration: '1 hr',
    deposit: true,
    summary: '45 min laser cosmetic teeth whitening, liquid lipo wrap applied before to melt those inches, perfect for a special occasion, holiday etc',
  },
  {
    name: 'Detox & Glow',
    price: 8900,
    duration: '1 hr',
    deposit: true,
    summary: 'Liquid lipo is applied and wrapped while you enjoy a relaxing 30 min express hydrafacial, leaving your skin cleansed and looking glowy and fresh, you will then enjoy a 15 min infrared sauna blanket session to increase the results of thd liquid lipo, this package will leave you feeling slimmer and glowing perfect for a holiday, special event or just to bo…',
  },
  {
    name: 'Ultimate Thigh Cellulite sculpt/ Blaster',
    price: 9500,
    duration: '1 hr 30 mins',
    deposit: true,
    summary: 'The ultimate for getting rid of that cellulite Pressotherapy for lymphatic drainage Liquid lipo to reduce trapped fat Rf skin tightening /cavitation for sculpting toning and tightening',
  },
  {
    name: 'Feel good package',
    price: 9900,
    duration: '1 hr',
    deposit: true,
    summary: 'NEW PACKAGE The Feel Good Package Wow! What a package the Queen of beauty Dee has put together For LESS than £100 you’ll get: A B12 injection. This is perfect for increasing energy, reducing anxiety and fatigue, increases brain function, can aid metabolism & weight loss amongst other things- the B12 shot is fab for overall health…',
  },
  {
    name: 'Dazzle & go',
    price: 9900,
    duration: '1 hr 15 mins',
    deposit: true,
    summary: '',
  },
  {
    name: 'Full Body Bikini Blaster',
    price: 12000,
    duration: '1 hr',
    deposit: true,
    summary: 'Your session includes A full body liquid lipo wrap scientifically proven to dissolve the stubborn fat A infrared lymphatic 30 min sauna blanket session Tummy/hip cavitation Rf skin tightening to tighten',
  },
  {
    name: 'Body systems reset',
    price: 12000,
    duration: '1 hr 30 mins',
    deposit: true,
    summary: 'INTRODUCING: THE BODY SYSTEMS RESET A structured, results-focused protocol designed to work with your body’s natural systems to: • Reduce inflammation & bloating • Support lymphatic drainage • Sculpt and define your body THE SYSTEM INCLUDES: • Vibration Plate — stimulate circulation & tone muscles • Infrared Sauna — support detox & f…',
  },
  {
    name: 'Makeover Special',
    price: 12900,
    duration: '2 hr',
    deposit: true,
    summary: 'Pick 3 treatments',
  },
  {
    name: 'Dazzle & Glow - Limited Offer',
    price: 12900,
    duration: '2 hr',
    deposit: true,
    summary: '',
  },
  {
    name: 'Hydra and bum lift',
    price: 13000,
    duration: '1 hr 30 mins',
    deposit: false,
    summary: '',
  },
  {
    name: 'Glo Up Package',
    price: 14900,
    duration: '2 hr',
    deposit: true,
    summary: 'GLO UP PACKAGE Glow up this Summer season with our Glo Up Package for only £149! Includes: Booty Lift Anti Cellulite on your Thighs Tummy Sculpt Hip Melt Achieve your body goals and create a sleeker and more defined physique at Luna Moon Aesthetics! Book your body transformation today!',
  },
  {
    name: 'Mummy Makeover Package',
    price: 14900,
    duration: '1 hr 30 mins',
    deposit: true,
    summary: 'MUMMY MAKEOVER PACKAGE Revitalise your body with our incredible Mummy Makeover Package for only £149! Includes: Liquid Lipo for Tum, Hips, and Love Handles RF Skin Tightening RF Fractional Microneedling for Stretch Mark Reduction Reclaim your confidence and enjoy a smoother, firmer, and more sculpted body. Book your makeov…',
  },
  {
    name: 'Little Black Dress Package',
    price: 14900,
    duration: '2 hr',
    deposit: true,
    summary: '',
  },
  {
    name: 'Kim K Package',
    price: 14900,
    duration: '2 hr',
    deposit: true,
    summary: 'KIM K PACKAGE ONLY £149 Transform your look with our exclusive Kim K Package: - Brazilian Breast Lift/Enlargement - vacum therapy - Liquid Lipo Snatched Waist - Liquid Lipo Tummy Sculpt - Brazilian Booty Lift - vacum therapy Unleash your inner diva',
  },
  {
    name: 'Non Surgical BBL package',
    price: 14900,
    duration: '1 hr',
    deposit: false,
    summary: '',
  },
  {
    name: 'Extreme bum & thighs package',
    price: 14900,
    duration: '2 hr',
    deposit: true,
    summary: 'EXTREME BUM AND THIGH PACKAGE Ready to lift, sculpt, and define your lower body like never before? This powerhouse package is designed to transform your shape, smooth your skin, and enhance your curves - all without surgery and for just £149! What’s included? Thigh Sculpting Liquid Lipo Pressotherapy Cavitation Bum Sculpti…',
  },
  {
    name: 'Love Island Luna Package',
    price: 15000,
    duration: '2 hr',
    deposit: true,
    summary: '',
  },
  {
    name: 'Deluxe Bikini Tightening',
    price: 15900,
    duration: '1 hr',
    deposit: true,
    summary: 'Choose 3 areas of rf skin tightening',
  },
  {
    name: 'Rapid Results Package',
    price: 16500,
    duration: '1 hr',
    deposit: true,
    summary: '',
  },
  {
    name: 'Extreme Fat Blaster Package',
    price: 16900,
    duration: '1 hr',
    deposit: false,
    summary: '',
  },
  {
    name: 'Hourglass Queen',
    price: 16900,
    duration: '1 hr 30 mins',
    deposit: true,
    summary: 'HOURGLASS QUEEN - Ready to slay, Our exclusive Hourglass Queen Package has everything you need to look like a total QUEEN at every ball this year! ( Back Fat: Target stubborn spots with Liquid lipo + BBL Vacuum Booty Lift: Enhance and lift for the perfect curves f Tummy/Hips: Sculpt and define your waistline',
  },
  {
    name: 'Brazilian Contouring Package',
    price: 18500,
    duration: '3 hr',
    deposit: false,
    summary: '',
  },
  {
    name: 'Underarm pigmentation peel x 4',
    price: 19900,
    duration: '20 mins',
    deposit: false,
    summary: '',
  },
  {
    name: 'Collagen lift hand rejuvenation - course of 4',
    price: 19900,
    duration: '25 mins',
    deposit: true,
    summary: '',
  },
  {
    name: 'Ultimate Holiday Package',
    price: 24900,
    duration: '2 hr',
    deposit: false,
    summary: '',
  },
  {
    name: 'The ultimate kick start package',
    price: 24900,
    duration: '1 hr',
    deposit: true,
    summary: 'THE ULTIMATE STARTER PACKAGE Day 1: Experience the power of transformation! Say goodbye to fat with Fatblaster, liquid lipo for tum, hips, and back fat, plus rejuvenate in our infrared sauna blanket & cavitation sessions. Days 2-6: Keep up the momentum at home with our easy-to-use kit and personalised plan, complemented by liquid lipo oral drop…',
  },
  {
    name: 'Bikini & underarms 8 sessions',
    price: 25000,
    duration: '30 mins',
    deposit: false,
    summary: 'Laser bikini and underarms 8 sessions',
  },
  {
    name: 'Hourglass x 3',
    price: 39000,
    duration: '2 hr 15 mins',
    deposit: true,
    summary: 'Course of 3 hourglass package',
  },
];
