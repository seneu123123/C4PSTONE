import React from 'react';
import { MapPin } from 'lucide-react';

interface DestinationItem {
  region: string;
  name: string;
  coordinates: string;
  italicTagline: string;
  description: string;
  image: string;
  fallbackImage: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    region: 'PALAWAN',
    name: 'El Nido',
    coordinates: '11.18° N / 119.38° E',
    italicTagline: 'Cathedrals of stone rising from jade water',
    description: 'Towering karst cliffs cradle hidden lagoons you reach only by kayak at dawn. Secret beaches where the only footsteps are yours.',
    image: '/images/elnido.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80'
  },
  {
    region: 'SURIGAO DEL NORTE',
    name: 'Siargao',
    coordinates: '9.85° N / 126.05° E',
    italicTagline: 'Pacific swell and coconut canopies',
    description: 'Tear-drop island fringed by untouched mangrove waterways, emerald tidal pools at Magpupungko, and world-class breaks at Cloud 9.',
    image: '/images/siargao.png',
    fallbackImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    region: 'CENTRAL VIETNAM',
    name: 'Da Nang & Ba Na Hills',
    coordinates: '16.05° N / 108.20° E',
    italicTagline: 'Giant stone hands cradling the sky above cloud forests',
    description: 'Sun World Ba Na Hills suspended cableways, ancient UNESCO lantern streets of Hoi An, and Dragon Bridge waters over the Han River.',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
  },
  {
    region: 'EAST ASIA',
    name: 'Seoul & Nami Island',
    coordinates: '37.56° N / 126.97° E',
    italicTagline: 'Ancient palaces veiled in golden ginkgo and winter magic',
    description: 'Gyeongbokgung royal courtyards in traditional Hanbok, tree-lined avenues of Nami Island, and the illuminated night streets of Myeongdong.',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80'
  }
];

interface ClientDestinationsProps {
  onSelectDestination?: (name: string) => void;
}

export const ClientDestinations: React.FC<ClientDestinationsProps> = () => {
  return (
    <section
      id="destinations"
      className="py-28 sm:py-36 px-6 sm:px-8 bg-[#080D11] border-t border-white/[0.04]"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs sm:text-sm font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
              Featured Havens
            </p>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-ivory leading-[1.08]">
              Islands worth <br />
              <span className="italic text-sunset-coral">crossing water</span> for
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-sand-muted text-sm sm:text-base font-sans-body max-w-sm ml-auto font-light leading-relaxed">
              Four of our most-loved shores, mapped by the local seafarers who guide them.
            </p>
          </div>
        </div>

        {/* Destination Showcase Items */}
        <div className="space-y-24 sm:space-y-32">
          {DESTINATIONS.map((dest, idx) => {
            const isReversed = idx % 2 !== 0;

            return (
              <div
                key={dest.name}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center`}
              >
                {/* Image Container with Coordinate Badge */}
                <div
                  className={`lg:col-span-7 relative group rounded-2xl overflow-hidden ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-obsidian-card">
                    <img
                      src={dest.image}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = dest.fallbackImage;
                      }}
                      alt={`${dest.name} archipelago destination landscape`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover img-editorial-card"
                    />
                  </div>
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Coordinate Badge */}
                  <div className="absolute top-4 left-4 glass-obsidian px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-ivory/90 font-mono tracking-wider">
                    <MapPin className="w-3 h-3 text-sunset-coral" />
                    <span>{dest.coordinates}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div
                  className={`lg:col-span-5 space-y-4 sm:space-y-5 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
                    {dest.region}
                  </p>
                  <h3 className="font-serif-display text-4xl sm:text-5xl font-light text-ivory">
                    {dest.name}
                  </h3>
                  <p className="font-serif-display text-lg sm:text-xl text-[#D0D7DD] italic">
                    "{dest.italicTagline}"
                  </p>
                  <p className="text-sand-muted text-sm sm:text-base font-sans-body leading-relaxed font-light">
                    {dest.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
