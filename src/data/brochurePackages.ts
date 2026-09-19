import { TourPackage } from '../types';

export const BROCHURE_TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-holyland-2026',
    code: 'PKG-HL-2026',
    title: 'Pilgrim\'s Path: Holyland Tour 2026',
    subtitle: 'Jordan • Israel • Egypt Sacred Pilgrimage with Wadi Rum Bubble Room',
    destination: 'Jordan, Israel & Egypt',
    category: 'International & Pilgrimage',
    durationDays: 12,
    durationNights: 11,
    pricePerPax: 145000,
    maxCapacity: 30,
    status: 'Active',
    featured: true,
    rating: 5.0,
    reviewCount: 42,
    bannerUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    airline: 'Qatar Airways (5-Star Airline)',
    departureDates: ['Nov 4 - 15, 2026'],
    specialFeatures: [
      'Confirmed Stay in Wadi Rum Bubble Rooms under the Stars',
      'Qatar Airways 5-Star Full-Service Flight',
      'Sea of Galilee Cruise Boat Ride',
      'Renewal of Marriage Vows in Cana & Baptism in Jordan River'
    ],
    inclusions: [
      'Roundtrip Airfare via 5-Star Qatar Airways',
      'Check-in Baggage + Hand Carry Allowance',
      '10 Nights Luxury Hotel Accommodation (4-5 Star)',
      '1 Night Confirmed Stay in Wadi Rum Bubble Rooms',
      'Private Air-conditioned Luxury Motorcoach',
      'Daily Full Board Gourmet Meals & Farewell Dinner Party',
      'English-Speaking Licensed Local Tour Guides & Filipino Tour Escort',
      'Dead Sea Dip & Sea of Galilee Cruise Boat Ride',
      'Souvenirs & Travel Gifts + Daily Bottled Mineral Water',
      'Comprehensive Travel Insurance (up to 69 y/o)',
      'All Terminal Fees, Fuel Surcharge, Border Taxes (Jordan & Egypt) & Tipping'
    ],
    exclusions: [
      'Philippine Travel Tax (₱1,620)',
      'Personal incidental charges (minibar, laundry, phone calls)',
      'Single room supplement (if solo traveler)'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Manila to Amman, Jordan',
        description: 'Departure from Manila via Qatar Airways. Arrive at Queen Alia International Airport in Amman. Warm meet & greet and transfer to hotel.',
        meals: 'Dinner Included',
        overnightHotel: 'Amman Grand Palace Hotel (or similar)',
        activities: [
          { time: '06:00 PM', activity: 'Boarding Qatar Airways at NAIA Terminal 3', location: 'Manila' },
          { time: '11:30 PM', activity: 'Arrival at Amman Queen Alia Airport, Meet & Greet', location: 'Amman' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Petra – The Lost Rose-Red City & Wadi Rum Bubble Stargazing',
        description: 'Explore the Nabataean Lost City of Petra. Walk through the dramatic Siq to the Treasury (Al-Khazneh) on horseback. Transfer to magical Wadi Rum desert for a stay in luxury Martian Bubble Rooms.',
        meals: 'Breakfast, Lunch & Bedouin Feast Dinner',
        overnightHotel: 'Wadi Rum Luxury Bubble Camp',
        activities: [
          { time: '08:30 AM', activity: 'Visit Lost City of Petra & Horseback Ride through the Siq', location: 'Petra' },
          { time: '01:00 PM', activity: 'Authentic Jordanian Lunch at Basin Restaurant', location: 'Petra' },
          { time: '04:30 PM', activity: 'Transfer to Wadi Rum Desert & Sunset 4x4 Jeep Safari', location: 'Wadi Rum' },
          { time: '07:30 PM', activity: 'Bedouin Zarb Dinner under desert constellations', location: 'Wadi Rum Bubble Rooms' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Wadi Rum to Israel: Bridge Crossing, Nazareth & Mt. Tabor',
        description: 'Cross the border into the Holy Land of Israel. Ascend Mount Tabor, site of the Transfiguration of Jesus. Continue to Nazareth to venerate the Basilica of the Annunciation.',
        meals: 'Full Board (B / L / D)',
        overnightHotel: 'Nazareth Legacy Hotel',
        activities: [
          { time: '08:00 AM', activity: 'Proceed to Sheikh Hussein Bridge border crossing into Israel', location: 'Border' },
          { time: '11:30 AM', activity: 'Ascend Mt. Tabor & visit Church of Transfiguration', location: 'Mt. Tabor' },
          { time: '03:00 PM', activity: 'Visit Church of the Annunciation & St. Joseph Workshop', location: 'Nazareth' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Tiberias, Sea of Galilee, Capernaum & Jordan River',
        description: 'Vow renewal for couples at Cana Wedding Church. Ride a wooden Jesus Boat across the Sea of Galilee. Visit Mount of Beatitudes, Church of Multiplication of Loaves & Fishes, and renew baptismal vows in Jordan River (Yardenit).',
        meals: 'Full Board (B / St. Peter Fish Lunch / D)',
        overnightHotel: 'Resta Galilee Tiberias Hotel',
        activities: [
          { time: '08:00 AM', activity: 'Visit Church of the Wedding Feast in Cana (Marriage Vow Renewal)', location: 'Cana' },
          { time: '10:00 AM', activity: 'Holy Mass at Mount of Beatitudes', location: 'Sea of Galilee' },
          { time: '11:45 AM', activity: 'Church of Multiplication & Primacy of Peter (Mensa Christi)', location: 'Tabgha' },
          { time: '01:00 PM', activity: 'Traditional St. Peter\'s Fish Lunch by the Lake', location: 'Tiberias' },
          { time: '02:30 PM', activity: 'Jesus Boat Ride on the Sea of Galilee & Capernaum Synagogue', location: 'Capernaum' },
          { time: '04:30 PM', activity: 'Renewal of Baptismal Vows at Jordan River Yardenit', location: 'Jordan River' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Tiberias to Haifa, Caesarea, Mt. Carmel & Holy City Jerusalem',
        description: 'Travel along the Mediterranean coast. Marvel at Stella Maris Carmelite Monastery, Bahá\'í Gardens overlook, and Caesarea Maritima Roman Aqueduct. Triumphantly enter Jerusalem.',
        meals: 'Full Board (B / L / D)',
        overnightHotel: 'Jerusalem Gate Hotel / Dan Boutique',
        activities: [
          { time: '08:30 AM', activity: 'Travel to Mount Carmel & Stella Maris (Cave of Elijah)', location: 'Haifa' },
          { time: '10:30 AM', activity: 'Bahá\'í Terraces Overlook & Roman Aqueduct of Caesarea', location: 'Caesarea' },
          { time: '02:00 PM', activity: 'Ascend to Mount of Olives & Panoramic Blessing over Jerusalem', location: 'Jerusalem' },
          { time: '04:00 PM', activity: 'Visit Chapel of the Ascension & Pater Noster Church', location: 'Jerusalem' }
        ]
      },
      {
        dayNumber: 6,
        title: 'Jerusalem Old City & Bethlehem – The Nativity',
        description: 'Walk the Via Dolorosa carrying the cross to Church of the Holy Sepulchre and Golgotha. Touch the Western (Wailing) Wall. Journey to Bethlehem to touch the 14-point star in the Nativity Grotto.',
        meals: 'Full Board (B / L / D)',
        overnightHotel: 'Bethlehem Manger Square Hotel',
        activities: [
          { time: '08:00 AM', activity: 'Old City Jerusalem: Bethesda Pool & St. Anne Church', location: 'Jerusalem' },
          { time: '09:30 AM', activity: 'Pray the 14 Stations of the Cross along Via Dolorosa', location: 'Via Dolorosa' },
          { time: '11:30 AM', activity: 'Enter Church of the Holy Sepulchre (Calvary & Tomb of Christ)', location: 'Holy Sepulchre' },
          { time: '02:30 PM', activity: 'Wailing Wall & Mount Zion (Last Supper Room & King David Tomb)', location: 'Mt Zion' },
          { time: '04:30 PM', activity: 'Nativity Church & Shepherds Field in Bethlehem', location: 'Bethlehem' }
        ]
      },
      {
        dayNumber: 7,
        title: 'Mt. of Olives, Jericho, Dead Sea Float & Qumran',
        description: 'Venerate Garden of Gethsemane & Church of All Nations. Descend to Jericho, the oldest city in the world, with Mount of Temptation and Sycamore Tree of Zacchaeus. Float effortlessly on the mineral-rich Dead Sea.',
        meals: 'Full Board (B / L / D)',
        overnightHotel: 'Jerusalem / Bethlehem Hotel',
        activities: [
          { time: '08:00 AM', activity: 'Visit Garden of Gethsemane & Church of All Nations', location: 'Gethsemane' },
          { time: '10:30 AM', activity: 'Drive to ancient Jericho & see Zacchaeus Sycamore Tree', location: 'Jericho' },
          { time: '01:00 PM', activity: 'Dead Sea private beach swim & therapeutic mud bath float', location: 'Dead Sea' },
          { time: '03:30 PM', activity: 'Explore Qumran Caves (Discovery site of Dead Sea Scrolls)', location: 'Qumran' }
        ]
      },
      {
        dayNumber: 8,
        title: 'Bethlehem to Taba & Mount Sinai, Egypt',
        description: 'Depart through the Negev Desert towards the Red Sea. Cross the Taba Border into the Land of the Pharaohs (Egypt). Drive through rugged desert mountains to St. Catherine at the foot of Mount Sinai.',
        meals: 'Full Board (B / L / D)',
        overnightHotel: 'St. Catherine\'s Desert Resort, Sinai',
        activities: [
          { time: '07:30 AM', activity: 'Scenic drive across Negev Desert towards Eilat and Red Sea', location: 'Eilat' },
          { time: '11:00 AM', activity: 'Cross border into Egypt via Taba terminal', location: 'Taba Border' },
          { time: '03:30 PM', activity: 'Arrive at Saint Catherine (Site of Moses\' Burning Bush)', location: 'Mt. Sinai' }
        ]
      },
      {
        dayNumber: 9,
        title: 'Mount Sinai Sunrise, Burning Bush & Cairo via Suez Canal',
        description: 'Optional dawn climb of Mount Sinai where Moses received the Ten Commandments. Visit St. Catherine Monastery & the Burning Bush. Travel across the Sinai Peninsula through Ahmed Hamdi Suez Tunnel into Cairo.',
        meals: 'Full Board (B / L / D)',
        overnightHotel: 'Cairo Pyramids Steigenberger Hotel',
        activities: [
          { time: '02:00 AM', activity: 'Optional sunrise trek of Mount Sinai / Morning prayer', location: 'Mt. Sinai' },
          { time: '09:00 AM', activity: 'Tour St. Catherine Monastery, Moses Well & Burning Bush', location: 'Sinai' },
          { time: '11:30 AM', activity: 'Drive to Cairo across Suez Canal / Springs of Moses (Mara)', location: 'Suez' },
          { time: '06:30 PM', activity: 'Arrive in Cairo; Nile River Evening View', location: 'Cairo' }
        ]
      },
      {
        dayNumber: 10,
        title: 'Cairo – Great Pyramids of Giza, Sphinx & Coptic Cairo',
        description: 'Gaze upon the iconic Great Pyramids of Khufu, Khafre, and Menkaure alongside the Great Sphinx. Explore Old Coptic Cairo: Hanging Church, Church of St. Sergius (Holy Family crypt shelter), and Ben Ezra Synagogue.',
        meals: 'Full Board & Nile Dinner Cruise',
        overnightHotel: 'Cairo Pyramids Steigenberger Hotel',
        activities: [
          { time: '08:30 AM', activity: 'Explore the Great Pyramids of Giza & Great Sphinx of Giza', location: 'Giza Plateau' },
          { time: '12:30 PM', activity: 'Egyptian buffet lunch overlooking the pyramids', location: 'Giza' },
          { time: '02:30 PM', activity: 'Tour Coptic Cairo: The Hanging Church & St. George Church', location: 'Old Cairo' },
          { time: '07:00 PM', activity: 'Lavish Nile River Dinner Cruise with traditional folklore show', location: 'Nile River' }
        ]
      },
      {
        dayNumber: 11,
        title: 'National Egyptian Museum & Papyrus Institute',
        description: 'Marvel at King Tutankhamun\'s pure gold mask and treasures in the world-renowned Grand Egyptian Museum. Visit traditional Papyrus crafting workshop and Perfume Palace before airport transfer.',
        meals: 'Breakfast & Lunch',
        activities: [
          { time: '09:00 AM', activity: 'Guided tour of Grand Egyptian Museum antiquities', location: 'Cairo' },
          { time: '02:00 PM', activity: 'Visit Papyrus Institute & Khan el-Khalili Bazaar', location: 'Cairo' },
          { time: '07:00 PM', activity: 'Transfer to Cairo International Airport for flight home', location: 'Cairo Airport' }
        ]
      },
      {
        dayNumber: 12,
        title: 'Arrival in Manila, Philippines',
        description: 'Touch down at Ninoy Aquino International Airport (Manila) filled with profound spiritual memories, blessed certificates, and lifelong fellowship friendships.',
        meals: 'Meals on Board',
        activities: [
          { time: '04:30 PM', activity: 'Safe arrival at NAIA Manila with Holy Land Pilgrimage Certificate', location: 'Manila' }
        ]
      }
    ]
  },
  {
    id: 'pkg-danang-2026',
    code: 'PKG-VNM-DN01',
    title: 'Da Nang & Bana Hills Golden Bridge Charter Flight',
    subtitle: 'Direct Charter Flight Tour • Golden Giant Hands Bridge & French Village',
    destination: 'Da Nang & Hoi An, Vietnam',
    category: 'Grand Asia & Far East',
    durationDays: 5,
    durationNights: 4,
    pricePerPax: 38800,
    maxCapacity: 25,
    status: 'Active',
    featured: true,
    rating: 4.9,
    reviewCount: 35,
    bannerUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    airline: 'Direct Charter Flight (CEB/MNL to DAD)',
    departureDates: ['Aug 21 - 25, 2026', 'Sep 10 - 14, 2026'],
    specialFeatures: [
      'Direct Roundtrip Charter Flight with Baggage',
      'Walk on the Iconic Giant Stone Hands Golden Bridge',
      'Longest Single-Track Cable Car in the World to Ba Na Hills',
      'Hoi An Ancient Lantern Town Walking Tour'
    ],
    inclusions: [
      'Roundtrip Direct Charter Flight (Manila/Cebu to Da Nang)',
      'Check-in Baggage Allowance + 7kg Hand Carry',
      '4 Nights Hotel Accommodation (4-Star Danang Golden Bay or Stella Maris)',
      'Sun World Ba Na Hills Full Day Pass & Guinness World Record Cable Car',
      'Walkway Access to Golden Bridge Giant Stone Hands',
      'Full Board Delicious Vietnamese Buffet Meals',
      'Hoi An Ancient UNESCO Town Tour & Japanese Covered Bridge',
      'Marble Mountains & Linh Ung Pagoda (Giant Lady Buddha 67m)',
      'Dragon Bridge Fire & Water Breathing Spectacle',
      'Licensed English/Tagalog-speaking Tour Guide & Private Transfers',
      'All Environmental & Terminal Fees'
    ],
    exclusions: [
      'Philippine Travel Tax (₱1,620)',
      'Personal expenses & tipping (USD 5/day/pax)'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Da Nang – Son Tra & Giant Lady Buddha',
        description: 'Meet guide at Da Nang Airport. Visit Son Tra Peninsula, admire the 67-meter tall Lady Buddha overlooking the ocean, and cruise along My Khe Beach before hotel check-in.',
        meals: 'Dinner Included',
        overnightHotel: 'Danang Golden Bay Hotel or similar (4-Star)',
        activities: [
          { time: '10:00 AM', activity: 'Direct Charter Flight Landing in Da Nang International Airport', location: 'Da Nang' },
          { time: '02:00 PM', activity: 'Son Tra Peninsula & 67m Lady Buddha Statue', location: 'Son Tra' },
          { time: '04:30 PM', activity: 'Stroll along picturesque My Khe Beach & Check-in', location: 'My Khe' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Sun World Ba Na Hills & Walk on the Golden Bridge',
        description: 'Take the Guinness record-holding cable car up into the clouds. Walk the world-famous Golden Bridge held aloft by two colossal mossy stone hands. Explore French Village castles and Fantasy Park.',
        meals: 'Buffet Breakfast, Luxury Buffet Lunch, Dinner',
        overnightHotel: 'Danang Golden Bay Hotel or similar (4-Star)',
        activities: [
          { time: '08:30 AM', activity: 'Guinness Record Cable Car ride over waterfalls to Ba Na Hills', location: 'Ba Na Hills' },
          { time: '10:00 AM', activity: 'Walkway on Golden Hands Bridge (Cau Vang)', location: 'Golden Bridge' },
          { time: '12:30 PM', activity: 'Gourmet World Buffet Lunch at French Village', location: 'French Village' },
          { time: '03:30 PM', activity: 'Le Jardin D\'Amour Flower Gardens & Wine Cellar', location: 'Ba Na Hills' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Marble Mountains & Hoi An UNESCO Ancient Town',
        description: 'Explore natural caves and pagodas carved into Marble Mountains. In the afternoon, explore enchanting Hoi An ancient quarter lit with thousands of colorful silk lanterns.',
        meals: 'Breakfast, Lunch & Hoi An Specialty Dinner',
        overnightHotel: 'Danang Golden Bay Hotel or similar',
        activities: [
          { time: '09:00 AM', activity: 'Visit Marble Mountains & Non Nuoc Stone Carving Village', location: 'Marble Mountains' },
          { time: '02:00 PM', activity: 'Walking tour of Hoi An: Japanese Bridge, Tan Ky House', location: 'Hoi An' },
          { time: '06:00 PM', activity: 'Lantern boat ride on Hoai River & night lantern market', location: 'Hoi An' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Da Nang City Highlights & Han Market Shopping',
        description: 'Visit the famous Pink Church (Da Nang Cathedral), Cham Sculpture Museum, and hunt for souvenirs, coffee, and cashew nuts at Han Market.',
        meals: 'Breakfast, Lunch & Seafood Dinner',
        overnightHotel: 'Danang Golden Bay Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Photo stop at Pink Gothic Da Nang Cathedral', location: 'Da Nang' },
          { time: '11:00 AM', activity: 'Local specialty shopping at Han Market & Coffee Roastery', location: 'Han Market' },
          { time: '08:00 PM', activity: 'Witness the iconic Dragon Bridge Fire & Water show', location: 'Dragon Bridge' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Farewell Da Nang & Charter Return Flight',
        description: 'Enjoy a leisurely breakfast and beach walk before private transfer to Da Nang Airport for your return flight home.',
        meals: 'Breakfast',
        activities: [
          { time: '09:00 AM', activity: 'Hotel Check-out & final shopping stroll', location: 'Da Nang' },
          { time: '11:30 AM', activity: 'Airport Transfer for Charter Flight to Philippines', location: 'DAD Airport' }
        ]
      }
    ]
  },
  {
    id: 'pkg-korea-daebak',
    code: 'PKG-KOR-DB01',
    title: 'Daebak Korea: Autumn & Winter Magic',
    subtitle: 'Manila–Seoul 6D4N Tour • Gyeongbokgung, Nami Island & Starfield Library',
    destination: 'Seoul & Gangwon, South Korea',
    category: 'Grand Asia & Far East',
    durationDays: 6,
    durationNights: 4,
    pricePerPax: 42500,
    maxCapacity: 25,
    status: 'Active',
    featured: true,
    rating: 4.9,
    reviewCount: 48,
    bannerUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    airline: 'Cebu Pacific / Philippine Airlines (Direct MNL-ICN)',
    departureDates: ['Oct 08-13', 'Oct 15-20', 'Oct 22-27', 'Nov 12-17', 'Nov 19-24', 'Dec 03-08, 2026'],
    specialFeatures: [
      'Free Hanbok (Traditional Korean Dress) Rental Experience',
      'Nami Island Winter Sonata Golden Ginkgo & Maple Foliage',
      'Starfield Coex Library & Bukchon Hanok Village',
      'Everland Theme Park or Lotte World Adventure Ticket Option'
    ],
    inclusions: [
      'Roundtrip Airfare (Manila - Incheon) with 20kg Baggage',
      '4 Nights 4-Star Hotel Accommodation in Seoul/Gyeonggi',
      'Daily Hotel Breakfasts & Authentic Korean Gourmet Meals (Samgyeopsal, Dakgalbi, Ginseng Chicken Soup)',
      'Nami Island Ferry Cruise & Fairy Tale Grounds Entry',
      'Gyeongbokgung Palace with Hanbok Wearing Experience',
      'COEX Mall Starfield Library & Hongdae Youth Street',
      'Myeongdong Night Shopping District Free Time',
      'Korean Seaweed Museum with DIY Kimbap Making Lesson',
      'Licensed English-speaking Tour Guide & Private Coaster Coach'
    ],
    exclusions: [
      'Philippine Travel Tax (₱1,620)',
      'Korea Visa Processing Fee',
      'Personal expenses & guide tipping'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Manila to Incheon & Welcome to Seoul',
        description: 'Arrive at Incheon International Airport. Meet professional guide, transfer to Seoul, visit the dazzling Starfield Library at COEX Mall.',
        meals: 'Dinner Included',
        overnightHotel: 'Seoul 4-Star Hotel',
        activities: [
          { time: '11:00 AM', activity: 'Arrival at Incheon Airport (ICN) & Welcome Meet', location: 'Incheon' },
          { time: '02:30 PM', activity: 'COEX Mall Starfield Library Architectural Wonders', location: 'Gangnam' },
          { time: '06:00 PM', activity: 'Authentic Korean BBQ Samgyeopsal Welcome Dinner', location: 'Seoul' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Nami Island & Petite France / Italian Village',
        description: 'Ferry ride to picturesque Nami Island lined with majestic pine and ginkgo trees. Visit French fairy tale Petite France village.',
        meals: 'Breakfast, Chuncheon Dakgalbi Lunch, Dinner',
        overnightHotel: 'Seoul 4-Star Hotel',
        activities: [
          { time: '08:30 AM', activity: 'Scenic drive to Chuncheon & Ferry to Nami Island', location: 'Nami Island' },
          { time: '12:30 PM', activity: 'Famous Chuncheon Spicy Stir-fried Chicken (Dakgalbi)', location: 'Chuncheon' },
          { time: '02:30 PM', activity: 'Petite France & Pinocchio Italian Village', location: 'Gapyeong' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Gyeongbokgung Palace, Hanbok Dress & Bukchon Hanok',
        description: 'Dress in royal Hanbok attire to enter Gyeongbokgung Palace and watch the Royal Guard Changing Ceremony. Walk the historical alleys of Bukchon Hanok Village.',
        meals: 'Breakfast, Korean Ginseng Chicken (Samgyetang) Lunch, Dinner',
        overnightHotel: 'Seoul 4-Star Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Traditional Hanbok Dressing & Photoshoot', location: 'Gyeongbokgung' },
          { time: '10:30 AM', activity: 'Gyeongbokgung Palace & National Folk Museum', location: 'Palace' },
          { time: '02:00 PM', activity: 'Bukchon Hanok Village & Insadong Antique Street', location: 'Bukchon' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Everland Theme Park or Lotte World & K-Beauty Shopping',
        description: 'Full day thrill at Everland Theme Park (or Lotte World). Evening K-Cosmetics and Ginseng center discovery.',
        meals: 'Breakfast, Dinner',
        overnightHotel: 'Seoul 4-Star Hotel',
        activities: [
          { time: '09:30 AM', activity: 'Everland Theme Park: Safari World & T-Express Rollercoaster', location: 'Everland' },
          { time: '04:30 PM', activity: 'Korean Cosmetics & Red Pine Tree Discovery Experience', location: 'Seoul' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Kimbap Making, Seaweed Museum & Myeongdong Night Street',
        description: 'Experience making Korean Kimbap and wearing Korean Hanbok. Later explore the bustling street food alleys of Myeongdong and N Seoul Tower.',
        meals: 'Breakfast, Lunch, Street Food Exploration',
        overnightHotel: 'Seoul 4-Star Hotel',
        activities: [
          { time: '09:30 AM', activity: 'Seaweed Museum & DIY Kimbap Making Cooking Class', location: 'Seoul' },
          { time: '02:00 PM', activity: 'N Seoul Tower Love Lock Observatory view', location: 'Namsan' },
          { time: '05:00 PM', activity: 'Myeongdong Night Market & Street Food Safari', location: 'Myeongdong' }
        ]
      },
      {
        dayNumber: 6,
        title: 'Korean Grocery Souvenirs & Incheon Departure',
        description: 'Shop for Korean noodles, snacks, and skin products at Korean Local Supermarket before transferring to Incheon for flight home to Manila.',
        meals: 'Breakfast',
        activities: [
          { time: '09:30 AM', activity: 'Korean Local Food & Supermarket Souvenir Shopping', location: 'Incheon' },
          { time: '01:00 PM', activity: 'Transfer to Incheon International Airport & Flight Home', location: 'ICN Airport' }
        ]
      }
    ]
  },
  {
    id: 'pkg-thailand-legendary',
    code: 'PKG-THA-BK01',
    title: 'Legendary Thailand: Bangkok & Pattaya',
    subtitle: '4D3N Royal Palaces, Floating Market & Elephant Sanctuary',
    destination: 'Bangkok & Pattaya, Thailand',
    category: 'Grand Asia & Far East',
    durationDays: 4,
    durationNights: 3,
    pricePerPax: 28900,
    maxCapacity: 28,
    status: 'Active',
    featured: true,
    rating: 4.8,
    reviewCount: 39,
    bannerUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    airline: 'Thai Airways / Cebu Pacific',
    departureDates: ['Aug 20-23', 'Sep 03-06', 'Sep 17-20', 'Oct 15-18', 'Nov 12-15, 2026'],
    specialFeatures: [
      'Wat Arun Temple of Dawn Chao Phraya Ferry Ride',
      'Pattaya Floating Market & Great Herb Garden',
      'Nong Nooch Tropical Botanical Gardens & Elephant Cultural Show',
      'IconSiam Luxury Mall & Chaophraya Riverfront'
    ],
    inclusions: [
      'Roundtrip Airfare to Bangkok (BKK) with Baggage',
      '3 Nights 4-Star Hotel Stay (Pattaya & Bangkok Center)',
      'Daily Buffet Breakfasts & Gourmet Thai Lunches/Dinners',
      'Nong Nooch Tropical Garden & Elephant Cultural Performance',
      'Pattaya Floating Market Longtail Boat Experience',
      'Wat Arun (Temple of Dawn) Chao Phraya River Cruise',
      'IconSiam Waterfront & Erawan Shrine Blessing',
      'Private Air-conditioned Transport & English Tour Guide'
    ],
    exclusions: [
      'Philippine Travel Tax (₱1,620)',
      'Personal expenses & tipping (USD 5/day)'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Bangkok Arrival & Transfer to Vibrant Pattaya',
        description: 'Land at Bangkok Suvarnabhumi Airport. Travel to Pattaya, visit Pattaya Great Herb Garden and bustling night market.',
        meals: 'Dinner Included',
        overnightHotel: 'Pattaya 4-Star Beach Resort',
        activities: [
          { time: '10:00 AM', activity: 'Pick up at BKK Airport by licensed Thai guide', location: 'Bangkok' },
          { time: '02:00 PM', activity: 'Transfer to Pattaya & visit Great Herb Garden', location: 'Pattaya' },
          { time: '06:30 PM', activity: 'Pattaya Night Market & Seafood Dinner', location: 'Pattaya' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Nong Nooch Tropical Garden, Elephants & Floating Market',
        description: 'Marvel at French-inspired topiary gardens, traditional Thai dance, and elephant shows at Nong Nooch. Cruise through Pattaya Floating Market.',
        meals: 'Breakfast, Buffet Lunch, Dinner',
        overnightHotel: 'Pattaya 4-Star Beach Resort',
        activities: [
          { time: '08:30 AM', activity: 'Nong Nooch Tropical Botanical Garden & Elephant Show', location: 'Nong Nooch' },
          { time: '01:30 PM', activity: 'Pattaya Floating Market Longtail Boat ride', location: 'Floating Market' },
          { time: '04:00 PM', activity: 'Laser Buddha Mountain (Khao Chi Chan) visit', location: 'Pattaya' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Pattaya to Bangkok – Wat Arun & Chao Phraya River',
        description: 'Return to Bangkok. Board a cross-river ferry to marvel at the porcelain spires of Wat Arun. Shop at world-class IconSiam mall.',
        meals: 'Breakfast, Lunch, Dinner',
        overnightHotel: 'Bangkok 4-Star City Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Transfer from Pattaya to Bangkok City', location: 'Bangkok' },
          { time: '11:30 AM', activity: 'Chao Phraya River Ferry & Wat Arun (Temple of Dawn)', location: 'Wat Arun' },
          { time: '03:00 PM', activity: 'IconSiam Mall & Indoor SookSiam Floating Market', location: 'IconSiam' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Bangkok Souvenirs & Airport Departure',
        description: 'Leisurely morning for last-minute dried mango and Thai silk shopping before airport transfer.',
        meals: 'Breakfast',
        activities: [
          { time: '09:30 AM', activity: 'Local snack and dried fruit market shopping', location: 'Bangkok' },
          { time: '12:30 PM', activity: 'Transfer to Suvarnabhumi Airport for flight to Manila', location: 'BKK Airport' }
        ]
      }
    ]
  },
  {
    id: 'pkg-europe-ber-months',
    code: 'PKG-EUR-BER01',
    title: 'South Europe Grandeur: Switzerland, Italy, Vatican, Monaco & France',
    subtitle: '10 Days & 8 Nights Bus Tour • Lucerne, Rome, Paris, Monaco & Venice',
    destination: 'Switzerland, Italy, France & Monaco',
    category: 'European Grandeur',
    durationDays: 10,
    durationNights: 8,
    pricePerPax: 188000,
    maxCapacity: 22,
    status: 'Active',
    featured: true,
    rating: 5.0,
    reviewCount: 31,
    bannerUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    airline: 'Emirates / Qatar Airways (Economy Class Roundtrip)',
    departureDates: ['Sep 15 - 24, 2026', 'Oct 10 - 19, 2026', 'Nov 05 - 14, 2026'],
    specialFeatures: [
      'Roundtrip Intercontinental Flights with 30kg Baggage Allowance',
      '10 Days & 8 Nights Luxury Hotel Stays (4-Star Central)',
      'Lake Lucerne Lion Monument & Swiss Alps Panorama',
      'Colosseum of Rome, Vatican St. Peter\'s Basilica & Eiffel Tower Paris'
    ],
    inclusions: [
      'Roundtrip Economy Class Airfare via 5-Star Airline',
      '30kg Check-in Baggage + 7kg Cabin Baggage Allowance',
      '8 Nights 4-Star Hotel Accommodation (Rome, Venice, Lucerne, Paris)',
      'Private Luxury Long-distance Air-conditioned Touring Motorcoach',
      'Daily European Buffet Breakfasts & Selected Dinners',
      'Colosseum Exterior & Roman Forum Guided Walking Tour',
      'Vatican City & St. Peter\'s Square Exploration',
      'Venice Island Vaporetto Boat Ride & St. Mark\'s Square',
      'Lucerne Chapel Bridge & Lion Monument Lake Stroll',
      'Paris City Tour: Eiffel Tower, Arc de Triomphe & Seine River',
      'English-speaking Licensed European Tour Manager & Filipino Tour Escort'
    ],
    exclusions: [
      'Schengen Visa Processing & Embassy Fees',
      'Airline Tax & Philippine Travel Tax (₱1,620)',
      'Mandatory Driver & Tour Guide Gratuity (€10/day/pax)'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Manila to Rome, Italy',
        description: 'Board intercontinental flight from Manila to Rome Fiumicino Airport. Relax with in-flight dining and entertainment.',
        meals: 'In-Flight Meals',
        overnightHotel: 'Rome 4-Star Hotel',
        activities: [
          { time: '08:00 PM', activity: 'Departure from NAIA Manila Terminal', location: 'Manila' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Arrival in Eternal City Rome & Colosseum',
        description: 'Touchdown in Rome. Meet tour director and explore the Colosseum, Roman Forum, Trevi Fountain, and Spanish Steps.',
        meals: 'Welcome Italian Dinner',
        overnightHotel: 'Grand Hotel Fleming Rome (or similar)',
        activities: [
          { time: '10:00 AM', activity: 'Arrival in Rome Fiumicino Airport (FCO)', location: 'Rome' },
          { time: '02:00 PM', activity: 'Colosseum exterior, Arch of Constantine & Roman Forum', location: 'Colosseum' },
          { time: '05:00 PM', activity: 'Toss a coin in Trevi Fountain & Spanish Steps walk', location: 'Trevi' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Vatican City, St. Peter\'s Basilica & Transfer to Florence',
        description: 'Venerate the heart of Catholicism in Vatican City. Gaze upon St. Peter\'s Basilica before driving through Tuscan hills to Florence.',
        meals: 'Breakfast, Dinner',
        overnightHotel: 'Florence / Montecatini Hotel',
        activities: [
          { time: '08:30 AM', activity: 'Vatican City & St. Peter\'s Square & Basilica tour', location: 'Vatican' },
          { time: '01:30 PM', activity: 'Scenic drive through Tuscany towards Renaissance Florence', location: 'Tuscany' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Florence Duomo to Floating City of Venice',
        description: 'Explore Santa Maria del Fiore Duomo in Florence. Continue to Venice, board private motorboat to St. Mark\'s Square, see Bridge of Sighs.',
        meals: 'Breakfast, Authentic Venetian Dinner',
        overnightHotel: 'Venice Mestre 4-Star Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Florence Walking Tour: Piazza del Duomo & Ponte Vecchio', location: 'Florence' },
          { time: '02:00 PM', activity: 'Private Vaporetto boat transfer into Venice Canal', location: 'Venice' },
          { time: '04:00 PM', activity: 'St. Mark\'s Basilica, Doge\'s Palace & Gondola views', location: 'Piazza San Marco' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Venice to Lake Lucerne, Switzerland',
        description: 'Cross the Alps into picturesque Switzerland. Arrive in fairytale Lucerne nestled beside Lake Lucerne beneath Mount Pilatus.',
        meals: 'Breakfast, Swiss Dinner',
        overnightHotel: 'Lucerne 4-Star Swiss Hotel',
        activities: [
          { time: '08:00 AM', activity: 'Scenic drive across Italian lakes into Swiss Alps', location: 'Alps' },
          { time: '03:00 PM', activity: 'Visit the world-famous carved Dying Lion of Lucerne', location: 'Lucerne' },
          { time: '04:30 PM', activity: 'Walk across medieval wooden Chapel Bridge (Kapellbrücke)', location: 'Lucerne' }
        ]
      },
      {
        dayNumber: 6,
        title: 'Swiss Alps Panorama & Transfer to France',
        description: 'Enjoy free time for Swiss chocolate and luxury watches in Lucerne. Travel past Swiss meadows towards the French border.',
        meals: 'Breakfast, French Dinner',
        overnightHotel: 'Alsace / Dijon 4-Star Hotel',
        activities: [
          { time: '09:30 AM', activity: 'Swiss Chocolate Tasting & Lake Lucerne promenade', location: 'Lucerne' },
          { time: '01:30 PM', activity: 'Cross into France through rolling vineyards and castles', location: 'France' }
        ]
      },
      {
        dayNumber: 7,
        title: 'Arrive in Paris – The City of Light',
        description: 'Arrive in glorious Paris. Drive down Champs-Élysées, admire Arc de Triomphe, and behold the iconic Eiffel Tower.',
        meals: 'Breakfast, French Bistro Dinner',
        overnightHotel: 'Paris 4-Star Hotel (Pullman or Novotel)',
        activities: [
          { time: '11:00 AM', activity: 'Arrival in Paris & Champs-Élysées Boulevard stroll', location: 'Paris' },
          { time: '02:30 PM', activity: 'Eiffel Tower photo stop from Champ de Mars gardens', location: 'Eiffel Tower' },
          { time: '05:30 PM', activity: 'Arc de Triomphe & Place de la Concorde', location: 'Paris' }
        ]
      },
      {
        dayNumber: 8,
        title: 'Louvre Museum, Notre-Dame & Seine River Cruise',
        description: 'Marvel at the glass pyramid of the Louvre Museum. View Notre-Dame Cathedral and enjoy an enchanting cruise along the Seine River.',
        meals: 'Breakfast, Dinner',
        overnightHotel: 'Paris 4-Star Hotel',
        activities: [
          { time: '09:30 AM', activity: 'Louvre Palace courtyard and Tuileries Gardens', location: 'Louvre' },
          { time: '02:00 PM', activity: 'Notre-Dame Cathedral exterior on Île de la Cité', location: 'Notre Dame' },
          { time: '07:00 PM', activity: 'Bateaux-Mouches evening river cruise on the River Seine', location: 'Seine River' }
        ]
      },
      {
        dayNumber: 9,
        title: 'Paris Galeries Lafayette Shopping & Departure Flight',
        description: 'Last-minute luxury shopping at Galeries Lafayette department store before boarding flight back to Manila.',
        meals: 'Breakfast',
        activities: [
          { time: '10:00 AM', activity: 'Shopping at Galeries Lafayette Paris Haussmann', location: 'Paris' },
          { time: '03:00 PM', activity: 'Transfer to Paris Charles de Gaulle Airport (CDG)', location: 'CDG Airport' }
        ]
      },
      {
        dayNumber: 10,
        title: 'Safe Arrival in Manila, Philippines',
        description: 'Land safely at NAIA Manila, carrying unforgettable memories across five European nations.',
        meals: 'In-Flight Meals',
        activities: [
          { time: '06:00 PM', activity: 'Touchdown in NAIA Manila Terminal', location: 'Manila' }
        ]
      }
    ]
  },
  {
    id: 'pkg-canton-zhuhai',
    code: 'PKG-CHN-CZ01',
    title: 'Canton & Zhuhai: Chimelong Ocean Kingdom',
    subtitle: '5D4N Whale Sharks, Canton Tower & Sun Yat-sen Memorial',
    destination: 'Guangzhou & Zhuhai, China',
    category: 'Grand Asia & Far East',
    durationDays: 5,
    durationNights: 4,
    pricePerPax: 34500,
    maxCapacity: 25,
    status: 'Active',
    featured: false,
    rating: 4.8,
    reviewCount: 27,
    bannerUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    airline: 'China Southern Airlines (Direct Flights)',
    departureDates: ['Aug 27-31', 'Sep 10-14', 'Sep 17-21, 2026'],
    specialFeatures: [
      'Chimelong Ocean Kingdom Full Day Pass (World\'s Largest Aquarium)',
      'Watch Beluga Whales, Whale Sharks & Polar Bears',
      'Canton Tower (Iconic 600m Twisted Tower)',
      'Zhuhai Fisher Girl & Lovers\' Road Coastal Stroll'
    ],
    inclusions: [
      'Roundtrip Airfare to Guangzhou/Macau with 20kg Baggage',
      '4 Nights 4-5 Star Hotel Accommodation (Zhuhai & Guangzhou)',
      'Chimelong Ocean Kingdom 1-Day Ticket with Rides & Shows',
      'Daily Buffet Breakfasts, Authentic Cantonese Dim Sum & Roast Goose',
      'Zhuhai Fisher Girl Statue, Sun Yat-sen Memorial Hall & New Yuan Ming Palace',
      'Beijing Road Pedestrian Street & Pearl River Night Promenade',
      'Private Touring Bus & Bilingual English Tour Guide'
    ],
    exclusions: [
      'China Visa Processing',
      'Philippine Travel Tax (₱1,620)',
      'Personal expenses & tipping'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Canton (Guangzhou) – Transfer to Coastal Zhuhai',
        description: 'Arrive at Guangzhou Baiyun Airport. Meet guide and transfer via express highway to coastal Zhuhai.',
        meals: 'Dinner Included',
        overnightHotel: 'Zhuhai 4-Star Resort Hotel',
        activities: [
          { time: '11:00 AM', activity: 'Flight arrival in Guangzhou (CAN)', location: 'Guangzhou' },
          { time: '03:00 PM', activity: 'Scenic drive to romantic Zhuhai Coastal City', location: 'Zhuhai' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Chimelong Ocean Kingdom – Record-Breaking Wonder',
        description: 'Full day at Chimelong Ocean Kingdom. Walk through the Whale Shark dome aquarium, ride the Polar Coaster, and watch the evening fireworks spectacle.',
        meals: 'Breakfast, Ocean Kingdom Dining Coupon, Dinner',
        overnightHotel: 'Zhuhai 4-Star Resort Hotel',
        activities: [
          { time: '09:30 AM', activity: 'Enter Chimelong Ocean Kingdom & Whale Shark Aquarium', location: 'Chimelong' },
          { time: '02:00 PM', activity: 'Beluga Whale Theatre & Penguin Pavilion', location: 'Chimelong' },
          { time: '07:30 PM', activity: 'Grand Ocean Fireworks & Drone Musical Finale', location: 'Chimelong' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Zhuhai City Highlights & New Yuan Ming Palace',
        description: 'Stroll along famous Lovers\' Road, photograph the iconic Zhuhai Fisher Girl statue, and tour the regal New Yuan Ming Imperial Palace.',
        meals: 'Breakfast, Dim Sum Lunch, Dinner',
        overnightHotel: 'Zhuhai Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Lovers\' Road walk & Zhuhai Fisher Girl landmark', location: 'Zhuhai Coast' },
          { time: '11:30 AM', activity: 'Zhuhai Grand Theatre (Double Scallop Building)', location: 'Zhuhai' },
          { time: '02:30 PM', activity: 'Explore imperial courtyards of New Yuan Ming Palace', location: 'Zhuhai' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Transfer to Guangzhou – Canton Tower & Beijing Road',
        description: 'Travel back to Guangzhou. Photograph the twisted 600m Canton Tower, explore Chen Clan Ancestral Hall, and shop on lively Beijing Road.',
        meals: 'Breakfast, Lunch, Farewell Cantonese Banquet',
        overnightHotel: 'Guangzhou Landmark 4-Star Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Transfer to Guangzhou provincial capital', location: 'Guangzhou' },
          { time: '01:30 PM', activity: 'Canton Tower exterior & Haixinsha Asian Games Park', location: 'Canton Tower' },
          { time: '05:00 PM', activity: 'Beijing Road Pedestrian Street shopping & food', location: 'Beijing Road' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Guangzhou Souvenirs & Flight Departure',
        description: 'Final morning dim sum breakfast before transfer to Baiyun International Airport for flight home.',
        meals: 'Dim Sum Breakfast',
        activities: [
          { time: '09:00 AM', activity: 'Traditional Cantonese Morning Tea & Dim Sum', location: 'Guangzhou' },
          { time: '12:00 PM', activity: 'Transfer to Guangzhou Baiyun Airport for departure', location: 'CAN Airport' }
        ]
      }
    ]
  },
  {
    id: 'pkg-chengdu-chongqing',
    code: 'PKG-CHN-CD01',
    title: 'Chengdu & Chongqing: Pandas & Cyberpunk Skyline',
    subtitle: '5D4N Giant Panda Sanctuary, Hongyadong & Mountain Metro',
    destination: 'Chengdu & Chongqing, China',
    category: 'Grand Asia & Far East',
    durationDays: 5,
    durationNights: 4,
    pricePerPax: 37900,
    maxCapacity: 25,
    status: 'Active',
    featured: false,
    rating: 4.9,
    reviewCount: 33,
    bannerUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    airline: 'Sichuan Airlines / Air China',
    departureDates: ['Jun 23-27', 'Jul 02-06', 'Jul 09-13', 'Jul 16-20', 'Jul 23-27, 2026'],
    specialFeatures: [
      'Chengdu Giant Panda Breeding Research Base',
      'Chongqing Mountain Monorail riding straight through residential building (Liziba Station)',
      'Hongyadong 11-Story Glowing River Cliffside Palace',
      'Authentic World-Record Hotpot Dining Experience'
    ],
    inclusions: [
      'Roundtrip Airfare to Chengdu/Chongqing with Baggage',
      '4 Nights 4-Star Hotel Accommodation (Chongqing & Chengdu)',
      'Bullet Train transfer between Chongqing and Chengdu',
      'Giant Panda Research Base Admission & Guided Tour',
      'Liziba Station Monorail Experience & Kuixing Building skywalk',
      'Hongyadong Night Palace & Two Rivers Cruise Tour',
      'All Daily Meals including authentic Sichuan Banquet & Mild Hotpot',
      'Private luxury motorcoach & licensed English tour guide'
    ],
    exclusions: [
      'China Visa Processing',
      'Philippine Travel Tax (₱1,620)',
      'Personal expenses & tipping'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Cyberpunk Mountain City Chongqing',
        description: 'Arrive at Chongqing Jiangbei Airport. Check into hotel and marvel at the 3D multi-level neon metropolis.',
        meals: 'Dinner Included',
        overnightHotel: 'Chongqing 4-Star Hotel',
        activities: [
          { time: '11:00 AM', activity: 'Meet guide at Chongqing Jiangbei Airport', location: 'Chongqing' },
          { time: '03:00 PM', activity: 'Explore Ciqikou Ancient Porcelain Town', location: 'Ciqikou' },
          { time: '06:00 PM', activity: 'Dine at the world\'s largest Hot Pot restaurant (Pipa Yuan)', location: 'Chongqing' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Chongqing Liziba Train, Kuixing Building & Hongyadong',
        description: 'Witness the train passing directly through the 8th floor of an apartment at Liziba Station. In the evening, visit the dazzling illuminated cliffside palace of Hongyadong.',
        meals: 'Breakfast, Lunch, Dinner',
        overnightHotel: 'Chongqing 4-Star Hotel',
        activities: [
          { time: '09:00 AM', activity: 'Ride & photograph Liziba Monorail passing through building', location: 'Liziba Station' },
          { time: '11:30 AM', activity: 'Kuixing Building 22nd-floor ground plaza optical illusion', location: 'Yuzhong' },
          { time: '07:30 PM', activity: 'Illuminated night view of Hongyadong & Two Rivers cruise', location: 'Hongyadong' }
        ]
      },
      {
        dayNumber: 3,
        title: 'High-Speed Bullet Train to Chengdu & Jinli Street',
        description: 'Board China\'s ultra-modern high-speed bullet train across Sichuan basin to Chengdu. Explore historic Jinli Ancient Street with sugar-painting and street skewers.',
        meals: 'Breakfast, Sichuan Banquet Lunch, Dinner',
        overnightHotel: 'Chengdu 4-Star Hotel',
        activities: [
          { time: '08:30 AM', activity: 'Board High-speed Fuxing Bullet Train to Chengdu', location: 'Train Station' },
          { time: '11:00 AM', activity: 'Arrive in Chengdu & visit People\'s Park Teahouse culture', location: 'Chengdu' },
          { time: '03:00 PM', activity: 'Stroll ancient lantern-lined Jinli Street', location: 'Jinli Street' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Chengdu Giant Panda Research Sanctuary & Chunxi Road',
        description: 'Visit the world-famous Chengdu Research Base of Giant Panda Breeding. Watch cute giant pandas and playful red pandas munching fresh bamboo. Afternoon shopping at IFS Panda rooftop.',
        meals: 'Breakfast, Lunch, Dinner',
        overnightHotel: 'Chengdu 4-Star Hotel',
        activities: [
          { time: '08:00 AM', activity: 'Morning visit to Chengdu Giant Panda Research Base', location: 'Panda Base' },
          { time: '01:30 PM', activity: 'Chunxi Road shopping & Giant Climbing Panda at IFS', location: 'Chunxi Road' },
          { time: '06:00 PM', activity: 'Farewell Sichuan Dinner & Face-Changing Opera option', location: 'Chengdu' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Chengdu Airport Departure',
        description: 'Leisurely breakfast before transferring to Chengdu Tianfu International Airport for departure flight home.',
        meals: 'Breakfast',
        activities: [
          { time: '09:00 AM', activity: 'Last souvenir shopping for panda keepsakes & tea', location: 'Chengdu' },
          { time: '12:00 PM', activity: 'Transfer to Chengdu Tianfu Airport for flight home', location: 'TFU Airport' }
        ]
      }
    ]
  }
];
