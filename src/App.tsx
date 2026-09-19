import React, { useState, useEffect, useMemo } from 'react';
import { 
  Booking, 
  CustomerFeedback, 
  HotelReservation, 
  FlightReservation,
  PaymentInvoice, 
  PaymentRecord, 
  SubmoduleTab, 
  TourPackage, 
  TransportReservation, 
  ViewMode,
  AppSettings
} from './types';
import { 
  getStoredBookings, 
  getStoredFeedbacks, 
  getStoredPackages, 
  resetAllData, 
  saveBookings, 
  saveFeedbacks, 
  savePackages 
} from './utils/storage';
import { CapstoneInfoModal } from './components/CapstoneInfoModal';
import { ClientNavbar } from './components/client/ClientNavbar';
import { ClientPortal } from './components/client/ClientPortal';
import { ClientFooter } from './components/client/ClientFooter';
import { TravelerAuthModal } from './components/client/TravelerAuthModal';
import { MyAccountModal } from './components/client/MyAccountModal';
import { UserProfile, signOutUser, getSupabase, syncUserProfile, getCurrentUserProfile } from './utils/supabaseClient';
import { applyBookingsRLS } from './utils/rowLevelSecurity';
import { AdminNavbar } from './components/admin/AdminNavbar';
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { SessionInactivityGuard } from './components/admin/SessionInactivityGuard';
import { SkeletonLoader } from './components/common/SkeletonLoader';
import { AiCustomerConcierge } from './components/client/AiCustomerConcierge';
import { ClientPromoModal } from './components/client/ClientPromoModal';
import { GlobalWeatherRadarModal } from './components/client/GlobalWeatherRadarModal';
import { LegalComplianceModal } from './components/common/LegalComplianceModal';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { LegalPolicyTab } from './types/compliance';
import { trackEvent } from './utils/analytics';
import { applyAdminTheme } from './utils/theme';

const DEFAULT_SETTINGS: AppSettings = {
  agency: {
    companyName: 'Holiday Travelers Inc.',
    shortName: 'Holiday Travelers',
    accreditationNo: 'DOT-ACCR-NCR-2026',
    tagline: 'Online Booking, Passport & Visa Processing, and Curated Tour Packages',
    email: 'holidaytravelersinc2022@gmail.com',
    phone: '0916 525 3517',
    address: 'Unit 1101 City & Land Mega Plaza Inc., ADB Ave., Corner Garnet Rd., Ortigas Center San Antonio, Pasig City, Philippines, 1605',
    currencySymbol: '₱',
    defaultDownpaymentPct: 30
  },
  theme: {
    accentColor: 'coral',
    fontDisplay: 'cormorant',
    fontBody: 'jakarta',
    bgTone: 'obsidian',
    borderStyle: 'subtle',
    fontSize: 'standard',
    cardGlow: true,
    colorScheme: 'coral',
    density: 'spacious',
    showBorders: true,
    enableAnimations: true
  },
  promo: {
    enabled: true,
    badge: 'Limited Season Promo',
    title: 'Discover the World with 8% Off',
    tagline: 'Domestic & International Early Bird Reservations',
    description: 'Lock in your dream island or international expedition with only 50% downpayment today. Guaranteed boutique resort stays, chartered excursions, and certified local guides.',
    discountCode: 'HOLIDAY2026',
    discountPct: 8,
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    actionText: 'Claim Promo & Reserve Now',
    actionUrl: '#expeditions',
    expiresText: 'Limited to first 25 bookings this season'
  }
};

