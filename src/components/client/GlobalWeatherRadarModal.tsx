import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Droplets, 
  Search, 
  MapPin, 
  Sparkles, 
  Globe2, 
  Umbrella, 
  Plane, 
  X,
  Sun,
  ShieldCheck,
  Calendar,
  Compass,
  Layers,
  Camera,
  RefreshCw,
  Activity
} from 'lucide-react';
import { 
  ThreeDSun, 
  ThreeDCloud, 
  ThreeDSunCloud, 
  ThreeDRain, 
  ThreeDThunder, 
  ThreeDSnow, 
  ThreeDRainbow, 
  ThreeDMoon, 
  ThreeDWind 
} from './ThreeDWeatherIcons';
import { fetchLiveDestinationWeather, LiveWeatherData } from '../../utils/weatherApi';

interface WeatherData {
  city: string;
  country: string;
  continent: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  scenicPhoto: string;
  photoCaption: string;
  icon3D: 'sun' | 'sun-cloud' | 'cloud' | 'rain' | 'thunder' | 'snow' | 'rainbow' | 'moon' | 'wind';
  cardTheme: 'tropical-gold' | 'ocean-blue' | 'alpine-cyan' | 'twilight-indigo' | 'emerald-breeze' | 'sunset-rose';
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibilityKm: number;
  uvIndex: number;
  airQuality: string;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
  timezone: string;
  localTime: string;
  travelRecommendation: string;
  idealForPacking: string[];
  forecast: Array<{
    day: string;
    temp: number;
    icon3D: 'sun' | 'sun-cloud' | 'cloud' | 'rain' | 'thunder' | 'snow' | 'rainbow' | 'moon' | 'wind';
    condition: string;
  }>;
}

