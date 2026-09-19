import React from 'react';
import { 
  CalendarCheck, 
  FileCheck2, 
  Plane, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';

interface ClientSpecialtiesProps {
  onOpenBooking: () => void;
}

export const ClientSpecialties: React.FC<ClientSpecialtiesProps> = ({ onOpenBooking }) => {
  const VISA_FB_LINK = 'https://www.facebook.com/share/p/1DrMyBougo/';
  return (
    <section
      id="specialties"
      className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#070B0E] border-t border-white/[0.05] overflow-hidden"
    >
      {/* Decorative subtle background accents */}
      <div className="absolute -top-32 right-10 w-96 h-96 bg-sunset-coral/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Agency Capabilities</span>
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory leading-[1.12]">
              Specialized travel services, <br />
              <span className="italic font-normal">executed with precision.</span>
            </h2>
          </div>
          <div className="space-y-2">
            <p className="text-sand-muted text-xs sm:text-sm font-sans-body max-w-md leading-relaxed">
              Beyond holiday packages, we handle the critical paperwork that makes international and domestic voyages seamless.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/639165253517"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Fast Inquiries: 0916 525 3517</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Online Booking & Reservations */}
          <div className="bg-[#0B1014] border border-white/[0.08] hover:border-sunset-coral/40 rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:translate-y-[-2px] shadow-xl group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sunset-coral/10 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-2xl text-ivory font-normal">
                Online Booking & Reservations
              </h3>
              <p className="text-sand-muted text-xs leading-relaxed font-light">
                Direct confirmations for airlines, boutique island resorts, fast ferries, and luxury pilgrim departures with real-time status tracking.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sunset-coral shrink-0" />
                <span>Instant confirmation vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sunset-coral shrink-0" />
                <span>Domestic & international flights</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sunset-coral shrink-0" />
                <span>Flexible payment options</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Fast-Track Visa Processing (Redirects to Facebook Inquiry Desk) */}
          <div className="bg-[#0B1014] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:translate-y-[-2px] shadow-xl group relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  FB Inquiry Desk
                </span>
              </div>
              <h3 className="font-serif-display text-2xl text-ivory font-normal">
                Visa Processing & Embassy Assistance
              </h3>
              <p className="text-sand-muted text-xs leading-relaxed font-light">
                Stress-free visa assessments for tourist and business departures. We manage all requirements directly through our official social media desk.
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Hong Kong, Macau, Japan & Schengen</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Document vetting & slot bookings</span>
                </li>
              </ul>
              <a
                href={VISA_FB_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <span>Inquire on Facebook</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pillar 3: Passport Expedited Assistance */}
          <div className="bg-[#0B1014] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:translate-y-[-2px] shadow-xl group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DFA Fast-Track
                </span>
              </div>
              <h3 className="font-serif-display text-2xl text-ivory font-normal">
                Passport Expedited Assistance
              </h3>
              <p className="text-sand-muted text-xs leading-relaxed font-light">
                Hassle-free appointment scheduling and DFA pre-qualification. Clients routinely report passport turnaround in as fast as 5 business days.
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>First-time & renewal applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Expedited appointment slots</span>
                </li>
              </ul>
              <a
                href={VISA_FB_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
              >
                <span>Passport Inquiries (FB)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pillar 4: Curated Global & Domestic Itineraries */}
          <div className="bg-[#0B1014] border border-white/[0.08] hover:border-sunset-coral/40 rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:translate-y-[-2px] shadow-xl group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-2xl text-ivory font-normal">
                Curated Expeditions & Pilgrimages
              </h3>
              <p className="text-sand-muted text-xs leading-relaxed font-light">
                Tailor-made itineraries for international tours (Holyland, Europe, East Asia) and private Philippine island hops (Palawan, Bohol, Siargao).
              </p>
            </div>
            <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Small group & private departures</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Full-board meals & English guides</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Personalized care from start to end</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Banner: Have questions or need assistance? */}
        <div className="bg-gradient-to-r from-[#0C1219] via-[#0E1620] to-[#0C1219] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-serif-display text-2xl text-ivory font-normal">
              Planning a trip or need urgent visa/passport advice?
            </h4>
            <p className="text-sand-muted text-xs sm:text-sm font-light">
              Visit our office in Ortigas Center, Pasig City or chat directly with our specialists.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={VISA_FB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-xs text-cyan-300 font-semibold tracking-wide transition-all shadow-lg"
            >
              <span>Visa Desk (Facebook)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="tel:09165253517"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-ivory font-medium transition-all"
            >
              <Phone className="w-4 h-4 text-sunset-coral" />
              <span>0916 525 3517</span>
            </a>
            <a
              href="mailto:holidaytravelersinc2022@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-sunset-coral/20"
            >
              <Mail className="w-4 h-4" />
              <span>Email holidaytravelersinc2022@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
