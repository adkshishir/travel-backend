import { PrismaClient } from '@prisma/client';

const reviews = [
  {
    name: 'Sarah Mitchell',
    title: 'Absolutely life-changing experience!',
    description:
      'The Poon Hill sunrise was beyond anything I\'d imagined. Our guide Ram was incredibly knowledgeable about the flora, fauna, and local culture. He made sure we were always comfortable and safe. The rhododendron forests in bloom were magical. The teahouses were clean and the dal bhat was delicious! I\'m already planning my next trek with Poonhill Treks.',
    rating: 5,
  },
  {
    name: 'James Thornton',
    title: 'Best trek organization I\'ve experienced',
    description:
      'I\'ve trekked in Patagonia and the Alps, but nothing compares to the Annapurna Base Camp trek. Poonhill Treks organized everything flawlessly - permits, transport, guide, and porter were all arranged seamlessly. The sanctuary surrounded by towering peaks at sunset was an overwhelming moment. The hot springs at Jhinu were the perfect reward after the descent.',
    rating: 5,
  },
  {
    name: 'Yuki Tanaka',
    title: 'Exceeded all expectations',
    description:
      'Chose the EBC trek as my first major trekking expedition and I couldn\'t have been in better hands. The acclimatization schedule was well-planned, and our guide Pemba shared fascinating stories about Sherpa culture and mountaineering history. Standing at Kala Patthar watching the sun rise over Everest brought me to tears. The Tengboche Monastery visit was a spiritual highlight.',
    rating: 5,
  },
  {
    name: 'Marcus Weber',
    title: 'Perfect for first-time trekkers',
    description:
      'My wife and I chose the Poon Hill trek as our first Himalayan experience and it was perfect. Not too demanding, incredibly scenic, and the Gurung villages were so welcoming. The guide adjusted the pace to our comfort level. The views of Dhaulagiri and Annapurna from Poon Hill at sunrise were spectacular. Highly recommend for beginners!',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    title: 'Incredible Langtang experience',
    description:
      'The Langtang Valley trek was exactly what I was looking for - fewer crowds, authentic village life, and stunning scenery. The yak cheese at Kyanjin Gompa was delicious! Climbing Tserko Ri was challenging but the panoramic views were worth every step. Our guide was knowledgeable about the earthquake recovery efforts and it was humbling to see the community\'s resilience.',
    rating: 4,
  },
  {
    name: 'David Park',
    title: 'Manaslu Circuit - the real deal',
    description:
      'If you want a trek that feels wild and remote, the Manaslu Circuit is it. We barely saw other trekkers for days at a time. The Larkya La pass crossing was physically demanding but our guide and porters were incredibly supportive. The Tibetan-influenced villages and ancient monasteries gave the trek a cultural richness beyond just mountain views. This is what trekking should be.',
    rating: 5,
  },
  {
    name: 'Anna Johansson',
    title: 'Mardi Himal - hidden treasure',
    description:
      'The Mardi Himal trek was recommended by a friend who said it\'s the best-kept secret in the Annapurna region. She was right! Walking along the ridge above the clouds with Machapuchare towering beside us was surreal. The trail is less maintained which adds to the adventure. Our guide found the best viewpoints and the forest camp was incredibly peaceful.',
    rating: 4,
  },
  {
    name: 'Robert Chen',
    title: 'Upper Mustang blew my mind',
    description:
      'Upper Mustang is unlike anything else in Nepal or the world. The desert landscape, the ancient walled city of Lo Manthang, the sky caves - it felt like stepping back in time. The permit cost is worth every penny for this unique experience. Our guide grew up in the region and his local connections opened doors that wouldn\'t be possible otherwise. The monastery visits were deeply moving.',
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    title: 'Professional and caring team',
    description:
      'From the moment we landed in Kathmandu to our final dinner in Pokhara, the Poonhill Treks team made us feel like family. Our guide anticipated our needs before we even asked - extra blankets when it got cold, ginger tea when we felt unwell, and always a smile and encouragement. The ABC trek was challenging but incredibly rewarding. Thank you for the memories!',
    rating: 5,
  },
  {
    name: 'Ahmed Hassan',
    title: 'Island Peak summit - dream come true',
    description:
      'I\'d dreamed of climbing a Himalayan peak for years and Island Peak with Poonhill Treks made it possible. The EBC trek was the perfect warm-up and acclimatization. The climbing training day at Chukhung built our confidence. Summit day was tough - the fixed rope sections were intense - but reaching 6,189m and seeing the view of Lhotse was the greatest achievement of my life. The climbing Sherpas were absolute professionals.',
    rating: 5,
  },
  {
    name: 'Lisa Andersen',
    title: 'Solo female trekker - felt completely safe',
    description:
      'As a solo female traveler, I was initially nervous about trekking in Nepal. Poonhill Treks paired me with a wonderful female guide who made me feel completely safe and comfortable throughout the Poon Hill trek. The teahouses were welcoming, the trail was well-marked, and the whole experience empowered me. I\'m coming back for ABC next year!',
    rating: 5,
  },
  {
    name: 'Thomas Mueller',
    title: 'Photography paradise',
    description:
      'As a landscape photographer, the Everest Base Camp trek was a dream assignment. Our guide knew exactly when and where to catch the best light on the peaks. The sunrise from Kala Patthar, the reflection of Ama Dablam in the Dudh Koshi, prayer flags against deep blue sky at Tengboche - every frame was a masterpiece. Poonhill Treks even arranged early departures to catch golden hour.',
    rating: 5,
  },
];

export async function createReviews(
  prisma: PrismaClient,
  packageIds: number[],
  mediaIds: number[],
): Promise<void> {
  for (let i = 0; i < reviews.length; i++) {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 180));

    await prisma.review.create({
      data: {
        ...reviews[i],
        packageId: packageIds[i % packageIds.length],
        mediaId: mediaIds[i % mediaIds.length],
        reviewDate,
      },
    });
  }

  console.log(`  Created ${reviews.length} reviews`);
}
