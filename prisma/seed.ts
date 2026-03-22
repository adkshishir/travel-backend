import { PrismaClient } from '@prisma/client';
import { createMedia } from './factories/media.factory';
import { createActivities } from './factories/activity.factory';
import { createDestinations } from './factories/destination.factory';
import { createPackages } from './factories/package.factory';
import { createReviews } from './factories/review.factory';
import { createAuthorsAndBlogs } from './factories/blog.factory';
import { createBookings } from './factories/booking.factory';
import { createUsers } from './factories/user.factory';
import {
  createSiteInfo,
  createTeam,
  createCarousels,
  createFaqs,
  createCategories,
  createComments,
  createContactMessages,
} from './factories/site.factory';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('\nCleaning database...');

  // Delete in reverse dependency order
  await prisma.wishlist.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.author.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.carousel.deleteMany();
  await prisma.category.deleteMany();
  await prisma.team.deleteMany();
  await prisma.mail.deleteMany();
  await prisma.seo.deleteMany();
  await prisma.media.deleteMany();
  await prisma.siteInformation.deleteMany();
  await prisma.user.deleteMany();

  console.log('  Database cleaned\n');
}

async function main() {
  console.log('================================================');
  console.log('  Poonhill Treks — Database Seeder');
  console.log('================================================\n');

  await cleanDatabase();

  // 1. Users
  console.log('Creating users...');
  await createUsers(prisma);

  // 2. Media (images)
  console.log('Creating media assets...');
  const mediaIds = await createMedia(prisma);

  // 3. Activities
  console.log('Creating activities...');
  const activityRefs = await createActivities(prisma, mediaIds);

  // 4. Destinations
  console.log('Creating destinations...');
  const destRefs = await createDestinations(prisma, activityRefs, mediaIds);

  // 5. Packages
  console.log('Creating packages...');
  const packageRefs = await createPackages(prisma, destRefs, mediaIds);
  const packageIds = packageRefs.map((p) => p.id);

  // 6. Reviews
  console.log('Creating reviews...');
  await createReviews(prisma, packageIds, mediaIds);

  // 7. Authors & Blogs
  console.log('Creating authors and blogs...');
  await createAuthorsAndBlogs(prisma, mediaIds);

  // 8. Bookings with Payments
  console.log('Creating bookings...');
  await createBookings(prisma, packageIds);

  // 9. Site Info
  console.log('Creating site information...');
  await createSiteInfo(prisma);

  // 10. Team Members
  console.log('Creating team members...');
  await createTeam(prisma, mediaIds);

  // 11. Carousels
  console.log('Creating carousel slides...');
  await createCarousels(prisma, mediaIds);

  // 12. FAQs
  console.log('Creating FAQs...');
  await createFaqs(prisma, packageIds);

  // 13. Categories
  console.log('Creating categories...');
  await createCategories(prisma);

  // 14. Comments
  console.log('Creating comments...');
  const blogSlugs = [
    'complete-packing-list-trekking-nepal',
    'best-time-trek-nepal-month-by-month',
    'altitude-sickness-prevention-symptoms-nepal-treks',
  ];
  await createComments(prisma, packageIds, blogSlugs);

  // 15. Contact Messages
  console.log('Creating contact messages...');
  await createContactMessages(prisma);

  console.log('\n================================================');
  console.log('  Seeding complete!');
  console.log('================================================');
  console.log('\nSummary:');
  console.log('  - 6 users (1 admin, 1 author, 4 regular)');
  console.log('  - 15 media assets');
  console.log('  - 4 activities');
  console.log('  - 8 destinations');
  console.log('  - 8 trek packages');
  console.log('  - 12 reviews');
  console.log('  - 3 authors + 8 blogs');
  console.log('  - 10 bookings with payments');
  console.log('  - 4 carousel slides');
  console.log('  - 11 FAQs (8 general + 3 package-specific)');
  console.log('  - 3 categories');
  console.log('  - 6 comments');
  console.log('  - 5 contact messages');
  console.log('  - 6 team members');
  console.log('  - 1 site information record');
  console.log('');
}

main()
  .catch((e) => {
    console.error('\nSeeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
