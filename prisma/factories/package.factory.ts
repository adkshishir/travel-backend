import { PrismaClient } from '@prisma/client';

interface DestRef {
  id: number;
  slug: string;
  activitySlug: string;
}

const packages = [
  {
    title: 'Ghorepani Poon Hill Trek',
    slug: 'ghorepani-poon-hill-trek',
    subtitle: 'Classic sunrise viewpoint trek in the Annapurna foothills',
    description:
      '<p>The Ghorepani Poon Hill Trek is one of Nepal\'s most beloved short treks, perfect for first-time Himalayan trekkers. This 4-5 day journey takes you through lush rhododendron forests that burst into spectacular color during spring (March-May), charming Gurung and Magar villages, and culminates with a pre-dawn climb to Poon Hill (3,210m) for one of the most breathtaking sunrise panoramas in Nepal.</p><p>From the summit, you\'ll witness a 360-degree view of the Annapurna range, Dhaulagiri (8,167m), Machapuchare (Fishtail), and dozens of other Himalayan peaks painted in golden morning light. The trail is well-established with comfortable teahouse accommodations, making it accessible yet deeply rewarding.</p>',
    accommodation: 'Teahouse/Lodge',
    startFrom: 'Nayapul',
    endAt: 'Nayapul',
    duration: '5 Days / 4 Nights',
    altitude: '3,210m (Poon Hill)',
    bestSeason: 'March-May, September-November',
    price: '450',
    rating: 5,
    culture: 'Gurung, Magar',
    attractions: 'Poon Hill Sunrise, Rhododendron Forest, Hot Springs',
    groupSize: '2-16',
    groupAge: '12-65',
    nature: 'Moderate',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>Starting from Nayapul, a 1.5-hour drive from Pokhara, the trail follows the Modi Khola valley through terraced rice paddies before ascending into dense forests. You\'ll stay overnight in traditional teahouses in Tikhedhunga, Ghorepani, and Tadapani, each offering warm hospitality, dal bhat, and mountain views.</p><p>The highlight is the early morning hike to Poon Hill summit, where you\'ll join fellow trekkers to watch the Himalayan sunrise unfold across an unbroken chain of snow-capped peaks. The descent through Tadapani offers close-up views of the Annapurna South face and Machapuchare.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Drive Pokhara to Nayapul (1,070m), trek to Tikhedhunga (1,540m) - 4-5 hours. Follow the Bhurungdi Khola through charming villages and suspension bridges.</li><li><strong>Day 2:</strong> Trek Tikhedhunga to Ghorepani (2,860m) - 5-6 hours. Ascend stone steps through oak and rhododendron forest, passing Ulleri with its stunning valley views.</li><li><strong>Day 3:</strong> Early morning hike to Poon Hill (3,210m) for sunrise, then trek to Tadapani (2,630m) - 5-6 hours. Descend through pristine forest with views of Annapurna South and Hiunchuli.</li><li><strong>Day 4:</strong> Trek Tadapani to Ghandruk (1,940m) - 3-4 hours. Visit the Gurung Museum and explore this beautiful hillside village with panoramic mountain views.</li><li><strong>Day 5:</strong> Trek Ghandruk to Nayapul (1,070m), drive to Pokhara - 4-5 hours trekking. Descend through terraced fields and traditional villages.</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Airport pickup and drop-off in Pokhara</li><li>All ground transportation (private vehicle)</li><li>ACAP (Annapurna Conservation Area Permit)</li><li>TIMS (Trekkers Information Management System) card</li><li>Experienced English-speaking trekking guide</li><li>Porter service (1 porter per 2 trekkers)</li><li>All meals during the trek (breakfast, lunch, dinner)</li><li>Teahouse accommodation throughout the trek</li><li>First aid kit and oximeter</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>No prior trekking experience required, but basic fitness is recommended</li><li>Temperatures can drop to -5°C at Ghorepani in winter months</li><li>Spring (March-May) offers blooming rhododendrons; autumn (Sept-Nov) offers clearest skies</li><li>Bring layers, a warm sleeping bag liner, and sturdy trekking boots</li><li>ATMs are not available on the trail; carry enough Nepali rupees</li><li>Mobile network is available in most villages (NTC works best)</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>Iconic Poon Hill sunrise panorama over Annapurna and Dhaulagiri ranges</li><li>Walk through Nepal\'s largest rhododendron forest</li><li>Experience warm Gurung village hospitality</li><li>Visit the traditional village of Ghandruk with Gurung Museum</li><li>Close-up views of Machapuchare (Fishtail) at 6,993m</li></ul>',
    destinationSlug: 'annapurna-region',
  },
  {
    title: 'Annapurna Base Camp Trek',
    slug: 'annapurna-base-camp-trek',
    subtitle: 'Journey to the heart of the Annapurna Sanctuary',
    description:
      '<p>The Annapurna Base Camp (ABC) Trek is a spectacular journey into the heart of the Annapurna Sanctuary, a natural amphitheater surrounded by towering peaks including Annapurna I (8,091m), Machapuchare, Hiunchuli, and Annapurna South. This moderately challenging trek takes 7-10 days and reaches an altitude of 4,130m at the base camp.</p><p>The trail passes through diverse ecological zones from subtropical lowlands to alpine meadows, bamboo forests, and finally the glacial moraine of the sanctuary. Each day brings dramatically different landscapes and ever-closer mountain views.</p>',
    accommodation: 'Teahouse/Lodge',
    startFrom: 'Nayapul',
    endAt: 'Nayapul',
    duration: '10 Days / 9 Nights',
    altitude: '4,130m (Annapurna Base Camp)',
    bestSeason: 'March-May, September-November',
    price: '750',
    rating: 5,
    culture: 'Gurung, Magar',
    attractions: 'Annapurna Sanctuary, Machapuchare Base Camp, Hot Springs at Jhinu',
    groupSize: '2-14',
    groupAge: '16-60',
    nature: 'Moderate to Challenging',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>The ABC trek follows the Modi Khola gorge deep into the Annapurna Sanctuary, a sacred cirque revered by the Gurung people. You\'ll pass through Chhomrong, the last permanent settlement, before entering the sanctuary through a narrow gorge guarded by Machapuchare and Hiunchuli. The base camp sits at 4,130m on a glacial plateau surrounded by 360 degrees of towering Himalayan peaks.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Drive Pokhara to Nayapul, trek to Tikhedhunga (1,540m)</li><li><strong>Day 2:</strong> Trek to Ghorepani (2,860m)</li><li><strong>Day 3:</strong> Poon Hill sunrise, trek to Tadapani (2,630m)</li><li><strong>Day 4:</strong> Trek to Chhomrong (2,170m)</li><li><strong>Day 5:</strong> Trek to Bamboo (2,310m)</li><li><strong>Day 6:</strong> Trek to Deurali (3,230m)</li><li><strong>Day 7:</strong> Trek to Annapurna Base Camp (4,130m) via MBC (3,700m)</li><li><strong>Day 8:</strong> Sunrise at ABC, descend to Bamboo (2,310m)</li><li><strong>Day 9:</strong> Trek to Jhinu Danda (1,780m) - enjoy natural hot springs</li><li><strong>Day 10:</strong> Trek to Nayapul, drive to Pokhara</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>All ground transportation</li><li>ACAP permit and TIMS card</li><li>Licensed trekking guide and porters</li><li>All meals on trek (3 meals/day)</li><li>Teahouse accommodation</li><li>First aid kit and emergency evacuation plan</li><li>Sleeping bag (if needed)</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>Moderate fitness required - 5-7 hours of walking per day</li><li>Altitude sickness can occur above 3,500m; proper acclimatization days are built in</li><li>The sanctuary is a sacred area - no hunting or camping beyond designated sites</li><li>Weather can change rapidly at high altitude; bring waterproof gear</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>360-degree panorama of Annapurna range from base camp</li><li>Walk through the sacred Annapurna Sanctuary</li><li>Natural hot springs at Jhinu Danda</li><li>Machapuchare Base Camp views</li><li>Diverse ecology from subtropical to alpine zones</li></ul>',
    destinationSlug: 'annapurna-region',
  },
  {
    title: 'Everest Base Camp Trek',
    slug: 'everest-base-camp-trek',
    subtitle: 'Walk to the foot of the world\'s highest mountain',
    description:
      '<p>The Everest Base Camp trek is the ultimate bucket-list adventure, following in the footsteps of legendary mountaineers Edmund Hillary and Tenzing Norgay to the base of Mount Everest (8,849m). This 12-14 day trek through the Khumbu region of eastern Nepal takes you through the heart of Sherpa country, past ancient Buddhist monasteries, and into one of the most dramatic mountain landscapes on Earth.</p><p>Starting with a thrilling flight to Lukla\'s mountain airstrip, the trail ascends gradually through the bustling trading town of Namche Bazaar, the spiritual Tengboche Monastery, and increasingly stark glacial terrain to reach Everest Base Camp at 5,364m and the panoramic viewpoint of Kala Patthar (5,545m).</p>',
    accommodation: 'Teahouse/Lodge',
    startFrom: 'Lukla',
    endAt: 'Lukla',
    duration: '14 Days / 13 Nights',
    altitude: '5,545m (Kala Patthar)',
    bestSeason: 'March-May, September-November',
    price: '1350',
    rating: 5,
    culture: 'Sherpa',
    attractions: 'Everest Base Camp, Kala Patthar, Tengboche Monastery, Namche Bazaar',
    groupSize: '2-12',
    groupAge: '18-60',
    nature: 'Challenging',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>The EBC trek is a journey through the legendary Khumbu Valley, home to the Sherpa people who have guided mountaineers to Himalayan summits for over a century. The trail passes through Sagarmatha National Park, a UNESCO World Heritage Site, with views of four of the world\'s six highest peaks: Everest, Lhotse, Makalu, and Cho Oyu.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Fly Kathmandu to Lukla (2,860m), trek to Phakding (2,610m)</li><li><strong>Day 2:</strong> Trek to Namche Bazaar (3,440m)</li><li><strong>Day 3:</strong> Acclimatization day in Namche - hike to Everest View Hotel</li><li><strong>Day 4:</strong> Trek to Tengboche (3,860m) - visit the famous monastery</li><li><strong>Day 5:</strong> Trek to Dingboche (4,410m)</li><li><strong>Day 6:</strong> Acclimatization day - hike to Nagarjun Hill (5,100m)</li><li><strong>Day 7:</strong> Trek to Lobuche (4,940m)</li><li><strong>Day 8:</strong> Trek to Gorak Shep (5,170m), hike to Everest Base Camp (5,364m)</li><li><strong>Day 9:</strong> Early morning hike to Kala Patthar (5,545m), trek to Pheriche (4,371m)</li><li><strong>Day 10:</strong> Trek to Namche Bazaar (3,440m)</li><li><strong>Day 11:</strong> Trek to Lukla (2,860m)</li><li><strong>Day 12:</strong> Fly Lukla to Kathmandu</li><li><strong>Day 13-14:</strong> Buffer days for weather delays</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Domestic flights (Kathmandu-Lukla-Kathmandu)</li><li>Sagarmatha National Park entry permit</li><li>TIMS card</li><li>Licensed trekking guide and porters</li><li>All meals during trek</li><li>Teahouse accommodation</li><li>2 nights hotel in Kathmandu with breakfast</li><li>Airport transfers</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>Good physical fitness is essential - trek involves 6-8 hours of walking daily</li><li>Lukla flights may be delayed due to weather; buffer days are included</li><li>Carry Diamox for altitude sickness prevention (consult your doctor)</li><li>Wi-Fi available in teahouses (paid) up to Lobuche</li><li>Charging stations available at most teahouses (paid)</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>Stand at the base of Mount Everest (8,849m)</li><li>Sunrise from Kala Patthar (5,545m) with Everest views</li><li>Visit historic Tengboche Monastery</li><li>Experience Sherpa culture in Namche Bazaar</li><li>Trek through Sagarmatha National Park (UNESCO)</li></ul>',
    destinationSlug: 'everest-region',
  },
  {
    title: 'Langtang Valley Trek',
    slug: 'langtang-valley-trek',
    subtitle: 'The valley of glaciers closest to Kathmandu',
    description:
      '<p>The Langtang Valley Trek offers an accessible yet deeply authentic Himalayan experience just 30km north of Kathmandu. This 7-day trek passes through the stunning Langtang National Park, Nepal\'s first Himalayan national park, following the Langtang Khola through dense forests of oak, maple, and rhododendron into the wide glacial valley beneath Langtang Lirung (7,227m).</p><p>The region is home to the Tamang people, whose Tibetan-influenced culture, warm hospitality, and famous yak cheese add rich cultural depth to the natural splendor. The valley was devastated by the 2015 earthquake and has been beautifully rebuilt, making every visit a contribution to the community\'s recovery.</p>',
    accommodation: 'Teahouse/Lodge',
    startFrom: 'Syabrubesi',
    endAt: 'Syabrubesi',
    duration: '7 Days / 6 Nights',
    altitude: '4,984m (Tserko Ri)',
    bestSeason: 'March-May, September-November',
    price: '550',
    rating: 4,
    culture: 'Tamang',
    attractions: 'Kyanjin Gompa, Tserko Ri viewpoint, Langtang Glacier, Yak Cheese Factory',
    groupSize: '2-14',
    groupAge: '14-65',
    nature: 'Moderate',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>Starting from Syabrubesi (1,550m), reached by a scenic 7-hour drive from Kathmandu, the trail ascends through subtropical forest and Tamang villages to the wide Langtang Valley. The valley floor at Kyanjin Gompa (3,870m) offers superb day-hike options to Tserko Ri (4,984m) and the Langtang Glacier, with unobstructed views of Langtang Lirung, Dorje Lakpa, and the Tibetan border peaks.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Drive Kathmandu to Syabrubesi (1,550m) - 7-8 hours scenic drive</li><li><strong>Day 2:</strong> Trek to Lama Hotel (2,480m) - 5-6 hours through forest</li><li><strong>Day 3:</strong> Trek to Langtang Village (3,430m) - 5-6 hours</li><li><strong>Day 4:</strong> Trek to Kyanjin Gompa (3,870m) - 3-4 hours, visit cheese factory</li><li><strong>Day 5:</strong> Day hike to Tserko Ri (4,984m) - 4-5 hours round trip</li><li><strong>Day 6:</strong> Trek to Lama Hotel (2,480m) - 6-7 hours descent</li><li><strong>Day 7:</strong> Trek to Syabrubesi, drive to Kathmandu</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Ground transportation Kathmandu-Syabrubesi-Kathmandu</li><li>Langtang National Park entry permit</li><li>TIMS card</li><li>Licensed trekking guide and porter</li><li>All meals during trek</li><li>Teahouse accommodation</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>The drive to Syabrubesi is long but scenic along the Trisuli River</li><li>Langtang village was rebuilt after 2015 earthquake - your visit supports local recovery</li><li>Try the famous Langtang yak cheese at Kyanjin Gompa</li><li>Less crowded alternative to Annapurna and Everest regions</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>Panoramic views from Tserko Ri (4,984m)</li><li>Visit ancient Kyanjin Gompa monastery</li><li>Taste authentic yak cheese at the local factory</li><li>Experience Tamang culture and hospitality</li><li>Walk alongside the Langtang Glacier</li></ul>',
    destinationSlug: 'langtang-region',
  },
  {
    title: 'Manaslu Circuit Trek',
    slug: 'manaslu-circuit-trek',
    subtitle: 'Remote restricted-area trek around the world\'s 8th highest peak',
    description:
      '<p>The Manaslu Circuit Trek is a remote, pristine journey around Mount Manaslu (8,163m), the world\'s eighth highest peak. This restricted-area trek offers an experience similar to what the Annapurna Circuit was decades ago - fewer trekkers, unspoiled villages, and raw Himalayan beauty. The 14-16 day circuit crosses the dramatic Larkya La pass (5,160m) and passes through diverse landscapes from subtropical valleys to high-altitude desert.</p>',
    accommodation: 'Teahouse/Basic Lodge',
    startFrom: 'Soti Khola',
    endAt: 'Dharapani',
    duration: '15 Days / 14 Nights',
    altitude: '5,160m (Larkya La Pass)',
    bestSeason: 'March-May, September-November',
    price: '1200',
    rating: 5,
    culture: 'Tibetan, Gurung, Nubri',
    attractions: 'Larkya La Pass, Birendra Lake, Manaslu Glacier, Ancient Monasteries',
    groupSize: '2-12',
    groupAge: '18-60',
    nature: 'Challenging',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>This restricted-area trek requires a special permit and minimum group of 2. The circuit follows the Budhi Gandaki gorge upstream through lush subtropical forest, climbs through Tibetan-influenced villages with ancient gompas, crosses the high Larkya La pass with its stunning views, and descends to join the Annapurna Circuit trail at Dharapani.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Drive Kathmandu to Soti Khola (700m)</li><li><strong>Day 2:</strong> Trek to Machha Khola (930m)</li><li><strong>Day 3:</strong> Trek to Jagat (1,340m)</li><li><strong>Day 4:</strong> Trek to Deng (1,860m)</li><li><strong>Day 5:</strong> Trek to Namrung (2,660m)</li><li><strong>Day 6:</strong> Trek to Samagaun (3,530m)</li><li><strong>Day 7:</strong> Rest day - explore Manaslu Base Camp trail and Birendra Lake</li><li><strong>Day 8:</strong> Trek to Samdo (3,860m)</li><li><strong>Day 9:</strong> Acclimatization day in Samdo</li><li><strong>Day 10:</strong> Trek to Dharamsala/Larkya BC (4,460m)</li><li><strong>Day 11:</strong> Cross Larkya La (5,160m), descend to Bimthang (3,720m)</li><li><strong>Day 12:</strong> Trek to Dharapani (1,860m)</li><li><strong>Day 13:</strong> Trek to Jagat/drive to Besisahar</li><li><strong>Day 14:</strong> Drive to Kathmandu</li><li><strong>Day 15:</strong> Buffer day</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Restricted area permit and Manaslu Conservation Area permit</li><li>All ground transportation</li><li>Licensed guide, assistant guide, and porters</li><li>All meals during trek</li><li>Teahouse accommodation</li><li>Sleeping bag and down jacket rental</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>Minimum 2 trekkers required for restricted area permit</li><li>This is a strenuous trek requiring previous trekking experience</li><li>Larkya La crossing is weather-dependent; flexibility is essential</li><li>Accommodation is basic compared to Annapurna and Everest</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>Cross the dramatic Larkya La pass at 5,160m</li><li>Remote, uncrowded trails through pristine valleys</li><li>Tibetan Buddhist monasteries and culture</li><li>Birendra Lake at the foot of Manaslu Glacier</li><li>Diverse landscapes from subtropical to alpine</li></ul>',
    destinationSlug: 'manaslu-region',
  },
  {
    title: 'Mardi Himal Trek',
    slug: 'mardi-himal-trek',
    subtitle: 'Hidden gem trail with ridge walks and cloud-sea views',
    description:
      '<p>The Mardi Himal Trek is a relatively new and less-traveled route that has quickly become a favorite among trekkers seeking solitude and stunning views without the crowds. This 5-7 day trek follows a dramatic ridge line with panoramic views of Machapuchare (Fishtail), Annapurna South, Hiunchuli, and Mardi Himal, often walking above a sea of clouds.</p>',
    accommodation: 'Teahouse/Homestay',
    startFrom: 'Kande',
    endAt: 'Lwang',
    duration: '6 Days / 5 Nights',
    altitude: '4,500m (Mardi Himal High Camp)',
    bestSeason: 'March-May, October-December',
    price: '400',
    rating: 4,
    culture: 'Gurung',
    attractions: 'Ridge Walk, Machapuchare Close-up, Cloud Sea, Forest Camp',
    groupSize: '2-10',
    groupAge: '14-60',
    nature: 'Moderate',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>Starting from Kande, the trail ascends through beautiful rhododendron forest to the ridge separating Modi Khola and Mardi Khola valleys. The ridge walk offers spectacular views on both sides, with Machapuchare appearing impossibly close. The trail is less maintained than popular routes, adding an element of adventure.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Drive Pokhara to Kande, trek to Forest Camp (2,550m)</li><li><strong>Day 2:</strong> Trek to Low Camp (2,990m)</li><li><strong>Day 3:</strong> Trek to High Camp (3,580m)</li><li><strong>Day 4:</strong> Trek to Upper Viewpoint (4,500m) and back to High Camp</li><li><strong>Day 5:</strong> Trek to Siding Village (1,700m)</li><li><strong>Day 6:</strong> Trek to Lwang, drive to Pokhara</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Transportation Pokhara-Kande and Lwang-Pokhara</li><li>ACAP permit and TIMS card</li><li>Trekking guide and porter</li><li>All meals during trek</li><li>Teahouse accommodation</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>Trail can be slippery during and after rain</li><li>Accommodation is more basic than Poon Hill or ABC routes</li><li>Perfect alternative for those wanting fewer crowds</li><li>Can be combined with Poon Hill trek</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>Dramatic ridge walk above the clouds</li><li>Close-up views of Machapuchare (Fishtail)</li><li>Less crowded, off-the-beaten-path experience</li><li>Beautiful rhododendron and bamboo forests</li><li>Authentic Gurung village homestays</li></ul>',
    destinationSlug: 'annapurna-region',
  },
  {
    title: 'Upper Mustang Trek',
    slug: 'upper-mustang-trek',
    subtitle: 'Explore the last forbidden kingdom of Nepal',
    description:
      '<p>The Upper Mustang Trek takes you into the former Kingdom of Lo, a remote desert landscape hidden behind the Himalayan rain shadow that was closed to foreigners until 1992. This restricted-area trek reveals a world of dramatic eroded cliffs, ancient cave dwellings, sky-high monasteries, and the medieval walled city of Lo Manthang - the last vestige of traditional Tibetan culture largely untouched by modernity.</p>',
    accommodation: 'Teahouse/Traditional Lodge',
    startFrom: 'Jomsom',
    endAt: 'Jomsom',
    duration: '12 Days / 11 Nights',
    altitude: '3,810m (Lo Manthang)',
    bestSeason: 'May-October',
    price: '1600',
    rating: 5,
    culture: 'Loba (Tibetan)',
    attractions: 'Lo Manthang, Choser Caves, Sky Caves, Ancient Monasteries',
    groupSize: '2-10',
    groupAge: '18-60',
    nature: 'Moderate',
    activity: 'Trekking',
    overview:
      '<h3>Trek Overview</h3><p>Unlike most Nepal treks, Upper Mustang is best during monsoon season (June-August) as it lies in the rain shadow of the Himalayan range. The trek follows the ancient salt trading route along the Kali Gandaki gorge, through barren desert landscapes that resemble Tibet or the American Southwest. The highlight is spending 2-3 days exploring Lo Manthang, with its 14th-century Buddhist monasteries, royal palace, and traditional Tibetan way of life.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Day 1:</strong> Fly Pokhara to Jomsom (2,720m)</li><li><strong>Day 2:</strong> Trek to Kagbeni (2,800m)</li><li><strong>Day 3:</strong> Trek to Chele (3,050m) - enter Upper Mustang</li><li><strong>Day 4:</strong> Trek to Syangboche (3,800m)</li><li><strong>Day 5:</strong> Trek to Ghami (3,520m)</li><li><strong>Day 6:</strong> Trek to Tsarang (3,560m)</li><li><strong>Day 7:</strong> Trek to Lo Manthang (3,810m)</li><li><strong>Day 8:</strong> Explore Lo Manthang - royal palace, monasteries, caves</li><li><strong>Day 9:</strong> Day trip to Choser and sky caves</li><li><strong>Day 10:</strong> Trek to Ghami via alternative route (3,520m)</li><li><strong>Day 11:</strong> Trek to Kagbeni (2,800m)</li><li><strong>Day 12:</strong> Trek to Jomsom, fly to Pokhara</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Upper Mustang restricted area permit ($500/person for 10 days)</li><li>ACAP permit and TIMS card</li><li>Domestic flights Pokhara-Jomsom-Pokhara</li><li>Licensed guide and porters</li><li>All meals and accommodation</li><li>Lo Manthang museum and monastery entry fees</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>Restricted area permit costs $500/person for first 10 days</li><li>Minimum 2 trekkers required for permit</li><li>Best trekked during monsoon (Jun-Aug) when rest of Nepal is rainy</li><li>Winds are very strong in the afternoon - start early each day</li><li>This is a culturally sensitive area - dress modestly and ask before photographing</li></ul>',
    highlights:
      '<h3>Trek Highlights</h3><ul><li>Explore the medieval walled city of Lo Manthang</li><li>Walk through a stark desert landscape unique in Nepal</li><li>Visit ancient sky caves and cliff monasteries</li><li>Experience authentic Tibetan Buddhist culture</li><li>Trek the ancient salt trading route of the Kali Gandaki</li></ul>',
    destinationSlug: 'upper-mustang',
  },
  {
    title: 'Island Peak Climbing',
    slug: 'island-peak-climbing',
    subtitle: 'Summit a 6,189m Himalayan peak combined with EBC trek',
    description:
      '<p>Island Peak (Imja Tse, 6,189m) is Nepal\'s most popular trekking peak, combining the classic Everest Base Camp trek with a technical summit push. Located in the Khumbu region near Chukhung, this expedition offers a taste of high-altitude mountaineering with glacier travel, fixed rope sections, and a narrow summit ridge with jaw-dropping views of Lhotse, Nuptse, Makalu, Baruntse, and Ama Dablam.</p>',
    accommodation: 'Teahouse + Camping',
    startFrom: 'Lukla',
    endAt: 'Lukla',
    duration: '18 Days / 17 Nights',
    altitude: '6,189m (Island Peak Summit)',
    bestSeason: 'April-May, October-November',
    price: '2200',
    rating: 5,
    culture: 'Sherpa',
    attractions: 'Island Peak Summit, Everest Base Camp, Kala Patthar, Chukhung Ri',
    groupSize: '2-8',
    groupAge: '18-55',
    nature: 'Very Challenging',
    activity: 'Peak Climbing',
    overview:
      '<h3>Expedition Overview</h3><p>This expedition combines the Everest Base Camp trek with a summit attempt of Island Peak. After acclimatizing on the EBC trek, climbers head to Chukhung Valley for climbing training before establishing base camp at 5,087m. The summit day involves crossing the Imja Glacier, ascending steep snow slopes using fixed ropes and jumar ascenders, and navigating a narrow summit ridge.</p>',
    itinerary:
      '<h3>Day-by-Day Itinerary</h3><ul><li><strong>Days 1-12:</strong> Everest Base Camp trek (Lukla to EBC via Namche, Tengboche, Dingboche)</li><li><strong>Day 13:</strong> Trek to Chukhung (4,730m)</li><li><strong>Day 14:</strong> Climbing training and gear check</li><li><strong>Day 15:</strong> Trek to Island Peak Base Camp (5,087m)</li><li><strong>Day 16:</strong> Summit day - climb to High Camp (5,600m), summit push to 6,189m, return to BC</li><li><strong>Day 17:</strong> Descend to Pangboche (3,930m)</li><li><strong>Day 18:</strong> Trek to Lukla, fly to Kathmandu</li></ul>',
    includes:
      '<h3>What\'s Included</h3><ul><li>Island Peak climbing permit</li><li>Sagarmatha National Park permit and TIMS</li><li>Domestic flights Kathmandu-Lukla-Kathmandu</li><li>Experienced climbing guide (1:2 ratio) and Sherpa support</li><li>All climbing equipment (ropes, ice axes, crampons, harnesses)</li><li>All meals and accommodation</li><li>Camping equipment at base camp and high camp</li></ul>',
    goodtoknow:
      '<h3>Good to Know</h3><ul><li>Previous trekking experience at high altitude is required</li><li>Basic mountaineering skills helpful but not mandatory (training provided)</li><li>Summit success rate is approximately 70-80%</li><li>Climbing is weather-dependent; flexibility is essential</li></ul>',
    highlights:
      '<h3>Expedition Highlights</h3><ul><li>Summit a 6,000m+ Himalayan peak</li><li>Combined EBC trek and climbing expedition</li><li>Glacier travel and technical climbing experience</li><li>Stunning views of Lhotse, Makalu, and Ama Dablam from summit</li><li>Certificate of achievement from Nepal Mountaineering Association</li></ul>',
    destinationSlug: 'island-peak',
  },
];

