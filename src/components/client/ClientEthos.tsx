import React from 'react';

export const ClientEthos: React.FC = () => {
  return (
    <section
      id="ethos"
      className="relative py-28 sm:py-36 px-6 sm:px-8 bg-obsidian-deep border-t border-white/[0.04] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs sm:text-sm font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
              Our Ethos
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory leading-[1.12]">
              A different <br className="hidden sm:inline" />
              <span className="italic">way to meet</span> <br />
              the sea
            </h2>
          </div>

          {/* Right Column: Numbered Philosophy Cards with Large Watermark Digits */}
          <div className="lg:col-span-7 space-y-12 sm:space-y-16">
            {/* 01 We travel slow */}
            <div className="relative pl-16 sm:pl-24">
              <span className="absolute left-0 top-0 font-serif-display text-5xl sm:text-7xl italic font-light text-white/15 select-none leading-none">
                01
              </span>
              <div className="space-y-3">
                <h3 className="font-serif-display text-2xl sm:text-3xl text-ivory font-normal italic">
                  We travel slow
                </h3>
                <p className="text-sand-muted text-sm sm:text-base font-sans-body leading-relaxed max-w-xl">
                  No fifteen-stop day tours. We linger where the light is good, sleep where the reef is loud, and let the tide set the schedule.
                </p>
              </div>
            </div>

            {/* 02 We travel small */}
            <div className="relative pl-16 sm:pl-24">
              <span className="absolute left-0 top-0 font-serif-display text-5xl sm:text-7xl italic font-light text-white/15 select-none leading-none">
                02
              </span>
              <div className="space-y-3">
                <h3 className="font-serif-display text-2xl sm:text-3xl text-ivory font-normal italic">
                  We travel small
                </h3>
                <p className="text-sand-muted text-sm sm:text-base font-sans-body leading-relaxed max-w-xl">
                  Bancas over buses. Family-run kitchens over resort buffets. Every journey carries a handful of travellers, never a herd.
                </p>
              </div>
            </div>

            {/* 03 We protect the sanctuaries */}
            <div className="relative pl-16 sm:pl-24">
              <span className="absolute left-0 top-0 font-serif-display text-5xl sm:text-7xl italic font-light text-white/15 select-none leading-none">
                03
              </span>
              <div className="space-y-3">
                <h3 className="font-serif-display text-2xl sm:text-3xl text-ivory font-normal italic">
                  We protect the sanctuaries
                </h3>
                <p className="text-sand-muted text-sm sm:text-base font-sans-body leading-relaxed max-w-xl">
                  Reef-safe protocols, certified community guides, zero disposable plastics, and direct conservation allocations from every booking made.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
