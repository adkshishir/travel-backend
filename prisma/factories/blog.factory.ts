import { PrismaClient } from '@prisma/client';

const authors = [
  {
    name: 'Shishir Adhikari',
    username: 'shishir',
    email: 'shishir@poonhilltreks.com',
    bio: 'Founder of Poonhill Treks and a passionate mountaineer with over 15 years of trekking experience across Nepal. Born and raised in Pokhara, Shishir has guided thousands of trekkers through the Himalayas and holds a degree in Tourism Management from Tribhuvan University.',
    website: 'https://poonhilltreks.com',
    socialLinks: {
      facebook: 'https://facebook.com/poonhilltreks',
      instagram: 'https://instagram.com/poonhilltreks',
    },
  },
  {
    name: 'Anita Gurung',
    username: 'anita-gurung',
    email: 'anita@poonhilltreks.com',
    bio: 'Trek leader and cultural guide from Ghandruk village in the Annapurna region. Anita is one of Nepal\'s first female trekking guides and is passionate about sustainable tourism and empowering women in the adventure industry.',
    website: null,
    socialLinks: {
      instagram: 'https://instagram.com/anitagurung_treks',
    },
  },
  {
    name: 'Pemba Sherpa',
    username: 'pemba-sherpa',
    email: 'pemba@poonhilltreks.com',
    bio: 'Born in Namche Bazaar, Pemba is a veteran Everest region guide who has summited Island Peak four times. He writes about Sherpa culture, high-altitude trekking safety, and the changing landscape of the Khumbu Valley.',
    website: null,
    socialLinks: {
      facebook: 'https://facebook.com/pembasherpa.guide',
    },
  },
];