export default function App() {
  // Navigation & View Mode State (Check URL param ?view=admin or /admin for isolation)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'admin' || window.location.pathname.includes('/admin')) {
      return 'operator';
    }
    const saved = localStorage.getItem('holiday_view_mode');
    return saved === 'operator' ? 'operator' : 'customer';
  });

  const [adminTab, setAdminTab] = useState<SubmoduleTab>('overview');
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);

  // Modals & Client State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [targetTrackerRef, setTargetTrackerRef] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const handleOpenTracker = (ref?: unknown) => {
    if (typeof ref === 'string' && ref.trim()) {
      setTargetTrackerRef(ref.trim());
    } else {
      setTargetTrackerRef(undefined);
    }
    setIsTrackerOpen(true);
  };
  const [isCapstoneModalOpen, setIsCapstoneModalOpen] = useState<boolean>(false);
  const [isWeatherRadarOpen, setIsWeatherRadarOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalPolicyTab>('privacy');
  const [isCookiePreferencesOpen, setIsCookiePreferencesOpen] = useState<boolean>(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [activePromoCode, setActivePromoCode] = useState<string | undefined>(undefined);
  const [isMyAccountModalOpen, setIsMyAccountModalOpen] = useState<boolean>(false);

  // Traveler Supabase Auth State
  const [travelerUser, setTravelerUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('holiday_traveler_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return null;
  });
  const [isTravelerAuthModalOpen, setIsTravelerAuthModalOpen] = useState<boolean>(false);
  const [travelerAuthReason, setTravelerAuthReason] = useState<string | undefined>(undefined);

  const handleTravelerAuthSuccess = (profile: UserProfile) => {
    setTravelerUser(profile);
    localStorage.setItem('holiday_traveler_profile', JSON.stringify(profile));
    setIsTravelerAuthModalOpen(false);
    // Re-open booking modal when user completes sign in
    setIsBookingModalOpen(true);
    setTravelerAuthReason(undefined);
  };

  const handleOpenBookingModalWithAuth = (pkg?: TourPackage) => {
    if (pkg) setPreSelectedPackage(pkg);
    if (!travelerUser) {
      setTravelerAuthReason('Please sign in or create an account to access the reservation & passenger manifest checkout.');
      setIsBookingModalOpen(false);
      setIsTravelerAuthModalOpen(true);
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleSignOutTraveler = async () => {
    await signOutUser();
    setTravelerUser(null);
    localStorage.removeItem('holiday_traveler_profile');
    localStorage.removeItem('holiday_my_booking_refs');
    setTargetTrackerRef(undefined);
    setIsTrackerOpen(false);
  };

  // Synchronize Supabase Auth state (Google OAuth redirect, Session restore, etc.)
  useEffect(() => {
    let isMounted = true;

    // Check active session / profile immediately on load
    getCurrentUserProfile().then((profile) => {
      if (isMounted && profile) {
        setTravelerUser(profile);
      }
    });

    // Subscribe to auth state changes (e.g. returning from Google OAuth popup/redirect)
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const profile = await syncUserProfile(session.user);
        if (profile) {
          setTravelerUser(profile);
        }
        // Clean up hash fragment or query params from URL after Google OAuth callback
        if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState(null, '', cleanUrl);
        }
      } else if (event === 'SIGNED_OUT') {
        setTravelerUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleOpenLegalPolicy = (tab: LegalPolicyTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
    trackEvent('view_legal_policy', 'compliance', { policy: tab });
  };

  useEffect(() => {
    trackEvent('page_view', 'navigation', { view: viewMode });
  }, [viewMode]);

  // Discrete Staff Hotkeys (Ctrl+Shift+A, Cmd+Shift+A, Ctrl+Alt+A, Ctrl+Shift+L, Cmd+Shift+L) & URL triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isShiftOrAlt = e.shiftKey || e.altKey;

      if (
        (isCmdOrCtrl && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (isCmdOrCtrl && e.altKey && (e.key === 'A' || e.key === 'a')) ||
        (isCmdOrCtrl && e.shiftKey && (e.key === 'L' || e.key === 'l')) ||
        (isCmdOrCtrl && e.altKey && (e.key === 'L' || e.key === 'l')) ||
        (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Check for deep link staff query or hash
    const checkHashAndQuery = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (
        urlParams.get('admin') === 'login' || 
        urlParams.get('staff') === 'true' || 
        urlParams.get('portal') === 'operator' ||
        hash === '#staff' ||
        hash === '#admin' ||
        hash === '#terminal'
      ) {
        setIsLoginModalOpen(true);
      }
    };

    checkHashAndQuery();
    window.addEventListener('hashchange', checkHashAndQuery);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHashAndQuery);
    };
  }, []);

  const [adminSession, setAdminSession] = useState<{ email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('holiday_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // App Settings Customization with auto-migration to official Ortigas Pasig details
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('holiday_travelers_settings_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let updatedStorage = false;
        if (parsed?.agency) {
          // If agency still has previous email or empty, migrate to holidaytravelersinc2022@gmail.com
          if (!parsed.agency.email || parsed.agency.email === 'karlljacob8@gmail.com') {
            parsed.agency.email = DEFAULT_SETTINGS.agency.email;
            updatedStorage = true;
          }
        }
        if (parsed?.promo) {
          // Align promo discountPct with 8% if previously 20% or unset
          if (parsed.promo.discountPct === 20 || !parsed.promo.discountPct) {
            parsed.promo.discountPct = 8;
            parsed.promo.title = 'Discover the World with 8% Off';
            updatedStorage = true;
          }
        }
        if (updatedStorage) {
          localStorage.setItem('holiday_travelers_settings_v2', JSON.stringify(parsed));
        }
        if (parsed) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const legacy = localStorage.getItem('holiday_travelers_settings');
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        const updated = {
          ...parsed,
          agency: {
            ...parsed.agency,
            companyName: DEFAULT_SETTINGS.agency.companyName,
            shortName: DEFAULT_SETTINGS.agency.shortName,
            address: DEFAULT_SETTINGS.agency.address,
            phone: DEFAULT_SETTINGS.agency.phone,
            email: DEFAULT_SETTINGS.agency.email,
            tagline: DEFAULT_SETTINGS.agency.tagline,
            accreditationNo: DEFAULT_SETTINGS.agency.accreditationNo,
          }
        };
        localStorage.setItem('holiday_travelers_settings_v2', JSON.stringify(updated));
        return updated;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('holiday_travelers_settings_v2', JSON.stringify(appSettings));
  }, [appSettings]);

  // Auto-launch promotional advertisement popup for guests
  useEffect(() => {
    if (viewMode === 'customer') {
      const timer = setTimeout(() => {
        setIsPromoModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'operator') {
      applyAdminTheme(appSettings.theme);
    } else {
      applyAdminTheme({
        accentColor: 'coral',
        fontDisplay: 'cormorant',
        fontBody: 'jakarta',
        bgTone: 'obsidian',
        borderStyle: 'subtle',
        fontSize: 'standard',
        cardGlow: true,
      });
    }
  }, [appSettings.theme, viewMode]);

  useEffect(() => {
    localStorage.setItem('holiday_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem('holiday_admin_session', JSON.stringify(adminSession));
    } else {
      localStorage.removeItem('holiday_admin_session');
    }
  }, [adminSession]);

  // Persistent Data Collections
  const [packages, setPackages] = useState<TourPackage[]>(() => getStoredPackages());
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings());
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(() => getStoredFeedbacks());

  const [preSelectedPackage, setPreSelectedPackage] = useState<TourPackage | null>(null);

  useEffect(() => {
    savePackages(packages);
  }, [packages]);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveFeedbacks(feedbacks);
  }, [feedbacks]);

  // CRUD Handlers for Packages
  const handleSavePackage = (newPkg: TourPackage) => {
    setPackages((prev) => {
      const idx = prev.findIndex((p) => p.id === newPkg.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newPkg;
        return updated;
      }
      return [newPkg, ...prev];
    });
  };

  const handleDeletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicatePackage = (pkg: TourPackage) => {
    const duplicated: TourPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      code: `${pkg.code}-COPY`,
      title: `${pkg.title} (Copy)`
    };
    setPackages((prev) => [duplicated, ...prev]);
  };

  // Booking Operations Handlers
  const handleCreateBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, bookingStatus: status } : b))
    );
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
    );
  };

  // Dispatch & Allocations Handlers
  const handleUpdateGuide = (bookingId: string, guideName: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, assignedGuide: guideName } : b))
    );
  };

  const handleUpdateHotelReservation = (bookingId: string, hotel: HotelReservation) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, hotelReservation: hotel } : b))
    );
  };

  const handleUpdateTransportReservation = (bookingId: string, transport: TransportReservation) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, transportReservation: transport } : b))
    );
  };

  const handleUpdateFlightReservation = (bookingId: string, flight: FlightReservation) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, flightReservation: flight } : b))
    );
  };

  // Invoices & Payments Handler
  const handleAddPaymentRecord = (bookingId: string, payment: PaymentRecord) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const newPayments = [...b.invoice.payments, payment];
        const newPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
        const newBalance = Math.max(0, b.invoice.totalAmount - newPaid);
        const newInvoiceStatus = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';

        const updatedInvoice: PaymentInvoice = {
          ...b.invoice,
          amountPaid: newPaid,
          balanceDue: newBalance,
          status: newInvoiceStatus as any,
          payments: newPayments
        };

        return {
          ...b,
          paymentStatus: newInvoiceStatus === 'Paid' ? 'Paid' : 'Partial',
          invoice: updatedInvoice
        };
      })
    );
  };

  // Feedback Handler
  const handleSubmitFeedback = (newFeedback: CustomerFeedback) => {
    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  // Reset Demo Data
  const handleResetData = () => {
    resetAllData();
    window.location.reload();
  };

  const handleAdminTabChange = (newTab: SubmoduleTab) => {
    if (newTab === adminTab) return;
    setIsTabLoading(true);
    setAdminTab(newTab);
    setTimeout(() => setIsTabLoading(false), 150);
  };

  // Auth Operations
  const handleLoginSuccess = (email: string, role: string) => {
    setAdminSession({ email, role });
    setViewMode('operator');
    setAdminTab('overview');
  };

  const handleLogout = () => {
    setAdminSession(null);
    setViewMode('customer');
    setTravelerUser(null);
    localStorage.removeItem('holiday_admin_session');
    localStorage.removeItem('holiday_traveler_profile');
    localStorage.removeItem('holiday_my_booking_refs');
    setTargetTrackerRef(undefined);
    setIsTrackerOpen(false);
  };

  // Row Level Security (RLS) Customer Isolation Filter:
  // - Staff members: see authorized bookings per staff role RLS
  // - Authenticated travelers: see ONLY bookings linked to their account email
  // - Logged-out / Guest users: see 0 tickets by default (eliminating ticket visibility leakage on logout)
  const customerVisibleBookings = useMemo(() => {
    if (adminSession) {
      return applyBookingsRLS(bookings, { email: adminSession.email, role: adminSession.role }).data;
    }
    if (travelerUser) {
      const userEmail = travelerUser.email.toLowerCase().trim();
      return bookings.filter((b) => (b.customer?.email || '').toLowerCase().trim() === userEmail);
    }
    if (targetTrackerRef) {
      return bookings.filter((b) => b.bookingRef === targetTrackerRef);
    }
    return [];
  }, [bookings, adminSession, travelerUser, targetTrackerRef]);

  const pendingPaymentsCount = bookings.filter((b) => b.invoice.balanceDue > 0).length;

  return (
    <div className="min-h-screen bg-[#070B0E] text-[#F4F1EA] font-sans antialiased selection:bg-[#F26A4F] selection:text-white flex flex-col">
      {/* Accessible Skip Link for Screen Readers (ISO/IEC 40500 / WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sunset-coral focus:text-white focus:rounded-full focus:shadow-2xl focus:text-xs focus:font-semibold focus:outline-none"
      >
        Skip to main content (ISO/IEC 40500 Accessible)
      </a>

      {/* ========================================================================= */}
      {/* MODE 1: 100% IMMERSIVE CLIENT WEBSITE (Archipelago Emergent Design)       */}
      {/* ========================================================================= */}
      {viewMode === 'customer' ? (
        <>
          <ClientNavbar
            onOpenBooking={(pkgId) => {
              const found = pkgId ? packages.find((p) => p.id === pkgId) : undefined;
              handleOpenBookingModalWithAuth(found);
            }}
            onOpenTracker={handleOpenTracker}
            onOpenAdminAuth={() => setIsLoginModalOpen(true)}
            onOpenWeatherRadar={() => setIsWeatherRadarOpen(true)}
            isStaffLoggedIn={Boolean(adminSession)}
            onOpenAdminPortal={() => setViewMode('operator')}
            travelerUser={travelerUser}
            onOpenTravelerAuth={() => {
              setTravelerAuthReason(undefined);
              setIsTravelerAuthModalOpen(true);
            }}
            onSignOutTraveler={handleSignOutTraveler}
            onOpenMyAccount={() => setIsMyAccountModalOpen(true)}
          />

          <main className="flex-1 w-full" id="main-content">
            <ClientPortal
              packages={packages}
              bookings={customerVisibleBookings}
              feedbacks={feedbacks}
              onCreateBooking={handleCreateBooking}
              onUpdateBooking={handleUpdateBooking}
              onSubmitFeedback={handleSubmitFeedback}
              preSelectedPackage={preSelectedPackage}
              onSelectBookPackage={(pkg) => setPreSelectedPackage(pkg)}
              onClearPreSelectedPackage={() => setPreSelectedPackage(null)}
              isTrackerOpen={isTrackerOpen}
              onCloseTracker={() => {
                setIsTrackerOpen(false);
                setTargetTrackerRef(undefined);
              }}
              onOpenTracker={handleOpenTracker}
              trackerTargetRef={targetTrackerRef}
              isBookingModalOpen={isBookingModalOpen}
              onCloseBookingModal={() => setIsBookingModalOpen(false)}
              onOpenBookingModal={(pkg) => handleOpenBookingModalWithAuth(pkg)}
              onOpenWeatherRadar={() => setIsWeatherRadarOpen(true)}
              onOpenLegalPolicy={handleOpenLegalPolicy}
              promoCode={activePromoCode || (appSettings.promo?.enabled ? appSettings.promo.discountCode : undefined)}
              promoDiscountPct={appSettings.promo?.discountPct || 8}
              currentUser={travelerUser}
              onOpenMyAccount={() => setIsMyAccountModalOpen(true)}
              onRequireAuth={() => {
                setTravelerAuthReason('Philippine DOT and IATA airline regulations require a verified email or Google profile to confirm booking vouchers and transmit flight manifests. Please sign in or register to complete your reservation.');
                setIsBookingModalOpen(false);
                setIsTravelerAuthModalOpen(true);
              }}
            />
          </main>

          <ClientFooter
            onOpenAdminAuth={() => setIsLoginModalOpen(true)}
            onOpenTracker={handleOpenTracker}
            isStaffLoggedIn={Boolean(adminSession)}
            onOpenAdminPortal={() => setViewMode('operator')}
            onOpenLegalPolicy={handleOpenLegalPolicy}
            onOpenCookiePreferences={() => setIsCookiePreferencesOpen(true)}
          />

          <AiCustomerConcierge
            packages={packages}
            onSelectPackage={(pkg) => handleOpenBookingModalWithAuth(pkg)}
          />
        </>
      ) : (
        /* ========================================================================= */
        /* MODE 2: ISOLATED ADMIN TOUR OPERATIONS ENTERPRISE PORTAL                  */
        /* ========================================================================= */
        <SessionInactivityGuard
          adminEmail={adminSession?.email || 'admin@holidaytravelers.ph'}
          adminRole={adminSession?.role || 'Super Admin'}
          onLogout={handleLogout}
        >
          <div 
            className="min-h-screen admin-theme-wrapper flex flex-col transition-colors duration-300"
            style={{ backgroundColor: 'var(--admin-bg-base, #070B0E)' }}
          >
            <AdminNavbar
              activeTab={adminTab}
              onTabChange={handleAdminTabChange}
              onOpenCapstoneModal={() => setIsCapstoneModalOpen(true)}
              onLogout={handleLogout}
              bookingCount={bookings.length}
              pendingPaymentCount={pendingPaymentsCount}
              adminEmail={adminSession?.email || 'admin@holidaytravelers.ph'}
              adminRole={adminSession?.role || 'Senior Tour Operations Manager'}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {isTabLoading ? (
                <div className="space-y-6">
                  <SkeletonLoader type="banner" />
                  <SkeletonLoader type="card" count={3} />
                </div>
              ) : (
                <AdminPortal
                  activeTab={adminTab}
                  onTabChange={handleAdminTabChange}
                  packages={packages}
                  bookings={bookings}
                  feedbacks={feedbacks}
                  appSettings={appSettings}
                  adminEmail={adminSession?.email || 'admin@holidaytravelers.ph'}
                  adminRole={adminSession?.role || 'Senior Tour Operations Manager'}
                  onSavePackage={handleSavePackage}
                  onDeletePackage={handleDeletePackage}
                  onDuplicatePackage={handleDuplicatePackage}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onUpdateBooking={handleUpdateBooking}
                  onUpdateGuide={handleUpdateGuide}
                  onUpdateHotelReservation={handleUpdateHotelReservation}
                  onUpdateTransportReservation={handleUpdateTransportReservation}
                  onUpdateFlightReservation={handleUpdateFlightReservation}
                  onAddPaymentRecord={handleAddPaymentRecord}
                  onSubmitFeedback={handleSubmitFeedback}
                  onUpdateSettings={(newSettings) => setAppSettings(newSettings)}
                  onResetSettings={() => setAppSettings(DEFAULT_SETTINGS)}
                />
              )}
            </main>

            <footer 
              className="border-t border-white/[0.06] py-5 text-xs text-sand-muted transition-colors duration-300"
              style={{ backgroundColor: 'var(--admin-bg-base, #070B0E)' }}
            >
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <strong className="text-ivory">{appSettings.agency.companyName}</strong> — Operator Command Center ({appSettings.agency.accreditationNo})
                </div>
                <div className="flex items-center gap-3 text-[11px] text-sand-muted">
                  <button
                    onClick={() => setIsCapstoneModalOpen(true)}
                    className="hover:text-ivory transition-colors"
                    style={{ color: 'var(--admin-accent, #F26A4F)' }}
                  >
                    System Specs
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setViewMode('customer')}
                    className="text-sand-muted hover:text-ivory transition-colors"
                  >
                    Return to Public Website
                  </button>
                  <span>•</span>
                  <button
                    onClick={handleLogout}
                    className="text-rose-400 hover:underline transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </SessionInactivityGuard>
      )}

      {/* Traveler Auth Modal (Supabase Sign In / Register / Guest) */}
      <TravelerAuthModal
        isOpen={isTravelerAuthModalOpen}
        onClose={() => {
          setIsTravelerAuthModalOpen(false);
          setTravelerAuthReason(undefined);
        }}
        onAuthSuccess={handleTravelerAuthSuccess}
        onContinueAsGuest={() => {
          setIsTravelerAuthModalOpen(false);
          setTravelerAuthReason(undefined);
        }}
        reasonMessage={travelerAuthReason}
      />

      {/* Admin Login Modal (Accessible from discreet staff access trigger) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Live Weather Radar Modal */}
      <GlobalWeatherRadarModal
        isOpen={isWeatherRadarOpen}
        onClose={() => setIsWeatherRadarOpen(false)}
      />

      {/* Capstone Info Modal */}
      <CapstoneInfoModal
        isOpen={isCapstoneModalOpen}
        onClose={() => setIsCapstoneModalOpen(false)}
        onResetData={handleResetData}
      />

      {/* Legal & Governance Compliance Modal (ISO/IEC 27001 & ISO/IEC 40500) */}
      <LegalComplianceModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
        onOpenCookiePreferences={() => setIsCookiePreferencesOpen(true)}
      />

      {/* Cookie & Telemetry Consent Manager */}
      <CookieConsentBanner
        onOpenLegalModal={(tab) => handleOpenLegalPolicy(tab)}
        forceOpenPreferences={isCookiePreferencesOpen}
        onClosePreferencesModal={() => setIsCookiePreferencesOpen(false)}
      />

      {/* My Account & Traveler Profile Modal */}
      <MyAccountModal
        isOpen={isMyAccountModalOpen}
        onClose={() => setIsMyAccountModalOpen(false)}
        travelerUser={travelerUser}
        userBookings={customerVisibleBookings}
        onUpdateProfile={(updatedProfile) => setTravelerUser(updatedProfile)}
        onUpdateAppSettings={(updatedSettings) => setAppSettings({ ...appSettings, ...updatedSettings })}
        appSettings={appSettings}
        onOpenTracker={handleOpenTracker}
      />

      {/* Interactive Full-Screen Promotional Advertisement Modal */}
      {appSettings.promo && (
        <ClientPromoModal
          promo={appSettings.promo}
          isOpen={isPromoModalOpen}
          onClose={() => setIsPromoModalOpen(false)}
          onClaimPromo={() => {
            if (appSettings.promo?.discountCode) {
              setActivePromoCode(appSettings.promo.discountCode);
            }
            setIsPromoModalOpen(false);
            setIsBookingModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