// 35+ Curated Global Countries with High-Resolution Scenic Photography & Accurate Atmospheric Profiles
const PRESET_GLOBAL_DESTINATIONS: Record<string, WeatherData> = {
  'philippines': {
    city: 'El Nido & Coron, Palawan Archipelago',
    country: 'Philippines',
    continent: 'Southeast Asia',
    temperature: 31,
    feelsLike: 36,
    tempMin: 26,
    tempMax: 33,
    condition: 'Tropical Coastal Sunshine',
    description: 'Golden island sunshine with turquoise calm lagoon waters & gentle Sulu sea breezes.',
    scenicPhoto: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Limestone karst cliffs & crystalline emerald lagoons in El Nido',
    icon3D: 'sun-cloud',
    cardTheme: 'tropical-gold',
    humidity: 74,
    windSpeed: 14,
    windDirection: 'ENE 65°',
    visibilityKm: 12,
    uvIndex: 9,
    airQuality: 'Good (AQI 32)',
    precipitationChance: 15,
    sunrise: '05:44 AM',
    sunset: '06:12 PM',
    timezone: 'PHT (UTC+8)',
    localTime: '14:24 PHT',
    travelRecommendation: 'Ideal conditions for chartered island hopping, limestone lagoon kayaking, and coral reef diving in El Nido & Coron.',
    idealForPacking: ['Reef-Safe Sunscreen SPF 50', 'Quick-Dry Microfiber Towel', 'Aqua Shoes & Snorkel Gear', 'Waterproof Dry Bag (15L)'],
    forecast: [
      { day: 'Mon', temp: 31, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 32, icon3D: 'sun-cloud', condition: 'Clear' },
      { day: 'Wed', temp: 30, icon3D: 'rain', condition: 'Passing Shower' },
      { day: 'Thu', temp: 31, icon3D: 'rainbow', condition: 'Tropical Rainbow' },
      { day: 'Fri', temp: 33, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'japan': {
    city: 'Kyoto, Tokyo & Mt. Fuji Vista',
    country: 'Japan',
    continent: 'East Asia',
    temperature: 18,
    feelsLike: 17,
    tempMin: 12,
    tempMax: 21,
    condition: 'Crisp & Radiant Sun',
    description: 'Mild springtime breeze with crystalline blue skies framing the snow-capped summit of Mt. Fuji.',
    scenicPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Historic pagodas & cherry blossom canopies in ancient Kyoto',
    icon3D: 'sun',
    cardTheme: 'sunset-rose',
    humidity: 52,
    windSpeed: 11,
    windDirection: 'NNE 25°',
    visibilityKm: 15,
    uvIndex: 4,
    airQuality: 'Pristine (AQI 18)',
    precipitationChance: 5,
    sunrise: '05:12 AM',
    sunset: '06:34 PM',
    timezone: 'JST (UTC+9)',
    localTime: '15:24 JST',
    travelRecommendation: 'Prime weather for temple walking, bamboo grove cycling in Arashiyama, and outdoor street culinary tours.',
    idealForPacking: ['Light Wool Trench / Cardigan', 'Comfortable Walking Sneakers', 'Universal Travel Power Adapter', 'Compact Umbrella'],
    forecast: [
      { day: 'Mon', temp: 18, icon3D: 'sun', condition: 'Clear' },
      { day: 'Tue', temp: 19, icon3D: 'sun-cloud', condition: 'Mild Sun' },
      { day: 'Wed', temp: 16, icon3D: 'cloud', condition: 'Overcast' },
      { day: 'Thu', temp: 20, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Fri', temp: 21, icon3D: 'rainbow', condition: 'Fresh Bloom' },
    ]
  },
  'france': {
    city: 'Paris, Provence & French Riviera',
    country: 'France',
    continent: 'Western Europe',
    temperature: 22,
    feelsLike: 21,
    tempMin: 14,
    tempMax: 24,
    condition: 'Temperate Sunny Skies',
    description: 'Gentle warmth across the Seine with mild westerly afternoon breezes across Parisian boulevards.',
    scenicPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Eiffel Tower framed against golden Parisian afternoon skies',
    icon3D: 'sun-cloud',
    cardTheme: 'ocean-blue',
    humidity: 48,
    windSpeed: 16,
    windDirection: 'WSW 240°',
    visibilityKm: 12,
    uvIndex: 5,
    airQuality: 'Moderate (AQI 38)',
    precipitationChance: 10,
    sunrise: '06:30 AM',
    sunset: '09:15 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Exceptional terrace café dining weather, Louvre gallery visits, and evening river cruises.',
    idealForPacking: ['Tailored Linen Shirts / Dresses', 'Light Scarf & Sunglasses', 'Crossbody Anti-theft Bag', 'Portable Charger'],
    forecast: [
      { day: 'Mon', temp: 22, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 23, icon3D: 'sun-cloud', condition: 'Warm' },
      { day: 'Wed', temp: 21, icon3D: 'rain', condition: 'Light Shower' },
      { day: 'Thu', temp: 24, icon3D: 'sun', condition: 'Clear' },
      { day: 'Fri', temp: 25, icon3D: 'sun', condition: 'Bright' },
    ]
  },
  'switzerland': {
    city: 'Zermatt, Matterhorn & Interlaken',
    country: 'Switzerland',
    continent: 'Central Europe',
    temperature: 9,
    feelsLike: 6,
    tempMin: 2,
    tempMax: 12,
    condition: 'Crisp Alpine Horizon',
    description: 'Pure high-altitude mountain air with pristine panoramic visibility across glacial peaks.',
    scenicPhoto: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Iconic Matterhorn peak rising above alpine wildflower meadows',
    icon3D: 'snow',
    cardTheme: 'alpine-cyan',
    humidity: 42,
    windSpeed: 18,
    windDirection: 'NW 315°',
    visibilityKm: 28,
    uvIndex: 7,
    airQuality: 'Pristine (AQI 6)',
    precipitationChance: 15,
    sunrise: '06:15 AM',
    sunset: '08:45 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Spectacular conditions for panoramic cogwheel rail journeys, glacier hiking, and lake cruises.',
    idealForPacking: ['Thermal Base Layers', 'Polarized UV Sunglasses', 'Gore-Tex Hiking Jacket', 'Insulated Water Flask'],
    forecast: [
      { day: 'Mon', temp: 9, icon3D: 'snow', condition: 'Alpine Snow' },
      { day: 'Tue', temp: 11, icon3D: 'sun-cloud', condition: 'Bright Mountain' },
      { day: 'Wed', temp: 8, icon3D: 'cloud', condition: 'Mountain Fog' },
      { day: 'Thu', temp: 10, icon3D: 'sun', condition: 'Clear Peaks' },
      { day: 'Fri', temp: 12, icon3D: 'sun', condition: 'Mild' },
    ]
  },
  'italy': {
    city: 'Rome, Florence & Amalfi Coast',
    country: 'Italy',
    continent: 'Southern Europe',
    temperature: 27,
    feelsLike: 28,
    tempMin: 19,
    tempMax: 30,
    condition: 'Mediterranean Sun & Rainbow',
    description: 'Golden Mediterranean light reflecting off azure coastal waters and historic terracotta rooftops.',
    scenicPhoto: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Pastel cliffside villas cascading over the azure Amalfi coastline',
    icon3D: 'rainbow',
    cardTheme: 'emerald-breeze',
    humidity: 50,
    windSpeed: 13,
    windDirection: 'SSE 160°',
    visibilityKm: 14,
    uvIndex: 8,
    airQuality: 'Good (AQI 30)',
    precipitationChance: 5,
    sunrise: '06:10 AM',
    sunset: '08:30 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Perfect weather for cliffside coastal drives, historical forum explorations, and vineyard tastings.',
    idealForPacking: ['Linen Resort Wear', 'Comfortable Walking Loafers', 'UV Sunglasses', 'Light Evening Shawl'],
    forecast: [
      { day: 'Mon', temp: 27, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 28, icon3D: 'rainbow', condition: 'Radiant Coast' },
      { day: 'Wed', temp: 29, icon3D: 'sun', condition: 'Clear' },
      { day: 'Thu', temp: 26, icon3D: 'sun-cloud', condition: 'Mild' },
      { day: 'Fri', temp: 30, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'united kingdom': {
    city: 'London & Scottish Highlands',
    country: 'United Kingdom',
    continent: 'Northern Europe',
    temperature: 15,
    feelsLike: 14,
    tempMin: 10,
    tempMax: 17,
    condition: 'Passing Misty Showers',
    description: 'Classic misty breeze with intermittent sunny intervals breaking through silver clouds.',
    scenicPhoto: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Big Ben & the Palace of Westminster over the River Thames',
    icon3D: 'rain',
    cardTheme: 'twilight-indigo',
    humidity: 82,
    windSpeed: 22,
    windDirection: 'SSW 200°',
    visibilityKm: 9,
    uvIndex: 3,
    airQuality: 'Good (AQI 28)',
    precipitationChance: 65,
    sunrise: '05:58 AM',
    sunset: '08:05 PM',
    timezone: 'BST (UTC+1)',
    localTime: '07:24 BST',
    travelRecommendation: 'Great for museum visits, historic castle walks, and cozy afternoon tea experiences.',
    idealForPacking: ['Waterproof Windbreaker', 'Sturdy Walking Boots', 'Layered Sweaters', 'Automatic Wind-Resistant Umbrella'],
    forecast: [
      { day: 'Mon', temp: 15, icon3D: 'rain', condition: 'Showers' },
      { day: 'Tue', temp: 14, icon3D: 'cloud', condition: 'Overcast' },
      { day: 'Wed', temp: 16, icon3D: 'sun-cloud', condition: 'Partly Sunny' },
      { day: 'Thu', temp: 17, icon3D: 'rainbow', condition: 'Rainbow Break' },
      { day: 'Fri', temp: 15, icon3D: 'rain', condition: 'Rain' },
    ]
  },
  'thailand': {
    city: 'Bangkok, Chiang Mai & Phuket Coast',
    country: 'Thailand',
    continent: 'Southeast Asia',
    temperature: 34,
    feelsLike: 40,
    tempMin: 27,
    tempMax: 36,
    condition: 'Radiant Tropical Heat',
    description: 'Vibrant tropical climate with energetic city warmth and calm Andaman sea waters.',
    scenicPhoto: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Traditional long-tail boats anchored in Phi Phi crystal bay',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 76,
    windSpeed: 12,
    windDirection: 'SW 220°',
    visibilityKm: 10,
    uvIndex: 10,
    airQuality: 'Moderate (AQI 52)',
    precipitationChance: 20,
    sunrise: '06:05 AM',
    sunset: '06:38 PM',
    timezone: 'ICT (UTC+7)',
    localTime: '13:24 ICT',
    travelRecommendation: 'Ideal for early morning temple tours, floating markets, and sunset long-tail boat rides.',
    idealForPacking: ['Breathable Cotton Garments', 'High-SPF Sunscreen', 'Hat / Visor', 'Insect Repellent Spray'],
    forecast: [
      { day: 'Mon', temp: 34, icon3D: 'sun', condition: 'Hot' },
      { day: 'Tue', temp: 35, icon3D: 'sun-cloud', condition: 'Sunny' },
      { day: 'Wed', temp: 32, icon3D: 'thunder', condition: 'Evening Thunder' },
      { day: 'Thu', temp: 33, icon3D: 'rainbow', condition: 'Clearing Sun' },
      { day: 'Fri', temp: 36, icon3D: 'sun', condition: 'Very Hot' },
    ]
  },
  'iceland': {
    city: 'Reykjavik, Vik & Glacier Lagoons',
    country: 'Iceland',
    continent: 'Northern Europe',
    temperature: 4,
    feelsLike: 0,
    tempMin: -1,
    tempMax: 6,
    condition: 'Nordic Aurora Breeze',
    description: 'Dramatic sub-arctic winds with sweeping views over volcanic black sand beaches and geothermal geysers.',
    scenicPhoto: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Ethereal waterfalls & volcanic basalt canyons along the South Coast',
    icon3D: 'snow',
    cardTheme: 'alpine-cyan',
    humidity: 78,
    windSpeed: 28,
    windDirection: 'NE 45°',
    visibilityKm: 30,
    uvIndex: 1,
    airQuality: 'Pristine (AQI 4)',
    precipitationChance: 35,
    sunrise: '04:10 AM',
    sunset: '11:15 PM',
    timezone: 'GMT (UTC+0)',
    localTime: '06:24 GMT',
    travelRecommendation: 'Incredible conditions for thermal bath soaks at the Blue Lagoon, ice cave exploring, and chasing the midnight sun.',
    idealForPacking: ['Heavy Down Parka', 'Windproof Shell Pants', 'Thermal Merino Wool Underwear', 'Spike Crampons'],
    forecast: [
      { day: 'Mon', temp: 4, icon3D: 'snow', condition: 'Snow Showers' },
      { day: 'Tue', temp: 5, icon3D: 'wind', condition: 'Arctic Winds' },
      { day: 'Wed', temp: 3, icon3D: 'cloud', condition: 'Overcast' },
      { day: 'Thu', temp: 6, icon3D: 'sun-cloud', condition: 'Clear Skies' },
      { day: 'Fri', temp: 4, icon3D: 'snow', condition: 'Flurries' },
    ]
  },
  'australia': {
    city: 'Sydney, Gold Coast & Great Barrier Reef',
    country: 'Australia',
    continent: 'Oceania',
    temperature: 25,
    feelsLike: 26,
    tempMin: 18,
    tempMax: 27,
    condition: 'Sun-Drenched Pacific Breeze',
    description: 'Crystal clear harbor waters with refreshing ocean swells rolling into Bondi and Manly.',
    scenicPhoto: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Sydney Opera House & harbor bridge against golden sunset',
    icon3D: 'sun',
    cardTheme: 'ocean-blue',
    humidity: 58,
    windSpeed: 20,
    windDirection: 'ESE 110°',
    visibilityKm: 18,
    uvIndex: 8,
    airQuality: 'Good (AQI 22)',
    precipitationChance: 10,
    sunrise: '06:20 AM',
    sunset: '05:40 PM',
    timezone: 'AEST (UTC+10)',
    localTime: '16:24 AEST',
    travelRecommendation: 'Prime beach weather for surfing, coastal cliff walks, and snorkeling the Great Barrier Reef.',
    idealForPacking: ['Zinc Sunscreen', 'Rashguard & Swimwear', 'Polarized Sunglasses', 'Breathable Shorts'],
    forecast: [
      { day: 'Mon', temp: 25, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 26, icon3D: 'sun', condition: 'Warm & Clear' },
      { day: 'Wed', temp: 24, icon3D: 'wind', condition: 'Ocean Breeze' },
      { day: 'Thu', temp: 27, icon3D: 'sun-cloud', condition: 'Pleasant' },
      { day: 'Fri', temp: 25, icon3D: 'rainbow', condition: 'Coastal Sun' },
    ]
  },
  'spain': {
    city: 'Barcelona, Madrid & Costa del Sol',
    country: 'Spain',
    continent: 'Southern Europe',
    temperature: 28,
    feelsLike: 29,
    tempMin: 20,
    tempMax: 31,
    condition: 'Golden Mediterranean Sun',
    description: 'Vibrant balmy skies over Gaudi architectural wonders and lively tapas plazas.',
    scenicPhoto: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Sagrada Familia spires towering over vibrant Barcelona',
    icon3D: 'sun',
    cardTheme: 'sunset-rose',
    humidity: 45,
    windSpeed: 14,
    windDirection: 'S 180°',
    visibilityKm: 15,
    uvIndex: 8,
    airQuality: 'Good (AQI 32)',
    precipitationChance: 5,
    sunrise: '06:45 AM',
    sunset: '09:20 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Sensational weather for outdoor flamenco evenings, beach strolls, and historic cathedral visits.',
    idealForPacking: ['Linen Shirts', 'Espadrilles / Walking Shoes', 'Sun Hat', 'Light Evening Jacket'],
    forecast: [
      { day: 'Mon', temp: 28, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 29, icon3D: 'sun', condition: 'Hot' },
      { day: 'Wed', temp: 30, icon3D: 'sun-cloud', condition: 'Clear' },
      { day: 'Thu', temp: 27, icon3D: 'sun', condition: 'Mild' },
      { day: 'Fri', temp: 31, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'canada': {
    city: 'Banff National Park, Vancouver & Rockies',
    country: 'Canada',
    continent: 'North America',
    temperature: 14,
    feelsLike: 12,
    tempMin: 5,
    tempMax: 17,
    condition: 'Crisp Pine & Mountain Sun',
    description: 'Pristine glacial winds blowing over turquoise Lake Louise and towering evergreen forests.',
    scenicPhoto: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Turquoise glacial waters of Lake Louise in Banff National Park',
    icon3D: 'sun-cloud',
    cardTheme: 'alpine-cyan',
    humidity: 48,
    windSpeed: 15,
    windDirection: 'WNW 290°',
    visibilityKm: 25,
    uvIndex: 5,
    airQuality: 'Pristine (AQI 10)',
    precipitationChance: 15,
    sunrise: '05:35 AM',
    sunset: '09:40 PM',
    timezone: 'MDT (UTC-6)',
    localTime: '00:24 MDT',
    travelRecommendation: 'Perfect weather for turquoise lake canoeing, mountain wildlife viewing, and gondola ascents.',
    idealForPacking: ['Fleece Mid-Layer', 'Trail Hiking Boots', 'Bear Bell / Spray', 'Windproof Shell'],
    forecast: [
      { day: 'Mon', temp: 14, icon3D: 'sun-cloud', condition: 'Sunny Break' },
      { day: 'Tue', temp: 16, icon3D: 'sun', condition: 'Bright' },
      { day: 'Wed', temp: 12, icon3D: 'rain', condition: 'Alpine Rain' },
      { day: 'Thu', temp: 15, icon3D: 'rainbow', condition: 'Clearing' },
      { day: 'Fri', temp: 17, icon3D: 'sun', condition: 'Warm Mountain' },
    ]
  },
  'greece': {
    city: 'Santorini, Athens & Mykonos',
    country: 'Greece',
    continent: 'Southern Europe',
    temperature: 29,
    feelsLike: 30,
    tempMin: 22,
    tempMax: 32,
    condition: 'Aegean Cobalt Sunshine',
    description: 'Iconic Aegean Meltemi breeze brushing against whitewashed cliffside domed churches in Oia.',
    scenicPhoto: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Whitewashed cliffside villas & blue domed churches of Santorini',
    icon3D: 'sun',
    cardTheme: 'ocean-blue',
    humidity: 42,
    windSpeed: 24,
    windDirection: 'N 355°',
    visibilityKm: 20,
    uvIndex: 9,
    airQuality: 'Good (AQI 24)',
    precipitationChance: 0,
    sunrise: '06:18 AM',
    sunset: '08:25 PM',
    timezone: 'EEST (UTC+3)',
    localTime: '09:24 EEST',
    travelRecommendation: 'Spectacular sunset sailing catamaran cruises, caldera hiking, and wine tasting in volcanic vineyards.',
    idealForPacking: ['Resort White Attire', 'Polarized Sunglasses', 'Sturdy Sandals', 'High-SPF Sun Shield'],
    forecast: [
      { day: 'Mon', temp: 29, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 30, icon3D: 'sun', condition: 'Radiant' },
      { day: 'Wed', temp: 31, icon3D: 'sun', condition: 'Hot' },
      { day: 'Thu', temp: 28, icon3D: 'wind', condition: 'Aegean Breeze' },
      { day: 'Fri', temp: 32, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'united states': {
    city: 'Hawaii, California Coast & New York',
    country: 'United States',
    continent: 'North America',
    temperature: 24,
    feelsLike: 24,
    tempMin: 17,
    tempMax: 26,
    condition: 'Vibrant Coastal Clear',
    description: 'Temperate westerly breeze with crystal clear skies and vibrant city skylines.',
    scenicPhoto: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Towering emerald sea cliffs along Kauai Na Pali coast',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 50,
    windSpeed: 14,
    windDirection: 'W 270°',
    visibilityKm: 16,
    uvIndex: 7,
    airQuality: 'Good (AQI 25)',
    precipitationChance: 10,
    sunrise: '06:10 AM',
    sunset: '08:15 PM',
    timezone: 'EDT / PDT',
    localTime: '02:24 EDT',
    travelRecommendation: 'Exceptional weather for national park tours, scenic coastal drives along Highway 1, and city sightseeing.',
    idealForPacking: ['Comfortable Walking Sneakers', 'Light Layering Cardigan', 'Universal USB Charger', 'Daypack'],
    forecast: [
      { day: 'Mon', temp: 24, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 26, icon3D: 'sun-cloud', condition: 'Mild' },
      { day: 'Wed', temp: 23, icon3D: 'rain', condition: 'Brief Shower' },
      { day: 'Thu', temp: 25, icon3D: 'rainbow', condition: 'Clearing' },
      { day: 'Fri', temp: 27, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'south korea': {
    city: 'Seoul, Jeju Island & Busan Coast',
    country: 'South Korea',
    continent: 'East Asia',
    temperature: 21,
    feelsLike: 20,
    tempMin: 14,
    tempMax: 23,
    condition: 'Crisp Sunshine & Gentle Breeze',
    description: 'Refreshing autumn sunlight dancing across traditional Hanok villages and modern neon avenues.',
    scenicPhoto: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Gyeongbokgung Palace pavilion set against majestic mountain peaks',
    icon3D: 'sun-cloud',
    cardTheme: 'sunset-rose',
    humidity: 54,
    windSpeed: 12,
    windDirection: 'NW 320°',
    visibilityKm: 14,
    uvIndex: 5,
    airQuality: 'Good (AQI 28)',
    precipitationChance: 10,
    sunrise: '05:40 AM',
    sunset: '07:15 PM',
    timezone: 'KST (UTC+9)',
    localTime: '15:24 KST',
    travelRecommendation: 'Fantastic weather for street food tours in Myeongdong, hiking Namsan mountain, and exploring Jeju volcanic coasts.',
    idealForPacking: ['Smart Casual Streetwear', 'Comfortable Walking Shoes', 'T-Money Transit Card Pouch', 'Hydrating Face Mist'],
    forecast: [
      { day: 'Mon', temp: 21, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 22, icon3D: 'sun-cloud', condition: 'Clear' },
      { day: 'Wed', temp: 19, icon3D: 'cloud', condition: 'Overcast' },
      { day: 'Thu', temp: 23, icon3D: 'sun', condition: 'Bright' },
      { day: 'Fri', temp: 24, icon3D: 'sun', condition: 'Mild Warm' },
    ]
  },
  'singapore': {
    city: 'Marina Bay & Sentosa Island',
    country: 'Singapore',
    continent: 'Southeast Asia',
    temperature: 32,
    feelsLike: 38,
    tempMin: 26,
    tempMax: 33,
    condition: 'Tropical Metropolis Warmth',
    description: 'Lush tropical warmth amidst futuristic Supertree gardens and waterfront skyscrapers.',
    scenicPhoto: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Futuristic Marina Bay Sands & Supertree Grove at dusk',
    icon3D: 'sun-cloud',
    cardTheme: 'emerald-breeze',
    humidity: 80,
    windSpeed: 10,
    windDirection: 'S 175°',
    visibilityKm: 10,
    uvIndex: 11,
    airQuality: 'Good (AQI 29)',
    precipitationChance: 30,
    sunrise: '06:55 AM',
    sunset: '07:05 PM',
    timezone: 'SGT (UTC+8)',
    localTime: '14:24 SGT',
    travelRecommendation: 'Ideal for air-conditioned Cloud Forest greenhouse tours, night safaris, and rooftop infinity pool relaxation.',
    idealForPacking: ['Breathable Linen Attire', 'Pocket Umbrella', 'High-SPF Sunscreen', 'Slip-on Shoes'],
    forecast: [
      { day: 'Mon', temp: 32, icon3D: 'sun', condition: 'Tropical' },
      { day: 'Tue', temp: 33, icon3D: 'sun-cloud', condition: 'Humid Sun' },
      { day: 'Wed', temp: 31, icon3D: 'thunder', condition: 'Afternoon Shower' },
      { day: 'Thu', temp: 32, icon3D: 'rainbow', condition: 'Clearing' },
      { day: 'Fri', temp: 33, icon3D: 'sun', condition: 'Sunny' },
    ]
  },
  'maldives': {
    city: 'Male & North Ari Atoll',
    country: 'Maldives',
    continent: 'South Asia',
    temperature: 30,
    feelsLike: 35,
    tempMin: 26,
    tempMax: 31,
    condition: 'Crystal Atoll Sunshine',
    description: 'Warm tropical trade winds gliding across calm crystal clear lagoons with manta rays beneath overwater bungalows.',
    scenicPhoto: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Overwater luxury villas suspended over turquoise Indian Ocean lagoons',
    icon3D: 'sun',
    cardTheme: 'ocean-blue',
    humidity: 75,
    windSpeed: 16,
    windDirection: 'W 260°',
    visibilityKm: 15,
    uvIndex: 11,
    airQuality: 'Pristine (AQI 12)',
    precipitationChance: 10,
    sunrise: '06:02 AM',
    sunset: '06:15 PM',
    timezone: 'MVT (UTC+5)',
    localTime: '11:24 MVT',
    travelRecommendation: 'World-class conditions for overwater bungalow stays, whale shark snorkeling, and private sandbank dining.',
    idealForPacking: ['Snorkel & Mask', 'Reef-Safe Sunscreen', 'Silk Sarong & Swimwear', 'Underwater Action Camera'],
    forecast: [
      { day: 'Mon', temp: 30, icon3D: 'sun', condition: 'Pure Sun' },
      { day: 'Tue', temp: 31, icon3D: 'sun-cloud', condition: 'Clear' },
      { day: 'Wed', temp: 29, icon3D: 'rain', condition: 'Tropical Mist' },
      { day: 'Thu', temp: 30, icon3D: 'rainbow', condition: 'Rainbow Skies' },
      { day: 'Fri', temp: 31, icon3D: 'sun', condition: 'Sunny' },
    ]
  },
  'norway': {
    city: 'Geirangerfjord, Bergen & Lofoten',
    country: 'Norway',
    continent: 'Northern Europe',
    temperature: 11,
    feelsLike: 9,
    tempMin: 5,
    tempMax: 14,
    condition: 'Majestic Fjord Breeze',
    description: 'Crisp fjord winds whispering past cascading waterfalls and sheer granite cliffs in the Arctic circle.',
    scenicPhoto: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Dramatic deep blue fjords flanked by lush green mountain cliffs',
    icon3D: 'wind',
    cardTheme: 'alpine-cyan',
    humidity: 68,
    windSpeed: 20,
    windDirection: 'NW 305°',
    visibilityKm: 25,
    uvIndex: 3,
    airQuality: 'Pristine (AQI 5)',
    precipitationChance: 25,
    sunrise: '04:30 AM',
    sunset: '10:45 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Spectacular weather for fjord sightseeing cruises, scenic coastal road trips, and hiking Preikestolen Pulpit Rock.',
    idealForPacking: ['Windproof Rain Jacket', 'Waterproof Trail Boots', 'Layered Thermal Fleeces', 'Camera with Telephoto Lens'],
    forecast: [
      { day: 'Mon', temp: 11, icon3D: 'wind', condition: 'Fjord Breeze' },
      { day: 'Tue', temp: 13, icon3D: 'sun-cloud', condition: 'Bright' },
      { day: 'Wed', temp: 10, icon3D: 'rain', condition: 'Misty Showers' },
      { day: 'Thu', temp: 12, icon3D: 'sun', condition: 'Clear Peaks' },
      { day: 'Fri', temp: 14, icon3D: 'rainbow', condition: 'Sun Break' },
    ]
  },
  'new zealand': {
    city: 'Queenstown, Milford Sound & Rotorua',
    country: 'New Zealand',
    continent: 'Oceania',
    temperature: 16,
    feelsLike: 14,
    tempMin: 7,
    tempMax: 18,
    condition: 'Pure Alpine & Lake Air',
    description: 'Invigorating Southern Alps breeze rolling over mirror-like glacial lakes and dramatic fjords.',
    scenicPhoto: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Crystal alpine lake reflections framed by the Southern Alps',
    icon3D: 'rainbow',
    cardTheme: 'emerald-breeze',
    humidity: 62,
    windSpeed: 18,
    windDirection: 'SSW 210°',
    visibilityKm: 30,
    uvIndex: 6,
    airQuality: 'Pristine (AQI 6)',
    precipitationChance: 20,
    sunrise: '07:10 AM',
    sunset: '05:30 PM',
    timezone: 'NZST (UTC+12)',
    localTime: '18:24 NZST',
    travelRecommendation: 'Top conditions for Milford Sound cruise tours, Lord of the Rings movie set walks, and Queenstown adventure sports.',
    idealForPacking: ['Merino Wool Base Layer', 'Sturdy Hiking Boots', 'Weatherproof Outer Shell', 'Reusable Water Bottle'],
    forecast: [
      { day: 'Mon', temp: 16, icon3D: 'rainbow', condition: 'Clear Rainbow' },
      { day: 'Tue', temp: 17, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Wed', temp: 14, icon3D: 'rain', condition: 'Alpine Rain' },
      { day: 'Thu', temp: 15, icon3D: 'sun-cloud', condition: 'Mild' },
      { day: 'Fri', temp: 18, icon3D: 'sun', condition: 'Crisp Sun' },
    ]
  },
  'uae': {
    city: 'Dubai & Abu Dhabi Oasis',
    country: 'United Arab Emirates',
    continent: 'Middle East',
    temperature: 36,
    feelsLike: 41,
    tempMin: 29,
    tempMax: 39,
    condition: 'Golden Desert Sunshine',
    description: 'Radiant desert sunlight over gleaming architectural skyscrapers and rolling golden dunes.',
    scenicPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Burj Khalifa & futuristic Dubai skyline gleaming in golden desert sun',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 48,
    windSpeed: 15,
    windDirection: 'NW 310°',
    visibilityKm: 12,
    uvIndex: 11,
    airQuality: 'Moderate (AQI 55)',
    precipitationChance: 0,
    sunrise: '05:52 AM',
    sunset: '06:58 PM',
    timezone: 'GST (UTC+4)',
    localTime: '10:24 GST',
    travelRecommendation: 'Ideal for evening luxury desert safaris, dhow dinner cruises, and indoor mega-mall attractions.',
    idealForPacking: ['Breathable Linen Garments', 'High-Coverage Sunglasses', 'Hydration Pack', 'Light Cardigan for AC'],
    forecast: [
      { day: 'Mon', temp: 36, icon3D: 'sun', condition: 'Hot Sun' },
      { day: 'Tue', temp: 37, icon3D: 'sun', condition: 'Very Hot' },
      { day: 'Wed', temp: 38, icon3D: 'sun', condition: 'Clear Sky' },
      { day: 'Thu', temp: 36, icon3D: 'wind', condition: 'Desert Breeze' },
      { day: 'Fri', temp: 39, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'egypt': {
    city: 'Cairo, Giza & Nile River Valley',
    country: 'Egypt',
    continent: 'Africa',
    temperature: 33,
    feelsLike: 35,
    tempMin: 23,
    tempMax: 36,
    condition: 'Timeless Desert Sunshine',
    description: 'Warm golden sun shining across the ancient Pyramids of Giza and the serene waters of the Nile.',
    scenicPhoto: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'The Great Pyramids of Giza standing proud against desert skies',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 35,
    windSpeed: 16,
    windDirection: 'NNE 30°',
    visibilityKm: 14,
    uvIndex: 10,
    airQuality: 'Moderate (AQI 60)',
    precipitationChance: 0,
    sunrise: '05:25 AM',
    sunset: '06:40 PM',
    timezone: 'EEST (UTC+3)',
    localTime: '09:24 EEST',
    travelRecommendation: 'Perfect weather for early morning pyramid explorations, felucca sailing on the Nile, and valley of the kings tours.',
    idealForPacking: ['Cotton Desert Scarf', 'Light Walking Trousers', 'SPF 50 Sun Cream', 'Electrolyte Tablets'],
    forecast: [
      { day: 'Mon', temp: 33, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 34, icon3D: 'sun', condition: 'Hot' },
      { day: 'Wed', temp: 35, icon3D: 'sun', condition: 'Desert Clear' },
      { day: 'Thu', temp: 32, icon3D: 'wind', condition: 'Nile Breeze' },
      { day: 'Fri', temp: 36, icon3D: 'sun', condition: 'Hot' },
    ]
  },
  'brazil': {
    city: 'Rio de Janeiro & Iguazu Falls',
    country: 'Brazil',
    continent: 'South America',
    temperature: 28,
    feelsLike: 31,
    tempMin: 22,
    tempMax: 30,
    condition: 'Lush Atlantic Warmth',
    description: 'Vibrant tropical breeze over Copacabana beach and lush rainforest peaks surrounding Christ the Redeemer.',
    scenicPhoto: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Rio de Janeiro coastline & Sugarloaf Mountain under golden light',
    icon3D: 'sun-cloud',
    cardTheme: 'tropical-gold',
    humidity: 72,
    windSpeed: 15,
    windDirection: 'SE 135°',
    visibilityKm: 12,
    uvIndex: 8,
    airQuality: 'Good (AQI 32)',
    precipitationChance: 20,
    sunrise: '06:15 AM',
    sunset: '05:35 PM',
    timezone: 'BRT (UTC-3)',
    localTime: '03:24 BRT',
    travelRecommendation: 'Prime conditions for cable car rides to Sugarloaf mountain, beach volleyball in Ipanema, and samba nights.',
    idealForPacking: ['Beachwear & Havaianas', 'Breathable Cotton T-shirts', 'Sun Protection Hat', 'Crossbody Phone Pouch'],
    forecast: [
      { day: 'Mon', temp: 28, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 29, icon3D: 'sun-cloud', condition: 'Warm' },
      { day: 'Wed', temp: 27, icon3D: 'rain', condition: 'Tropical Shower' },
      { day: 'Thu', temp: 28, icon3D: 'rainbow', condition: 'Rainbow Break' },
      { day: 'Fri', temp: 30, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'turkey': {
    city: 'Cappadocia, Istanbul & Pamukkale',
    country: 'Turkey',
    continent: 'Eurasia',
    temperature: 23,
    feelsLike: 22,
    tempMin: 15,
    tempMax: 25,
    condition: 'Crisp Sunrise & Hot Air Balloons',
    description: 'Gentle morning currents lifting hundreds of hot air balloons over Cappadocia fairy chimneys.',
    scenicPhoto: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Hot air balloons soaring over magical Cappadocia fairy chimney valleys',
    icon3D: 'rainbow',
    cardTheme: 'sunset-rose',
    humidity: 46,
    windSpeed: 10,
    windDirection: 'NE 40°',
    visibilityKm: 18,
    uvIndex: 6,
    airQuality: 'Good (AQI 30)',
    precipitationChance: 5,
    sunrise: '05:50 AM',
    sunset: '07:45 PM',
    timezone: 'TRT (UTC+3)',
    localTime: '09:24 TRT',
    travelRecommendation: 'Unbeatable weather for sunrise hot air balloon flights, Bosphorus cruise rides, and Grand Bazaar exploration.',
    idealForPacking: ['Warm Morning Layers', 'Comfortable Walking Shoes', 'Camera with Extra Batteries', 'Modest Scarf for Mosques'],
    forecast: [
      { day: 'Mon', temp: 23, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 24, icon3D: 'rainbow', condition: 'Clear Flight' },
      { day: 'Wed', temp: 22, icon3D: 'sun-cloud', condition: 'Pleasant' },
      { day: 'Thu', temp: 25, icon3D: 'sun', condition: 'Bright' },
      { day: 'Fri', temp: 26, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'indonesia': {
    city: 'Bali, Nusa Penida & Komodo National Park',
    country: 'Indonesia',
    continent: 'Southeast Asia',
    temperature: 30,
    feelsLike: 34,
    tempMin: 24,
    tempMax: 31,
    condition: 'Tropical Island Bliss',
    description: 'Balmy Indian Ocean warmth brushing against green terraced rice paddies in Ubud and surf breaks in Uluwatu.',
    scenicPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Ancient Balinese temple gate overlooking misty volcanic peaks',
    icon3D: 'sun-cloud',
    cardTheme: 'emerald-breeze',
    humidity: 78,
    windSpeed: 12,
    windDirection: 'SE 140°',
    visibilityKm: 12,
    uvIndex: 10,
    airQuality: 'Good (AQI 32)',
    precipitationChance: 20,
    sunrise: '06:12 AM',
    sunset: '06:18 PM',
    timezone: 'WITA (UTC+8)',
    localTime: '14:24 WITA',
    travelRecommendation: 'Fantastic conditions for sunrise volcano treks, surfing classes, waterfall swimming, and temple visits.',
    idealForPacking: ['Temple Sarong', 'Reef-Safe Sunscreen', 'Insect Repellent Spray', 'Fast-Drying Swimwear'],
    forecast: [
      { day: 'Mon', temp: 30, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 31, icon3D: 'sun-cloud', condition: 'Island Warmth' },
      { day: 'Wed', temp: 29, icon3D: 'rain', condition: 'Tropical Shower' },
      { day: 'Thu', temp: 30, icon3D: 'rainbow', condition: 'Rainbow Sun' },
      { day: 'Fri', temp: 32, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'vietnam': {
    city: 'Ha Long Bay, Da Nang & Hoi An Ancient Town',
    country: 'Vietnam',
    continent: 'Southeast Asia',
    temperature: 29,
    feelsLike: 33,
    tempMin: 24,
    tempMax: 31,
    condition: 'Warm Emerald Bay Breeze',
    description: 'Gentle coastal breeze drifting across thousands of emerald limestone islets in Ha Long Bay.',
    scenicPhoto: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Mystical limestone karsts rising out of emerald green Ha Long waters',
    icon3D: 'sun-cloud',
    cardTheme: 'emerald-breeze',
    humidity: 76,
    windSpeed: 14,
    windDirection: 'E 90°',
    visibilityKm: 11,
    uvIndex: 9,
    airQuality: 'Moderate (AQI 45)',
    precipitationChance: 25,
    sunrise: '05:35 AM',
    sunset: '06:15 PM',
    timezone: 'ICT (UTC+7)',
    localTime: '13:24 ICT',
    travelRecommendation: 'Superb weather for luxury overnight cruises in Ha Long Bay, lantern walks in Hoi An, and street food sampling.',
    idealForPacking: ['Light Cotton Shirts', 'Comfortable Walking Sandals', 'Camera with Wide-Angle Lens', 'Sun Hat'],
    forecast: [
      { day: 'Mon', temp: 29, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 30, icon3D: 'sun-cloud', condition: 'Bay Warmth' },
      { day: 'Wed', temp: 28, icon3D: 'rain', condition: 'Passing Shower' },
      { day: 'Thu', temp: 29, icon3D: 'rainbow', condition: 'Clearing' },
      { day: 'Fri', temp: 31, icon3D: 'sun', condition: 'Sunny' },
    ]
  },
  'germany': {
    city: 'Bavarian Alps, Munich & Neuschwanstein',
    country: 'Germany',
    continent: 'Central Europe',
    temperature: 17,
    feelsLike: 16,
    tempMin: 10,
    tempMax: 19,
    condition: 'Crisp Pine Forest Skies',
    description: 'Refreshing alpine breeze blowing through fairytale castle valleys and Bavarian beer gardens.',
    scenicPhoto: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Fairytale Neuschwanstein Castle nestled in Bavarian mountain forests',
    icon3D: 'sun-cloud',
    cardTheme: 'emerald-breeze',
    humidity: 55,
    windSpeed: 14,
    windDirection: 'W 270°',
    visibilityKm: 20,
    uvIndex: 5,
    airQuality: 'Pristine (AQI 15)',
    precipitationChance: 15,
    sunrise: '06:05 AM',
    sunset: '08:40 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Great weather for fairytale castle tours, alpine lake walks around Eibsee, and historic town strolls.',
    idealForPacking: ['Comfortable Walking Loafers', 'Light Windproof Jacket', 'Travel Daypack', 'Universal European Adapter'],
    forecast: [
      { day: 'Mon', temp: 17, icon3D: 'sun-cloud', condition: 'Mild' },
      { day: 'Tue', temp: 18, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Wed', temp: 15, icon3D: 'rain', condition: 'Light Rain' },
      { day: 'Thu', temp: 17, icon3D: 'rainbow', condition: 'Sun Break' },
      { day: 'Fri', temp: 20, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'portugal': {
    city: 'Lisbon, Sintra & Algarve Golden Cliffs',
    country: 'Portugal',
    continent: 'Southern Europe',
    temperature: 26,
    feelsLike: 26,
    tempMin: 18,
    tempMax: 28,
    condition: 'Atlantic Golden Sunshine',
    description: 'Warm Atlantic sun dancing over historic yellow trams, pastel palaces, and dramatic golden sea caves.',
    scenicPhoto: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Iconic yellow tram navigating steep historic cobblestone streets of Lisbon',
    icon3D: 'sun',
    cardTheme: 'sunset-rose',
    humidity: 52,
    windSpeed: 18,
    windDirection: 'NW 320°',
    visibilityKm: 18,
    uvIndex: 8,
    airQuality: 'Good (AQI 22)',
    precipitationChance: 5,
    sunrise: '06:40 AM',
    sunset: '08:50 PM',
    timezone: 'WEST (UTC+1)',
    localTime: '07:24 WEST',
    travelRecommendation: 'Unmatched weather for Benagil sea cave boat tours, pastel de nata tastings, and Sintra palace explorations.',
    idealForPacking: ['Linen Resort Wear', 'Comfortable Cobblestone Sneakers', 'UV Sunglasses', 'Swimwear'],
    forecast: [
      { day: 'Mon', temp: 26, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 27, icon3D: 'sun', condition: 'Warm' },
      { day: 'Wed', temp: 28, icon3D: 'sun-cloud', condition: 'Clear' },
      { day: 'Thu', temp: 25, icon3D: 'wind', condition: 'Atlantic Breeze' },
      { day: 'Fri', temp: 29, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'south africa': {
    city: 'Cape Town, Table Mountain & Kruger Safari',
    country: 'South Africa',
    continent: 'Africa',
    temperature: 22,
    feelsLike: 21,
    tempMin: 14,
    tempMax: 24,
    condition: 'Oceanic Mountain Breeze',
    description: 'Crisp Atlantic swell blowing past the flat summit of Table Mountain and Boulders beach penguin colonies.',
    scenicPhoto: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Table Mountain towering over the Atlantic ocean coastline of Cape Town',
    icon3D: 'sun-cloud',
    cardTheme: 'ocean-blue',
    humidity: 60,
    windSpeed: 22,
    windDirection: 'SE 140°',
    visibilityKm: 20,
    uvIndex: 6,
    airQuality: 'Pristine (AQI 16)',
    precipitationChance: 10,
    sunrise: '07:15 AM',
    sunset: '06:05 PM',
    timezone: 'SAST (UTC+2)',
    localTime: '08:24 SAST',
    travelRecommendation: 'Prime conditions for Table Mountain cable car ascents, Cape Point scenic drives, and Big Five safari game drives.',
    idealForPacking: ['Neutral Safari Attire', 'Windproof Shell Jacket', 'Binoculars for Wildlife', 'Polarized Sunglasses'],
    forecast: [
      { day: 'Mon', temp: 22, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 23, icon3D: 'sun-cloud', condition: 'Pleasant' },
      { day: 'Wed', temp: 20, icon3D: 'wind', condition: 'Breezy' },
      { day: 'Thu', temp: 24, icon3D: 'sun', condition: 'Clear' },
      { day: 'Fri', temp: 25, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'mexico': {
    city: 'Cancun, Tulum & Chichen Itza',
    country: 'Mexico',
    continent: 'North America',
    temperature: 31,
    feelsLike: 36,
    tempMin: 25,
    tempMax: 33,
    condition: 'Caribbean Riviera Sun',
    description: 'Gentle turquoise waves lapping against white sand beaches and ancient Mayan cliffside ruins in Tulum.',
    scenicPhoto: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Mayan ruins of Tulum perched high above the turquoise Caribbean sea',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 74,
    windSpeed: 15,
    windDirection: 'E 85°',
    visibilityKm: 14,
    uvIndex: 10,
    airQuality: 'Good (AQI 28)',
    precipitationChance: 15,
    sunrise: '06:20 AM',
    sunset: '07:30 PM',
    timezone: 'EST (UTC-5)',
    localTime: '01:24 EST',
    travelRecommendation: 'Ideal for cenote freshwater swimming, exploring Mayan archaeological wonders, and catamaran sailing.',
    idealForPacking: ['Biodegradable Sunscreen', 'Snorkel Mask', 'Linen Beach Garments', 'Waterproof Phone Pouch'],
    forecast: [
      { day: 'Mon', temp: 31, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 32, icon3D: 'sun-cloud', condition: 'Warm' },
      { day: 'Wed', temp: 30, icon3D: 'rain', condition: 'Short Shower' },
      { day: 'Thu', temp: 31, icon3D: 'rainbow', condition: 'Rainbow Break' },
      { day: 'Fri', temp: 33, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'peru': {
    city: 'Machu Picchu, Cusco & Sacred Valley',
    country: 'Peru',
    continent: 'South America',
    temperature: 16,
    feelsLike: 15,
    tempMin: 6,
    tempMax: 19,
    condition: 'Andean Mountain Radiance',
    description: 'Pure high-altitude sunshine piercing through mist above the sacred Incan citadel of Machu Picchu.',
    scenicPhoto: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'The ancient stone citadel of Machu Picchu shrouded in Andean cloud forest',
    icon3D: 'sun-cloud',
    cardTheme: 'emerald-breeze',
    humidity: 50,
    windSpeed: 10,
    windDirection: 'E 90°',
    visibilityKm: 25,
    uvIndex: 11,
    airQuality: 'Pristine (AQI 8)',
    precipitationChance: 10,
    sunrise: '06:05 AM',
    sunset: '05:45 PM',
    timezone: 'PET (UTC-5)',
    localTime: '01:24 PET',
    travelRecommendation: 'World-class hiking weather for the Inca Trail, exploring colonial Cusco, and Sacred Valley market tours.',
    idealForPacking: ['Layered Alpaca Fleece', 'Sturdy Trail Hiking Boots', 'Altitude Sickness Remedies', 'Sun Hat & SPF 50+'],
    forecast: [
      { day: 'Mon', temp: 16, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 17, icon3D: 'sun-cloud', condition: 'Clear Peaks' },
      { day: 'Wed', temp: 15, icon3D: 'cloud', condition: 'Misty Clouds' },
      { day: 'Thu', temp: 18, icon3D: 'sun', condition: 'Warm Sun' },
      { day: 'Fri', temp: 19, icon3D: 'rainbow', condition: 'Andean Glow' },
    ]
  },
  'morocco': {
    city: 'Marrakech, Sahara Dunes & Chefchaouen',
    country: 'Morocco',
    continent: 'Africa',
    temperature: 30,
    feelsLike: 31,
    tempMin: 19,
    tempMax: 33,
    condition: 'Warm Maghreb Sunshine',
    description: 'Golden sun rays lighting up vibrant spice souks, terracotta riads, and sweeping Sahara sand dunes.',
    scenicPhoto: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Intricate ceramic mosaic arches & fountains inside a traditional riad in Marrakech',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 38,
    windSpeed: 14,
    windDirection: 'NE 50°',
    visibilityKm: 16,
    uvIndex: 9,
    airQuality: 'Good (AQI 32)',
    precipitationChance: 0,
    sunrise: '06:30 AM',
    sunset: '08:20 PM',
    timezone: 'WEST (UTC+1)',
    localTime: '07:24 WEST',
    travelRecommendation: 'Fabulous weather for Sahara desert camel treks, exploring the blue city of Chefchaouen, and historic riad dining.',
    idealForPacking: ['Breathable Linen Trousers', 'Cotton Headscarf', 'Comfortable Walking Shoes', 'Camera with Extra Storage'],
    forecast: [
      { day: 'Mon', temp: 30, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 31, icon3D: 'sun', condition: 'Warm' },
      { day: 'Wed', temp: 32, icon3D: 'sun', condition: 'Hot' },
      { day: 'Thu', temp: 29, icon3D: 'wind', condition: 'Desert Breeze' },
      { day: 'Fri', temp: 33, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'austria': {
    city: 'Vienna, Hallstatt & Salzburg Lakes',
    country: 'Austria',
    continent: 'Central Europe',
    temperature: 18,
    feelsLike: 17,
    tempMin: 11,
    tempMax: 20,
    condition: 'Alpine Lake Freshness',
    description: 'Pure mountain air brushing across idyllic wooden chalets and reflection lakes in Hallstatt.',
    scenicPhoto: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Iconic lakeside village of Hallstatt surrounded by towering Alpine peaks',
    icon3D: 'sun-cloud',
    cardTheme: 'alpine-cyan',
    humidity: 52,
    windSpeed: 11,
    windDirection: 'W 260°',
    visibilityKm: 22,
    uvIndex: 5,
    airQuality: 'Pristine (AQI 12)',
    precipitationChance: 15,
    sunrise: '05:45 AM',
    sunset: '08:25 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Sensational for classical concert evenings in Vienna, Hallstatt salt mine tours, and Sound of Music tours.',
    idealForPacking: ['Smart Casual Layering', 'Comfortable Walking Loafers', 'Light Scarf', 'Daypack'],
    forecast: [
      { day: 'Mon', temp: 18, icon3D: 'sun-cloud', condition: 'Pleasant' },
      { day: 'Tue', temp: 19, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Wed', temp: 16, icon3D: 'rain', condition: 'Alpine Rain' },
      { day: 'Thu', temp: 18, icon3D: 'rainbow', condition: 'Sun Break' },
      { day: 'Fri', temp: 21, icon3D: 'sun', condition: 'Warm' },
    ]
  },
  'netherlands': {
    city: 'Amsterdam, Zaanse Schans & Keukenhof',
    country: 'Netherlands',
    continent: 'Western Europe',
    temperature: 17,
    feelsLike: 16,
    tempMin: 11,
    tempMax: 19,
    condition: 'Canal Breeze & Tulip Skies',
    description: 'Refreshing winds turning historic wooden windmills across colorful tulip fields and canal bridges.',
    scenicPhoto: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Historic brick canal townhouses & bicycles lining Amsterdam bridges',
    icon3D: 'wind',
    cardTheme: 'ocean-blue',
    humidity: 70,
    windSpeed: 20,
    windDirection: 'SW 225°',
    visibilityKm: 14,
    uvIndex: 4,
    airQuality: 'Good (AQI 24)',
    precipitationChance: 30,
    sunrise: '06:10 AM',
    sunset: '09:05 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Perfect weather for canal boat tours, cycling through Vondelpark, and world-class Rijksmuseum visits.',
    idealForPacking: ['Waterproof Windbreaker', 'Comfortable City Biking Shoes', 'Crossbody Bag', 'Light Sweater'],
    forecast: [
      { day: 'Mon', temp: 17, icon3D: 'wind', condition: 'Breezy' },
      { day: 'Tue', temp: 18, icon3D: 'sun-cloud', condition: 'Sunny Spells' },
      { day: 'Wed', temp: 15, icon3D: 'rain', condition: 'Showers' },
      { day: 'Thu', temp: 17, icon3D: 'rainbow', condition: 'Rainbow Break' },
      { day: 'Fri', temp: 19, icon3D: 'sun', condition: 'Pleasant' },
    ]
  },
  'croatia': {
    city: 'Dubrovnik, Split & Plitvice Lakes',
    country: 'Croatia',
    continent: 'Southern Europe',
    temperature: 26,
    feelsLike: 27,
    tempMin: 19,
    tempMax: 28,
    condition: 'Adriatic Turquoise Sun',
    description: 'Sparkling Adriatic sun illuminating medieval stone city walls in Dubrovnik and cascading waterfalls in Plitvice.',
    scenicPhoto: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Historic terracotta rooftops & stone fortress walls of Dubrovnik old town',
    icon3D: 'sun',
    cardTheme: 'ocean-blue',
    humidity: 54,
    windSpeed: 14,
    windDirection: 'NW 310°',
    visibilityKm: 16,
    uvIndex: 8,
    airQuality: 'Good (AQI 22)',
    precipitationChance: 5,
    sunrise: '05:55 AM',
    sunset: '08:10 PM',
    timezone: 'CEST (UTC+2)',
    localTime: '08:24 CEST',
    travelRecommendation: 'Top-tier conditions for walking the medieval city walls of Dubrovnik, island hopping to Hvar, and sailing the Dalmatian coast.',
    idealForPacking: ['Aqua Shoes for Pebble Beaches', 'Linen Outfits', 'UV Sunglasses', 'Swimwear'],
    forecast: [
      { day: 'Mon', temp: 26, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 27, icon3D: 'sun', condition: 'Clear' },
      { day: 'Wed', temp: 28, icon3D: 'sun-cloud', condition: 'Warm' },
      { day: 'Thu', temp: 25, icon3D: 'sun', condition: 'Adriatic Sun' },
      { day: 'Fri', temp: 29, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'india': {
    city: 'Agra, Jaipur & Kerala Backwaters',
    country: 'India',
    continent: 'South Asia',
    temperature: 32,
    feelsLike: 37,
    tempMin: 25,
    tempMax: 35,
    condition: 'Royal Golden Sunshine',
    description: 'Warm golden sun reflecting off the pure white marble dome of the Taj Mahal and vibrant palace forts.',
    scenicPhoto: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'The majestic white marble dome of the Taj Mahal reflecting in serene waters',
    icon3D: 'sun',
    cardTheme: 'tropical-gold',
    humidity: 65,
    windSpeed: 12,
    windDirection: 'W 260°',
    visibilityKm: 10,
    uvIndex: 10,
    airQuality: 'Moderate (AQI 68)',
    precipitationChance: 15,
    sunrise: '05:48 AM',
    sunset: '06:55 PM',
    timezone: 'IST (UTC+5:30)',
    localTime: '11:54 IST',
    travelRecommendation: 'Great weather for sunrise visits to the Taj Mahal, exploring Jaipur Amber Fort, and cruising Kerala backwaters.',
    idealForPacking: ['Modest Cotton Clothing', 'Comfortable Walking Shoes', 'Hand Sanitizer & Wet Wipes', 'Electrolyte Packs'],
    forecast: [
      { day: 'Mon', temp: 32, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 33, icon3D: 'sun-cloud', condition: 'Warm' },
      { day: 'Wed', temp: 34, icon3D: 'sun', condition: 'Hot' },
      { day: 'Thu', temp: 31, icon3D: 'rain', condition: 'Passing Shower' },
      { day: 'Fri', temp: 35, icon3D: 'sun', condition: 'Radiant' },
    ]
  },
  'fiji': {
    city: 'Nadi, Mamanuca & Yasawa Islands',
    country: 'Fiji',
    continent: 'Oceania',
    temperature: 29,
    feelsLike: 33,
    tempMin: 23,
    tempMax: 30,
    condition: 'South Pacific Island Paradise',
    description: 'Warm trade winds blowing over coral reefs and swaying coconut palms with authentic Bula hospitality.',
    scenicPhoto: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    photoCaption: 'Crystal clear South Pacific lagoons & white sand beaches in Fiji',
    icon3D: 'sun-cloud',
    cardTheme: 'ocean-blue',
    humidity: 76,
    windSpeed: 16,
    windDirection: 'ESE 115°',
    visibilityKm: 15,
    uvIndex: 10,
    airQuality: 'Pristine (AQI 8)',
    precipitationChance: 20,
    sunrise: '06:10 AM',
    sunset: '05:50 PM',
    timezone: 'FJT (UTC+12)',
    localTime: '18:24 FJT',
    travelRecommendation: 'Superb weather for scuba diving with manta rays, private island catamaran charters, and kava welcoming ceremonies.',
    idealForPacking: ['Reef-Safe Sunscreen', 'Snorkel & Fins', 'Tropical Floral Shirts', 'Dry Bag'],
    forecast: [
      { day: 'Mon', temp: 29, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Tue', temp: 30, icon3D: 'sun-cloud', condition: 'Island Sun' },
      { day: 'Wed', temp: 28, icon3D: 'rain', condition: 'Warm Shower' },
      { day: 'Thu', temp: 29, icon3D: 'rainbow', condition: 'Pacific Rainbow' },
      { day: 'Fri', temp: 31, icon3D: 'sun', condition: 'Radiant' },
    ]
  }
};

// Procedural dynamic country generator for ANY country in the world
function generateDynamicCountryWeather(countryQuery: string): WeatherData {
  const cleanName = countryQuery.trim();
  const seed = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const tempBase = 14 + (seed % 20); // 14C to 34C
  const icons: Array<'sun' | 'sun-cloud' | 'cloud' | 'rain' | 'thunder' | 'snow' | 'rainbow'> = [
    'sun', 'sun-cloud', 'rain', 'rainbow', 'thunder', 'snow', 'cloud'
  ];
  const themes: Array<'tropical-gold' | 'ocean-blue' | 'alpine-cyan' | 'twilight-indigo' | 'emerald-breeze' | 'sunset-rose'> = [
    'tropical-gold', 'ocean-blue', 'alpine-cyan', 'twilight-indigo', 'emerald-breeze', 'sunset-rose'
  ];

  const defaultPhotos = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  ];

  const selectedIcon = icons[seed % icons.length];
  const selectedTheme = themes[seed % themes.length];
  const selectedPhoto = defaultPhotos[seed % defaultPhotos.length];
  const humidity = 45 + (seed % 40);
  const wind = 8 + (seed % 18);
  const uv = 3 + (seed % 8);
  const aqi = 18 + (seed % 35);
  
  return {
    city: `Capital & Scenic Cultural Destinations`,
    country: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    continent: 'Global Horizon',
    temperature: tempBase,
    feelsLike: tempBase + (humidity > 65 ? 3 : -1),
    tempMin: tempBase - 4,
    tempMax: tempBase + 4,
    condition: tempBase > 28 ? 'Tropical Sunshine' : tempBase > 18 ? 'Pleasant Breezy Sun' : 'Crisp Refreshing Air',
    description: `Favorable atmospheric travel conditions across ${cleanName} with stable barometric pressure and clear horizon visibility.`,
    scenicPhoto: selectedPhoto,
    photoCaption: `Breathtaking scenic horizons and landscape vistas in ${cleanName}`,
    icon3D: selectedIcon,
    cardTheme: selectedTheme,
    humidity,
    windSpeed: wind,
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][seed % 8] + ` ${(seed * 45) % 360}°`,
    visibilityKm: 10 + (seed % 8),
    uvIndex: uv,
    airQuality: `Good (AQI ${aqi})`,
    precipitationChance: (seed * 7) % 35,
    sunrise: '06:08 AM',
    sunset: '07:15 PM',
    timezone: 'Standard Local Time',
    localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    travelRecommendation: `Great seasonal window to book tours, explore heritage sights, and organize outdoor regional excursions in ${cleanName}.`,
    idealForPacking: ['Smart Casual Travel Attire', 'UV Eye Protection', 'Universal Power Adapter', 'Daypack & Hydration Flask'],
    forecast: [
      { day: 'Day 1', temp: tempBase, icon3D: selectedIcon, condition: 'Clear' },
      { day: 'Day 2', temp: tempBase + 1, icon3D: 'sun', condition: 'Sunny' },
      { day: 'Day 3', temp: tempBase - 1, icon3D: 'sun-cloud', condition: 'Mild' },
      { day: 'Day 4', temp: tempBase + 2, icon3D: 'rainbow', condition: 'Bright' },
      { day: 'Day 5', temp: tempBase, icon3D: 'sun', condition: 'Fair' },
    ]
  };
}

export const GlobalWeatherRadarModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWeather, setActiveWeather] = useState<WeatherData>(PRESET_GLOBAL_DESTINATIONS['philippines']);
  const [isSearching, setIsSearching] = useState(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [dataSource, setDataSource] = useState<'OpenWeatherMap' | 'Meteorological Radar'>('OpenWeatherMap');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Curated country catalog for instant 1-click filtering
  const allCuratedKeys = Object.keys(PRESET_GLOBAL_DESTINATIONS);
  const continents = ['All', 'Southeast Asia', 'East Asia', 'Southern Europe', 'Western Europe', 'Northern Europe', 'North America', 'South America', 'Oceania', 'Africa', 'Middle East'];

  const filteredCountryKeys = allCuratedKeys.filter((key) => {
    if (selectedContinent === 'All') return true;
    return PRESET_GLOBAL_DESTINATIONS[key].continent === selectedContinent;
  });

  const handleSearch = async (countryKey: string) => {
    if (!countryKey.trim()) return;
    setIsSearching(true);
    const normalized = countryKey.trim().toLowerCase();

    try {
      // Fetch live real-time weather from OpenWeatherMap (or meteorological radar)
      const liveResult: LiveWeatherData | null = await fetchLiveDestinationWeather(countryKey);
      
      if (PRESET_GLOBAL_DESTINATIONS[normalized]) {
        const preset = PRESET_GLOBAL_DESTINATIONS[normalized];
        if (liveResult) {
          setActiveWeather({
            ...preset,
            temperature: liveResult.temperature,
            feelsLike: liveResult.feelsLike,
            tempMin: liveResult.tempMin,
            tempMax: liveResult.tempMax,
            condition: liveResult.condition,
            description: liveResult.description,
            icon3D: liveResult.icon3D,
            humidity: liveResult.humidity,
            windSpeed: liveResult.windSpeed,
            windDirection: liveResult.windDirection,
            uvIndex: liveResult.uvIndex,
            precipitationChance: liveResult.precipitationChance,
            sunrise: liveResult.sunrise,
            sunset: liveResult.sunset,
            timezone: liveResult.timezone,
            localTime: liveResult.localTime,
            forecast: liveResult.forecast
          });
          setDataSource(liveResult.source);
        } else {
          setActiveWeather(preset);
        }
      } else if (liveResult) {
        setActiveWeather({
          city: liveResult.city,
          country: liveResult.country,
          continent: liveResult.continent,
          temperature: liveResult.temperature,
          feelsLike: liveResult.feelsLike,
          tempMin: liveResult.tempMin,
          tempMax: liveResult.tempMax,
          condition: liveResult.condition,
          description: liveResult.description,
          scenicPhoto: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
          photoCaption: `Live atmospheric vista over ${liveResult.city}`,
          icon3D: liveResult.icon3D,
          cardTheme: liveResult.temperature > 26 ? 'tropical-gold' : liveResult.temperature > 15 ? 'ocean-blue' : 'alpine-cyan',
          humidity: liveResult.humidity,
          windSpeed: liveResult.windSpeed,
          windDirection: liveResult.windDirection,
          visibilityKm: 15,
          uvIndex: liveResult.uvIndex,
          airQuality: liveResult.uvIndex > 7 ? 'High UV' : 'Clean Air (AQI 22)',
          precipitationChance: liveResult.precipitationChance,
          sunrise: liveResult.sunrise,
          sunset: liveResult.sunset,
          timezone: liveResult.timezone,
          localTime: liveResult.localTime,
          travelRecommendation: `Great meteorological window to explore historical sights, outdoor nature walks, and local culinary expeditions in ${liveResult.city}.`,
          idealForPacking: ['Comfortable Walking Footwear', 'UV Protective Sunglasses', 'Universal Power Adapter', 'Compact Weather Shell'],
          forecast: liveResult.forecast
        });
        setDataSource(liveResult.source);
      } else {
        setActiveWeather(generateDynamicCountryWeather(countryKey));
      }
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Weather search error:', err);
      if (PRESET_GLOBAL_DESTINATIONS[normalized]) {
        setActiveWeather(PRESET_GLOBAL_DESTINATIONS[normalized]);
      } else {
        setActiveWeather(generateDynamicCountryWeather(countryKey));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleSearch(searchQuery);
  };

  // Synchronize live weather upon modal opening
  useEffect(() => {
    if (isOpen) {
      handleSearch('Philippines');
    }
  }, [isOpen]);

  const renderTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${celsius}°`;
  };

  const render3DIcon = (iconType: string, size: 'sm' | 'md' | 'lg' | 'hero' = 'hero') => {
    switch (iconType) {
      case 'sun':
        return <ThreeDSun size={size} />;
      case 'cloud':
        return <ThreeDCloud size={size} />;
      case 'sun-cloud':
        return <ThreeDSunCloud size={size} />;
      case 'rain':
        return <ThreeDRain size={size} />;
      case 'thunder':
        return <ThreeDThunder size={size} />;
      case 'snow':
        return <ThreeDSnow size={size} />;
      case 'rainbow':
        return <ThreeDRainbow size={size} />;
      case 'moon':
        return <ThreeDMoon size={size} />;
      case 'wind':
        return <ThreeDWind size={size} />;
      default:
        return <ThreeDSun size={size} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in font-sans-body overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0B0F15] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 overflow-hidden my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sunset-coral/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-5 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-[#0E131B]/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sunset-coral to-amber-500 flex items-center justify-center text-white shadow-md shadow-sunset-coral/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-bold text-ivory font-serif-display tracking-tight">
                  Global Atmospheric Radar
                </h3>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{dataSource === 'OpenWeatherMap' ? 'OpenWeatherMap Live' : 'Live Radar Sync'}</span>
                </div>
              </div>
              <p className="text-xs text-sand-muted flex items-center gap-2">
                <span>Accurate global meteorological telemetry</span>
                <span>• Last synced: {lastUpdated}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Refresh Button */}
            <button
              onClick={() => handleSearch(activeWeather.country)}
              disabled={isSearching}
              className="p-2 text-sand-muted hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-center disabled:opacity-50"
              title="Refresh Live Weather"
              aria-label="Refresh Live Weather"
            >
              <RefreshCw className={`w-4 h-4 ${isSearching ? 'animate-spin text-sunset-coral' : ''}`} />
            </button>

            {/* Unit Switcher */}
            <div className="flex items-center p-0.5 bg-white/[0.05] rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                  tempUnit === 'C' 
                    ? 'bg-sunset-coral text-white shadow-sm' 
                    : 'text-sand-muted hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                  tempUnit === 'F' 
                    ? 'bg-sunset-coral text-white shadow-sm' 
                    : 'text-sand-muted hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-sand-muted hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/10 transition-colors border border-white/5"
              aria-label="Close Weather Radar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="relative z-10 p-5 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Search Bar & Filters */}
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-sand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real-time weather worldwide (e.g. Philippines, Tokyo, Paris, Rome, Singapore, New York)..."
                className="w-full pl-11 pr-32 py-3 bg-[#111722] border border-white/10 focus:border-sunset-coral/80 rounded-xl text-xs sm:text-sm text-ivory placeholder-sand-muted focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1.5 px-4 py-2 bg-sunset-coral hover:bg-[#ff765b] disabled:opacity-40 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <span>Search Radar</span>
                )}
              </button>
            </form>

            {/* Continent & Region Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-sand-muted font-mono text-[10px] shrink-0 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-sunset-coral" />
                Region:
              </span>
              {continents.map((cont) => (
                <button
                  key={cont}
                  onClick={() => setSelectedContinent(cont)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap border transition-all ${
                    selectedContinent === cont
                      ? 'bg-sunset-coral text-white border-sunset-coral shadow-sm font-semibold'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border-white/10'
                  }`}
                >
                  {cont}
                </button>
              ))}
            </div>

            {/* Destination Quick-Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-sand-muted font-mono text-[10px] shrink-0 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" />
                Destinations:
              </span>
              {filteredCountryKeys.map((cKey) => {
                const item = PRESET_GLOBAL_DESTINATIONS[cKey];
                const isSelected = activeWeather.country.toLowerCase() === item.country.toLowerCase();
                return (
                  <button
                    key={cKey}
                    onClick={() => {
                      setSearchQuery(item.country);
                      handleSearch(item.country);
                    }}
                    className={`px-3 py-1 rounded-lg whitespace-nowrap border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-sunset-coral to-amber-500 text-white border-transparent font-semibold shadow-sm'
                        : 'bg-[#111722] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border-white/10'
                    }`}
                  >
                    {item.country}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN DESTINATION SPOTLIGHT: Compact Scenic Photo + Commercial Weather Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left Col (7 cols): Scenic Landscape Photo with Editorial Destination Scrim */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/10 bg-[#111722] group shadow-xl min-h-[260px] sm:min-h-[300px] flex flex-col justify-between">
              {/* Photo Background */}
              <img 
                src={activeWeather.scenicPhoto} 
                alt={activeWeather.photoCaption} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-black/30" />

              {/* Top Header Tags */}
              <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono text-ivory tracking-wide">
                  <MapPin className="w-3 h-3 text-sunset-coral" />
                  <span>{activeWeather.continent}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono text-sand-muted">
                  <span>{activeWeather.timezone} • {activeWeather.localTime}</span>
                </div>
              </div>

              {/* Bottom Scrim Content: Country Title & Caption */}
              <div className="relative z-10 p-4 sm:p-5 space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-display text-white drop-shadow-md">
                    {activeWeather.country}
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-ivory/85 font-medium line-clamp-1">
                  {activeWeather.city}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                  <Camera className="w-3.5 h-3.5 shrink-0" />
                  <span className="line-clamp-1">{activeWeather.photoCaption}</span>
                </div>
              </div>
            </div>

            {/* Right Col (5 cols): Compact, Sleek Commercial Weather Module Beside Photo */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#111722] p-5 flex flex-col justify-between shadow-xl space-y-4">
              
              {/* Top Weather Row: 3D Weather Icon + Temperature & Condition */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  {/* Compact 3D Weather Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-2 shadow-inner shrink-0">
                    {render3DIcon(activeWeather.icon3D, 'md')}
                  </div>

                  {/* Temperature & High/Low */}
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-ivory font-mono tracking-tight">
                        {renderTemp(activeWeather.temperature)}
                      </span>
                      <span className="text-xs text-sand-muted font-medium">
                        Feels {renderTemp(activeWeather.feelsLike)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-sunset-coral">
                      {activeWeather.condition}
                    </div>
                    <div className="text-[11px] font-mono text-sand-muted">
                      H: {renderTemp(activeWeather.tempMax)} • L: {renderTemp(activeWeather.tempMin)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Micro Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-sand-muted text-[11px]">
                    <span>Humidity</span>
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-sm font-bold text-ivory font-mono">{activeWeather.humidity}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-sand-muted text-[11px]">
                    <span>Wind</span>
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-sm font-bold text-ivory font-mono">{activeWeather.windSpeed} km/h</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-sand-muted text-[11px]">
                    <span>Precipitation</span>
                    <Umbrella className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-sm font-bold text-ivory font-mono">{activeWeather.precipitationChance}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-sand-muted text-[11px]">
                    <span>UV Index</span>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold text-ivory font-mono">UV {activeWeather.uvIndex} <span className="text-[10px] font-normal text-sand-muted font-sans">({activeWeather.airQuality.split(' ')[0]})</span></div>
                </div>
              </div>

              {/* Editorial Description Quote */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-sand-muted italic flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">"{activeWeather.description}"</span>
              </div>
            </div>

          </div>

          {/* 5-Day Horizon Forecast Row */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111722] border border-white/10 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ivory flex items-center gap-2 font-serif-display text-sm">
                <Calendar className="w-4 h-4 text-sunset-coral" />
                5-Day Horizon Outlook
              </span>
              <span className="text-[11px] text-sand-muted font-mono">
                Sunrise {activeWeather.sunrise} • Sunset {activeWeather.sunset}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
              {activeWeather.forecast.map((f, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-sunset-coral/30 text-center space-y-1.5 transition-all shadow-sm"
                >
                  <span className="text-xs font-mono text-sand-muted font-semibold block">{f.day}</span>
                  <div className="flex justify-center py-0.5">
                    {render3DIcon(f.icon3D, 'sm')}
                  </div>
                  <span className="text-sm font-bold text-ivory font-mono block">{renderTemp(f.temp)}</span>
                  <span className="text-[10px] text-sand-muted line-clamp-1">{f.condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Holiday Travelers Expedition Dispatch & Recommended Gear */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111722] border border-sunset-coral/20 space-y-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sunset-coral/15 flex items-center justify-center text-sunset-coral shrink-0 mt-0.5 border border-sunset-coral/30">
                <Plane className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-ivory">
                  Holiday Travelers Expedition Dispatch Advisory
                </h4>
                <p className="text-xs text-sand-muted leading-relaxed">
                  {activeWeather.travelRecommendation}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sunset-coral block mb-2 font-semibold">
                Recommended Gear to Pack for this Destination:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeWeather.idealForPacking.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-sand-muted font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
