// What the clinic does, as three categories rather than one long block.
//
// This section used to be the old site's treatment copy — several paragraphs
// running Skin Boosters into Lumi Eye into B Complex into IPL, which is where
// the homepage started to feel cluttered. The clinic's brief was explicit:
// drop Lumi Eye and B Complex, lose the giant paragraph, and split the rest
// into categories people can scan.
//
// Each category keeps a sentence of real copy, because the terms in it are what
// the page is found for — "microneedling", "polynucleotides", "laser hair
// removal" — and a bare list of names would throw that away.

export interface TreatmentCategory {
  /** Stable id, used as the React key and the anchor. */
  id: string;
  title: string;
  /** One line on what the category is for. */
  blurb: string;
  /** The treatments themselves, as the clinic lists them. */
  items: string[];
  /** Where "See treatments" goes. */
  to: string;
}

export const treatmentsIntro = {
  eyebrow: 'What we treat',
  heading: 'BODY • SKIN • LASER',
  body: 'Three areas, one plan. Tell us what you want to change and we’ll build a programme from the treatments below — on their own or combined, at our clinic on Friargate in Preston.',
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    id: 'advanced-skin',
    title: 'ADVANCED SKIN',
    blurb:
      'Rejuvenation and resurfacing for texture, tone, fine lines and hydration — from injectable skin boosters to microneedling and peels.',
    items: [
      'Polynucleotides',
      'Skin Boosters',
      'Microneedling',
      'RF Microneedling',
      'BioRePeel',
      'Hydrofacial',
      'Microdermabrasion',
      'LED',
      'Bespoke Facials',
    ],
    to: '/advanced-facial-treatments',
  },
  {
    id: 'body-contouring',
    title: 'BODY CONTOURING',
    blurb:
      'Sculpting, firming and skin tightening, targeted at the areas you want to work on and taken as a course rather than a one-off.',
    items: [
      'Tummy Reset',
      'Body Sculpting',
      'EMS',
      'RF Skin Tightening',
      'Pressotherapy',
      'Lymphatic treatments',
      'Wood Therapy',
    ],
    to: '/skin-tightening-weight-loss',
  },
  {
    id: 'laser',
    title: 'LASER',
    blurb:
      'IPL laser hair removal for long-term hair reduction, on the face and body, with packages for the areas most people treat together.',
    items: ['Laser Hair Removal', 'IPL treatments', 'Packages'],
    to: '/book-online#ipl-laser-hair-removal',
  },
];
