export interface AirlineDirectoryOption {
  id: string;
  name: string;
  iataCode?: string;
  defaultFlightNumber?: string;
  hubTerminal?: string;
  popularRoutes?: string[];
  baggageAllowance?: string;
  cabinClass?: string;
}

export interface HotelDirectoryOption {
  id: string;
  name: string;
  stars?: number;
  defaultRoomType?: string;
  location?: string;
  contactPhone?: string;
  inclusions?: string;
}

export interface ShuttleDirectoryOption {
  id: string;
  vehicleType: string;
  operator: string;
  capacity?: string;
  defaultPickup?: string;
  defaultDropoff?: string;
  driverName?: string;
  driverContact?: string;
  plateNumber?: string;
}

export interface CountryLogisticsData {
  countryId: string;
  countryName: string;
  flag: string;
  popularDestinations: string[];
  airlines: AirlineDirectoryOption[];
  hotels: HotelDirectoryOption[];
  shuttles: ShuttleDirectoryOption[];
}

export const COUNTRY_LOGISTICS_DIRECTORY: CountryLogisticsData[] = [
  {
    countryId: 'philippines',
    countryName: 'Philippines (Domestic)',
    flag: '🇵🇭',
    popularDestinations: ['Palawan', 'El Nido', 'Coron', 'Puerto Princesa', 'Boracay', 'Batanes', 'Cebu', 'Bohol', 'Panglao', 'Siargao', 'Davao', 'Iloilo', 'Baguio', 'Manila'],
    airlines: [
      {
        id: 'pal',
        name: 'Philippine Airlines (PAL Flag Carrier)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-2196',
        hubTerminal: 'NAIA Terminal 2 (Manila Domestic)',
        baggageAllowance: '20kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Prime',
        popularRoutes: [
          'MNL (Manila NAIA T2) ➔ ENI (El Nido Lio Airport)',
          'MNL (Manila NAIA T2) ➔ MPH (Caticlan Boracay)',
          'MNL (Manila NAIA T2) ➔ CEB (Mactan Cebu T1)',
          'MNL (Manila NAIA T2) ➔ BSO (Basco Batanes)',
          'MNL (Manila NAIA T2) ➔ IAO (Siargao Sayak)',
          'MNL (Manila NAIA T2) ➔ TAG (Panglao Bohol)'
        ]
      },
      {
        id: 'pal-express',
        name: 'PAL Express',
        iataCode: '2P',
        defaultFlightNumber: '2P-2041',
        hubTerminal: 'NAIA Terminal 2 Domestic',
        baggageAllowance: '20kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Flex',
        popularRoutes: [
          'MNL (NAIA T2) ➔ USU (Coron Busuanga)',
          'MNL (NAIA T2) ➔ PPS (Puerto Princesa)',
          'MNL (NAIA T2) ➔ DVO (Davao Francisco Bangoy)'
        ]
      },
      {
        id: 'cebupacific',
        name: 'Cebu Pacific Air',
        iataCode: '5J',
        defaultFlightNumber: '5J-895',
        hubTerminal: 'NAIA Terminal 3 (Manila)',
        baggageAllowance: '20kg Prepaid Check-in + 7kg Carry-on',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ MPH (Caticlan Boracay)',
          'MNL (NAIA T3) ➔ CEB (Cebu Mactan)',
          'MNL (NAIA T3) ➔ PPS (Puerto Princesa)',
          'MNL (NAIA T3) ➔ ILO (Iloilo Airport)'
        ]
      },
      {
        id: 'airswift',
        name: 'AirSWIFT Express',
        iataCode: 'T4',
        defaultFlightNumber: 'T4-502',
        hubTerminal: 'NAIA Terminal 4 / Lio Airport',
        baggageAllowance: '10kg Check-in + 7kg Carry-on',
        cabinClass: 'Island Commuter Class',
        popularRoutes: [
          'MNL (NAIA T4) ➔ ENI (El Nido Lio Airport)',
          'CEB (Mactan T1) ➔ ENI (El Nido Lio Airport)',
          'CRK (Clark) ➔ ENI (El Nido Lio Airport)'
        ]
      },
      {
        id: 'airasia-ph',
        name: 'AirAsia Philippines',
        iataCode: 'Z2',
        defaultFlightNumber: 'Z2-773',
        hubTerminal: 'NAIA Terminal 2 Domestic',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Promo Saver',
        popularRoutes: [
          'MNL (NAIA T2) ➔ TAG (Bohol-Panglao)',
          'MNL (NAIA T2) ➔ CEB (Cebu Mactan)',
          'MNL (NAIA T2) ➔ DVO (Davao)'
        ]
      },
      {
        id: 'sunlight-air',
        name: 'Sunlight Air',
        iataCode: '2R',
        defaultFlightNumber: '2R-601',
        hubTerminal: 'Clark International Terminal (CRK)',
        baggageAllowance: '15kg Check-in + 7kg Carry-on',
        cabinClass: 'Boutique Tourist Class',
        popularRoutes: [
          'CRK (Clark) ➔ USU (Busuanga Coron)',
          'MNL ➔ IAO (Siargao Island)'
        ]
      }
    ],
    hotels: [
      {
        id: 'elnido-resort',
        name: 'El Nido Beachfront Eco-Resort & Spa',
        stars: 5,
        defaultRoomType: 'Deluxe Seaview Villa with Private Balcony',
        location: 'Bacuit Bay Coastal Boulevard, El Nido, Palawan',
        contactPhone: '+63 917 888 2026',
        inclusions: 'Daily Island Gourmet Breakfast Buffet, Welcome Tropical Juice, Sunset Lounge Access'
      },
      {
        id: 'henann-boracay',
        name: 'Henann Palm Beach Resort Boracay',
        stars: 5,
        defaultRoomType: 'Premier Room with Direct Pool Access',
        location: 'Station 2 Beachfront, Boracay Island, Malay, Aklan',
        contactPhone: '+63 36 288 1200',
        inclusions: 'Buffet Breakfast for 2, Welcome Drink, Beach Towels, Free Pool Access'
      },
      {
        id: 'fundacion-pacita',
        name: 'Fundacion Pacita Batanes Nature Lodge',
        stars: 4,
        defaultRoomType: 'Traditional Ivatan Stone Suite (Ocean Terrace)',
        location: 'Chanarian Hills, Basco, Batanes',
        contactPhone: '+63 927 290 2400',
        inclusions: 'Organic Farm-to-Table Breakfast, Ivatan Welcome Lei, Coffee & Tea Service'
      },
      {
        id: 'bluewater-maribago',
        name: 'Bluewater Maribago Beach Resort',
        stars: 4,
        defaultRoomType: 'Amuma Spa Deluxe Suite',
        location: 'Buyong, Maribago, Mactan Island, Cebu',
        contactPhone: '+63 32 402 4100',
        inclusions: 'Buffet Breakfast for 2, Free Lagoon Pool Use, Fitness Gym Pass'
      },
      {
        id: 'amorita-panglao',
        name: 'Amorita Resort Panglao',
        stars: 5,
        defaultRoomType: 'Ocean Cliff Deluxe Suite',
        location: 'Alona Beach Cliff, Panglao Island, Bohol',
        contactPhone: '+63 38 502 9002',
        inclusions: 'Gourmet Breakfast at Saffron Restaurant, Afternoon Tea Service, Yoga Session'
      },
      {
        id: 'nay-palad-siargao',
        name: 'Nay Palad Hideaway Siargao',
        stars: 5,
        defaultRoomType: 'Luxury Coconut Grove Villa',
        location: 'General Luna Beachfront, Siargao Island, Surigao del Norte',
        contactPhone: '+63 917 701 7840',
        inclusions: 'All-Inclusive Farm-to-Table Dining, Surf Board Access, Island Massage'
      },
      {
        id: 'manila-hotel',
        name: 'The Manila Hotel (Heritage Landmark)',
        stars: 5,
        defaultRoomType: 'Grand Deluxe Superior Suite',
        location: 'One Rizal Park, Ermita, Manila',
        contactPhone: '+63 2 8527 0011',
        inclusions: 'Café Ilang-Ilang Gourmet Breakfast Buffet, Welcome Macarons, Pool & Sauna'
      }
    ],
    shuttles: [
      {
        id: 'hiace-grandia-vip',
        vehicleType: 'Toyota HiAce GL Grandia (VIP Air-Conditioned Van)',
        operator: 'Holiday Travelers Philippines Fleet Command',
        capacity: '10-12 Passengers',
        defaultPickup: 'Airport Arrival Bay / Domestic Terminal Exit',
        defaultDropoff: 'Resort Main Lobby Entrance',
        driverName: 'Kuya Ronald Mendoza (DOT Accredited)',
        driverContact: '+63 928 333 4444',
        plateNumber: 'NAA-8842'
      },
      {
        id: 'coaster-van',
        vehicleType: 'Toyota Coaster 29-Seater Executive Tourist Coach',
        operator: 'Archipelago Express Logistics Partner',
        capacity: '24-29 Passengers',
        defaultPickup: 'Airport VIP Coach Parking Bay',
        defaultDropoff: 'Partner Hotel Entrance',
        driverName: 'Kuya Jojo Santos',
        driverContact: '+63 919 444 5555',
        plateNumber: 'ABY-4921'
      },
      {
        id: 'alphard-executive',
        vehicleType: 'Toyota Alphard Luxury Chauffeur Van',
        operator: 'Holiday Travelers Black Label VIP Logistics',
        capacity: '6 VIP Passengers (Captain Seats)',
        defaultPickup: 'Airport VIP Arrival Gate',
        defaultDropoff: 'Private Villa / 5-Star Resort Porch',
        driverName: 'Sir Dennis Bautista',
        driverContact: '+63 917 555 7799',
        plateNumber: 'VIP-7788'
      },
      {
        id: 'staria-tourist',
        vehicleType: 'Hyundai Staria 11-Seater Deluxe Shuttle',
        operator: 'Metro & Regional Airport Shuttle Services',
        capacity: '8-10 Passengers + Luggage',
        defaultPickup: 'Terminal Arrival Curbside',
        defaultDropoff: 'Hotel Lobby Front Desk',
        driverName: 'Tatay Edward Castillejos',
        driverContact: '+63 920 888 1122',
        plateNumber: 'IVT-2026'
      }
    ]
  },
  {
    countryId: 'japan',
    countryName: 'Japan',
    flag: '🇯🇵',
    popularDestinations: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Sapporo', 'Fukuoka', 'Okinawa', 'Nagoya', 'Hiroshima', 'Mount Fuji'],
    airlines: [
      {
        id: 'jal',
        name: 'Japan Airlines (JAL)',
        iataCode: 'JL',
        defaultFlightNumber: 'JL-78',
        hubTerminal: 'Tokyo Haneda (HND) / Narita (NRT) T2',
        baggageAllowance: '2x 23kg Check-in + 10kg Carry-on',
        cabinClass: 'Economy Sky Premium',
        popularRoutes: [
          'MNL (Manila NAIA T1) ➔ HND (Tokyo Haneda T3)',
          'MNL (Manila NAIA T1) ➔ NRT (Tokyo Narita T2)',
          'MNL (Manila NAIA T1) ➔ KIX (Osaka Kansai T1)'
        ]
      },
      {
        id: 'ana',
        name: 'All Nippon Airways (ANA)',
        iataCode: 'NH',
        defaultFlightNumber: 'NH-870',
        hubTerminal: 'Tokyo Haneda (HND) T2/T3 / Narita (NRT) T1',
        baggageAllowance: '2x 23kg Check-in + 10kg Carry-on',
        cabinClass: 'Inspiration of Japan Economy',
        popularRoutes: [
          'MNL (NAIA T3) ➔ HND (Tokyo Haneda)',
          'MNL (NAIA T3) ➔ NRT (Tokyo Narita)'
        ]
      },
      {
        id: 'ph-airlines-japan',
        name: 'Philippine Airlines (Japan Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-428',
        hubTerminal: 'NAIA Terminal 2 / Narita T2',
        baggageAllowance: '2x 23kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: [
          'MNL (NAIA T2) ➔ NRT (Tokyo Narita T2)',
          'MNL (NAIA T2) ➔ HND (Tokyo Haneda)',
          'MNL (NAIA T2) ➔ KIX (Osaka Kansai T1)',
          'MNL (NAIA T2) ➔ FUK (Fukuoka T1)'
        ]
      },
      {
        id: 'zipair',
        name: 'ZIPAIR Tokyo',
        iataCode: 'ZG',
        defaultFlightNumber: 'ZG-96',
        hubTerminal: 'Tokyo Narita Terminal 1',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Standard Value Class',
        popularRoutes: ['MNL (NAIA T1) ➔ NRT (Tokyo Narita T1)']
      },
      {
        id: 'cebupac-japan',
        name: 'Cebu Pacific Air (Japan Routes)',
        iataCode: '5J',
        defaultFlightNumber: '5J-5054',
        hubTerminal: 'NAIA Terminal 3',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ NRT (Tokyo Narita T2)',
          'MNL (NAIA T3) ➔ KIX (Osaka Kansai T1)',
          'MNL (NAIA T3) ➔ NGO (Nagoya Chubu Centrair)'
        ]
      }
    ],
    hotels: [
      {
        id: 'keio-plaza-tokyo',
        name: 'Keio Plaza Hotel Tokyo Premier Grand',
        stars: 5,
        defaultRoomType: 'Superior King Room with Shinjuku Skyline View',
        location: '2-2-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo',
        contactPhone: '+81 3-3344-0111',
        inclusions: 'Daily Japanese & Continental Buffet Breakfast, Club Lounge Beverage Pass'
      },
      {
        id: 'gracery-shinjuku',
        name: 'Hotel Gracery Shinjuku (Godzilla Head)',
        stars: 4,
        defaultRoomType: 'Comfort Double City View Room',
        location: '1-19-1 Kabukicho, Shinjuku-ku, Tokyo',
        contactPhone: '+81 3-6833-1111',
        inclusions: 'Breakfast Buffet, Godzilla Terrace Pass, Complimentary High-Speed Wi-Fi'
      },
      {
        id: 'swissotel-osaka',
        name: 'Swissôtel Nankai Osaka',
        stars: 5,
        defaultRoomType: 'Advantage Double Room with Namba Skyline View',
        location: '5-1-60 Namba, Chuo-ku, Osaka',
        contactPhone: '+81 6-6646-1111',
        inclusions: 'Table36 Rooftop Buffet Breakfast, Direct Namba Station Access, Spa Entry'
      },
      {
        id: 'kyoto-century-hotel',
        name: 'Kyoto Century Hotel',
        stars: 4,
        defaultRoomType: 'Grand Comfort Twin Room',
        location: '680 Higashishiokojicho, Shimogyo Ward, Kyoto',
        contactPhone: '+81 75-351-0111',
        inclusions: 'Traditional Kyoto Kaiseki Style Breakfast, Kyoto Station 2-min Walk'
      },
      {
        id: 'sapporo-grand-hotel',
        name: 'Sapporo Grand Hotel Hokkaido',
        stars: 5,
        defaultRoomType: 'East Building Superior Twin Room',
        location: '4-Chome, Kita 1-Jo Nishi, Chuo-ku, Sapporo, Hokkaido',
        contactPhone: '+81 11-261-3311',
        inclusions: 'Hokkaido Fresh Dairy & Seafood Buffet Breakfast, Bakery Coupon'
      }
    ],
    shuttles: [
      {
        id: 'limousine-bus-tokyo',
        vehicleType: 'Tokyo Airport Limousine Bus / Luxury Executive Coach',
        operator: 'Tokyo Airport Transport & Holiday Tours Japan',
        capacity: '45 Passengers + Large Cargo Hold',
        defaultPickup: 'Narita / Haneda Terminal Bus Stop #4',
        defaultDropoff: 'Keio Plaza Hotel / Shinjuku Station West Exit',
        driverName: 'Mr. Kenji Takahashi (Licensed Chauffeur)',
        driverContact: '+81 90-1234-5678',
        plateNumber: '品川 230 あ 88-19'
      },
      {
        id: 'alphard-vip-japan',
        vehicleType: 'Toyota Alphard Executive Lounge 6-Seater VIP Van',
        operator: 'Japan VIP Chauffeur Ground Logistics',
        capacity: '5-6 VIP Passengers',
        defaultPickup: 'International Arrival Chauffeur Meeting Point',
        defaultDropoff: 'Designated Hotel / Ryokan Entrance',
        driverName: 'Mr. Daiki Suzuki',
        driverContact: '+81 80-9876-5432',
        plateNumber: '練馬 300 さ 77-01'
      },
      {
        id: 'hiace-commuter-japan',
        vehicleType: 'Toyota HiAce Grand Cabin 10-Passenger Luxury Shuttle',
        operator: 'Kansai & Tokyo Private Tour Transport',
        capacity: '9-10 Passengers',
        defaultPickup: 'KIX Airport Terminal Arrival Lane',
        defaultDropoff: 'Hotel Lobby Front Door',
        driverName: 'Mr. Hiroshi Sato',
        driverContact: '+81 90-5544-3322',
        plateNumber: 'なにわ 500 な 12-34'
      }
    ]
  },
  {
    countryId: 'south_korea',
    countryName: 'South Korea',
    flag: '🇰🇷',
    popularDestinations: ['Seoul', 'Jeju Island', 'Busan', 'Incheon', 'Nami Island', 'Gangwon-do'],
    airlines: [
      {
        id: 'korean-air',
        name: 'Korean Air (Flag Carrier)',
        iataCode: 'KE',
        defaultFlightNumber: 'KE-624',
        hubTerminal: 'Incheon International Terminal 2 (ICN)',
        baggageAllowance: '1x 23kg Check-in + 10kg Carry-on',
        cabinClass: 'Prestige & Economy Standard',
        popularRoutes: [
          'MNL (Manila NAIA T1) ➔ ICN (Seoul Incheon T2)',
          'CEB (Cebu Mactan T2) ➔ ICN (Seoul Incheon T2)',
          'ICN (Seoul Incheon) ➔ CJU (Jeju Island)'
        ]
      },
      {
        id: 'asiana-airlines',
        name: 'Asiana Airlines',
        iataCode: 'OZ',
        defaultFlightNumber: 'OZ-704',
        hubTerminal: 'Incheon International Terminal 1 (ICN)',
        baggageAllowance: '1x 23kg Check-in + 10kg Carry-on',
        cabinClass: 'Economy Prime',
        popularRoutes: [
          'MNL (NAIA T1) ➔ ICN (Seoul Incheon T1)',
          'CRK (Clark) ➔ ICN (Seoul Incheon T1)'
        ]
      },
      {
        id: 'jeju-air',
        name: 'Jeju Air',
        iataCode: '7C',
        defaultFlightNumber: '7C-2306',
        hubTerminal: 'Incheon Terminal 1 / Gimpo Domestic (GMP)',
        baggageAllowance: '15kg Check-in + 10kg Carry-on',
        cabinClass: 'Economy Saver',
        popularRoutes: [
          'MNL (NAIA T1) ➔ ICN (Seoul Incheon)',
          'GMP (Gimpo Seoul) ➔ CJU (Jeju Island)'
        ]
      },
      {
        id: 'ph-airlines-korea',
        name: 'Philippine Airlines (Korea Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-468',
        hubTerminal: 'NAIA Terminal 2 / Incheon T1',
        baggageAllowance: '2x 23kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T2) ➔ ICN (Seoul Incheon T1)']
      }
    ],
    hotels: [
      {
        id: 'lotte-hotel-seoul',
        name: 'Lotte Hotel Seoul (Myeongdong Center)',
        stars: 5,
        defaultRoomType: 'Main Building Superior King Room',
        location: '30 Eulji-ro, Jung-gu, Seoul',
        contactPhone: '+82 2-771-1000',
        inclusions: 'La Seine International Breakfast Buffet, Direct Myeongdong & Euljiro 1-ga Subway Access'
      },
      {
        id: 'shilla-seoul',
        name: 'The Shilla Seoul',
        stars: 5,
        defaultRoomType: 'Deluxe Park View Room with Namsan Mountain Panorama',
        location: '249 Dongho-ro, Jung-gu, Seoul',
        contactPhone: '+82 2-2233-3131',
        inclusions: 'The Parkview Gourmet Buffet Breakfast, Outdoor Heated Pool, Luxury Sauna'
      },
      {
        id: 'lotte-city-jeju',
        name: 'Lotte City Hotel Jeju Island',
        stars: 4,
        defaultRoomType: 'Deluxe Mountain / Ocean View Room',
        location: '83 Doryeong-ro, Jeju-si, Jeju-do',
        contactPhone: '+82 64-730-1000',
        inclusions: 'C\'Café Buffet Breakfast on 22nd Floor, Heated Infinity Pool, 5 mins from Airport'
      },
      {
        id: 'park-hyatt-busan',
        name: 'Park Hyatt Busan',
        stars: 5,
        defaultRoomType: 'Marine City & Gwangan Bridge View Deluxe',
        location: '51 Marine city 1-ro, Haeundae-gu, Busan',
        contactPhone: '+82 51-990-1234',
        inclusions: 'Dining Room French & Korean Breakfast, Ocean View Swimming Pool'
      }
    ],
    shuttles: [
      {
        id: 'hyundai-staria-korea',
        vehicleType: 'Hyundai Staria Lounge 9-Seater VIP Shuttle',
        operator: 'Seoul K-Travel VIP Transport Group',
        capacity: '7-9 Passengers',
        defaultPickup: 'Incheon T1 / T2 Gate 6 Chauffeur Stand',
        defaultDropoff: 'Lotte Hotel Seoul / Myeongdong Lobby',
        driverName: 'Mr. Min-ho Park (English/Korean Speaking)',
        driverContact: '+82 10-2345-6789',
        plateNumber: '서울 70 바 1928'
      },
      {
        id: 'korea-tour-coach',
        vehicleType: 'Hyundai Universe 45-Seater Luxury Tour Coach',
        operator: 'Korea National Tour Bus Fleet',
        capacity: '40-45 Passengers',
        defaultPickup: 'Airport Coach Parking Lot 3',
        defaultDropoff: 'Seoul Hotel / Nami Island Ferry Terminal',
        driverName: 'Captain Sung-jin Kim',
        driverContact: '+82 10-8765-4321',
        plateNumber: '경기 75 아 3456'
      }
    ]
  },
  {
    countryId: 'singapore',
    countryName: 'Singapore',
    flag: '🇸🇬',
    popularDestinations: ['Singapore City', 'Marina Bay', 'Sentosa Island', 'Orchard Road', 'Changi', 'Gardens by the Bay'],
    airlines: [
      {
        id: 'singapore-airlines',
        name: 'Singapore Airlines (SIA)',
        iataCode: 'SQ',
        defaultFlightNumber: 'SQ-917',
        hubTerminal: 'Singapore Changi Airport Terminal 2 & 3 (SIN)',
        baggageAllowance: '25kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Value / Standard',
        popularRoutes: [
          'MNL (Manila NAIA T3) ➔ SIN (Singapore Changi T2)',
          'CEB (Cebu Mactan T2) ➔ SIN (Singapore Changi T2)',
          'DVO (Davao) ➔ SIN (Singapore Changi T2)'
        ]
      },
      {
        id: 'scoot',
        name: 'Scoot Airlines',
        iataCode: 'TR',
        defaultFlightNumber: 'TR-397',
        hubTerminal: 'Singapore Changi Terminal 1 (SIN)',
        baggageAllowance: '20kg FlyBag Check-in + 10kg Carry-on',
        cabinClass: 'Economy Saver',
        popularRoutes: [
          'MNL (NAIA T3) ➔ SIN (Singapore Changi T1)',
          'CRK (Clark) ➔ SIN (Singapore Changi T1)'
        ]
      },
      {
        id: 'ph-airlines-sg',
        name: 'Philippine Airlines (Singapore Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-507',
        hubTerminal: 'NAIA Terminal 2 / Changi T1',
        baggageAllowance: '30kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T2) ➔ SIN (Singapore Changi T1)']
      },
      {
        id: 'cebu-pacific-sg',
        name: 'Cebu Pacific Air (Singapore Routes)',
        iataCode: '5J',
        defaultFlightNumber: '5J-813',
        hubTerminal: 'NAIA Terminal 3 / Changi T4',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Standard',
        popularRoutes: ['MNL (NAIA T3) ➔ SIN (Singapore Changi T4)']
      }
    ],
    hotels: [
      {
        id: 'mbs-singapore',
        name: 'Marina Bay Sands Singapore',
        stars: 5,
        defaultRoomType: 'Sands Premier Room with Bay View',
        location: '10 Bayfront Avenue, Marina Bay, Singapore',
        contactPhone: '+65 6688 8868',
        inclusions: 'RISE Restaurant International Breakfast Buffet, World-Famous 57th Floor Skypark & Infinity Pool Entry'
      },
      {
        id: 'fullerton-singapore',
        name: 'The Fullerton Hotel Singapore',
        stars: 5,
        defaultRoomType: 'Heritage Straits Club Room',
        location: '1 Fullerton Square, Singapore',
        contactPhone: '+65 6733 8388',
        inclusions: 'Town Restaurant Buffet Breakfast, Straits Club Afternoon High Tea, Infinity Pool along Singapore River'
      },
      {
        id: 'pan-pacific-singapore',
        name: 'Pan Pacific Singapore (Marina Square)',
        stars: 5,
        defaultRoomType: 'Deluxe Panoramic City Room',
        location: '7 Raffles Boulevard, Marina Square, Singapore',
        contactPhone: '+65 6336 8111',
        inclusions: 'Edge Restaurant Epicurean Breakfast Buffet, Pool & Fitness Access'
      }
    ],
    shuttles: [
      {
        id: 'mercedes-vip-sg',
        vehicleType: 'Mercedes-Benz V-Class Luxury 7-Seater Van',
        operator: 'Singapore Prestige Limousine & Airport Transfer',
        capacity: '6 VIP Passengers',
        defaultPickup: 'Changi Airport T1/T2/T3/T4 Arrival Hall Conveyor Gate',
        defaultDropoff: 'Marina Bay Sands / Orchard Hotel Porch',
        driverName: 'Mr. David Tan (Certified Chauffeur)',
        driverContact: '+65 9123 4567',
        plateNumber: 'SLA 8820 P'
      },
      {
        id: 'alphard-vip-sg',
        vehicleType: 'Toyota Alphard Executive Royal Lounge',
        operator: 'Lion City VIP Ground Logistics',
        capacity: '5-6 Passengers',
        defaultPickup: 'Airport VIP Arrival Bay',
        defaultDropoff: 'Sentosa Resort / City Hotel',
        driverName: 'Mr. Kelvin Lim',
        driverContact: '+65 8234 5678',
        plateNumber: 'SKH 1199 M'
      }
    ]
  },
  {
    countryId: 'thailand',
    countryName: 'Thailand',
    flag: '🇹🇭',
    popularDestinations: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Koh Samui', 'Krabi', 'Ayutthaya'],
    airlines: [
      {
        id: 'thai-airways',
        name: 'Thai Airways International',
        iataCode: 'TG',
        defaultFlightNumber: 'TG-621',
        hubTerminal: 'Suvarnabhumi Airport Bangkok (BKK)',
        baggageAllowance: '30kg Check-in + 7kg Carry-on',
        cabinClass: 'Royal Silk & Economy Standard',
        popularRoutes: [
          'MNL (Manila NAIA T1) ➔ BKK (Bangkok Suvarnabhumi)',
          'BKK (Bangkok) ➔ HKT (Phuket Airport)',
          'BKK (Bangkok) ➔ CNX (Chiang Mai Airport)'
        ]
      },
      {
        id: 'bangkok-airways',
        name: 'Bangkok Airways (Asia\'s Boutique Airline)',
        iataCode: 'PG',
        defaultFlightNumber: 'PG-275',
        hubTerminal: 'Suvarnabhumi Airport (BKK)',
        baggageAllowance: '20kg Check-in + Free Boutique Lounge Access',
        cabinClass: 'Boutique Economy',
        popularRoutes: [
          'BKK (Suvarnabhumi) ➔ USM (Koh Samui Airport)',
          'BKK (Suvarnabhumi) ➔ HKT (Phuket)'
        ]
      },
      {
        id: 'ph-airlines-thai',
        name: 'Philippine Airlines (Bangkok Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-730',
        hubTerminal: 'NAIA Terminal 2 / Suvarnabhumi (BKK)',
        baggageAllowance: '25kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T2) ➔ BKK (Bangkok Suvarnabhumi)']
      },
      {
        id: 'cebu-pac-thai',
        name: 'Cebu Pacific Air (Bangkok Routes)',
        iataCode: '5J',
        defaultFlightNumber: '5J-929',
        hubTerminal: 'NAIA Terminal 3 / Suvarnabhumi (BKK)',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ BKK (Bangkok Suvarnabhumi)',
          'MNL (NAIA T3) ➔ DMK (Don Mueang Airport)'
        ]
      }
    ],
    hotels: [
      {
        id: 'anantara-riverside-bkk',
        name: 'Anantara Riverside Bangkok Resort',
        stars: 5,
        defaultRoomType: 'Deluxe Chao Phraya River View Room with Balcony',
        location: '257/1-3 Charoennakhon Road, Thonburi, Bangkok',
        contactPhone: '+66 2 476 0022',
        inclusions: 'Riverside Terrace International Breakfast, Shuttle Boat to Iconsiam & BTS Skytrain'
      },
      {
        id: 'centara-grand-phuket',
        name: 'Centara Grand Beach Resort Phuket',
        stars: 5,
        defaultRoomType: 'Deluxe Ocean Facing Room with Spa Bath',
        location: '683 Karon Beach, Patak Road, Muang, Phuket',
        contactPhone: '+66 76 201 234',
        inclusions: 'The Cove Restaurant Breakfast Buffet, Waterpark & Lazy River Entry'
      },
      {
        id: 'shangrila-chiangmai',
        name: 'Shangri-La Chiang Mai',
        stars: 5,
        defaultRoomType: 'Premier Lanna Heritage Room',
        location: '89/8 Chang Klan Road, Muang, Chiang Mai',
        contactPhone: '+66 53 253 888',
        inclusions: 'Kad Kafe Gourmet Breakfast, Chi The Spa Access, Night Bazaar Proximity'
      }
    ],
    shuttles: [
      {
        id: 'commuter-van-thai',
        vehicleType: 'Toyota Commuter VIP 10-Passenger Luxury Van',
        operator: 'Siam Royal Tour & Transport Co.',
        capacity: '9-10 Passengers',
        defaultPickup: 'Suvarnabhumi Airport Gate 3 Meeting Point',
        defaultDropoff: 'Anantara Riverside Resort Lobby',
        driverName: 'Mr. Somchai Prasert',
        driverContact: '+66 81-234-5678',
        plateNumber: '30-8819 กรุงเทพมหานคร'
      },
      {
        id: 'phuket-tour-coach',
        vehicleType: 'Isuzu Air-Conditioned VIP Tourist Coach',
        operator: 'Andaman Island Land Transport Fleet',
        capacity: '20-25 Passengers',
        defaultPickup: 'Phuket International Airport Arrival Bay',
        defaultDropoff: 'Karon / Patong Beachfront Resort',
        driverName: 'Mr. Anan Srithep',
        driverContact: '+66 89-765-4321',
        plateNumber: '10-5544 ภูเก็ต'
      }
    ]
  },
  {
    countryId: 'hongkong_macau',
    countryName: 'Hong Kong & Macau',
    flag: '🇭🇰',
    popularDestinations: ['Hong Kong', 'Kowloon', 'Lantau Island', 'Disneyland', 'Macau', 'Cotai Strip'],
    airlines: [
      {
        id: 'cathay-pacific',
        name: 'Cathay Pacific Airways',
        iataCode: 'CX',
        defaultFlightNumber: 'CX-906',
        hubTerminal: 'Hong Kong International Airport Terminal 1 (HKG)',
        baggageAllowance: '23kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Essential',
        popularRoutes: [
          'MNL (Manila NAIA T3) ➔ HKG (Hong Kong T1)',
          'CEB (Cebu Mactan T2) ➔ HKG (Hong Kong T1)'
        ]
      },
      {
        id: 'hong-kong-airlines',
        name: 'Hong Kong Airlines',
        iataCode: 'HX',
        defaultFlightNumber: 'HX-782',
        hubTerminal: 'Hong Kong International Terminal 1 (HKG)',
        baggageAllowance: '20kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Standard',
        popularRoutes: ['MNL (NAIA T1) ➔ HKG (Hong Kong)']
      },
      {
        id: 'ph-airlines-hk',
        name: 'Philippine Airlines (Hong Kong Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-300',
        hubTerminal: 'NAIA Terminal 2 / HKG T1',
        baggageAllowance: '25kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T2) ➔ HKG (Hong Kong T1)']
      },
      {
        id: 'cebu-pac-hk',
        name: 'Cebu Pacific Air (Hong Kong / Macau)',
        iataCode: '5J',
        defaultFlightNumber: '5J-110',
        hubTerminal: 'NAIA Terminal 3 / HKG & MFM',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ HKG (Hong Kong T1)',
          'MNL (NAIA T3) ➔ MFM (Macau International)'
        ]
      }
    ],
    hotels: [
      {
        id: 'peninsula-hk',
        name: 'The Peninsula Hong Kong (Grand Dame of Far East)',
        stars: 5,
        defaultRoomType: 'Grand Deluxe Harbour View Suite',
        location: 'Salisbury Road, Tsim Sha Tsui, Kowloon, Hong Kong',
        contactPhone: '+852 2920 2888',
        inclusions: 'The Verandah Legendary Breakfast, Rolls-Royce Chauffeur Option, Victoria Harbour View'
      },
      {
        id: 'venetian-macao',
        name: 'The Venetian Macao Resort Hotel',
        stars: 5,
        defaultRoomType: 'Royale Deluxe King Suite (70 sqm)',
        location: 'Estrada da Baía de N. Senhora da Esperança, Cotai, Macau',
        contactPhone: '+853 2882 8888',
        inclusions: 'Bambu Restaurant Buffet Breakfast, Gondola Ride Ticket, Shopping Voucher'
      },
      {
        id: 'kowloon-shangrila',
        name: 'Kowloon Shangri-La Hong Kong',
        stars: 5,
        defaultRoomType: 'Deluxe Victoria Harbour View Room',
        location: '64 Mody Road, Tsim Sha Tsui East, Kowloon',
        contactPhone: '+852 2721 2111',
        inclusions: 'Café Kool Gourmet Buffet Breakfast, Health Club Access'
      }
    ],
    shuttles: [
      {
        id: 'alphard-vip-hk',
        vehicleType: 'Toyota Alphard Cross-Border 7-Seater Limousine',
        operator: 'Hong Kong & Macau Express VIP Logistics',
        capacity: '6 Passengers',
        defaultPickup: 'HKG Airport Arrival Hall Exit B',
        defaultDropoff: 'The Peninsula Hotel / Tsim Sha Tsui',
        driverName: 'Mr. Raymond Chan (English & Cantonese Speaking)',
        driverContact: '+852 9123 8899',
        plateNumber: 'HK 8899 / 粵Z 1234 澳'
      },
      {
        id: 'hk-airport-express-coach',
        vehicleType: 'Scania 45-Passenger Luxury Sightseeing Coach',
        operator: 'Kwoon Chung Motors Tour Fleet',
        capacity: '40-45 Passengers',
        defaultPickup: 'HK International Airport Coach Station',
        defaultDropoff: 'Kowloon / Hong Kong Island Designated Hotel',
        driverName: 'Mr. Wing-kit Wong',
        driverContact: '+852 6234 5678',
        plateNumber: 'TE 1928'
      }
    ]
  },
  {
    countryId: 'taiwan',
    countryName: 'Taiwan',
    flag: '🇹🇼',
    popularDestinations: ['Taipei', 'Kaohsiung', 'Taichung', 'Sun Moon Lake', 'Jiufen', 'Taroko Gorge'],
    airlines: [
      {
        id: 'eva-air',
        name: 'EVA Air',
        iataCode: 'BR',
        defaultFlightNumber: 'BR-272',
        hubTerminal: 'Taoyuan International Terminal 2 (TPE)',
        baggageAllowance: '1x 23kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (Manila NAIA T1) ➔ TPE (Taipei Taoyuan T2)',
          'CEB (Cebu Mactan T2) ➔ TPE (Taipei Taoyuan T2)'
        ]
      },
      {
        id: 'china-airlines',
        name: 'China Airlines',
        iataCode: 'CI',
        defaultFlightNumber: 'CI-702',
        hubTerminal: 'Taoyuan International Terminal 1 (TPE)',
        baggageAllowance: '1x 23kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T1) ➔ TPE (Taipei Taoyuan T1)']
      },
      {
        id: 'starlux',
        name: 'STARLUX Airlines',
        iataCode: 'JX',
        defaultFlightNumber: 'JX-786',
        hubTerminal: 'Taoyuan International Terminal 1 (TPE)',
        baggageAllowance: '1x 23kg Check-in + 7kg Cabin',
        cabinClass: 'Premium Boutique Economy',
        popularRoutes: [
          'MNL (NAIA T1) ➔ TPE (Taipei Taoyuan T1)',
          'CRK (Clark) ➔ TPE (Taipei Taoyuan T1)'
        ]
      },
      {
        id: 'ph-airlines-taiwan',
        name: 'Philippine Airlines (Taipei Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-890',
        hubTerminal: 'NAIA Terminal 2 / Taoyuan T1',
        baggageAllowance: '25kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T2) ➔ TPE (Taipei Taoyuan T1)']
      }
    ],
    hotels: [
      {
        id: 'grand-hyatt-taipei',
        name: 'Grand Hyatt Taipei (Beside Taipei 101)',
        stars: 5,
        defaultRoomType: 'Taipei 101 View Deluxe King Room',
        location: '2 Songshou Road, Xinyi District, Taipei',
        contactPhone: '+886 2 2720 1234',
        inclusions: 'Café Buffet Breakfast, Outdoor Heated Pool, Oasis Spa & Fitness Studio'
      },
      {
        id: 'grand-hotel-taipei',
        name: 'The Grand Hotel Taipei (Imperial Palace Landmark)',
        stars: 5,
        defaultRoomType: 'Grand Deluxe Prestige Suite with Mountain View',
        location: 'No. 1, Sec. 4, Zhongshan N. Rd., Zhongshan Dist., Taipei',
        contactPhone: '+886 2 2886 8888',
        inclusions: 'Grand Garden Buffet Breakfast, Secret Escape Tunnel Tour Pass'
      },
      {
        id: 'fleur-de-chine-sunmoonlake',
        name: 'Fleur de Chine Hotel Sun Moon Lake',
        stars: 5,
        defaultRoomType: 'Deluxe Lake View Hot Spring Room with Private Tub',
        location: 'No. 23, Zhongzheng Rd., Yuchi Township, Nantou County',
        contactPhone: '+886 4 9285 6788',
        inclusions: 'Crimson Buffet Breakfast & Dinner, Natural In-Room Hot Springs Water'
      }
    ],
    shuttles: [
      {
        id: 'volkswagen-t6-taiwan',
        vehicleType: 'Volkswagen T6 Caravelle 9-Seater Executive Van',
        operator: 'Formosa VIP Chauffeur & Tour Transport',
        capacity: '7-8 Passengers + Luggage',
        defaultPickup: 'Taoyuan Airport T1/T2 Arrival Meeting Pillar',
        defaultDropoff: 'Grand Hyatt Taipei / Xinyi District Hotel',
        driverName: 'Mr. Jerry Chen (Licensed Guide Driver)',
        driverContact: '+886 912-345-678',
        plateNumber: 'TDF-8819'
      },
      {
        id: 'taiwan-tourist-coach',
        vehicleType: 'Fuso Super Great 43-Passenger Luxury Sightseeing Coach',
        operator: 'Taiwan Sunshine Tour Coach Fleet',
        capacity: '40-43 Passengers',
        defaultPickup: 'Taoyuan Airport Coach Parking Lot',
        defaultDropoff: 'Taipei City / Jiufen Old Street / Sun Moon Lake',
        driverName: 'Captain Chih-ming Lin',
        driverContact: '+886 923-456-789',
        plateNumber: 'KAA-5588'
      }
    ]
  },
  {
    countryId: 'vietnam',
    countryName: 'Vietnam',
    flag: '🇻🇳',
    popularDestinations: ['Hanoi', 'Da Nang', 'Hoi An', 'Ho Chi Minh City', 'Nha Trang', 'Phu Quoc', 'Ha Long Bay'],
    airlines: [
      {
        id: 'vietnam-airlines',
        name: 'Vietnam Airlines (SkyTeam)',
        iataCode: 'VN',
        defaultFlightNumber: 'VN-648',
        hubTerminal: 'Noi Bai Hanoi (HAN) / Tan Son Nhat Saigon (SGN)',
        baggageAllowance: '23kg Check-in + 12kg Carry-on',
        cabinClass: 'Lotus Class & Economy Classic',
        popularRoutes: [
          'MNL (Manila NAIA T1) ➔ HAN (Hanoi Noi Bai T2)',
          'MNL (Manila NAIA T1) ➔ SGN (Ho Chi Minh City T2)',
          'HAN (Hanoi) ➔ DAD (Da Nang Airport)'
        ]
      },
      {
        id: 'vietjet-air',
        name: 'VietJet Air',
        iataCode: 'VJ',
        defaultFlightNumber: 'VJ-780',
        hubTerminal: 'Noi Bai / Tan Son Nhat Airport',
        baggageAllowance: '20kg Check-in + 7kg Carry-on',
        cabinClass: 'Eco Class',
        popularRoutes: [
          'MNL (NAIA T3) ➔ HAN (Hanoi Noi Bai)',
          'MNL (NAIA T3) ➔ SGN (Ho Chi Minh)'
        ]
      },
      {
        id: 'ph-airlines-vietnam',
        name: 'Philippine Airlines (Vietnam Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-591',
        hubTerminal: 'NAIA Terminal 2 / SGN & HAN',
        baggageAllowance: '25kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: [
          'MNL (NAIA T2) ➔ SGN (Ho Chi Minh City)',
          'MNL (NAIA T2) ➔ HAN (Hanoi Noi Bai)'
        ]
      },
      {
        id: 'cebu-pac-vietnam',
        name: 'Cebu Pacific Air (Vietnam Routes)',
        iataCode: '5J',
        defaultFlightNumber: '5J-751',
        hubTerminal: 'NAIA Terminal 3 / SGN & HAN',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ SGN (Ho Chi Minh T2)',
          'MNL (NAIA T3) ➔ HAN (Hanoi T2)',
          'MNL (NAIA T3) ➔ DAD (Da Nang T2)'
        ]
      }
    ],
    hotels: [
      {
        id: 'metropole-hanoi',
        name: 'Sofitel Legend Metropole Hanoi (Historical Landmark)',
        stars: 5,
        defaultRoomType: 'Historical Wing Metropole Luxury Suite',
        location: '15 Ngo Quyen Street, Hoan Kiem District, Hanoi',
        contactPhone: '+84 24 3826 6919',
        inclusions: 'Le Beaulieu Gourmet French Breakfast, War Bunker Tour Access, Heated Pool'
      },
      {
        id: 'vinpearl-saigon-landmark81',
        name: 'Vinpearl Landmark 81, Autograph Collection Saigon',
        stars: 5,
        defaultRoomType: 'Panoramic Saigon River King Room (High Floor)',
        location: '720A Dien Bien Phu, Binh Thanh District, Ho Chi Minh City',
        contactPhone: '+84 28 3971 8888',
        inclusions: 'Oriental Pearl 66th Floor Sky Breakfast, Infinity Sky Pool Entry'
      },
      {
        id: 'intercon-danang',
        name: 'InterContinental Danang Sun Peninsula Resort',
        stars: 5,
        defaultRoomType: 'Heaven Level Classic Oceanview Villa',
        location: 'Son Tra Peninsula, Da Nang',
        contactPhone: '+84 236 393 8888',
        inclusions: 'Citron Restaurant Hanging Booth Breakfast, Private Beach Access, Tramway Pass'
      }
    ],
    shuttles: [
      {
        id: 'limousine-dcar-vietnam',
        vehicleType: 'Ford Transit DCar VIP 9-Seater Executive Limousine',
        operator: 'Vietnam Heritage Luxury Express Fleet',
        capacity: '7-9 Passengers (Massage Seats)',
        defaultPickup: 'Noi Bai / Tan Son Nhat Airport VIP Gate',
        defaultDropoff: 'Metropole Hotel Hanoi / Old Quarter',
        driverName: 'Mr. Nguyen Van Minh',
        driverContact: '+84 90 123 4567',
        plateNumber: '29B-881.99'
      },
      {
        id: 'hyundai-solati-vietnam',
        vehicleType: 'Hyundai Solati 16-Seater Deluxe Tourist Van',
        operator: 'Indochina Tour Transport Services',
        capacity: '12-14 Passengers',
        defaultPickup: 'Airport Arrival Bay',
        defaultDropoff: 'Da Nang Resort / Hoi An Ancient Town',
        driverName: 'Mr. Tran Duc Thang',
        driverContact: '+84 98 765 4321',
        plateNumber: '43B-554.21'
      }
    ]
  },
  {
    countryId: 'uae',
    countryName: 'United Arab Emirates (UAE)',
    flag: '🇦🇪',
    popularDestinations: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Palm Jumeirah', 'Downtown Dubai', 'Desert Safari'],
    airlines: [
      {
        id: 'emirates',
        name: 'Emirates Airline (World\'s Leading Carrier)',
        iataCode: 'EK',
        defaultFlightNumber: 'EK-335',
        hubTerminal: 'Dubai International Terminal 3 (DXB)',
        baggageAllowance: '30kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Flex Plus & Business Class',
        popularRoutes: [
          'MNL (Manila NAIA T3) ➔ DXB (Dubai International T3)',
          'CRK (Clark) ➔ DXB (Dubai International T3)',
          'CEB (Cebu) ➔ DXB (Dubai International T3)'
        ]
      },
      {
        id: 'etihad',
        name: 'Etihad Airways',
        iataCode: 'EY',
        defaultFlightNumber: 'EY-421',
        hubTerminal: 'Zayed International Airport (AUH Terminal A)',
        baggageAllowance: '30kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Choice',
        popularRoutes: ['MNL (NAIA T3) ➔ AUH (Abu Dhabi Zayed Intl)']
      },
      {
        id: 'ph-airlines-uae',
        name: 'Philippine Airlines (Middle East Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-658',
        hubTerminal: 'NAIA Terminal 2 / DXB T1',
        baggageAllowance: '2x 23kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: ['MNL (NAIA T2) ➔ DXB (Dubai International T1)']
      },
      {
        id: 'cebu-pac-uae',
        name: 'Cebu Pacific Air (Dubai Routes)',
        iataCode: '5J',
        defaultFlightNumber: '5J-14',
        hubTerminal: 'NAIA Terminal 3 / DXB T1',
        baggageAllowance: '20kg Check-in + 7kg Cabin',
        cabinClass: 'Economy Standard',
        popularRoutes: ['MNL (NAIA T3) ➔ DXB (Dubai International T1)']
      }
    ],
    hotels: [
      {
        id: 'atlantis-the-palm',
        name: 'Atlantis, The Palm Dubai',
        stars: 5,
        defaultRoomType: 'Ocean King Room with Arabian Gulf View',
        location: 'Crescent Road, The Palm Jumeirah, Dubai',
        contactPhone: '+971 4 426 2000',
        inclusions: 'Kaleidoscope Buffet Breakfast, Unlimited Aquaventure Waterpark & Lost Chambers Aquarium Entry'
      },
      {
        id: 'burj-al-arab',
        name: 'Burj Al Arab Jumeirah (7-Star Icon)',
        stars: 5,
        defaultRoomType: 'Deluxe One-Bedroom Duplex Marina Suite',
        location: 'Jumeirah Beach Road, Dubai',
        contactPhone: '+971 4 301 7777',
        inclusions: 'Bab Al Yam Luxury Breakfast, 24-Hour Private Butler, Hermès Luxury Amenities'
      },
      {
        id: 'emirates-palace-abudhabi',
        name: 'Emirates Palace Mandarin Oriental Abu Dhabi',
        stars: 5,
        defaultRoomType: 'Palace Deluxe Ocean King Suite',
        location: 'West Corniche Road, Abu Dhabi',
        contactPhone: '+971 2 690 9000',
        inclusions: 'Vendôme International Gourmet Breakfast, Gold Leaf Cappuccino Pass, Private Beach'
      }
    ],
    shuttles: [
      {
        id: 'gmc-yukon-vip-uae',
        vehicleType: 'GMC Yukon Denali / Cadillac Escalade Luxury SUV',
        operator: 'Dubai Royal VIP Chauffeur Service',
        capacity: '5-6 VIP Passengers',
        defaultPickup: 'Dubai DXB T3 Chauffeur VIP Arrival Area',
        defaultDropoff: 'Atlantis The Palm / Burj Al Arab Entrance',
        driverName: 'Mr. Tariq Al-Mansoor (Licensed Chauffeur)',
        driverContact: '+971 50 123 4567',
        plateNumber: 'Dubai A-88190'
      },
      {
        id: 'mercedes-sprinter-uae',
        vehicleType: 'Mercedes-Benz Sprinter 16-Seater Executive Coach',
        operator: 'Emirates Desert & City Tour Logistics',
        capacity: '12-15 Passengers',
        defaultPickup: 'Airport Arrival Terminals 1 / 3',
        defaultDropoff: 'Downtown Dubai Hotel / Sheikh Zayed Road',
        driverName: 'Mr. Farooq Mohammed',
        driverContact: '+971 55 987 6543',
        plateNumber: 'Abu Dhabi 5-44210'
      }
    ]
  },
  {
    countryId: 'holyland',
    countryName: 'Holy Land (Israel, Jordan & Egypt)',
    flag: '🇮🇱',
    popularDestinations: ['Jerusalem', 'Bethlehem', 'Sea of Galilee', 'Nazareth', 'Dead Sea', 'Tel Aviv', 'Amman', 'Petra', 'Cairo'],
    airlines: [
      {
        id: 'el-al',
        name: 'EL AL Israel Airlines',
        iataCode: 'LY',
        defaultFlightNumber: 'LY-88',
        hubTerminal: 'Ben Gurion Airport Tel Aviv (TLV)',
        baggageAllowance: '1x 23kg Check-in + 8kg Carry-on',
        cabinClass: 'Economy Classic',
        popularRoutes: [
          'MNL (NAIA) ➔ BKK/DXB ➔ TLV (Tel Aviv Ben Gurion)',
          'TLV (Tel Aviv) ➔ AMM (Amman Queen Alia)'
        ]
      },
      {
        id: 'royal-jordanian',
        name: 'Royal Jordanian (oneworld)',
        iataCode: 'RJ',
        defaultFlightNumber: 'RJ-182',
        hubTerminal: 'Queen Alia International Amman (AMM)',
        baggageAllowance: '30kg Check-in + 7kg Carry-on',
        cabinClass: 'Crown Class & Economy Classic',
        popularRoutes: [
          'BKK (Bangkok) ➔ AMM (Amman Queen Alia)',
          'DXB (Dubai) ➔ AMM (Amman Queen Alia)'
        ]
      },
      {
        id: 'egyptair',
        name: 'EgyptAir (Star Alliance)',
        iataCode: 'MS',
        defaultFlightNumber: 'MS-800',
        hubTerminal: 'Cairo International Airport (CAI)',
        baggageAllowance: '2x 23kg Check-in + 8kg Carry-on',
        cabinClass: 'Horus Economy Class',
        popularRoutes: [
          'CAI (Cairo International T3) ➔ TLV (Tel Aviv)',
          'AMM (Amman) ➔ CAI (Cairo International)'
        ]
      },
      {
        id: 'turkish-airlines-holyland',
        name: 'Turkish Airlines',
        iataCode: 'TK',
        defaultFlightNumber: 'TK-84',
        hubTerminal: 'Istanbul Airport (IST) ➔ TLV/AMM/CAI',
        baggageAllowance: '30kg Check-in + 8kg Carry-on',
        cabinClass: 'Economy Semi-Flexible',
        popularRoutes: [
          'MNL (NAIA T3) ➔ IST (Istanbul) ➔ TLV (Tel Aviv)',
          'MNL (NAIA T3) ➔ IST (Istanbul) ➔ AMM (Amman)',
          'MNL (NAIA T3) ➔ IST (Istanbul) ➔ CAI (Cairo)'
        ]
      }
    ],
    hotels: [
      {
        id: 'king-david-jerusalem',
        name: 'The King David Hotel Jerusalem (Historic Landmark)',
        stars: 5,
        defaultRoomType: 'Old City View Deluxe King Room',
        location: '23 King David Street, Jerusalem',
        contactPhone: '+972 2-620-8888',
        inclusions: 'King\'s Garden Kosher Buffet Breakfast, Views of the Old City Walls, Heated Outdoor Pool'
      },
      {
        id: 'david-citadel-hotel',
        name: 'The David Citadel Hotel Jerusalem',
        stars: 5,
        defaultRoomType: 'Superior Room Overlooking Old City',
        location: '7 King David Street, Jerusalem',
        contactPhone: '+972 2-621-1111',
        inclusions: 'Seasons Gourmet Breakfast, 5-min Walk to Jaffa Gate & Western Wall'
      },
      {
        id: 'kempinski-deadsea',
        name: 'Kempinski Hotel Ishtar Dead Sea (Jordan)',
        stars: 5,
        defaultRoomType: 'Ishtar Superior Sea View Room',
        location: 'Dead Sea Road, Swaimeh, Jordan',
        contactPhone: '+962 5 356 8888',
        inclusions: 'Obelisk International Breakfast, Private Mineral Dead Sea Mud Beach, 9 Swimming Pools'
      },
      {
        id: 'marriott-mena-house-cairo',
        name: 'Marriott Mena House Cairo (Pyramids View)',
        stars: 5,
        defaultRoomType: 'Deluxe Giza Pyramids View Balcony Room',
        location: '6 Pyramids Road, Giza, Cairo, Egypt',
        contactPhone: '+20 2 3377 3222',
        inclusions: '139 Restaurant Pyramids View Breakfast Buffet, Historic Royal Gardens Pass'
      }
    ],
    shuttles: [
      {
        id: 'pilgrimage-deluxe-coach',
        vehicleType: 'Mercedes-Benz Travego 50-Seater Deluxe Pilgrimage Coach',
        operator: 'Holy Land Pilgrimage & Cross-Border Escort Fleet',
        capacity: '45-50 Pilgrims (Wi-Fi, AC, Reclining Seats)',
        defaultPickup: 'Tel Aviv Ben Gurion Airport VIP Terminal / Allenby Bridge',
        defaultDropoff: 'King David Hotel / Jerusalem Hotel Entrance',
        driverName: 'Mr. Yossi Cohen & Mr. Ibrahim Nazzal',
        driverContact: '+972 54-123-4567',
        plateNumber: 'IL 88-190-26'
      },
      {
        id: 'mercedes-sprinter-holyland',
        vehicleType: 'Mercedes-Benz Sprinter 16-Seater Executive Tourist Van',
        operator: 'Biblical Heritage Private Escort Services',
        capacity: '12-15 Passengers',
        defaultPickup: 'Queen Alia Airport Amman / Cairo Airport',
        defaultDropoff: 'Petra / Dead Sea / Pyramids Hotel Lobby',
        driverName: 'Mr. Ahmad Al-Majali',
        driverContact: '+962 79-987-6543',
        plateNumber: 'JO 23-4491'
      }
    ]
  },
  {
    countryId: 'europe',
    countryName: 'Europe (Schengen & UK)',
    flag: '🇪🇺',
    popularDestinations: ['Paris', 'Rome', 'Venice', 'Florence', 'Barcelona', 'Madrid', 'Zurich', 'Lucerne', 'Amsterdam', 'London'],
    airlines: [
      {
        id: 'air-france-klm',
        name: 'Air France / KLM Royal Dutch Airlines',
        iataCode: 'AF',
        defaultFlightNumber: 'AF-208',
        hubTerminal: 'Paris Charles de Gaulle (CDG T2E) / Amsterdam Schiphol (AMS)',
        baggageAllowance: '1x 23kg Check-in + 12kg Carry-on',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ CDG (Paris Charles de Gaulle)',
          'MNL (NAIA T3) ➔ AMS (Amsterdam Schiphol)'
        ]
      },
      {
        id: 'lufthansa-swiss',
        name: 'Lufthansa & Swiss International Air Lines',
        iataCode: 'LH',
        defaultFlightNumber: 'LH-778',
        hubTerminal: 'Frankfurt (FRA T1) / Zurich (ZRH)',
        baggageAllowance: '1x 23kg Check-in + 8kg Carry-on',
        cabinClass: 'Economy Classic',
        popularRoutes: [
          'MNL (NAIA) ➔ FRA (Frankfurt Main)',
          'MNL (NAIA) ➔ ZRH (Zurich Airport)'
        ]
      },
      {
        id: 'qatar-airways-europe',
        name: 'Qatar Airways (Award-Winning European Connector)',
        iataCode: 'QR',
        defaultFlightNumber: 'QR-933',
        hubTerminal: 'Hamad International Doha (DOH) ➔ FCO/CDG/MAD/LHR',
        baggageAllowance: '30kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Classic',
        popularRoutes: [
          'MNL (NAIA T3) ➔ DOH ➔ FCO (Rome Fiumicino)',
          'MNL (NAIA T3) ➔ DOH ➔ CDG (Paris Charles de Gaulle)',
          'MNL (NAIA T3) ➔ DOH ➔ MAD (Madrid Barajas)'
        ]
      },
      {
        id: 'turkish-europe',
        name: 'Turkish Airlines (European Gateway)',
        iataCode: 'TK',
        defaultFlightNumber: 'TK-85',
        hubTerminal: 'Istanbul Airport (IST) ➔ Europe',
        baggageAllowance: '30kg Check-in + 8kg Carry-on',
        cabinClass: 'Economy Semi-Flexible',
        popularRoutes: [
          'MNL (NAIA T3) ➔ IST ➔ FCO (Rome)',
          'MNL (NAIA T3) ➔ IST ➔ VCE (Venice)',
          'MNL (NAIA T3) ➔ IST ➔ BCN (Barcelona)'
        ]
      }
    ],
    hotels: [
      {
        id: 'plaza-athenee-paris',
        name: 'Hôtel Plaza Athénée Paris (Haute Couture Palace)',
        stars: 5,
        defaultRoomType: 'Prestige Eiffel Tower View Suite',
        location: '25 Avenue Montaigne, 8th arr., Paris, France',
        contactPhone: '+33 1 53 67 66 65',
        inclusions: 'Jean Imbert Gourmet French Breakfast, Dior Spa Access, Courtyard Garden Access'
      },
      {
        id: 'hotel-danieli-venice',
        name: 'Hotel Danieli Venice (Historic Doge Palace Hotel)',
        stars: 5,
        defaultRoomType: 'Deluxe Lagoon View Balcony Room',
        location: 'Riva degli Schiavoni, 4196, Venice, Italy',
        contactPhone: '+39 041 522 6480',
        inclusions: 'Terrazza Danieli Rooftop Breakfast Overlooking Grand Canal, Private Dock Access'
      },
      {
        id: 'w-barcelona',
        name: 'W Barcelona (Sail Icon on the Mediterranean)',
        stars: 5,
        defaultRoomType: 'Fabulous Mediterranean Sea View King Room',
        location: 'Plaça Rosa Del Vents 1, Ciutat Vella, Barcelona, Spain',
        contactPhone: '+34 932 95 28 00',
        inclusions: 'FIRE Restaurant Mediterranean Breakfast Buffet, WET Deck Pool Pass, Direct Beach Entry'
      },
      {
        id: 'victoria-jungfrau-switzerland',
        name: 'Victoria-Jungfrau Grand Hotel & Spa Interlaken',
        stars: 5,
        defaultRoomType: 'Superior Room with Jungfrau Glacier View',
        location: 'Höheweg 41, Interlaken, Bernese Oberland, Switzerland',
        contactPhone: '+41 33 828 28 28',
        inclusions: 'Swiss Alpine Gourmet Breakfast, 5,500 sqm Spa Nescens Entry, Mountain View Balcony'
      }
    ],
    shuttles: [
      {
        id: 'mercedes-v-class-europe',
        vehicleType: 'Mercedes-Benz V-Class Avantgarde Luxury 7-Seater',
        operator: 'European Grand Luxe Chauffeur Logistics',
        capacity: '6 VIP Passengers',
        defaultPickup: 'CDG / FCO / ZRH Airport VIP Chauffeur Arrival Area',
        defaultDropoff: 'Plaza Athénée Paris / Hotel Danieli Venice Front',
        driverName: 'Mr. Jean-Luc Dubois & Mr. Marco Rossi',
        driverContact: '+33 6 12 34 56 78',
        plateNumber: 'FR 881-HT-75'
      },
      {
        id: 'setra-grand-touring-coach',
        vehicleType: 'Setra TopClass 50-Seater Grand European Motorcoach',
        operator: 'Pan-European Grand Touring Fleet',
        capacity: '45-48 Passengers (Wi-Fi, Restroom, Panoramic Glass Roof)',
        defaultPickup: 'European Airport Group Terminal Parking Bay',
        defaultDropoff: 'Partner City Center 5-Star Hotel',
        driverName: 'Captain Hans Meier',
        driverContact: '+49 171 234 5678',
        plateNumber: 'DE M-HT 2026'
      }
    ]
  },
  {
    countryId: 'usa_canada',
    countryName: 'United States & Canada',
    flag: '🇺🇸',
    popularDestinations: ['Los Angeles', 'San Francisco', 'Las Vegas', 'New York', 'Hawaii', 'Honolulu', 'Vancouver', 'Toronto'],
    airlines: [
      {
        id: 'united-airlines',
        name: 'United Airlines',
        iataCode: 'UA',
        defaultFlightNumber: 'UA-190',
        hubTerminal: 'Los Angeles (LAX) / San Francisco (SFO) / Newark (EWR)',
        baggageAllowance: '2x 23kg Check-in + Carry-on',
        cabinClass: 'United Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ SFO (San Francisco Intl)',
          'MNL (NAIA T3) ➔ LAX (Los Angeles Intl)'
        ]
      },
      {
        id: 'ph-airlines-usa',
        name: 'Philippine Airlines (Transpacific Non-Stop)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-102',
        hubTerminal: 'NAIA Terminal 2 / LAX Tom Bradley / SFO Intl',
        baggageAllowance: '2x 23kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: [
          'MNL (NAIA T2) ➔ LAX (Los Angeles Tom Bradley TBIT)',
          'MNL (NAIA T2) ➔ SFO (San Francisco International)',
          'MNL (NAIA T2) ➔ JFK (New York John F. Kennedy T1)',
          'MNL (NAIA T2) ➔ HNL (Honolulu Daniel K. Inouye)',
          'MNL (NAIA T2) ➔ YVR (Vancouver International)'
        ]
      },
      {
        id: 'delta-air-lines',
        name: 'Delta Air Lines',
        iataCode: 'DL',
        defaultFlightNumber: 'DL-284',
        hubTerminal: 'LAX / SEA / JFK Terminal 4',
        baggageAllowance: '2x 23kg Check-in + Carry-on',
        cabinClass: 'Main Cabin Economy',
        popularRoutes: ['MNL (NAIA T3) ➔ ICN ➔ LAX/SEA/JFK']
      }
    ],
    hotels: [
      {
        id: 'plaza-ny',
        name: 'The Plaza Hotel New York (Fifth Avenue Icon)',
        stars: 5,
        defaultRoomType: 'Plaza King Suite with Central Park View',
        location: 'Fifth Avenue at Central Park South, New York, NY',
        contactPhone: '+1 212-759-3000',
        inclusions: 'The Palm Court Champagne Breakfast, White Glove Butler Service, Central Park Access'
      },
      {
        id: 'bellagio-lasvegas',
        name: 'Bellagio Hotel & Casino Las Vegas',
        stars: 5,
        defaultRoomType: 'Fountain View Premier King Room',
        location: '3600 S Las Vegas Blvd, Las Vegas, NV',
        contactPhone: '+1 888-987-6667',
        inclusions: 'Buffet at Bellagio Breakfast Pass, World-Famous Conservatory Access, Casino Credit'
      },
      {
        id: 'royal-hawaiian-waikiki',
        name: 'The Royal Hawaiian, a Luxury Collection Resort (Pink Palace)',
        stars: 5,
        defaultRoomType: 'Historic Oceanfront King Room',
        location: '2259 Kalakaua Ave, Honolulu, Oahu, Hawaii',
        contactPhone: '+1 808-923-7311',
        inclusions: 'Surf Lanai Beachfront Breakfast, Fresh Flower Lei Greeting, Diamond Head View'
      }
    ],
    shuttles: [
      {
        id: 'cadillac-escalade-usa',
        vehicleType: 'Cadillac Escalade ESV Luxury VIP Chauffeur SUV',
        operator: 'All-American Executive Chauffeur Services',
        capacity: '5-6 Passengers + Full Luggage',
        defaultPickup: 'LAX / JFK / SFO Curbside VIP Chauffeur Lane',
        defaultDropoff: 'The Plaza New York / Bellagio Las Vegas Lobby',
        driverName: 'Mr. Robert Miller (Licensed Chauffeur)',
        driverContact: '+1 310-555-0199',
        plateNumber: 'CA 7HTL881'
      },
      {
        id: 'sprinter-van-usa',
        vehicleType: 'Mercedes-Benz Sprinter 14-Passenger Executive Van',
        operator: 'Trans-American Tour Fleet Logistics',
        capacity: '12-14 Passengers',
        defaultPickup: 'Airport Arrival Ground Transportation Level',
        defaultDropoff: 'Hotel Porte-Cochère Entrance',
        driverName: 'Mr. James Wilson',
        driverContact: '+1 415-555-0288',
        plateNumber: 'NV HT-2026'
      }
    ]
  },
  {
    countryId: 'australia_nz',
    countryName: 'Australia & New Zealand',
    flag: '🇦🇺',
    popularDestinations: ['Sydney', 'Melbourne', 'Brisbane', 'Gold Coast', 'Cairns', 'Auckland', 'Queenstown'],
    airlines: [
      {
        id: 'qantas',
        name: 'Qantas Airways (Spirit of Australia)',
        iataCode: 'QF',
        defaultFlightNumber: 'QF-20',
        hubTerminal: 'Sydney Kingsford Smith (SYD T1) / Melbourne (MEL)',
        baggageAllowance: '30kg Check-in + 7kg Carry-on',
        cabinClass: 'Economy Standard',
        popularRoutes: [
          'MNL (NAIA T3) ➔ SYD (Sydney Kingsford Smith T1)',
          'MNL (NAIA T3) ➔ BNE (Brisbane International)'
        ]
      },
      {
        id: 'ph-airlines-au',
        name: 'Philippine Airlines (Australia Routes)',
        iataCode: 'PR',
        defaultFlightNumber: 'PR-211',
        hubTerminal: 'NAIA Terminal 2 / Sydney T1',
        baggageAllowance: '30kg Check-in Baggage',
        cabinClass: 'Economy Flex',
        popularRoutes: [
          'MNL (NAIA T2) ➔ SYD (Sydney Kingsford Smith T1)',
          'MNL (NAIA T2) ➔ MEL (Melbourne Tullamarine T2)',
          'MNL (NAIA T2) ➔ BNE (Brisbane International)'
        ]
      },
      {
        id: 'air-nz',
        name: 'Air New Zealand',
        iataCode: 'NZ',
        defaultFlightNumber: 'NZ-28',
        hubTerminal: 'Auckland International Airport (AKL)',
        baggageAllowance: '23kg Check-in + 7kg Carry-on',
        cabinClass: 'The Works Economy',
        popularRoutes: ['SYD (Sydney) ➔ AKL (Auckland) / ZQN (Queenstown)']
      }
    ],
    hotels: [
      {
        id: 'park-hyatt-sydney',
        name: 'Park Hyatt Sydney (Sydney Opera House View)',
        stars: 5,
        defaultRoomType: 'Opera View Deluxe King Room with Private Balcony',
        location: '7 Hickson Road, The Rocks, Sydney, NSW, Australia',
        contactPhone: '+61 2 9256 1234',
        inclusions: 'The Dining Room Gourmet Australian Breakfast, Rooftop Heated Pool with Harbour Views'
      },
      {
        id: 'crown-towers-melbourne',
        name: 'Crown Towers Melbourne',
        stars: 5,
        defaultRoomType: 'Premier Yarra River View King Suite',
        location: '8 Whiteman Street, Southbank, Melbourne, VIC',
        contactPhone: '+61 3 9292 6666',
        inclusions: 'Conservatory International Buffet Breakfast, Crown Spa & 25m Heated Pool Pass'
      }
    ],
    shuttles: [
      {
        id: 'mercedes-v-class-au',
        vehicleType: 'Mercedes-Benz V-Class 7-Seater Luxury Chauffeur Van',
        operator: 'Aussie VIP Airport & Tour Chauffeur',
        capacity: '6 VIP Passengers',
        defaultPickup: 'Sydney SYD T1 International Limousine Bay',
        defaultDropoff: 'Park Hyatt Sydney / The Rocks Hotel Lobby',
        driverName: 'Mr. Liam O\'Connor',
        driverContact: '+61 412 345 678',
        plateNumber: 'NSW HT-8819'
      },
      {
        id: 'mercedes-sprinter-au',
        vehicleType: 'Mercedes-Benz Sprinter 14-Passenger Tour Van',
        operator: 'Down Under Touring & Regional Logistics',
        capacity: '12-14 Passengers',
        defaultPickup: 'Airport Arrival Bay 4',
        defaultDropoff: 'Melbourne CBD / Gold Coast Resort',
        driverName: 'Mr. Callum Smith',
        driverContact: '+61 423 456 789',
        plateNumber: 'VIC 994-HTL'
      }
    ]
  }
];

