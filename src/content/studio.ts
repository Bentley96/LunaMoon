// Photographs of the studio, shown on the homepage.
//
// The existing site runs these as a carousel of thumbnails under the "about"
// copy. People book a treatment room partly on how it looks, so they earn a
// place — and the alt text describes each room rather than repeating the
// business name, because that's what someone who can't see them needs.
//
// Source: the "Homepage Carousel" folder in the repo root, plus the newer
// treatment room in "Images/", resized to 1400px with a 400px thumbnail each.
// The newest photo leads, then the order runs from the room you walk into,
// through the treatment rooms, to the equipment.

export interface StudioPhoto {
  src: string;
  thumb: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  alt: string;
}

export const studioPhotos: StudioPhoto[] = [
  {
    src: '/images/studio/studio-00-treatment-room.webp',
    thumb: '/images/studio/studio-00-treatment-room-thumb.webp',
    width: 1050,
    height: 1400,
    thumbWidth: 300,
    thumbHeight: 400,
    alt: 'A treatment room at Luna Moon Aesthetics: a dressed couch with pink and cream throws, a backlit mirror, a lit shelving unit of skincare and a facial steamer.',
  },
  {
    src: '/images/studio/studio-01-flower-wall-reception.webp',
    thumb: '/images/studio/studio-01-flower-wall-reception-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'The floral wall and neon "love" sign in reception at Luna Moon Aesthetics, with a lit mirror and treatment leaflets.',
  },
  {
    src: '/images/studio/studio-02-floral-arch-corridor.webp',
    thumb: '/images/studio/studio-02-floral-arch-corridor-thumb.webp',
    width: 1050,
    height: 1400,
    thumbWidth: 300,
    thumbHeight: 400,
    alt: 'The corridor into the clinic, with a floral arch over the mirror and a treatment station beyond it.',
  },
  {
    src: '/images/studio/studio-03-treatment-couch.webp',
    thumb: '/images/studio/studio-03-treatment-couch-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'A treatment couch with the clinic’s machines beside it and framed certificates on the wall.',
  },
  {
    src: '/images/studio/studio-04-seating-area.webp',
    thumb: '/images/studio/studio-04-seating-area-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'The waiting area, with an armchair, a full-length mirror and a balloon arch.',
  },
  {
    src: '/images/studio/studio-05-robes.webp',
    thumb: '/images/studio/studio-05-robes-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'Pink robes hanging ready for clients by the treatment rooms.',
  },
  {
    src: '/images/studio/studio-06-treatment-chair-flower-wall.webp',
    thumb: '/images/studio/studio-06-treatment-chair-flower-wall-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'A treatment chair beside the floral wall, lit in warm pink.',
  },
  {
    src: '/images/studio/studio-07-treatment-room-mood-lighting.webp',
    thumb: '/images/studio/studio-07-treatment-room-mood-lighting-thumb.webp',
    width: 1050,
    height: 1400,
    thumbWidth: 300,
    thumbHeight: 400,
    alt: 'A treatment room under soft purple lighting, with a robe hanging by the door.',
  },
  {
    src: '/images/studio/studio-08-treatment-room-mirror.webp',
    thumb: '/images/studio/studio-08-treatment-room-mirror-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'A treatment room with a large mirror, product shelving and a therapist’s trolley.',
  },
  {
    src: '/images/studio/studio-09-treatment-room-line-art.webp',
    thumb: '/images/studio/studio-09-treatment-room-line-art-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'A treatment room with line-art prints and a stocked trolley.',
  },
  {
    src: '/images/studio/studio-10-skincare-display.webp',
    thumb: '/images/studio/studio-10-skincare-display-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'Skincare and treatment information laid out on the console table under the floral wall.',
  },
  {
    src: '/images/studio/studio-11-teeth-whitening-chair.webp',
    thumb: '/images/studio/studio-11-teeth-whitening-chair-thumb.webp',
    width: 1050,
    height: 1400,
    thumbWidth: 300,
    thumbHeight: 400,
    alt: 'The laser teeth whitening chair, under the clinic’s neon lips sign.',
  },
  {
    src: '/images/studio/studio-12-teeth-whitening-machine.webp',
    thumb: '/images/studio/studio-12-teeth-whitening-machine-thumb.webp',
    width: 1050,
    height: 1400,
    thumbWidth: 300,
    thumbHeight: 400,
    alt: 'The NaturaWhite laser teeth whitening machine used at the clinic.',
  },
  {
    src: '/images/studio/studio-13-teeth-whitening-treatment.webp',
    thumb: '/images/studio/studio-13-teeth-whitening-treatment-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'A client having laser cosmetic teeth whitening under the blue treatment lamp.',
  },
  {
    src: '/images/studio/studio-14-certificates-neon.webp',
    thumb: '/images/studio/studio-14-certificates-neon-thumb.webp',
    width: 1400,
    height: 1050,
    thumbWidth: 400,
    thumbHeight: 300,
    alt: 'Framed certificates and the neon lips sign on the treatment room wall.',
  },
];
