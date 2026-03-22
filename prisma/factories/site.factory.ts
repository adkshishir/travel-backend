import { PrismaClient } from '@prisma/client';

export async function createSiteInfo(prisma: PrismaClient): Promise<void> {
  await prisma.siteInformation.create({
    data: {
      name: 'Poonhill Treks',
      logo: '/uploads/images/poonhill-logo.webp',
      description:
        'Poonhill Treks is a locally-owned trekking and tour company based in Pokhara, Nepal. Founded by experienced trekking guides, we specialize in personalized Himalayan adventures from short day hikes to challenging high-altitude expeditions. With over 15 years of experience and thousands of happy trekkers, we offer authentic, safe, and sustainable trekking experiences across Nepal.',
      url: 'https://poonhilltreks.com',
      address: 'Lakeside-6, Pokhara, Kaski, Nepal',
      location: '28.2096,83.9856',
      phone1: '+977-9856012345',
      phone2: '+977-61-465789',
      email1: 'info@poonhilltreks.com',
      email2: 'booking@poonhilltreks.com',
      facebook: 'https://facebook.com/poonhilltreks',
      twitter: 'https://twitter.com/poonhilltreks',
      instagram: 'https://instagram.com/poonhilltreks',
      linkedin: 'https://linkedin.com/company/poonhilltreks',
      youtube: 'https://youtube.com/@poonhilltreks',
      whatsapp: '+977-9856012345',
      openingTime: 'Sun-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM',
      footerAbout:
        'Your trusted partner for Himalayan adventures since 2010. Locally owned, expert guides, unforgettable experiences.',
      embedVideo:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Poonhill Treks - Nepal Trekking Adventures" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    },
  });

  console.log('  Created site information');
}

export async function createTeam(prisma: PrismaClient, mediaIds: number[]): Promise<void> {
  const team = [
    {
      name: 'Shishir Adhikari',
      position: 'Founder & Managing Director',
      facebook: 'https://facebook.com/shishiradhikari',
      twitter: 'https://twitter.com/shishiradhikari',
      linkedin: 'https://linkedin.com/in/shishiradhikari',
    },
    {
      name: 'Ram Bahadur Gurung',
      position: 'Senior Trekking Guide',
      facebook: 'https://facebook.com/ramgurung.guide',
      twitter: null,
      linkedin: null,
    },
    {
      name: 'Anita Gurung',
      position: 'Trek Leader & Cultural Guide',
      facebook: 'https://facebook.com/anitagurung',
      twitter: null,
      linkedin: null,
    },
    {
      name: 'Pemba Sherpa',
      position: 'Everest Region Specialist',
      facebook: 'https://facebook.com/pembasherpa',
      twitter: null,
      linkedin: null,
    },
    {
      name: 'Sita Tamang',
      position: 'Operations Manager',
      facebook: null,
      twitter: null,
      linkedin: 'https://linkedin.com/in/sitatamang',
    },
    {
      name: 'Bikram Thapa',
      position: 'Marketing & Partnerships',
      facebook: 'https://facebook.com/bikramthapa',
      twitter: 'https://twitter.com/bikramthapa',
      linkedin: 'https://linkedin.com/in/bikramthapa',
    },
  ];

  for (let i = 0; i < team.length; i++) {
    await prisma.team.create({
      data: {
        ...team[i],
        mediaId: mediaIds[i % mediaIds.length],
      },
    });
  }

  console.log(`  Created ${team.length} team members`);
}

export async function createCarousels(prisma: PrismaClient, mediaIds: number[]): Promise<void> {
  const carousels = [
    {
      title: 'Discover the Magic of Poon Hill Sunrise',
      description:
        'Watch the golden sun paint the Annapurna and Dhaulagiri ranges in breathtaking light from one of Nepal\'s most iconic viewpoints.',
      subtitle: 'Nepal\'s Most Beloved Trek',
      link: '/trekking/annapurna-region/ghorepani-poon-hill-trek',
      page: 'home',
    },
    {
      title: 'Trek to Everest Base Camp',
      description:
        'Follow in the footsteps of legends to the foot of the world\'s highest mountain through the heart of Sherpa country.',
      subtitle: 'The Ultimate Himalayan Adventure',
      link: '/trekking/everest-region/everest-base-camp-trek',
      page: 'home',
    },
    {
      title: 'Explore the Forbidden Kingdom',
      description:
        'Journey into Upper Mustang, Nepal\'s hidden desert landscape of ancient monasteries, cave dwellings, and the medieval walled city of Lo Manthang.',
      subtitle: 'Upper Mustang Trek',
      link: '/trekking/upper-mustang/upper-mustang-trek',
      page: 'home',
    },
    {
      title: 'Your Himalayan Adventure Awaits',
      description:
        'From gentle day hikes to challenging high-altitude expeditions, we craft personalized trekking experiences with expert local guides.',
      subtitle: 'Locally Owned, Globally Trusted',
      link: '/contact',
      page: 'home',
    },
  ];

  for (let i = 0; i < carousels.length; i++) {
    await prisma.carousel.create({
      data: {
        ...carousels[i],
        mediaId: mediaIds[i % mediaIds.length],
      },
    });
  }

  console.log(`  Created ${carousels.length} carousel slides`);
}

export async function createFaqs(prisma: PrismaClient, packageIds: number[]): Promise<void> {
  // General FAQs (no packageId)
  const generalFaqs = [
    {
      question: 'Do I need prior trekking experience to trek in Nepal?',
      answer:
        'Not necessarily! Nepal offers treks for all experience levels. Short treks like Poon Hill (5 days) and Mardi Himal (6 days) are perfect for beginners with reasonable fitness. More challenging treks like Everest Base Camp, Manaslu Circuit, or peak climbing expeditions require previous trekking experience and good physical conditioning.',
    },
    {
      question: 'What is the best time of year to trek in Nepal?',
      answer:
        'The best trekking seasons are autumn (September-November) and spring (March-May). Autumn offers the clearest skies and most stable weather. Spring brings warmer temperatures and blooming rhododendrons. Winter treks (December-February) are possible at lower altitudes but very cold at height. Monsoon (June-August) is generally not recommended except for rain-shadow areas like Upper Mustang.',
    },
    {
      question: 'How fit do I need to be for a trek?',
      answer:
        'You should be able to walk 5-7 hours per day on hilly terrain for moderate treks. We recommend starting a fitness routine 2-3 months before your trek: regular cardio (running, cycling, swimming), stair climbing, and hiking with a loaded backpack. You don\'t need to be an athlete, but basic cardiovascular fitness and leg strength will make your trek much more enjoyable.',
    },
    {
      question: 'What permits do I need for trekking in Nepal?',
      answer:
        'Most treks require a TIMS (Trekkers Information Management System) card and a conservation area or national park entry permit. Restricted areas like Upper Mustang and Manaslu require special permits ($500/person for Upper Mustang). All permits are arranged by Poonhill Treks as part of your trek package — you don\'t need to worry about the paperwork.',
    },
    {
      question: 'Is it safe to trek in Nepal?',
      answer:
        'Nepal is generally very safe for trekkers. The main risks are altitude sickness (mitigated by proper acclimatization), weather changes, and trail conditions. Our guides are trained in first aid and carry emergency communication devices. We also include travel insurance requirements and helicopter evacuation arrangements in our packages.',
    },
    {
      question: 'Can I trek solo or do I need a guide?',
      answer:
        'Since April 2023, Nepal requires all foreign trekkers to hire a licensed guide for treks in national parks and conservation areas. This regulation was introduced for safety reasons. We always recommend trekking with a licensed guide who knows the trails, weather patterns, and emergency procedures. Our guides also enrich your experience with local knowledge and cultural insights.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept credit/debit cards (Visa, Mastercard) through Stripe, PayPal, and bank transfers. A 25-50% deposit is required to confirm your booking, with the balance payable before the trek starts. Cash payment in USD, EUR, or Nepali Rupees is also accepted upon arrival in Nepal.',
    },
    {
      question: 'What is your cancellation policy?',
      answer:
        'Cancellations more than 30 days before departure receive a full refund minus processing fees. Cancellations 15-30 days before departure receive a 50% refund. Cancellations less than 15 days before departure are non-refundable. We strongly recommend travel insurance that covers trip cancellation.',
    },
  ];

  for (const faq of generalFaqs) {
    await prisma.faq.create({ data: faq });
  }

  // Package-specific FAQs
  const packageFaqs = [
    {
      question: 'Can I see Everest from Poon Hill?',
      answer:
        'You cannot see Mount Everest from Poon Hill. However, the panorama includes over 20 Himalayan peaks including Dhaulagiri (8,167m), Annapurna I (8,091m), Annapurna South, Hiunchuli, Machapuchare (Fishtail), and Lamjung Himal. The view is absolutely spectacular and many trekkers consider it more beautiful than the Everest viewpoint.',
      packageId: packageIds[0], // Poon Hill
    },
    {
      question: 'Is the Annapurna Base Camp trek suitable for beginners?',
      answer:
        'The ABC trek is moderate in difficulty and suitable for fit beginners who prepare adequately. The trail is well-marked with teahouse accommodation available throughout. The main challenge is altitude — the base camp sits at 4,130m. Proper acclimatization and a steady pace make it achievable for most reasonably fit people.',
      packageId: packageIds[1], // ABC
    },
    {
      question: 'How difficult is the Everest Base Camp trek compared to Poon Hill?',
      answer:
        'The EBC trek is significantly more challenging than Poon Hill. It\'s longer (12-14 days vs 5 days), reaches much higher altitude (5,545m vs 3,210m), and involves more strenuous daily walking. EBC also requires proper acclimatization days and carries a higher risk of altitude sickness. Previous multi-day trekking experience is recommended.',
      packageId: packageIds[2], // EBC
    },
  ];

  for (const faq of packageFaqs) {
    await prisma.faq.create({ data: faq });
  }

  console.log(`  Created ${generalFaqs.length + packageFaqs.length} FAQs`);
}

export async function createCategories(prisma: PrismaClient): Promise<void> {
  const categories = [
    {
      endpoint: 'short-treks',
      title: 'Short Treks in Nepal',
      slug: 'short-treks',
      content:
        '<h2>Short Treks in Nepal (3-7 Days)</h2><p>Perfect for travelers with limited time, Nepal\'s short treks offer stunning Himalayan views, cultural immersion, and adventure without requiring weeks of commitment. Popular short treks include the Ghorepani Poon Hill Trek (5 days), Mardi Himal Trek (6 days), and Langtang Valley Trek (7 days).</p><p>These treks are ideal for first-time trekkers, families, and those combining trekking with other Nepal experiences like Chitwan safari or Kathmandu sightseeing.</p>',
      isActive: true,
    },
    {
      endpoint: 'luxury-treks',
      title: 'Luxury Trekking in Nepal',
      slug: 'luxury-treks',
      content:
        '<h2>Luxury Trekking Experiences</h2><p>Combine the thrill of Himalayan trekking with premium comfort. Our luxury trek packages feature the best lodge accommodations along the trail, private guides, gourmet meals, and helicopter transfers where available. Experience the mountains without sacrificing comfort.</p>',
      isActive: true,
    },
    {
      endpoint: 'family-treks',
      title: 'Family-Friendly Treks in Nepal',
      slug: 'family-treks',
      content:
        '<h2>Trekking with Family in Nepal</h2><p>Nepal welcomes families with children on several carefully selected trails. Our family treks feature shorter daily distances, lower altitudes, and engaging activities for younger trekkers. The Ghorepani Poon Hill trek and Australian Camp trek are our most popular family-friendly options.</p>',
      isActive: true,
    },
  ];

  for (const cat of categories) {
    const seo = await prisma.seo.create({
      data: {
        metaTitle: `${cat.title} | Poonhill Treks`,
        metaDescription: cat.content.replace(/<[^>]+>/g, '').slice(0, 160),
        metaKeywords: `${cat.slug}, nepal trekking, himalaya`,
      },
    });

    await prisma.category.create({
      data: {
        ...cat,
        seoId: seo.id,
      },
    });
  }

  console.log(`  Created ${categories.length} categories`);
}

export async function createComments(
  prisma: PrismaClient,
  packageIds: number[],
  blogSlugs: string[],
): Promise<void> {
  const comments = [
    {
      name: 'Mike Harrison',
      email: 'mike.harrison@gmail.com',
      message: 'Just completed this trek last week. The views were absolutely incredible, even better than the photos suggest. Our guide was fantastic!',
      isApproved: true,
      isVerified: true,
    },
    {
      name: 'Laura Chen',
      email: 'laura.c@hotmail.com',
      message: 'Planning to do this trek in October. Quick question - is the trail clearly marked or do you absolutely need a guide? Also, how cold does it get at night?',
      isApproved: true,
      isVerified: false,
    },
    {
      name: 'Peter Strand',
      email: 'peter.strand@outlook.com',
      message: 'Did this trek with my 14-year-old daughter and she loved it. The teahouses were comfortable and the food was great. Highly recommend for families!',
      isApproved: true,
      isVerified: true,
    },
    {
      name: 'Ayumi Sato',
      email: 'ayumi.sato@yahoo.co.jp',
      message: 'Beautiful article! The packing list was incredibly helpful for my upcoming trek. One suggestion - maybe add a section about photography gear?',
      isApproved: true,
      isVerified: false,
    },
    {
      name: 'Carlos Mendoza',
      email: 'carlos.m@gmail.com',
      message: 'Thank you for this detailed guide! I was worried about altitude sickness but your tips about acclimatization made me feel more prepared.',
      isApproved: false,
      isVerified: false,
    },
    {
      name: 'spam bot',
      email: 'spam@fakesite.com',
      message: 'Buy cheap trekking gear at our website!! Best prices guaranteed!!!',
      isApproved: false,
      isSpam: true,
    },
  ];

  // Get blog IDs from slugs
  const blogs = await prisma.blog.findMany({
    where: { slug: { in: blogSlugs } },
    select: { id: true },
  });
  const blogIds = blogs.map((b) => b.id);

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const isPackageComment = i < 3;

    await prisma.comment.create({
      data: {
        name: comment.name,
        email: comment.email,
        message: comment.message,
        isApproved: comment.isApproved,
        isVerified: comment.isVerified || false,
        isSpam: (comment as any).isSpam || false,
        packageId: isPackageComment ? packageIds[i % packageIds.length] : null,
        blogId: !isPackageComment ? blogIds[(i - 3) % blogIds.length] : null,
      },
    });
  }

  console.log(`  Created ${comments.length} comments`);
}