/**
 * Automatically detects the best matching country from destination and tour title strings
 */
export function detectCountryFromDestination(destination: string, tourTitle: string = ''): CountryLogisticsData {
  const query = `${destination} ${tourTitle}`.toLowerCase();

  // Holy Land / Israel / Jordan / Egypt
  if (
    query.includes('holy land') ||
    query.includes('israel') ||
    query.includes('jerusalem') ||
    query.includes('bethlehem') ||
    query.includes('nazareth') ||
    query.includes('galilee') ||
    query.includes('dead sea') ||
    query.includes('jordan') ||
    query.includes('petra') ||
    query.includes('amman') ||
    query.includes('egypt') ||
    query.includes('cairo') ||
    query.includes('pyramid') ||
    query.includes('tel aviv')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'holyland') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Japan
  if (
    query.includes('japan') ||
    query.includes('tokyo') ||
    query.includes('osaka') ||
    query.includes('kyoto') ||
    query.includes('hokkaido') ||
    query.includes('sapporo') ||
    query.includes('fukuoka') ||
    query.includes('fuji') ||
    query.includes('okinawa') ||
    query.includes('nagoya') ||
    query.includes('hiroshima')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'japan') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // South Korea
  if (
    query.includes('korea') ||
    query.includes('seoul') ||
    query.includes('jeju') ||
    query.includes('busan') ||
    query.includes('incheon') ||
    query.includes('nami island') ||
    query.includes('gangwon')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'south_korea') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Singapore
  if (query.includes('singapore') || query.includes('sentosa') || query.includes('marina bay') || query.includes('changi')) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'singapore') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Thailand
  if (
    query.includes('thailand') ||
    query.includes('bangkok') ||
    query.includes('phuket') ||
    query.includes('chiang mai') ||
    query.includes('pattaya') ||
    query.includes('samui') ||
    query.includes('krabi')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'thailand') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Hong Kong & Macau
  if (
    query.includes('hong kong') ||
    query.includes('hongkong') ||
    query.includes('kowloon') ||
    query.includes('macau') ||
    query.includes('macao') ||
    query.includes('cotai')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'hongkong_macau') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Taiwan
  if (
    query.includes('taiwan') ||
    query.includes('taipei') ||
    query.includes('kaohsiung') ||
    query.includes('taichung') ||
    query.includes('jiufen') ||
    query.includes('sun moon lake')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'taiwan') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Vietnam
  if (
    query.includes('vietnam') ||
    query.includes('hanoi') ||
    query.includes('da nang') ||
    query.includes('danang') ||
    query.includes('hoi an') ||
    query.includes('ho chi minh') ||
    query.includes('saigon') ||
    query.includes('nha trang') ||
    query.includes('ha long') ||
    query.includes('phu quoc')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'vietnam') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // UAE / Dubai
  if (
    query.includes('dubai') ||
    query.includes('uae') ||
    query.includes('abu dhabi') ||
    query.includes('emirates') ||
    query.includes('sharjah')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'uae') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Europe
  if (
    query.includes('europe') ||
    query.includes('paris') ||
    query.includes('france') ||
    query.includes('italy') ||
    query.includes('rome') ||
    query.includes('venice') ||
    query.includes('florence') ||
    query.includes('spain') ||
    query.includes('barcelona') ||
    query.includes('madrid') ||
    query.includes('switzerland') ||
    query.includes('zurich') ||
    query.includes('lucerne') ||
    query.includes('interlaken') ||
    query.includes('amsterdam') ||
    query.includes('london') ||
    query.includes('germany')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'europe') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // USA & Canada
  if (
    query.includes('usa') ||
    query.includes('united states') ||
    query.includes('america') ||
    query.includes('los angeles') ||
    query.includes('san francisco') ||
    query.includes('las vegas') ||
    query.includes('new york') ||
    query.includes('hawaii') ||
    query.includes('honolulu') ||
    query.includes('canada') ||
    query.includes('vancouver') ||
    query.includes('toronto')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'usa_canada') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Australia & NZ
  if (
    query.includes('australia') ||
    query.includes('sydney') ||
    query.includes('melbourne') ||
    query.includes('brisbane') ||
    query.includes('gold coast') ||
    query.includes('new zealand') ||
    query.includes('auckland') ||
    query.includes('queenstown')
  ) {
    return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'australia_nz') || COUNTRY_LOGISTICS_DIRECTORY[0];
  }

  // Default to Philippines Domestic
  return COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === 'philippines') || COUNTRY_LOGISTICS_DIRECTORY[0];
}

export const getLogisticsByDestinationOrCountry = detectCountryFromDestination;
