import { PrismaClient } from '@prisma/client';

interface ActivityRef {
  id: number;
  slug: string;
}

const destinations = [
  {
    name: 'Annapurna Region',
    slug: 'annapurna-region',
    description:
      'The Annapurna region is Nepal\'s most popular trekking area, offering diverse trails from the classic Annapurna Circuit to the shorter Poon Hill trek. Home to the Annapurna Conservation Area, this region features stunning mountain panoramas, hot springs, and rich Gurung and Thakali culture.',
    activitySlug: 'trekking',
  },
  {
    name: 'Everest Region',
    slug: 'everest-region',
    description:
      'Trek in the shadow of the world\'s highest peak through the legendary Khumbu Valley. The Everest region offers trails to Base Camp and beyond, passing through Sherpa villages, ancient monasteries like Tengboche, and the bustling market town of Namche Bazaar at 3,440m.',
    activitySlug: 'trekking',
  },
  {
    name: 'Langtang Region',
    slug: 'langtang-region',
    description:
      'Often called the "Valley of Glaciers," Langtang is the closest trekking region to Kathmandu. The Langtang Valley trek passes through dense bamboo and rhododendron forests, traditional Tamang villages, and high-altitude cheese factories with views of Langtang Lirung (7,227m).',
    activitySlug: 'trekking',
  },
  {
    name: 'Manaslu Region',
    slug: 'manaslu-region',
    description:
      'The Manaslu Circuit is a remote, less-crowded alternative to the Annapurna Circuit. This restricted-area trek circles the world\'s eighth highest peak (8,163m), crossing the dramatic Larkya La pass at 5,160m and passing through pristine Tibetan-influenced villages.',
    activitySlug: 'trekking',
  },
  {
    name: 'Upper Mustang',
    slug: 'upper-mustang',
    description:
      'A former forbidden kingdom, Upper Mustang is a rain-shadow desert landscape of dramatic eroded cliffs, cave dwellings, and the medieval walled city of Lo Manthang. This restricted trek offers a rare glimpse into preserved Tibetan Buddhist culture and stark, otherworldly terrain.',
    activitySlug: 'trekking',
  },
  {
    name: 'Kathmandu Valley',
    slug: 'kathmandu-valley',
    description:
      'Explore seven UNESCO World Heritage Sites clustered in the Kathmandu Valley, including Swayambhunath (Monkey Temple), Boudhanath Stupa, Pashupatinath Temple, and the ancient Durbar Squares of Kathmandu, Patan, and Bhaktapur.',
    activitySlug: 'tour',
  },
  {
    name: 'Pokhara',
    slug: 'pokhara',
    description:
      'Nepal\'s adventure capital sits on the shores of Phewa Lake with the Annapurna range as its backdrop. Pokhara offers paragliding, zip-lining, boating, and is the gateway to Annapurna treks. The lakeside area features vibrant cafes, shops, and the International Mountain Museum.',
    activitySlug: 'tour',
  },
  {
    name: 'Island Peak',
    slug: 'island-peak',
    description:
      'Island Peak (Imja Tse, 6,189m) is Nepal\'s most popular trekking peak, combining the Everest Base Camp trek with a summit push. The climb involves glacier travel, fixed rope sections, and rewards with panoramic views of Lhotse, Makalu, and Ama Dablam.',
    activitySlug: 'peak-climbing',
  },
];

export async function createDestinations(
  prisma: PrismaClient,
  activityRefs: ActivityRef[],
  mediaIds: number[],
): Promise<{ id: number; slug: string; activitySlug: string }[]> {
  const created: { id: number; slug: string; activitySlug: string }[] = [];

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const activityRef = activityRefs.find((a) => a.slug === dest.activitySlug);
    if (!activityRef) continue;

    const seo = await prisma.seo.create({
      data: {
        metaTitle: `${dest.name} - Trekking & Tours | Poonhill Treks`,
        metaDescription: dest.description.slice(0, 160),
        metaKeywords: `${dest.name.toLowerCase()}, nepal trekking, ${dest.activitySlug}`,
      },
    });

    const destination = await prisma.destination.create({
      data: {
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        activityId: activityRef.id,
        mediaId: mediaIds[i % mediaIds.length],
        seoId: seo.id,
      },
    });

    created.push({
      id: destination.id,
      slug: destination.slug!,
      activitySlug: dest.activitySlug,
    });
  }

  console.log(`  Created ${created.length} destinations`);
  return created;
}
