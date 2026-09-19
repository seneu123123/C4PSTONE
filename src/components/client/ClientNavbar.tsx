import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, CloudSun, Lock, Ticket, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { RealTimeNotificationCenter } from '../common/RealTimeNotificationCenter';
import { CurrencySelector } from '../common/CurrencySelector';
import { UserProfile } from '../../utils/supabaseClient';

interface ClientNavbarProps {
  onOpenBooking: (packageId?: string) => void;
  onOpenTracker: () => void;
  onOpenAdminAuth?: () => void;
  onOpenWeatherRadar?: () => void;
  isStaffLoggedIn?: boolean;
  onOpenAdminPortal?: () => void;
  travelerUser?: UserProfile | null;
  onOpenTravelerAuth?: () => void;
  onSignOutTraveler?: () => void;
  onOpenMyAccount?: () => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({
  onOpenBooking,
  onOpenTracker,
  onOpenWeatherRadar,
  onOpenAdminAuth,
  isStaffLoggedIn,
  onOpenAdminPortal,
  travelerUser,
  onOpenTravelerAuth,
  onSignOutTraveler,
  onOpenMyAccount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [logoTapCount, setLogoTapCount] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('hero');

    // Mobile Easter Egg 1: Rapidly tapping brand logo 5 times unlocks/triggers Admin Authentication
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);

    if (nextCount >= 5) {
      setLogoTapCount(0);
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      if (isStaffLoggedIn && onOpenAdminPortal) {
        onOpenAdminPortal();
      } else if (onOpenAdminAuth) {
        onOpenAdminAuth();
      }
    } else {
      // Reset counter if taps are separated by more than 2 seconds
      setTimeout(() => {
        setLogoTapCount(0);
      }, 2000);
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-obsidian-nav py-4 shadow-2xl'
          : 'bg-gradient-to-b from-[#070B0E]/90 via-[#070B0E]/40 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo with Custom Suitcase Airplane Logo & Secret Discreet Multi-click Staff Ingress */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLogoClick(e);
          }}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer select-none"
          id="brand-logo-link"
          title="Holiday Travelers Travel and Tours Inc."
        >
          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sunset-coral/15 to-sunset-coral/5 border border-white/15 flex items-center justify-center p-1.5 group-hover:scale-105 group-hover:border-sunset-coral/60 transition-all duration-300 shadow-xl shadow-black/40">
            <img
              src="/images/logo.svg"
              alt="Holiday Travelers Inc. Logo"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-display text-2xl sm:text-3xl text-ivory tracking-wide font-medium leading-tight drop-shadow-md">
              Holiday Travelers
            </span>
            <span className="text-[11px] sm:text-xs font-sans-body tracking-[0.22em] uppercase text-sand-muted font-normal">
              Travel & Tours Inc.
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <a
            href="https://www.facebook.com/share/p/1DrMyBougo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-sans-body text-cyan-300 hover:text-cyan-200 transition-colors tracking-wide flex items-center gap-1.5"
            id="nav-visa-fb-btn"
            title="Inquire about Visa & Passport on official Facebook post"
          >
            <span>Visa Inquiries</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">FB</span>
          </a>
          <button
            onClick={() => scrollToSection('destinations')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-destinations-btn"
          >
            Destinations
          </button>
          <button
            onClick={() => scrollToSection('expeditions')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-journeys-btn"
          >
            Packages
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-reviews-btn"
          >
            Reviews
          </button>
          {onOpenWeatherRadar && (
            <button
              onClick={onOpenWeatherRadar}
              className="text-sm font-sans-body text-cyan-300 hover:text-cyan-200 transition-colors tracking-wide flex items-center gap-1.5"
              id="nav-weather-radar-btn"
            >
              <CloudSun className="w-4 h-4 text-cyan-400" />
              Weather
            </button>
          )}
          <button
            onClick={() => onOpenTracker()}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide flex items-center gap-1.5 active:scale-95 cursor-pointer"
            id="nav-track-btn"
            title="Check Tickets & Live Travel Status"
          >
            <Ticket className="w-3.5 h-3.5 text-sunset-coral" />
            <span>Check Tickets</span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Multi-Currency Selector Dropdown */}
          <CurrencySelector variant="pill" />

          {/* Real-time notification center */}
          <RealTimeNotificationCenter onOpenTracker={onOpenTracker} />

          {/* Traveler Sign-In / Account Dropdown */}
          {travelerUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-ivory text-xs transition-all cursor-pointer shadow-sm"
                id="traveler-profile-menu-btn"
              >
                {travelerUser.avatar_url ? (
                  <img
                    src={travelerUser.avatar_url}
                    alt={travelerUser.full_name}
                    className="w-5 h-5 rounded-full object-cover border border-sunset-coral/50"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-sunset-coral/30 border border-sunset-coral/60 text-sunset-coral flex items-center justify-center text-[10px] font-bold">
                    {travelerUser.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium max-w-[110px] truncate">{travelerUser.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-sand-muted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090E14] border border-white/15 shadow-2xl p-2 z-50 animate-scale-in">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-serif-display text-ivory font-normal truncate">
                      {travelerUser.full_name}
                    </p>
                    <p className="text-[10px] font-mono text-sand-muted truncate">{travelerUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      {travelerUser.role || 'Traveler'} (Verified)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenMyAccount) onOpenMyAccount();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-ivory hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-sunset-coral" />
                    <span>My Account & Balances</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenTracker();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-sand-muted hover:text-ivory hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Bookings & Vouchers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onSignOutTraveler) onSignOutTraveler();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors flex items-center gap-2 mt-1 border-t border-white/5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenTravelerAuth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-ivory border border-white/15 hover:border-sunset-coral/50 transition-all shadow-sm active:scale-95 cursor-pointer group"
              id="nav-traveler-signin-btn"
              title="Sign in with Google or Email"
            >
              <User className="w-3.5 h-3.5 text-sunset-coral group-hover:scale-110 transition-transform" />
              <span>Sign In</span>
            </button>
          )}

          {isStaffLoggedIn && (
            <button
              onClick={onOpenAdminPortal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-sunset-coral/15 hover:bg-sunset-coral/25 text-sunset-coral border border-sunset-coral/40 transition-all shadow-sm"
              title="Open Admin Operations Tower"
              id="nav-admin-portal-active-btn"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            onClick={() => onOpenBooking()}
            className="group relative inline-flex items-center justify-center gap-2 bg-sunset-coral hover:bg-[#ff765b] text-white px-7 py-3 rounded-full text-xs font-semibold tracking-[0.15em] uppercase shadow-xl shadow-sunset-coral/30 hover:shadow-sunset-coral/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/10"
            id="nav-begin-journey-btn"
          >
            <span>Begin Journey</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:bg-white animate-pulse" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-ivory p-2 rounded-lg hover:bg-white/5 focus:outline-none"
            aria-label="Toggle Navigation Menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-obsidian border-b border-white/10 px-6 py-6 mt-3 space-y-4">
          <a
            href="https://www.facebook.com/share/p/1DrMyBougo/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-cyan-300 text-base font-serif-display flex items-center justify-between"
          >
            <span>Visa & Passport Inquiries</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">FB Page</span>
          </a>
          <button
            onClick={() => scrollToSection('destinations')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Islands & Destinations
          </button>
          <button
            onClick={() => scrollToSection('expeditions')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Tour Packages
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Client Reviews
          </button>
          {onOpenWeatherRadar && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWeatherRadar();
              }}
              className="block w-full text-left py-2 text-cyan-300 text-base font-sans-body flex items-center gap-2"
            >
              <CloudSun className="w-4 h-4 text-cyan-400" />
              Global Weather Radar
            </button>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracker();
            }}
            className="block w-full text-left py-2 text-sunset-coral text-base font-sans-body flex items-center gap-2"
          >
            <Ticket className="w-4 h-4 text-sunset-coral" />
            <span>Check Tickets</span>
          </button>

          {travelerUser ? (
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center gap-3">
                {travelerUser.avatar_url ? (
                  <img
                    src={travelerUser.avatar_url}
                    alt={travelerUser.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-sunset-coral/50"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sunset-coral/30 border border-sunset-coral/60 text-sunset-coral flex items-center justify-center text-xs font-bold">
                    {travelerUser.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-serif-display text-ivory truncate">{travelerUser.full_name}</p>
                  <p className="text-[10px] font-mono text-sand-muted truncate">{travelerUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSignOutTraveler) onSignOutTraveler();
                }}
                className="w-full text-left py-1.5 px-2 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Profile</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTravelerAuth) onOpenTravelerAuth();
              }}
              className="block w-full text-left py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/10 text-ivory text-sm font-sans-body flex items-center gap-2.5 hover:border-sunset-coral/50 transition-colors"
            >
              <User className="w-4 h-4 text-sunset-coral" />
              <span>Sign In (Google / Email)</span>
            </button>
          )}

          {isStaffLoggedIn ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdminPortal) onOpenAdminPortal();
              }}
              className="block w-full text-left py-2 text-sunset-coral text-base font-sans-body flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Enter Admin Portal
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdminAuth) onOpenAdminAuth();
              }}
              className="block w-full text-left py-2 text-sand-muted hover:text-ivory text-base font-sans-body flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Staff & Operator Login
            </button>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-sunset-coral text-white py-3 rounded-full text-sm font-medium tracking-wide text-center"
            >
              Begin Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
