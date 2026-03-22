import { PrismaClient } from '@prisma/client';

const activities = [
  {
    name: 'Trekking',
    slug: 'trekking',
    description:
      'Explore the majestic Himalayas on foot through well-marked trails ranging from easy day hikes to challenging multi-week expeditions. Nepal offers some of the most iconic trekking routes in the world, passing through diverse landscapes from subtropical forests to high-altitude glacial moraines.',
  },
  {
    name: 'Peak Climbing',
    slug: 'peak-climbing',
    description:
      'Summit Nepal\'s trekking peaks with experienced mountaineering guides. From Island Peak (6,189m) to Mera Peak (6,476m), these expeditions combine trekking with technical climbing for adventurers ready to push beyond the trails.',
  },
  {
    name: 'Tour',
    slug: 'tour',
    description:
      'Discover Nepal\'s cultural heritage, UNESCO World Heritage Sites, and vibrant cities. Our guided tours cover Kathmandu Valley temples, Lumbini (birthplace of Buddha), Pokhara lakeside, and Chitwan National Park wildlife safaris.',
  },
  {
    name: 'Helicopter Tour',
    slug: 'helicopter-tour',
    description:
      'Experience the Himalayas from above with scenic helicopter flights to Everest Base Camp, Annapurna Base Camp, and Langtang Valley. Perfect for those with limited time who want breathtaking mountain views without the multi-day trek.',
  },
];

export async function createActivities(
  prisma: PrismaClient,
  mediaIds: number[],
): Promise<{ id: number; slug: string }[]> {
  const created: { id: number; slug: string }[] = [];

  for (let i = 0; i < activities.length; i++) {
    const seo = await prisma.seo.create({
      data: {
        metaTitle: `${activities[i].name} in Nepal | Poonhill Treks`,
        metaDescription: activities[i].description.slice(0, 160),
        metaKeywords: `${activities[i].name.toLowerCase()}, nepal, himalaya, adventure`,
      },
    });

    const activity = await prisma.activity.create({
      data: {
        ...activities[i],
        mediaId: mediaIds[i] || mediaIds[0],
        seoId: seo.id,
      },
    });
    created.push({ id: activity.id, slug: activity.slug! });
  }

  console.log(`  Created ${created.length} activities`);
  return created;
}
