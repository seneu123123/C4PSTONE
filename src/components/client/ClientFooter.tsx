import React, { useRef, useState } from 'react';
import { Compass, ArrowUp, Lock, Eye, Scale, Cookie, FileCheck, CheckCircle2, MapPin, Phone, Mail, Instagram, Twitter, MessageCircle, ExternalLink } from 'lucide-react';
import { LegalPolicyTab } from '../../types/compliance';

interface ClientFooterProps {
  onOpenAdminAuth?: () => void;
  onOpenTracker: () => void;
  isStaffLoggedIn?: boolean;
  onOpenAdminPortal?: () => void;
  onOpenLegalPolicy?: (tab: LegalPolicyTab) => void;
  onOpenCookiePreferences?: () => void;
}

export const ClientFooter: React.FC<ClientFooterProps> = ({
  onOpenAdminAuth,
  onOpenTracker,
  isStaffLoggedIn,
  onOpenAdminPortal,
  onOpenLegalPolicy,
  onOpenCookiePreferences,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPolicy = (tab: LegalPolicyTab) => {
    if (onOpenLegalPolicy) {
      onOpenLegalPolicy(tab);
    }
  };

  // Easter Egg: Long press on accreditation or copyright opens Admin Authentication
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const startPressTimer = () => {
    setIsHolding(true);
    pressTimerRef.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }
      if (isStaffLoggedIn && onOpenAdminPortal) {
        onOpenAdminPortal();
      } else if (onOpenAdminAuth) {
        onOpenAdminAuth();
      }
      setIsHolding(false);
    }, 1800);
  };

  const cancelPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsHolding(false);
  };

  return (
    <footer className="bg-[#05080A] border-t border-white/[0.05] py-20 px-6 sm:px-8 text-sand-muted text-sm font-sans-body">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start justify-between">
          {/* Brand & Office Location Column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sunset-coral/10 border border-sunset-coral/50 flex items-center justify-center text-sunset-coral">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-display text-2xl text-ivory tracking-wider block">
                  Holiday Travelers Inc.
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-sunset-coral font-mono">
                  Travel & Tours
                </span>
              </div>
            </div>

            {/* Official Office Address */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-start gap-2.5 text-sand-muted">
                <MapPin className="w-4 h-4 text-sunset-coral shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-ivory font-medium block">Main Office:</strong>
                  Unit 1101 City & Land Mega Plaza Inc., ADB Ave., Corner Garnet Rd., Ortigas Center, San Antonio, Pasig City, Philippines, 1605
                </p>
              </div>

              {/* Direct Hotlines & Email */}
              <div className="flex items-center gap-2.5 text-sand-muted pt-1">
                <Phone className="w-4 h-4 text-sunset-coral shrink-0" />
                <a href="tel:09165253517" className="hover:text-ivory transition-colors font-mono">
                  0916 525 3517
                </a>
                <span className="text-white/20">|</span>
                <span className="text-[11px] text-emerald-400">Viber / WhatsApp</span>
              </div>

              <div className="flex items-center gap-2.5 text-sand-muted">
                <Mail className="w-4 h-4 text-sunset-coral shrink-0" />
                <a href="mailto:holidaytravelersinc2022@gmail.com" className="hover:text-ivory transition-colors underline font-mono">
                  holidaytravelersinc2022@gmail.com
                </a>
              </div>
            </div>

            {/* Verified Social Media Channels */}
            <div className="pt-2 space-y-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 font-medium">Official Socials</p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com/holidaytravelersinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-ivory transition-all hover:border-sunset-coral"
                >
                  <Instagram className="w-3.5 h-3.5 text-sunset-coral" />
                  <span>@holidaytravelersinc</span>
                </a>
                <a
                  href="https://x.com/HTravelersInc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-ivory transition-all hover:border-sunset-coral"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  <span>@HTravelersInc</span>
                </a>
              </div>
            </div>

            {/* Specialties Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.05] text-sand-muted border border-white/10">
                Online Booking & Tours
              </span>
              <a
                href="https://www.facebook.com/share/p/1DrMyBougo/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 inline-flex items-center gap-1 transition-all"
                title="Redirect to official Facebook post for Visa Assistance"
              >
                <span>Visa Assistance (Facebook)</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://www.facebook.com/share/p/1DrMyBougo/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 inline-flex items-center gap-1 transition-all"
                title="Redirect to official Facebook post for Passport Assistance"
              >
                <span>Passport Assistance (Facebook)</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Quick Links & Navigation */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-sunset-coral font-medium">
                Navigation
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#destinations" className="hover:text-ivory transition-colors">
                    Islands
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-ivory transition-colors">
                    Expeditions
                  </a>
                </li>
                <li>
                  <a href="#specialties" className="hover:text-ivory transition-colors">
                    Our Specialties
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-ivory transition-colors">
                    Client Reviews
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-sunset-coral font-medium">
                Guest Services
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => onOpenTracker()} 
                    className="hover:text-ivory transition-colors text-left cursor-pointer"
                    aria-label="Open Guest Booking Tracker and Voucher Retrieval"
                  >
                    Track Booking
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('refund')} 
                    className="hover:text-ivory transition-colors text-left"
                  >
                    Refund & Rebooking
                  </button>
                </li>
                <li>
                  <a href="mailto:holidaytravelersinc2022@gmail.com" className="hover:text-ivory transition-colors">
                    Email Inquiry
                  </a>
                </li>
                <li>
                  <a href="tel:09165253517" className="hover:text-ivory transition-colors text-sunset-coral">
                    Call 0916 525 3517
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-sunset-coral font-medium">
                Legal & Privacy
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => openPolicy('privacy')} 
                    className="hover:text-ivory transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('terms')} 
                    className="hover:text-ivory transition-colors text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('cookies')} 
                    className="hover:text-ivory transition-colors text-left"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onOpenCookiePreferences} 
                    className="hover:text-ivory transition-colors text-left text-sunset-coral flex items-center gap-1"
                  >
                    <Cookie className="w-3 h-3" />
                    <span>Cookie Preferences</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Back to Top & Staff Access */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between space-y-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sand-muted hover:text-ivory transition-colors"
              aria-label="Scroll back to top of the page"
            >
              <span>Back to surface</span>
              <ArrowUp className="w-3.5 h-3.5 text-sunset-coral" />
            </button>

            {/* Staff / Admin Portal Ingress Button */}
            <div className="pt-4 border-t border-white/[0.06] w-full flex flex-col items-start md:items-end">
              {isStaffLoggedIn ? (
                <button
                  onClick={onOpenAdminPortal}
                  id="footer-open-admin-portal-btn"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-sunset-coral/15 hover:bg-sunset-coral/25 text-sunset-coral border border-sunset-coral/30 transition-all group"
                  title="Switch to Admin Operations Tower"
                >
                  <Lock className="w-3.5 h-3.5 text-sunset-coral group-hover:scale-110 transition-transform" />
                  <span>Enter Admin Portal</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminAuth}
                  id="footer-staff-login-btn"
                  className="inline-flex items-center gap-1.5 text-xs text-sand-muted hover:text-ivory transition-colors group"
                  title="Staff and Tour Operator Authentication"
                >
                  <Lock className="w-3 h-3 text-sand-muted group-hover:text-sunset-coral transition-colors" />
                  <span>Staff & Operator Login</span>
                </button>
              )}
              <span className="text-[10px] text-white/30 mt-1">Role-based access controls active</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© {new Date().getFullYear()} Holiday Travelers Inc. All rights reserved.</p>
            <span>•</span>
            <p 
              onMouseDown={startPressTimer}
              onMouseUp={cancelPressTimer}
              onMouseLeave={cancelPressTimer}
              onTouchStart={startPressTimer}
              onTouchEnd={cancelPressTimer}
              onTouchCancel={cancelPressTimer}
              className={`cursor-default select-none transition-all duration-500 ${
                isHolding ? 'text-sunset-coral scale-105 opacity-100' : ''
              }`}
              title="Official Registered Travel Agency"
            >
              Pasig City, Metro Manila, Philippines
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <button onClick={() => openPolicy('security-iso27001')} className="hover:text-sand-muted underline">
              ISO/IEC 27001 Security
            </button>
            <span>•</span>
            <button onClick={() => openPolicy('accessibility-iso40500')} className="hover:text-sand-muted underline">
              ISO/IEC 40500 Accessibility
            </button>
            <span>•</span>
            <span>Online Booking Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

