import { PrismaClient } from '@prisma/client';

const trekImages = [
  {
    alt: 'Poon Hill sunrise view over Annapurna range',
    original: '/uploads/images/poonhill-sunrise.webp',
    thumbnail: '/uploads/images/poonhill-sunrise-thumb.webp',
    phone: '/uploads/images/poonhill-sunrise-phone.webp',
    type: 'image',
  },
  {
    alt: 'Annapurna Base Camp with snow-capped peaks',
    original: '/uploads/images/annapurna-basecamp.webp',
    thumbnail: '/uploads/images/annapurna-basecamp-thumb.webp',
    phone: '/uploads/images/annapurna-basecamp-phone.webp',
    type: 'image',
  },
  {
    alt: 'Rhododendron forest trail to Ghorepani',
    original: '/uploads/images/ghorepani-trail.webp',
    thumbnail: '/uploads/images/ghorepani-trail-thumb.webp',
    phone: '/uploads/images/ghorepani-trail-phone.webp',
    type: 'image',
  },
  {
    alt: 'Machapuchare fishtail mountain at golden hour',
    original: '/uploads/images/machapuchare-golden.webp',
    thumbnail: '/uploads/images/machapuchare-golden-thumb.webp',
    phone: '/uploads/images/machapuchare-golden-phone.webp',
    type: 'image',
  },
  {
    alt: 'Suspension bridge over Kali Gandaki gorge',
    original: '/uploads/images/kali-gandaki-bridge.webp',
    thumbnail: '/uploads/images/kali-gandaki-bridge-thumb.webp',
    phone: '/uploads/images/kali-gandaki-bridge-phone.webp',
    type: 'image',
  },
  {
    alt: 'Trekkers resting at Tadapani village teahouse',
    original: '/uploads/images/tadapani-teahouse.webp',
    thumbnail: '/uploads/images/tadapani-teahouse-thumb.webp',
    phone: '/uploads/images/tadapani-teahouse-phone.webp',
    type: 'image',
  },
  {
    alt: 'Panoramic view of Dhaulagiri from Poon Hill',
    original: '/uploads/images/dhaulagiri-panorama.webp',
    thumbnail: '/uploads/images/dhaulagiri-panorama-thumb.webp',
    phone: '/uploads/images/dhaulagiri-panorama-phone.webp',
    type: 'image',
  },
  {
    alt: 'Everest Base Camp with prayer flags',
    original: '/uploads/images/ebc-prayer-flags.webp',
    thumbnail: '/uploads/images/ebc-prayer-flags-thumb.webp',
    phone: '/uploads/images/ebc-prayer-flags-phone.webp',
    type: 'image',
  },
  {
    alt: 'Langtang Valley with yak herders',
    original: '/uploads/images/langtang-valley.webp',
    thumbnail: '/uploads/images/langtang-valley-thumb.webp',
    phone: '/uploads/images/langtang-valley-phone.webp',
    type: 'image',
  },
  {
    alt: 'Manaslu Circuit trek through terraced fields',
    original: '/uploads/images/manaslu-terraces.webp',
    thumbnail: '/uploads/images/manaslu-terraces-thumb.webp',
    phone: '/uploads/images/manaslu-terraces-phone.webp',
    type: 'image',
  },
  {
    alt: 'Upper Mustang Lo Manthang ancient walled city',
    original: '/uploads/images/upper-mustang-lomanthang.webp',
    thumbnail: '/uploads/images/upper-mustang-lomanthang-thumb.webp',
    phone: '/uploads/images/upper-mustang-lomanthang-phone.webp',
    type: 'image',
  },
  {
    alt: 'Mardi Himal trek ridge walk with cloud sea',
    original: '/uploads/images/mardi-himal-ridge.webp',
    thumbnail: '/uploads/images/mardi-himal-ridge-thumb.webp',
    phone: '/uploads/images/mardi-himal-ridge-phone.webp',
    type: 'image',
  },
  {
    alt: 'Trekking map of Annapurna region',
    original: '/uploads/images/annapurna-map.webp',
    thumbnail: '/uploads/images/annapurna-map-thumb.webp',
    phone: '/uploads/images/annapurna-map-phone.webp',
    type: 'map',
  },
  {
    alt: 'Trekking map of Everest region',
    original: '/uploads/images/everest-map.webp',
    thumbnail: '/uploads/images/everest-map-thumb.webp',
    phone: '/uploads/images/everest-map-phone.webp',
    type: 'map',
  },
  {
    alt: 'Trekking map of Langtang region',
    original: '/uploads/images/langtang-map.webp',
    thumbnail: '/uploads/images/langtang-map-thumb.webp',
    phone: '/uploads/images/langtang-map-phone.webp',
    type: 'map',
  },
];

export async function createMedia(prisma: PrismaClient): Promise<number[]> {
  const ids: number[] = [];
  for (const img of trekImages) {
    const media = await prisma.media.create({ data: img });
    ids.push(media.id);
  }
  console.log(`  Created ${ids.length} media records`);
  return ids;
}