export async function createContactMessages(prisma: PrismaClient): Promise<void> {
  const messages = [
    {
      name: 'Jennifer Walsh',
      phone: '+1-415-555-0142',
      email: 'jennifer.walsh@email.com',
      message:
        'Hi! I\'m interested in the Everest Base Camp trek for October 2026. We are a group of 4 friends, all with moderate fitness. Could you send us a detailed itinerary and group pricing? Also, do you offer airport pickup from Kathmandu?',
    },
    {
      name: 'Raj Patel',
      phone: '+44-7911-123456',
      email: 'raj.patel@email.co.uk',
      message:
        'I\'m planning a honeymoon trip to Nepal in March next year. We\'d love to combine a short trek (maybe Poon Hill?) with some cultural sightseeing in Kathmandu and Pokhara. Can you create a customized 10-day package for us?',
    },
    {
      name: 'Kim Soo-jin',
      phone: '+82-10-4567-8901',
      email: 'soojin.kim@email.kr',
      message:
        'Hello, I\'m a travel blogger and I\'d like to discuss a possible collaboration. I have 50K followers on Instagram and would love to trek with your company and create content. Is this something you\'d be interested in?',
    },
    {
      name: 'Marco Rossi',
      phone: '+39-333-456-7890',
      email: 'marco.rossi@email.it',
      message:
        'I completed the Annapurna Base Camp trek with your company last November and wanted to say THANK YOU. Our guide Ram was exceptional. I\'m now looking at the Manaslu Circuit for this autumn - is this much harder than ABC?',
    },
    {
      name: 'Sarah O\'Brien',
      phone: '+61-4-1234-5678',
      email: 'sarah.obrien@email.com.au',
      message:
        'Do you arrange treks for school groups? I\'m a geography teacher and would like to bring 15 students (ages 16-17) for a cultural and trekking experience during our summer break (June-July). What would you recommend?',
    },
  ];

  for (const msg of messages) {
    await prisma.mail.create({ data: msg });
  }

  console.log(`  Created ${messages.length} contact messages`);
}
