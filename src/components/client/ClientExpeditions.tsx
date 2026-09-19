import React, { useState, useEffect } from 'react';
import { TourPackage } from '../../types';
import { 
  Clock, 
  Star, 
  ArrowUpRight, 
  Check, 
  Eye, 
  X, 
  Plane, 
  Calendar, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  UtensilsCrossed, 
  Award, 
  Compass,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedCurrency, getStoredCurrency, formatCurrency } from '../../utils/currency';

interface ClientExpeditionsProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
}

export const ClientExpeditions: React.FC<ClientExpeditionsProps> = ({
  packages,
  onSelectPackage,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [modalPackage, setModalPackage] = useState<TourPackage | null>(null);
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const custom = e as CustomEvent<SupportedCurrency>;
      if (custom.detail) setActiveCurrency(custom.detail);
    };
    window.addEventListener('holiday_currency_changed', handleCurrencyChange);
    return () => window.removeEventListener('holiday_currency_changed', handleCurrencyChange);
  }, []);

  const activePackages = packages.filter((p) => p.status === 'Active');

  const categories = [
    'All',
    'International & Pilgrimage',
    'Grand Asia & Far East',
    'European Grandeur',
    'Island Hopping',
    'Adventure & Nature',
    'Heritage & Culture'
  ];

  const filteredPackages = activePackages.filter((pkg) => {
    if (selectedFilter === 'All') return true;
    return pkg.category === selectedFilter;
  });

  return (
    <section
      id="expeditions"
      className="py-28 sm:py-36 px-4 sm:px-8 bg-obsidian-deep border-t border-white/[0.04] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sunset-coral/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sand-muted/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        {/* Header and Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset-coral/10 border border-sunset-coral/20">
              <Sparkles className="w-3.5 h-3.5 text-sunset-coral" />
              <span className="text-[11px] font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-semibold">
                Signature Worldwide Expeditions
              </span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-ivory leading-[1.08]">
              Curated Journeys across <br />
              <span className="italic font-normal text-gradient-sunset">the Globe & Archipelago</span>
            </h2>
            <p className="text-sand-muted text-sm sm:text-base max-w-xl font-light">
              From sacred pilgrimage paths in Jordan, Israel & Egypt, to direct charter flights to Da Nang, Autumn in Seoul, and Philippine paradise islands.
            </p>
          </motion.div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans-body tracking-wider transition-all duration-300 ${
                  selectedFilter === cat
                    ? 'bg-sunset-coral text-white font-medium shadow-lg shadow-sunset-coral/30 scale-105'
                    : 'bg-white/[0.04] text-sand-muted hover:text-ivory hover:bg-white/[0.08] border border-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Premium Journey Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          <AnimatePresence>
            {filteredPackages.map((pkg, idx) => {
              const localFallbacks = [
                '/images/elnido.jpg',
                '/images/bohol.jpg',
                '/images/siargao.png',
                '/images/coron.webp',
                '/images/pac1.webp',
                '/images/pac2.avif',
                '/images/pac3.jpg'
              ];
              const fallbackImages = [
                'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
              ];
              const displayImage = pkg.bannerUrl || localFallbacks[idx % localFallbacks.length];

              const price = pkg.pricePerPax ?? (pkg as any).price_per_pax ?? 0;
              const days = pkg.durationDays ?? (pkg as any).duration_days ?? 1;
              const nights = pkg.durationNights ?? (pkg as any).duration_nights ?? Math.max(0, days - 1);
              const isSignature = pkg.featured || idx === 0 || price > 35000;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  key={pkg.id}
                  className="group relative bg-[#0B1014] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-sunset-coral/40 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-sunset-coral/10"
                >
                  {/* Image Banner Container */}
                  <div 
                    onClick={() => setModalPackage(pkg)}
                    className="relative aspect-[16/10] overflow-hidden bg-black/40 cursor-pointer"
                  >
                    <img
                      src={displayImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImages[idx % fallbackImages.length];
                      }}
                      alt={`${pkg.title} - ${pkg.destination} expedition`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1014] via-[#0B1014]/30 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                      <div className="flex items-center gap-2">
                        {isSignature ? (
                          <span className="bg-gradient-to-r from-sunset-coral to-[#ff856c] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-lg shadow-sunset-coral/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Signature Tour
                          </span>
                        ) : (
                          <span className="bg-black/70 backdrop-blur-md text-ivory text-[10px] font-medium tracking-wider px-3 py-1 rounded-full border border-white/10">
                            {pkg.category}
                          </span>
                        )}

                        {pkg.airline && (
                          <span className="hidden sm:inline-flex items-center gap-1 bg-black/70 backdrop-blur-md text-sunset-coral text-[10px] font-medium px-2.5 py-1 rounded-full border border-sunset-coral/20">
                            <Plane className="w-2.5 h-2.5" />
                            {pkg.airline.split('(')[0].trim()}
                          </span>
                        )}
                      </div>

                      <div className="bg-black/70 backdrop-blur-md text-ivory text-xs px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-[#F26A4F] text-[#F26A4F]" />
                        <span className="font-semibold">{pkg.rating || 4.9}</span>
                        <span className="text-[10px] text-sand-muted">({pkg.reviewCount || 30})</span>
                      </div>
                    </div>

                    {/* Bottom floating teaser pill if departure dates exist */}
                    {pkg.departureDates && pkg.departureDates.length > 0 && (
                      <div className="absolute bottom-3 left-4 pointer-events-none flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-[11px] text-ivory/90 px-3 py-1 rounded-full border border-white/10">
                        <Calendar className="w-3 h-3 text-sunset-coral shrink-0" />
                        <span className="font-sans-body">Departs: {pkg.departureDates[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body Content */}
                  <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Meta Row: Destination + Duration */}
                      <div className="flex items-center justify-between text-xs tracking-[0.15em] uppercase text-sand-muted">
                        <div className="flex items-center gap-1.5 text-ivory/90 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-sunset-coral shrink-0" />
                          <span>{pkg.destination}</span>
                        </div>
                        <span className="flex items-center gap-1 text-ivory/80">
                          <Clock className="w-3.5 h-3.5 text-sunset-coral" />
                          {days}D / {nights}N
                        </span>
                      </div>

                      {/* Expedition Title & Subtitle */}
                      <div>
                        <h3 
                          onClick={() => setModalPackage(pkg)}
                          className="font-serif-display text-2xl sm:text-3xl font-normal text-ivory group-hover:text-sunset-coral transition-colors leading-tight cursor-pointer"
                        >
                          {pkg.title}
                        </h3>
                        {pkg.subtitle && (
                          <p className="text-xs text-sand-muted/90 font-light mt-1.5 line-clamp-1">
                            {pkg.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Key highlights / Features */}
                      {pkg.specialFeatures && pkg.specialFeatures.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {pkg.specialFeatures.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-sand-muted/90 font-light">
                              <Check className="w-3.5 h-3.5 text-sunset-coral shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>
                      ) : pkg.inclusions && pkg.inclusions.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {pkg.inclusions.slice(0, 3).map((inc, i) => (
                            <span
                              key={i}
                              className="text-xs text-[#B0BCC5] bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full font-light line-clamp-1"
                            >
                              {inc}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Pricing and Action Footer */}
                    <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-sans-body tracking-[0.2em] uppercase text-sunset-coral font-medium">
                            All-Inclusive Rate
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif-display text-2xl sm:text-3xl font-semibold text-ivory tracking-tight">
                            {formatCurrency(Number(price), activeCurrency)}
                          </span>
                          <span className="text-xs font-sans-body text-sand-muted font-normal">
                            / pax
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalPackage(pkg)}
                          className="px-4 py-2.5 rounded-full text-xs font-medium text-sand-muted hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-1.5"
                          title="View Full Brochure & Daily Itinerary"
                        >
                          <Eye className="w-3.5 h-3.5 text-sunset-coral" />
                          <span className="hidden sm:inline">Itinerary</span>
                        </button>

                        <button
                          onClick={() => onSelectPackage(pkg)}
                          className="group/btn relative flex items-center gap-2 bg-sunset-coral hover:bg-[#ff765b] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl shadow-sunset-coral/25 hover:shadow-sunset-coral/45 hover:scale-[1.03] active:scale-[0.98] border border-white/10"
                          id={`reserve-pkg-${pkg.id}`}
                        >
                          <span>Reserve</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Comprehensive Expedition Details & Brochure Modal */}
      <AnimatePresence>
        {modalPackage && (
          <div 
            className="fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-6 bg-slate-950/50 backdrop-blur-sm overflow-y-auto cursor-pointer"
            onClick={() => setModalPackage(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0B1014] border border-white/15 rounded-3xl max-w-4xl w-full p-6 sm:p-10 space-y-8 shadow-2xl my-8 relative overflow-hidden text-ivory max-h-[90vh] flex flex-col justify-between cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setModalPackage(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full text-sand-muted hover:text-ivory bg-white/[0.05] hover:bg-white/[0.1] transition-all z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {/* Header Banner Section */}
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-black/40">
                  <img
                    src={modalPackage.bannerUrl || '/images/elnido.jpg'}
                    alt={modalPackage.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1014] via-[#0B1014]/40 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-semibold block mb-1">
                        {modalPackage.category} · {modalPackage.destination}
                      </span>
                      <h2 className="font-serif-display text-2xl sm:text-4xl text-ivory drop-shadow-md">
                        {modalPackage.title}
                      </h2>
                      {modalPackage.subtitle && (
                        <p className="text-xs text-sand-muted/90 font-light mt-1">
                          {modalPackage.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#070B0E] p-3.5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
                    <Clock className="w-5 h-5 text-sunset-coral shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-sand-muted">Duration</div>
                      <div className="text-xs sm:text-sm font-medium text-ivory">
                        {modalPackage.durationDays}D / {modalPackage.durationNights}N
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#070B0E] p-3.5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
                    <Plane className="w-5 h-5 text-sunset-coral shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-sand-muted">Flight / Carrier</div>
                      <div className="text-xs sm:text-sm font-medium text-ivory line-clamp-1">
                        {modalPackage.airline || 'Included Charter/Commercial'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#070B0E] p-3.5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-sunset-coral shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-sand-muted">Protection</div>
                      <div className="text-xs sm:text-sm font-medium text-ivory">Travel Insurance Incl.</div>
                    </div>
                  </div>

                  <div className="bg-[#070B0E] p-3.5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
                    <Star className="w-5 h-5 text-sunset-coral fill-sunset-coral shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-sand-muted">Guest Rating</div>
                      <div className="text-xs sm:text-sm font-medium text-ivory">
                        {modalPackage.rating || 4.9} / 5.0 ({modalPackage.reviewCount || 35} verified)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departure Schedule if available */}
                {modalPackage.departureDates && modalPackage.departureDates.length > 0 && (
                  <div className="bg-gradient-to-r from-sunset-coral/10 via-transparent to-transparent p-4 rounded-2xl border border-sunset-coral/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sunset-coral" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-ivory">
                        Scheduled Departure Dates:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {modalPackage.departureDates.map((date, idx) => (
                        <span key={idx} className="text-xs bg-white/[0.08] text-sunset-coral px-3 py-1 rounded-full font-medium border border-sunset-coral/30">
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Tour Features Highlights */}
                {modalPackage.specialFeatures && modalPackage.specialFeatures.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-sans-body uppercase tracking-wider text-sunset-coral font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Brochure Highlights & Exclusive Experiences
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {modalPackage.specialFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-[#070B0E] p-3 rounded-xl border border-white/[0.05]">
                          <Sparkles className="w-4 h-4 text-sunset-coral shrink-0 mt-0.5" />
                          <span className="text-xs text-ivory/90 leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-sans-body uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Package Inclusions
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {modalPackage.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-sand-muted bg-[#070B0E] p-2.5 rounded-xl border border-white/[0.03]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-sans-body uppercase tracking-wider text-rose-400/90 font-semibold flex items-center gap-1.5">
                      <X className="w-4 h-4" />
                      Important Exclusions
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {modalPackage.exclusions && modalPackage.exclusions.length > 0 ? (
                        modalPackage.exclusions.map((exc, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-sand-muted bg-[#070B0E] p-2.5 rounded-xl border border-white/[0.03]">
                            <X className="w-3.5 h-3.5 text-rose-400/80 shrink-0 mt-0.5" />
                            <span>{exc}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-sand-muted italic p-2.5">
                          Standard personal expenses and travel taxes not included.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Comprehensive Itinerary */}
                {modalPackage.itinerary && modalPackage.itinerary.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <h4 className="text-xs font-sans-body uppercase tracking-wider text-ivory font-medium flex items-center gap-2">
                      <Compass className="w-4 h-4 text-sunset-coral" />
                      Day-by-Day Comprehensive Itinerary
                    </h4>
                    <div className="space-y-3.5 max-h-72 overflow-y-auto pr-2">
                      {modalPackage.itinerary.map((day) => (
                        <div key={day.dayNumber} className="bg-[#070B0E] p-4 sm:p-5 rounded-2xl border border-white/[0.05] space-y-2.5 hover:border-white/10 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-sunset-coral/10 text-sunset-coral text-xs font-bold px-2.5 py-0.5 rounded-md border border-sunset-coral/20">
                                Day {day.dayNumber}
                              </span>
                              <span className="font-serif-display text-lg text-ivory">
                                {day.title}
                              </span>
                            </div>
                            {day.meals && (
                              <div className="flex items-center gap-1.5 text-[11px] text-sand-muted/90 bg-white/[0.04] px-2.5 py-1 rounded-full">
                                <UtensilsCrossed className="w-3 h-3 text-sunset-coral" />
                                <span>{day.meals}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-xs text-sand-muted font-light leading-relaxed">
                            {day.description}
                          </p>

                          {day.activities && day.activities.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
                              {day.activities.map((act, aIdx) => (
                                <div key={aIdx} className="flex items-center gap-2 text-[11px] text-ivory/80">
                                  <ChevronRight className="w-3 h-3 text-sunset-coral shrink-0" />
                                  <span className="font-medium text-sunset-coral/90">{act.time}:</span>
                                  <span className="truncate">{act.activity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Footer */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4 bg-[#0B1014] shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-sans-body tracking-[0.2em] uppercase text-sunset-coral font-medium block">
                    All-Inclusive Package Rate
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif-display text-3xl sm:text-4xl text-ivory font-normal">
                      {formatCurrency(Number(modalPackage.pricePerPax ?? (modalPackage as any).price_per_pax ?? 0), activeCurrency)}
                    </span>
                    <span className="text-xs text-sand-muted">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setModalPackage(null)}
                    className="px-5 py-3 rounded-full text-xs text-sand-muted hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const pkgToBook = modalPackage;
                      setModalPackage(null);
                      onSelectPackage(pkgToBook);
                    }}
                    className="group inline-flex items-center justify-center gap-2 bg-sunset-coral hover:bg-[#ff765b] text-white px-8 py-3 rounded-full text-xs font-semibold tracking-[0.15em] uppercase shadow-2xl shadow-sunset-coral/40 hover:shadow-sunset-coral/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/10"
                  >
                    <span>Reserve Package</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