const blogs = [
  {
    title: 'Complete Packing List for Trekking in Nepal: What to Bring and What to Skip',
    slug: 'complete-packing-list-trekking-nepal',
    subtitle: 'Expert tips from 15 years of guiding in the Himalayas',
    description:
      'A comprehensive guide to packing for Nepal treks, from essential gear like trekking boots and down jackets to often-forgotten items like water purification tablets and altitude sickness medication. Learn what to pack, what to rent in Kathmandu, and what you definitely don\'t need.',
    content:
      '<h2>The Essential Packing Guide for Nepal Treks</h2><p>After guiding thousands of trekkers through Nepal\'s Himalayas, I\'ve seen it all — from trekkers carrying 25kg backpacks they can barely lift to those who arrive with nothing but a daypack and flip-flops. The truth is somewhere in between.</p><h3>Footwear</h3><p>Your trekking boots are the single most important item. They should be waterproof, ankle-supporting, and broken in before your trip. I recommend boots like the Salomon X Ultra or Merrell Moab. Bring a pair of lightweight sandals for teahouse evenings — your feet will thank you.</p><h3>Clothing Layers</h3><p>The key to Himalayan trekking is layering. You\'ll experience temperatures from 25°C in the lowlands to -15°C at high camps, often in the same day. Essential layers include:</p><ul><li>Moisture-wicking base layers (merino wool is ideal)</li><li>Insulating mid-layer (fleece or light down)</li><li>Waterproof/windproof outer shell</li><li>Down jacket for evenings and high altitude</li></ul><h3>What to Rent in Kathmandu or Pokhara</h3><p>Don\'t waste luggage space on items you can rent cheaply in Thamel or Lakeside:</p><ul><li>Sleeping bags (good quality ones available for $1-2/day)</li><li>Down jackets ($2-3/day)</li><li>Trekking poles ($1/day)</li><li>Duffel bags for porters</li></ul><h3>What NOT to Bring</h3><p>Leave these at home: heavy books (use a Kindle), too many clothes changes (you\'ll wear the same thing daily), heavy camera equipment (a good phone is sufficient for most), and excessive snacks (teahouses serve plenty of food).</p>',
    authorIndex: 0,
    isPublished: true,
  },
  {
    title: 'Best Time to Trek in Nepal: A Month-by-Month Guide',
    slug: 'best-time-trek-nepal-month-by-month',
    subtitle: 'Plan your perfect Himalayan adventure with our seasonal guide',
    description:
      'Discover the ideal trekking seasons in Nepal with our detailed month-by-month breakdown. From the crystal-clear skies of autumn to the blooming rhododendrons of spring, learn when each region offers the best conditions for your trek.',
    content:
      '<h2>When Should You Trek in Nepal?</h2><p>Nepal has four distinct seasons, and choosing the right time can make the difference between a magical experience and a miserable one. Here\'s everything you need to know.</p><h3>Autumn (September - November) — Peak Season</h3><p>This is Nepal\'s premier trekking season. After the monsoon rains wash the atmosphere clean, the mountains appear in stunning clarity. Temperatures are comfortable, trails are dry, and the skies are deep blue. The only downside? Crowds, especially on popular routes like Annapurna Base Camp and Everest Base Camp. October and November see the highest number of trekkers.</p><h3>Spring (March - May) — Second Peak Season</h3><p>Spring brings warmer temperatures and Nepal\'s famous rhododendron bloom. The forests at 2,000-3,500m transform into a stunning display of red, pink, and white flowers. Visibility is slightly hazier than autumn due to dust and haze, but still excellent. Late May can bring pre-monsoon afternoon clouds.</p><h3>Winter (December - February) — Cold but Clear</h3><p>Lower altitude treks like Poon Hill are possible in winter, with cold but clear conditions. High passes and Everest Base Camp treks are extremely cold with heavy snowfall. However, winter offers the quietest trails and the lowest prices.</p><h3>Monsoon (June - August) — Off-Season</h3><p>Most treks are inadvisable during monsoon due to heavy rain, leeches, and landslide risk. However, rain-shadow regions like Upper Mustang and Dolpo are actually best during monsoon — the Himalayan range blocks the moisture.</p>',
    authorIndex: 0,
    isPublished: true,
  },
  {
    title: 'Altitude Sickness: Prevention, Symptoms, and Treatment on Nepal Treks',
    slug: 'altitude-sickness-prevention-symptoms-nepal-treks',
    subtitle: 'Essential health information for high-altitude trekking',
    description:
      'Learn everything about Acute Mountain Sickness (AMS) before your Nepal trek. From recognizing early symptoms to proper acclimatization schedules and when to descend, this guide covers all you need to stay safe at high altitude.',
    content:
      '<h2>Understanding Altitude Sickness in the Himalayas</h2><p>Altitude sickness, or Acute Mountain Sickness (AMS), is the most common health risk on Nepal treks above 2,500m. It occurs when the body doesn\'t have time to adjust to decreasing oxygen levels at higher elevations. Understanding AMS is essential for every trekker — it doesn\'t discriminate based on age, fitness, or experience.</p><h3>Symptoms of AMS</h3><p>Early symptoms include headache, loss of appetite, nausea, fatigue, and difficulty sleeping. These are normal at altitude and usually resolve with proper acclimatization. Severe symptoms that require immediate descent include confusion, loss of coordination (ataxia), severe breathlessness at rest, and fluid in the lungs (HAPE) or brain (HACE).</p><h3>The Golden Rules of Acclimatization</h3><ul><li><strong>Climb high, sleep low:</strong> Day hikes to higher elevations help your body adjust</li><li><strong>Don\'t ascend more than 500m sleeping altitude per day above 3,000m</strong></li><li><strong>Take a rest day every 3-4 days of ascending</strong></li><li><strong>Stay hydrated:</strong> Drink 3-4 liters of water daily at altitude</li><li><strong>Avoid alcohol and sleeping pills</strong> which mask symptoms</li></ul><h3>Diamox (Acetazolamide)</h3><p>Diamox is a prescription medication that aids acclimatization. It works by increasing ventilation and urination, helping the body adjust faster. Consult your doctor before your trek — common side effects include tingling in fingers and increased urination. Start 125mg twice daily, 1-2 days before reaching 3,000m.</p>',
    authorIndex: 2,
    isPublished: true,
  },
  {
    title: 'Life as a Female Trekking Guide in Nepal: Breaking Barriers in the Mountains',
    slug: 'female-trekking-guide-nepal-breaking-barriers',
    subtitle: 'Anita Gurung shares her journey from village girl to mountain leader',
    description:
      'Anita Gurung, one of Nepal\'s first female trekking guides, shares her inspiring journey from growing up in a Gurung village to leading international trekking groups through the Himalayas. A story of determination, cultural change, and empowerment.',
    content:
      '<h2>My Journey to the Mountains</h2><p>I grew up in Ghandruk, a beautiful Gurung village perched on a hillside with views of Annapurna South and Machapuchare. Every day, I watched foreign trekkers pass through our village, guided by men from the community. I served them tea at my family\'s teahouse and dreamed of walking with them, sharing the stories of my people and my mountains.</p><p>In our village, women cooked, cleaned, and tended the fields. The idea of a woman leading treks was unheard of. When I told my father I wanted to be a trekking guide, he was silent for three days. My mother cried. But my grandfather, who had served in the British Gurkha regiment, said, "If you can walk these mountains carrying water since you were five, you can guide anyone."</p><h3>Training and Certification</h3><p>I enrolled in the Nepal Academy of Tourism and Hotel Management guide training program in 2012. I was one of three women in a class of forty. The physical training was demanding, but I had grown up walking steep mountain trails — the classroom work was actually harder for me. I earned my government-licensed guide certification in 2013.</p><h3>The First Trek</h3><p>My first solo guiding job was a Poon Hill trek with two Australian women. They had specifically requested a female guide. Walking the same trails I had walked as a child, but now as a professional guide sharing my culture and knowledge, was the most empowering moment of my life. One of them told me, "Anita, you\'re not just guiding us up a mountain. You\'re showing us what\'s possible."</p>',
    authorIndex: 1,
    isPublished: true,
  },
  {
    title: 'Teahouse Etiquette: A Cultural Guide to Staying in Nepal\'s Mountain Lodges',
    slug: 'teahouse-etiquette-cultural-guide-nepal-lodges',
    subtitle: 'How to be a respectful and welcome guest in mountain communities',
    description:
      'Nepal\'s teahouses are more than just accommodation — they\'re family homes opened to trekkers. Learn the customs, expectations, and unspoken rules that will make your teahouse experience richer and more meaningful.',
    content:
      '<h2>Understanding the Teahouse System</h2><p>Nepal\'s teahouse system is unique in the trekking world. Unlike huts in the Alps or shelters on the Appalachian Trail, teahouses in Nepal are family-run guesthouses where you sleep, eat, and share space with the host family and other trekkers. Understanding the customs around teahouse stays will enrich your experience immeasurably.</p><h3>The Unspoken Deal</h3><p>Teahouse accommodation is remarkably cheap (200-500 NPR, or $1.50-3.75 per night) because the business model is built on food sales. The unspoken deal is: you sleep cheaply, but you eat at the teahouse. Ordering food from one teahouse while sleeping at another is considered very poor form and can cause friction in small communities.</p><h3>Cultural Do\'s and Don\'ts</h3><ul><li><strong>Remove shoes</strong> before entering the dining room</li><li><strong>Don\'t enter the kitchen</strong> unless invited</li><li><strong>Use your right hand</strong> when eating or passing objects</li><li><strong>Don\'t point your feet</strong> at people or religious objects</li><li><strong>"Namaste"</strong> with palms together is always appreciated</li><li><strong>Ask before photographing</strong> people, especially elderly locals and monks</li></ul><h3>Dal Bhat Power, 24 Hour</h3><p>This popular trekker saying reflects a truth: dal bhat (lentil soup with rice, vegetables, and pickles) is the most nutritious, filling, and affordable meal on the trail. It comes with unlimited refills! Order it at least once a day — it\'s the fuel that powers Nepal.</p>',
    authorIndex: 0,
    isPublished: true,
  },
  {
    title: 'Sherpa Culture Beyond Everest: Understanding the People Behind the Peaks',
    slug: 'sherpa-culture-beyond-everest-people-behind-peaks',
    subtitle: 'A Sherpa guide\'s perspective on his community\'s heritage and future',
    description:
      'Pemba Sherpa shares insights into Sherpa culture, Buddhist traditions, and the changing way of life in the Khumbu Valley. More than mountain guides, the Sherpa are a proud ethnic group with a rich cultural heritage.',
    content:
      '<h2>More Than a Word for "Guide"</h2><p>One of the things that bothers me most is when people use "sherpa" as a generic word for any mountain porter or guide. Sherpa is an ethnic group — my people — who migrated from eastern Tibet to the Khumbu Valley around 600 years ago. We have our own language (Sherpa, a Tibetan dialect), our own traditions, and our own identity that goes far beyond mountaineering.</p><h3>Buddhism in Daily Life</h3><p>Buddhism permeates every aspect of Sherpa life. You\'ll notice mani stones (rocks carved with Buddhist mantras) along every trail, prayer flags fluttering on high ridges, and the constant gentle spinning of prayer wheels. Tengboche Monastery, rebuilt after a devastating fire in 1989, is the spiritual heart of the Khumbu. Its annual Mani Rimdu festival in October/November features masked dances depicting the triumph of Buddhism over ancient Bon religion.</p><h3>The Changing Khumbu</h3><p>Tourism has transformed Sherpa communities in both wonderful and challenging ways. My generation has access to education, healthcare, and global connections our grandparents never dreamed of. But we also face the loss of traditional ways — fewer young people speak fluent Sherpa, many migrate to Kathmandu for education and careers, and climate change is reshaping the glaciers and landscapes that define our homeland. The Imja Glacier lake grows larger each year, a constant reminder of the forces reshaping our world.</p>',
    authorIndex: 2,
    isPublished: true,
  },
  {
    title: '10 Common Mistakes First-Time Trekkers Make in Nepal (and How to Avoid Them)',
    slug: '10-common-mistakes-first-time-trekkers-nepal',
    subtitle: 'Learn from others\' mistakes so your trek goes smoothly',
    description:
      'Planning your first Nepal trek? Avoid these 10 common mistakes that can turn your dream adventure into a difficult experience. From packing too much to ascending too fast, we cover the pitfalls and their solutions.',
    content:
      '<h2>Learn From Others\' Mistakes</h2><p>Every year, we see the same mistakes repeated by first-time trekkers. Here are the top 10 — and how to avoid them.</p><h3>1. Packing Too Much</h3><p>Your porter carries a maximum of 25kg for two trekkers. Bring only what you need. If you can\'t carry your own bag for 30 minutes, it\'s too heavy.</p><h3>2. Skipping Acclimatization Days</h3><p>We build rest days into our itineraries for a reason. AMS is the #1 reason treks get cut short. "I feel fine, let\'s keep going" is the most dangerous sentence at altitude.</p><h3>3. Not Breaking In Boots</h3><p>Brand new trekking boots on day one = blisters by day two. Wear your boots for at least 2-3 weeks before your trek.</p><h3>4. Underestimating the Cold</h3><p>At 4,000m+, temperatures can drop to -15°C at night. That lightweight fleece won\'t cut it. Bring or rent a proper down jacket and sleeping bag.</p><h3>5. Not Carrying Enough Cash</h3><p>There are no ATMs beyond Namche Bazaar (Everest region) or Jomsom (Annapurna). Carry sufficient Nepali rupees for the entire trek, plus emergency funds.</p><h3>6. Relying Only on Phone for Navigation</h3><p>Phone batteries die quickly in cold weather. While trails are well-marked and your guide knows the way, carry a paper map as backup and a power bank.</p><h3>7. Not Drinking Enough Water</h3><p>Dehydration worsens altitude sickness. Drink 3-4 liters daily. Water purification tablets are cheaper than buying bottled water and far better for the environment.</p><h3>8. Ignoring Sun Protection</h3><p>UV radiation increases dramatically at altitude. Sunburn at 4,000m is no joke. Bring SPF 50+ sunscreen, quality sunglasses, and a sun hat.</p><h3>9. Not Getting Travel Insurance</h3><p>Helicopter evacuation costs $3,000-5,000. Make sure your insurance covers trekking at altitude and emergency evacuation. Check the altitude limit on your policy.</p><h3>10. Rushing Through the Experience</h3><p>The trek is not a race. Stop to talk to villagers, photograph the wildflowers, watch the sunrise, and journal your thoughts. These moments become the memories you treasure most.</p>',
    authorIndex: 0,
    isPublished: true,
  },
  {
    title: 'Responsible Trekking in Nepal: How to Minimize Your Environmental Impact',
    slug: 'responsible-trekking-nepal-minimize-environmental-impact',
    subtitle: 'Practical steps every trekker can take to protect the Himalayas',
    description:
      'The Himalayas face growing environmental challenges from tourism. Learn how to trek responsibly by managing waste, supporting local communities, reducing plastic, and choosing eco-conscious operators.',
    content:
      '<h2>Protecting the Mountains We Love</h2><p>Nepal\'s mountain trails face a growing environmental crisis. The Everest region alone produces an estimated 12,000 kg of human waste and 11,000 kg of garbage annually from tourism. As trekkers who love these mountains, we have a responsibility to minimize our impact.</p><h3>The Plastic Problem</h3><p>Single-use water bottles are the biggest source of plastic waste on Nepal\'s trails. The solution is simple: carry a reusable water bottle and use water purification tablets or a SteriPen. Most teahouses now offer boiled or filtered water for a small fee — this is always preferable to buying plastic bottles.</p><h3>Pack It In, Pack It Out</h3><p>Carry a stuff sack for your trash and take it back to town for proper disposal. This includes wrappers, batteries, and personal items. Never leave trash on the trail or burn it in teahouse fires, as burning plastic releases toxic fumes.</p><h3>Support Local Economies</h3><p>Choose locally-owned teahouses over international hotel chains, buy handicrafts directly from artisans, and tip your guides and porters fairly. A fair tipping guideline is $10-15/day for guides and $8-10/day for porters.</p><h3>Stay on Marked Trails</h3><p>Shortcutting switchbacks causes erosion and damages fragile alpine ecosystems. Stick to established trails, especially above the tree line where vegetation takes decades to recover.</p>',
    authorIndex: 1,
    isPublished: true,
  },
];

