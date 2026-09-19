export interface LogisticsSuggestion {
  flight: {
    airline: string;
    flightNumber: string;
    route: string;
    terminal: string;
    etd: string;
    eta: string;
    cabinClass: string;
    baggageAllowance: string;
  };
  hotel: {
    hotelName: string;
    roomType: string;
    location: string;
    contactPhone: string;
    inclusions: string;
  };
  transport: {
    vehicleType: string;
    operator: string;
    pickupLocation: string;
    dropoffLocation: string;
    driverName: string;
    driverContact: string;
    plateNumber: string;
  };
}

export function getLogisticsSuggestions(destination: string, tourTitle: string): LogisticsSuggestion {
  const destLower = (destination + ' ' + tourTitle).toLowerCase();

  // 1. Domestic Philippines
  if (
    destLower.includes('palawan') ||
    destLower.includes('el nido') ||
    destLower.includes('coron') ||
    destLower.includes('puerto princesa')
  ) {
    return {
      flight: {
        airline: 'Philippine Airlines / AirSWIFT Express',
        flightNumber: 'PR-2196 / T4-502',
        route: 'MNL (Manila NAIA T2) ➔ ENI (El Nido Lio Airport)',
        terminal: 'NAIA Terminal 2 Domestic',
        etd: '07:15 AM',
        eta: '08:40 AM',
        cabinClass: 'Economy Prime with 20kg Baggage',
        baggageAllowance: '20kg Check-in + 7kg Carry-on'
      },
      hotel: {
        hotelName: 'El Nido Beachfront Eco-Resort & Spa',
        roomType: 'Deluxe Seaview Villa with Balcony',
        location: 'Bacuit Bay Coastal Strip, El Nido, Palawan',
        contactPhone: '+63 917 888 2026',
        inclusions: 'Daily Gourmet Island Buffet Breakfast & Welcome Drink'
      },
      transport: {
        vehicleType: 'Toyota HiAce GL Grandia (Air-Conditioned VIP Tourist Van)',
        operator: 'Holiday Travelers Palawan Island Fleet',
        pickupLocation: 'Lio Airport / Puerto Princesa Arrival Gate',
        dropoffLocation: 'Resort Lobby Main Entrance',
        driverName: 'Kuya Ronald Mendoza (DOT Licensed)',
        driverContact: '+63 928 333 4444',
        plateNumber: 'NAA-8842'
      }
    };
  }

  if (destLower.includes('boracay') || destLower.includes('caticlan') || destLower.includes('aklan')) {
    return {
      flight: {
        airline: 'Philippine Airlines (PAL Express)',
        flightNumber: 'PR-2041',
        route: 'MNL (Manila NAIA T2) ➔ MPH (Caticlan Boracay Airport)',
        terminal: 'NAIA Terminal 2 Domestic',
        etd: '08:30 AM',
        eta: '09:35 AM',
        cabinClass: 'Economy Flex',
        baggageAllowance: '20kg Check-in + 7kg Carry-on'
      },
      hotel: {
        hotelName: 'Henann Palm Beach Resort Boracay',
        roomType: 'Premier Room with Direct Pool Access',
        location: 'Station 2 Beachfront, Boracay Island',
        contactPhone: '+63 36 288 1200',
        inclusions: 'Buffet Breakfast for 2 & Direct Airport Transfer Service'
      },
      transport: {
        vehicleType: 'Private Tourist Coaster Shuttle Van',
        operator: 'Boracay Island Southwest Express',
        pickupLocation: 'Caticlan Airport Welcome Lounge',
        dropoffLocation: 'Henann Resort Main Lobby',
        driverName: 'Kuya Jojo Santos',
        driverContact: '+63 919 444 5555',
        plateNumber: 'ABY-4921'
      }
    };
  }

  if (destLower.includes('batanes') || destLower.includes('basco')) {
    return {
      flight: {
        airline: 'Philippine Airlines (PAL Express Dash 8-Q400)',
        flightNumber: 'PR-2932',
        route: 'MNL (Manila NAIA T2) ➔ BSO (Basco Batanes Airport)',
        terminal: 'NAIA Terminal 2 Domestic',
        etd: '06:00 AM',
        eta: '07:45 AM',
        cabinClass: 'Batanes Heritage Class',
        baggageAllowance: '10kg Check-in + 5kg Carry-on'
      },
      hotel: {
        hotelName: 'Fundacion Pacita Batanes Nature Lodge',
        roomType: 'Traditional Ivatan Stone Suite (Ocean Terrace)',
        location: 'Chanarian Hills, Basco, Batanes',
        contactPhone: '+63 927 290 2400',
        inclusions: 'Organic Farm-to-Table Breakfast & Coffee'
      },
      transport: {
        vehicleType: 'Custom Safari Tram & Air-conditioned 4WD Van',
        operator: 'Batanes Ivatan Heritage Transport Group',
        pickupLocation: 'Basco Airport Terminal Arrival',
        dropoffLocation: 'Fundacion Pacita Resort',
        driverName: 'Tatay Edward Castillejos',
        driverContact: '+63 920 888 1122',
        plateNumber: 'IVT-2026'
      }
    };
  }

  if (destLower.includes('cebu') || destLower.includes('bohol') || destLower.includes('panglao')) {
    return {
      flight: {
        airline: 'Philippine Airlines',
        flightNumber: 'PR-1845',
        route: 'MNL (Manila NAIA T2) ➔ CEB (Mactan Cebu T1) / TAG (Panglao)',
        terminal: 'NAIA Terminal 2 Domestic',
        etd: '09:10 AM',
        eta: '10:30 AM',
        cabinClass: 'Economy Choice',
        baggageAllowance: '20kg Check-in + 7kg Carry-on'
      },
      hotel: {
        hotelName: 'Bluewater Maribago / Amorita Resort Panglao',
        roomType: 'Deluxe Garden Bungalow',
        location: 'Panglao Island Beachfront, Bohol',
        contactPhone: '+63 38 502 9002',
        inclusions: 'Complimentary Breakfast & Ocean Kayak Access'
      },
      transport: {
        vehicleType: 'Toyota Commuter VIP Deluxe Van',
        operator: 'Visayas Airport Shuttle Express',
        pickupLocation: 'Panglao Bohol International Airport',
        dropoffLocation: 'Amorita Resort Gate',
        driverName: 'Kuya Bryan Tan',
        driverContact: '+63 917 555 7788',
        plateNumber: 'GAF-7391'
      }
    };
  }

  // 2. Japan (Tokyo / Osaka / Kyoto / Hokkaido)
  if (destLower.includes('japan') || destLower.includes('tokyo') || destLower.includes('osaka') || destLower.includes('kyoto') || destLower.includes('hokkaido')) {
    return {
      flight: {
        airline: 'Japan Airlines (JAL) / All Nippon Airways (ANA)',
        flightNumber: 'JL-078 / NH-870',
        route: 'MNL (Manila NAIA T1/T3) ➔ HND/NRT (Tokyo Haneda / Narita)',
        terminal: 'NAIA Terminal 3 International',
        etd: '09:20 AM',
        eta: '02:40 PM',
        cabinClass: 'Economy Main Cabin (2x 23kg Check-in)',
        baggageAllowance: '46kg (2x 23kg) Check-in + 10kg Carry-on'
      },
      hotel: {
        hotelName: 'Keio Plaza Hotel Tokyo / Hotel Gracery Shinjuku',
        roomType: 'Superior Twin Room (Tokyo Skyline View)',
        location: 'Shinjuku-ku, Tokyo, Japan',
        contactPhone: '+81 3-3344-0111',
        inclusions: 'Japanese & Western Buffet Breakfast, High-speed Wi-Fi'
      },
      transport: {
        vehicleType: 'Private Hino VIP Luxury Motorcoach & Shinkansen Bullet Pass',
        operator: 'Tokyo Hato Sightseeing Limousine Service',
        pickupLocation: 'Narita / Haneda Airport International Arrivals Gate',
        dropoffLocation: 'Keio Plaza Hotel Main Entrance',
        driverName: 'Sato-san (Licensed Green Plate Chauffeur)',
        driverContact: '+81 90-4421-8899',
        plateNumber: 'Tokyo 300 A 77-22'
      }
    };
  }

  // 3. South Korea (Seoul / Busan / Jeju)
  if (destLower.includes('korea') || destLower.includes('seoul') || destLower.includes('jeju') || destLower.includes('busan')) {
    return {
      flight: {
        airline: 'Korean Air / Asiana Airlines',
        flightNumber: 'KE-622 / OZ-702',
        route: 'MNL (Manila NAIA T1) ➔ ICN (Seoul Incheon Airport T2)',
        terminal: 'NAIA Terminal 1 International',
        etd: '12:30 PM',
        eta: '05:40 PM',
        cabinClass: 'Economy Standard',
        baggageAllowance: '23kg Check-in + 10kg Carry-on'
      },
      hotel: {
        hotelName: 'Lotte Hotel Seoul / Novotel Ambassador Dongdaemun',
        roomType: 'Deluxe Twin City View Room',
        location: 'Jung-gu, Myeongdong, Seoul, South Korea',
        contactPhone: '+82 2-771-1000',
        inclusions: 'International Breakfast Buffet & Sauna Access'
      },
      transport: {
        vehicleType: 'Hyundai Universe Express Luxury Limousine Bus',
        operator: 'Seoul AREX K-Tour Transit',
        pickupLocation: 'Incheon International Airport T2 Terminal Gate 4',
        dropoffLocation: 'Lotte Hotel Seoul Lobby',
        driverName: 'Park Min-ho (English-Guided Escort)',
        driverContact: '+82 10-3392-1082',
        plateNumber: 'Seoul 70 Ba 4892'
      }
    };
  }

  // 4. Middle East & Holy Land (Jordan / Israel / Egypt / Dubai)
  if (destLower.includes('holyland') || destLower.includes('jordan') || destLower.includes('israel') || destLower.includes('egypt') || destLower.includes('dubai') || destLower.includes('emirates')) {
    return {
      flight: {
        airline: 'Qatar Airways (5-Star Full Service) / Emirates',
        flightNumber: 'QR-933 ➔ QR-402',
        route: 'MNL (Manila NAIA T3) ➔ DOH (Doha) ➔ AMM (Queen Alia Airport, Jordan)',
        terminal: 'NAIA Terminal 3 International',
        etd: '06:30 PM',
        eta: '05:15 AM (+1)',
        cabinClass: 'Economy Choice (Gourmet Dining + 30kg)',
        baggageAllowance: '30kg Check-in + 7kg Hand-carry'
      },
      hotel: {
        hotelName: 'Amman Grand Palace & Wadi Rum UFO Stargazing Bubble Resort',
        roomType: 'Panoramic Stargazing Bubble Suite',
        location: 'Wadi Rum Protected Desert Reserve, Jordan',
        contactPhone: '+962 3 209 0000',
        inclusions: 'Bedouin BBQ Feast, Buffet Breakfast, Camel Trek'
      },
      transport: {
        vehicleType: 'Mercedes-Benz Travego VIP Motorcoach (Wi-Fi & Restroom Onboard)',
        operator: 'Jordan & Holy Land International Tourist Transport Board',
        pickupLocation: 'Queen Alia International Airport (AMM)',
        dropoffLocation: 'Grand Palace Amman / Wadi Rum Camp',
        driverName: 'Tariq Al-Mansoor (Diplomatic Escort Driver)',
        driverContact: '+962 7 9512 8840',
        plateNumber: 'AMM-9941-TOUR'
      }
    };
  }

  // 5. Europe / Switzerland / France / Italy
  if (destLower.includes('europe') || destLower.includes('switzerland') || destLower.includes('paris') || destLower.includes('italy') || destLower.includes('rome')) {
    return {
      flight: {
        airline: 'Singapore Airlines / Turkish Airlines / Emirates',
        flightNumber: 'SQ-917 ➔ SQ-346',
        route: 'MNL (Manila NAIA T3) ➔ SIN (Changi) ➔ ZRH (Zurich International)',
        terminal: 'NAIA Terminal 3 International',
        etd: '02:15 PM',
        eta: '08:00 AM (+1)',
        cabinClass: 'International Long-Haul Economy',
        baggageAllowance: '30kg Check-in + 7kg Carry-on'
      },
      hotel: {
        hotelName: 'Grand Hotel Victoria-Jungfrau Interlaken',
        roomType: 'Superior Alpine Mountain View Room',
        location: 'Interlaken Alpine Region, Bernese Oberland, Switzerland',
        contactPhone: '+41 33 828 28 28',
        inclusions: 'Swiss Alpine Breakfast Buffet & Swiss Travel Pass Integration'
      },
      transport: {
        vehicleType: 'Setra S 516 HD Luxury Panoramic Touring Coach + Glacier Express Rail',
        operator: 'Swiss Alpine Voyager Logistics S.A.',
        pickupLocation: 'Zurich Airport Coach Terminal Bay 3',
        dropoffLocation: 'Victoria-Jungfrau Interlaken',
        driverName: 'Hansruedi Keller (Chamonix & Alpine Certified)',
        driverContact: '+41 79 330 9122',
        plateNumber: 'ZH-402-991'
      }
    };
  }

  // Default General / Regional Southeast Asia (Singapore, Thailand, Vietnam, Bali)
  return {
    flight: {
      airline: 'Philippine Airlines / Singapore Airlines',
      flightNumber: 'PR-507 / SQ-915',
      route: `MNL (Manila NAIA) ➔ ${destination}`,
      terminal: 'NAIA Terminal 2/3 International',
      etd: '08:45 AM',
      eta: '12:30 PM',
      cabinClass: 'Economy Flex',
      baggageAllowance: '25kg Check-in + 7kg Carry-on'
    },
    hotel: {
      hotelName: `${destination} Grand Resort & Wellness Suites`,
      roomType: 'Deluxe Premier Suite',
      location: `Prime Coastal District, ${destination}`,
      contactPhone: '+63 2 8888 2026',
      inclusions: 'Daily International Buffet Breakfast for all guests'
    },
    transport: {
      vehicleType: 'Mercedes Sprinter / Toyota Commuter VIP Touring Van',
      operator: 'Holiday Travelers Global Partner Alliance',
      pickupLocation: 'Airport Arrival International Hall Gate 2',
      dropoffLocation: 'Resort Main Portico',
      driverName: 'Designated Assigned Senior Driver',
      driverContact: '+63 916 525 3517',
      plateNumber: 'TOUR-DISPATCH-TBA'
    }
  };
}