export async function createPackages(
  prisma: PrismaClient,
  destRefs: { id: number; slug: string }[],
  mediaIds: number[],
): Promise<{ id: number; slug: string }[]> {
  const created: { id: number; slug: string }[] = [];

  for (let i = 0; i < packages.length; i++) {
    const pkg = packages[i];
    const destRef = destRefs.find((d) => d.slug === pkg.destinationSlug);
    if (!destRef) continue;

    const seo = await prisma.seo.create({
      data: {
        metaTitle: `${pkg.title} | Poonhill Treks Nepal`,
        metaDescription: pkg.subtitle,
        metaKeywords: `${pkg.title.toLowerCase()}, nepal trek, ${pkg.destinationSlug}, himalaya`,
      },
    });

    const mainImageIdx = i % (mediaIds.length - 3); // avoid map images
    const mapImageIdx = 12 + (i % 3); // use map images (indices 12-14)

    const { destinationSlug, ...pkgData } = pkg;

    const created_pkg = await prisma.package.create({
      data: {
        ...pkgData,
        destinationId: destRef.id,
        mainImageId: mediaIds[mainImageIdx],
        mapId: mediaIds[mapImageIdx],
        seoId: seo.id,
      },
    });

    created.push({ id: created_pkg.id, slug: created_pkg.slug });
  }

  console.log(`  Created ${created.length} packages`);
  return created;
}