export async function createAuthorsAndBlogs(
  prisma: PrismaClient,
  mediaIds: number[],
): Promise<void> {
  const authorIds: number[] = [];

  for (let i = 0; i < authors.length; i++) {
    const seo = await prisma.seo.create({
      data: {
        metaTitle: `${authors[i].name} - Author | Poonhill Treks`,
        metaDescription: authors[i].bio.slice(0, 160),
        metaKeywords: `${authors[i].name.toLowerCase()}, nepal trekking, author`,
      },
    });

    const author = await prisma.author.create({
      data: {
        ...authors[i],
        mediaId: mediaIds[i % mediaIds.length],
        seoId: seo.id,
      },
    });
    authorIds.push(author.id);
  }

  console.log(`  Created ${authorIds.length} authors`);

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];

    const seo = await prisma.seo.create({
      data: {
        metaTitle: `${blog.title} | Poonhill Treks Blog`,
        metaDescription: blog.description.slice(0, 160),
        metaKeywords: `nepal trekking blog, ${blog.slug.split('-').slice(0, 3).join(', ')}`,
      },
    });

    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug,
        subtitle: blog.subtitle,
        description: blog.description,
        content: blog.content,
        isPublished: blog.isPublished,
        publisher: 'Poonhill Treks',
        authorId: authorIds[blog.authorIndex],
        mediaId: mediaIds[(i + 3) % mediaIds.length],
        seoId: seo.id,
      },
    });
  }

  console.log(`  Created ${blogs.length} blogs`);
}
