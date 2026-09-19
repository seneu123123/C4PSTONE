import React, { useState, useEffect } from 'react';
import { 
  Booking, 
  PaymentRecord 
} from '../../types';
import { InPersonReceiptModal } from './InPersonReceiptModal';
import { RubberStamp } from '../common/RubberStamp';
import { ActionConfirmModal } from '../common/ActionConfirmModal';
import { 
  Search, 
  FileCheck, 
  Calendar, 
  MapPin, 
  Users, 
  User, 
  CreditCard, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Hotel, 
  Car, 
  Plane,
  ShieldCheck, 
  Phone, 
  Mail, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  FileText,
  Copy,
  Check,
  MessageSquare,
  UploadCloud,
  X,
  Ticket,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { dispatchAppNotification } from '../../utils/notifications';
import { UserProfile } from '../../utils/supabaseClient';
import { SupportedCurrency, getStoredCurrency, formatCurrency } from '../../utils/currency';

interface ClientBookingTrackerProps {
  bookings: Booking[];
  onNavigateToBook: () => void;
  onUpdateBooking?: (booking: Booking) => void;
  initialSelectedRef?: string;
  currentUser?: UserProfile | null;
  onOpenMyAccount?: () => void;
}

export const ClientBookingTracker: React.FC<ClientBookingTrackerProps> = ({
  bookings,
  onNavigateToBook,
  onUpdateBooking,
  initialSelectedRef,
  currentUser,
  onOpenMyAccount
}) => {
  const safeInitialRef = typeof initialSelectedRef === 'string' && initialSelectedRef.trim() ? initialSelectedRef.trim() : undefined;
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedViber, setCopiedViber] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [reuploadImage, setReuploadImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const custom = e as CustomEvent<SupportedCurrency>;
      if (custom.detail) setActiveCurrency(custom.detail);
    };
    window.addEventListener('holiday_currency_changed', handleCurrencyChange);
    return () => window.removeEventListener('holiday_currency_changed', handleCurrencyChange);
  }, []);

  // Read personal booking references created by this browser/device
  const [myBookingRefs, setMyBookingRefs] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('holiday_my_booking_refs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Keep local refs in sync whenever bookings or safeInitialRef changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem('holiday_my_booking_refs');
      const parsed: string[] = raw ? JSON.parse(raw) : [];
      if (safeInitialRef && !parsed.includes(safeInitialRef)) {
        parsed.unshift(safeInitialRef);
        localStorage.setItem('holiday_my_booking_refs', JSON.stringify(parsed));
      }
      setMyBookingRefs(parsed);
    } catch {
      // ignore
    }
  }, [safeInitialRef, bookings]);

  // Filter bookings securely according to user account privacy:
  // - Logged in user: ONLY see bookings matching their email OR created on their session (myBookingRefs/safeInitialRef)
  // - Guests / Brand New Users: ONLY see bookings created on their session (myBookingRefs/safeInitialRef). Brand new accounts see 0 tickets!
  const visibleBookings = React.useMemo(() => {
    const userEmail = currentUser?.email?.toLowerCase().trim();

    // 1. If searching: search across user's authorized bookings OR by exact reference code
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qClean = q.replace(/[\s-]/g, '');

      return bookings.filter((b) => {
        const ref = (b.bookingRef || '').toLowerCase();
        const refClean = ref.replace(/[\s-]/g, '');
        const email = (b.customer?.email || '').toLowerCase().trim();
        const custRef = (b.customerReferenceNo || '').toLowerCase();
        const name = (b.customer?.fullName || '').toLowerCase();
        const title = (b.tourTitle || '').toLowerCase();

        // Is this booking owned by this logged-in account or session?
        const isOwnedByAccount = 
          (userEmail && email === userEmail) || 
          myBookingRefs.includes(b.bookingRef) || 
          b.bookingRef === safeInitialRef;

        const matchesExactRef = ref === q || refClean === qClean || custRef === q;

        if (isOwnedByAccount) {
          return (
            ref.includes(q) ||
            refClean.includes(qClean) ||
            name.includes(q) ||
            email.includes(q) ||
            title.includes(q)
          );
        }

        // Allow searching by exact reference number if user types their exact ticket code
        return matchesExactRef;
      });
    }

    // 2. Default view (No search query):
    // If logged in: filter strictly by user email OR session created refs
    if (userEmail) {
      return bookings.filter((b) => {
        const bEmail = (b.customer?.email || '').toLowerCase().trim();
        return (
          bEmail === userEmail ||
          myBookingRefs.includes(b.bookingRef) ||
          b.bookingRef === safeInitialRef
        );
      });
    }

    // If Guest (not logged in): filter strictly by session refs (myBookingRefs or safeInitialRef)
    const activeSet = new Set(myBookingRefs);
    if (safeInitialRef) activeSet.add(safeInitialRef);

    if (activeSet.size > 0) {
      return bookings.filter((b) => activeSet.has(b.bookingRef));
    }

    // Brand new guest with 0 bookings -> Return empty list (0 tickets!)
    return [];
  }, [bookings, searchQuery, myBookingRefs, safeInitialRef, currentUser]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(() => {
    if (safeInitialRef) {
      const found = bookings.find((b) => b.bookingRef === safeInitialRef);
      if (found) return found;
    }
    const userEmail = currentUser?.email?.toLowerCase().trim();
    if (userEmail) {
      const myAccountFirst = bookings.find((b) => (b.customer?.email || '').toLowerCase().trim() === userEmail || myBookingRefs.includes(b.bookingRef));
      if (myAccountFirst) return myAccountFirst;
    }
    const myFirst = bookings.find((b) => myBookingRefs.includes(b.bookingRef));
    return myFirst || null;
  });

  // When safeInitialRef changes
  useEffect(() => {
    if (safeInitialRef) {
      const found = bookings.find((b) => b.bookingRef === safeInitialRef);
      if (found) {
        setSelectedBooking(found);
      }
    }
  }, [safeInitialRef, bookings]);

  // Synchronize selected booking safely when visible bookings change without creating re-render loops
  useEffect(() => {
    if (visibleBookings.length > 0) {
      setSelectedBooking((prev) => {
        if (prev && visibleBookings.some((b) => b.id === prev.id)) {
          return prev;
        }
        return visibleBookings[0];
      });
    } else {
      setSelectedBooking(null);
    }
  }, [visibleBookings]);

  const handlePrintVoucher = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Printing unavailable in iframe sandbox:', err);
      dispatchAppNotification({
        title: 'Print Notice',
        message: 'Printing is restricted in preview mode. Click "Official Receipt" to view/save the full digital voucher.',
        type: 'info'
      });
    }
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleCopyViber = (b: Booking) => {
    const summary = `[HOLIDAY TRAVELERS INC. - TRAVEL VOUCHER SUMMARY]
Booking Ref: ${b.bookingRef}
Lead Passenger: ${b.customer.fullName}
Expedition: ${b.tourTitle}
Destination: ${b.destination}
Departure: ${b.travelDate}
Passengers: ${b.numPax} Persons
Amount Paid: ₱${b.invoice.amountPaid.toLocaleString()}
Payment Status: ${b.paymentVerificationStatus || b.invoice.payments[0]?.status || 'Pending Verification'}

Office Address: Unit 1101 City & Land Mega Plaza, ADB Ave. cor. Garnet Rd., Ortigas Center, Pasig City
Phone: 0916 525 3517 | Email: holidaytravelersinc2022@gmail.com`;

    navigator.clipboard.writeText(summary);
    setCopiedViber(true);
    setTimeout(() => setCopiedViber(false), 2200);
  };

  // Handle re-uploading a clearer receipt photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        if (event.target?.result) {
          setReuploadImage(event.target.result as string);
        }
        setIsUploading(false);
      }, 400);
    };
    reader.readAsDataURL(file);
  };

  // State for confirm modal
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);

  const handlePromptSubmitReupload = () => {
    if (!reuploadImage) return;
    setIsConfirmSubmitOpen(true);
  };

  const handleConfirmReupload = () => {
    setIsConfirmSubmitOpen(false);
    handleSubmitReupload();
  };

  const handleSubmitReupload = () => {
    if (!selectedBooking || !reuploadImage) return;

    const updatedPayments = selectedBooking.invoice.payments.map((p) => ({
      ...p,
      status: 'Pending Verification' as const,
      receiptProofUrl: reuploadImage,
      notes: 'Customer submitted updated receipt photo for audit'
    }));

    const updated: Booking = {
      ...selectedBooking,
      receiptProofUrl: reuploadImage,
      paymentVerificationStatus: 'Pending Verification',
      verificationNotes: undefined, // Clear old flag note
      invoice: {
        ...selectedBooking.invoice,
        payments: updatedPayments
      }
    };

    onUpdateBooking?.(updated);
    setSelectedBooking(updated);
    setIsReuploadModalOpen(false);
    setReuploadImage('');

    // Dispatch real-time notification
    dispatchAppNotification({
      title: 'Receipt Re-uploaded',
      message: `Updated receipt attached for ${selectedBooking.bookingRef}. Queued for Finance Officer audit.`,
      type: 'receipt',
      bookingRef: selectedBooking.bookingRef
    });
  };

  const latestRef = myBookingRefs.length > 0 ? myBookingRefs[0] : null;

  const totalOutstandingBalance = visibleBookings.reduce((sum, b) => sum + (b.invoice?.balanceDue || 0), 0);
  const activeUnpaidBookings = visibleBookings.filter((b) => (b.invoice?.balanceDue || 0) > 0);

  return (
    <div className="space-y-8 text-left">
      {/* Outstanding Balance Global Alert Banner */}
      {totalOutstandingBalance > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/70 via-sunset-coral/20 to-amber-950/50 border-2 border-sunset-coral/50 shadow-2xl space-y-3 animate-pulse-subtle">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sunset-coral/20 border border-sunset-coral/60 flex items-center justify-center text-sunset-coral shrink-0">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sunset-coral font-bold block">
                  Active Outstanding Balance Notice
                </span>
                <h3 className="text-lg sm:text-xl font-serif-display text-ivory">
                  {formatCurrency(totalOutstandingBalance, activeCurrency)} Remaining Unpaid
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenMyAccount && (
                <button
                  type="button"
                  onClick={onOpenMyAccount}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-ivory font-semibold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-sunset-coral" />
                  <span>My Account</span>
                </button>
              )}

              {activeUnpaidBookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedBooking(activeUnpaidBookings[0])}
                  className="px-4 py-2 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs shadow-lg shadow-sunset-coral/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Settle Balance Now</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-sand-muted font-sans-body">
            You have <strong className="text-sunset-coral">{activeUnpaidBookings.length} active reservation(s)</strong> with a pending balance. Please upload your payment receipt or transfer proof before your scheduled departure.
          </p>
        </div>
      )}

      {/* Search & Device Status Header */}
      <div className="bg-[#0B1015] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Passenger Travel Desk & Ticket Tracker</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-display font-light text-ivory tracking-wide">
            Check Tickets, Manifest & Tour Vouchers
          </h2>

          <p className="text-xs text-sand-muted leading-relaxed font-sans-body">
            View your verified travel dates, registered passengers, guide contact info, and printable vouchers. Enter your booking code (e.g., <code className="text-sunset-coral font-mono">HT-2026-XXXX</code>) or booking email.
          </p>

          {/* Search Box */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2 pt-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#070B0E] rounded-2xl border border-white/15 focus-within:border-sunset-coral transition-colors">
              <Search className="w-4 h-4 text-sunset-coral shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your code (e.g. HT-2026-8K4M), passenger name, or email..."
                className="bg-transparent text-xs text-ivory placeholder-sand-muted/50 focus:outline-none w-full font-sans-body"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-sand-muted hover:text-ivory px-2 py-1 rounded bg-white/5 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Suggested Booking Chip on this Device (Strict User Request) */}
          {latestRef && !searchQuery && (
            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-sand-muted text-[11px] font-sans-body">Recent Booking on this Device:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(latestRef);
                  const found = bookings.find((b) => b.bookingRef === latestRef);
                  if (found) setSelectedBooking(found);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunset-coral/15 hover:bg-sunset-coral/25 active:scale-95 text-sunset-coral font-mono font-bold text-xs border border-sunset-coral/30 transition-all cursor-pointer shadow-sm"
              >
                <Ticket className="w-3 h-3" />
                <span>{latestRef} (Click to Load)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {visibleBookings.length === 0 && !searchQuery ? (
        /* Clean Slate for New Guests */
        <div className="bg-[#0B1015] border border-white/10 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-sand-muted">
            <Ticket className="w-8 h-8 opacity-40 text-sand-muted" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif-display text-2xl text-ivory font-light">
              Clear Slate • No Reservations Stored on this Device
            </h3>
            <p className="text-xs text-sand-muted max-w-md mx-auto leading-relaxed font-sans-body">
              You do not have any active bookings cached in this browser session. If you recently reserved or booked at our Ortigas office, enter your reference code (e.g. <span className="font-mono text-ivory">HT-2026-XXXX</span>) or email above.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <button
              type="button"
              onClick={onNavigateToBook}
              className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] active:scale-95 text-white text-xs font-semibold tracking-wider uppercase shadow-lg shadow-sunset-coral/25 transition-all cursor-pointer"
            >
              Reserve a New Tour Expedition
            </button>

            {bookings.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const first = bookings[0];
                  setSelectedBooking(first);
                  setSearchQuery(first.bookingRef);
                }}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-ivory text-xs font-medium border border-white/10 transition-all cursor-pointer active:scale-95"
              >
                Inspect Sample Voucher ({bookings[0].bookingRef})
              </button>
            )}
          </div>
        </div>
      ) : visibleBookings.length === 0 && searchQuery ? (
        /* No Search Match - with Smart Quick Suggestions */
        <div className="bg-[#0B1015] border border-white/10 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-8 h-8 mx-auto text-amber-400" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-ivory">No Booking Found for "{searchQuery}"</h3>
            <p className="text-xs text-sand-muted leading-relaxed font-sans-body">
              Please verify the booking reference code format (<span className="font-mono text-ivory">HT-2026-XXXX</span>) or primary passenger name/email.
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2">
              <span className="text-[11px] font-mono uppercase text-sand-muted tracking-wider block">
                Available System Reservations:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {bookings.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(b.bookingRef);
                      setSelectedBooking(b);
                    }}
                    className="w-full p-2 rounded-xl bg-[#090E14] hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
                  >
                    <span className="font-mono text-sunset-coral font-bold">{b.bookingRef}</span>
                    <span className="text-ivory font-medium truncate max-w-[150px]">{b.customer.fullName}</span>
                    <span className="text-[10px] text-sand-muted">{b.travelDate}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-white/5 text-sand-muted hover:text-ivory text-xs transition-colors cursor-pointer"
            >
              Clear Search Query
            </button>
          </div>
        </div>
      ) : (
        /* Active Results Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of Matched Bookings */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sand-muted font-semibold">
                Your Reservations ({visibleBookings.length})
              </span>
              <span className="text-[10px] font-mono text-sand-muted">Select to View</span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {visibleBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                const status = b.paymentVerificationStatus || b.invoice.payments[0]?.status || 'Pending Verification';

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#0E151D] border-sunset-coral/60 shadow-lg shadow-sunset-coral/10'
                        : 'bg-[#0B1015] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-sm font-bold tracking-wider text-sunset-coral block">
                          {b.bookingRef}
                        </span>
                        <h4 className="text-xs font-semibold text-ivory mt-0.5 line-clamp-1 font-sans-body">
                          {b.tourTitle}
                        </h4>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-sunset-coral translate-x-0.5' : 'text-sand-muted/50'
                        }`}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-sans-body text-sand-muted border-t border-white/5 pt-2">
                      <span>{b.travelDate}</span>
                      <span className="font-mono text-ivory">{b.numPax} Pax</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-400">
                        {formatCurrency(b.invoice.amountPaid, activeCurrency)}
                      </span>

                      {status === 'Verified' ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Verified
                        </span>
                      ) : status === 'Flagged / Needs Re-upload' ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Action Needed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Audit in Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Ticket View */}
          <div className="lg:col-span-8">
            {selectedBooking ? (
              <div className="bg-[#0B1015] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-sunset-coral" />
                      <span className="font-mono text-2xl font-bold tracking-widest text-ivory">
                        {selectedBooking.bookingRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyRef(selectedBooking.bookingRef)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sand-muted hover:text-ivory transition-colors cursor-pointer"
                        title="Copy Reference Code"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-sand-muted mt-1 font-sans-body">
                      Official Passenger Travel Manifest & Electronic Ticket Voucher
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Copy Viber / Messenger Snippet */}
                    <button
                      type="button"
                      onClick={() => handleCopyViber(selectedBooking)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-sand-muted hover:text-ivory font-sans-body flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                      title="Copy formatted summary to paste into Viber or Facebook Messenger"
                    >
                      {copiedViber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{copiedViber ? 'Summary Copied' : 'Viber/FB Copy'}</span>
                    </button>

                    {/* Official Receipt / Voucher View */}
                    <button
                      type="button"
                      onClick={() => setIsReceiptModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs text-white font-medium flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer font-sans-body"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Official Receipt</span>
                    </button>

                    {/* Print Voucher */}
                    <button
                      type="button"
                      onClick={handlePrintVoucher}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-sand-muted hover:text-ivory font-medium flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer font-sans-body"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Anti-Scam & Verification Status Banner */}
                {(() => {
                  const pmtStatus = selectedBooking.paymentVerificationStatus || selectedBooking.invoice.payments[0]?.status || 'Pending Verification';

                  if (pmtStatus === 'Verified') {
                    return (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                        <div className="flex items-center gap-2 font-semibold text-xs font-sans-body">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Payment Verified & Confirmed by Finance Officer</span>
                        </div>
                        <p className="text-xs text-sand-muted leading-relaxed font-sans-body">
                          Your payment has been reconciled with our official merchant settlement statement. Your slots and travel clearances are fully locked.
                        </p>
                      </div>
                    );
                  }

                  if (pmtStatus === 'Flagged / Needs Re-upload') {
                    return (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-semibold text-xs font-sans-body">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span>Action Required • Clearer Receipt Screenshot Needed</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsReuploadModalOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer font-sans-body"
                          >
                            Re-upload Photo
                          </button>
                        </div>
                        <p className="text-xs text-sand-muted leading-relaxed font-sans-body">
                          <strong>Finance Note:</strong> {selectedBooking.verificationNotes || 'The uploaded receipt was unreadable. Please attach a high-resolution screenshot showing the transaction reference number.'}
                        </p>
                      </div>
                    );
                  }

                  // Default: Pending Manual Verification (Anti-Scam Architecture)
                  return (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-xs font-sans-body">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>Audit in Progress by Finance Officer</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsReuploadModalOpen(true)}
                          className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-sans-body border border-amber-500/30 active:scale-95 transition-all cursor-pointer"
                        >
                          Submit Clearer Photo
                        </button>
                      </div>
                      <p className="text-xs text-sand-muted leading-relaxed font-sans-body">
                        To prevent forged slips, every transaction reference is <strong className="text-amber-200">manually cross-checked</strong> against our live InstaPay and GCash merchant statements before departure clearance. Your booking is held for 48 hours.
                      </p>
                    </div>
                  );
                })()}

                {/* Tour & Destination Overview */}
                <div className="bg-[#070B0E] p-5 rounded-2xl border border-white/10 space-y-3 font-sans-body relative overflow-hidden">
                  {/* Official Stamp Placement */}
                  <div className="sm:absolute sm:top-4 sm:right-5 flex justify-end z-10 pointer-events-none mb-2 sm:mb-0">
                    <RubberStamp
                      type={
                        selectedBooking.paymentStatus === 'Paid' || (selectedBooking.paymentVerificationStatus === 'Verified')
                          ? 'PAID'
                          : selectedBooking.paymentStatus === 'Partial' && selectedBooking.invoice.amountPaid > 0
                          ? 'PARTIAL'
                          : selectedBooking.paymentVerificationStatus === 'Flagged / Needs Re-upload'
                          ? 'PENDING'
                          : 'UNPAID'
                      }
                      verificationCode={selectedBooking.bookingRef}
                      size="sm"
                      rotation={-6}
                      className="animate-stamp-drop"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sunset-coral font-semibold">
                      Curated Tour Expedition
                    </span>
                    <span className="text-xs text-sand-muted font-mono">{selectedBooking.destination}</span>
                  </div>
                  <h3 className="text-lg font-bold text-ivory max-w-[80%]">{selectedBooking.tourTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-white/5">
                    <div>
                      <span className="text-sand-muted text-[10px] block">Departure Date:</span>
                      <span className="text-ivory font-mono font-medium">{selectedBooking.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-sand-muted text-[10px] block">Total Manifested Pax:</span>
                      <span className="text-sunset-coral font-mono font-bold">{selectedBooking.numPax} Persons</span>
                    </div>
                    <div>
                      <span className="text-sand-muted text-[10px] block">Amount Settled:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        ₱{selectedBooking.invoice.amountPaid.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {selectedBooking.appliedPromoCode && (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Promo Code Applied: <strong>{selectedBooking.appliedPromoCode}</strong></span>
                      </span>
                      <span>Discount: -₱{(selectedBooking.discountAmount || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Passenger Manifest Roster */}
                <div className="bg-[#070B0E] p-5 rounded-2xl border border-white/10 space-y-3 font-sans-body">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sand-muted flex items-center gap-2">
                      <Users className="w-4 h-4 text-sunset-coral" />
                      <span>Passenger Manifest ({selectedBooking.passengers?.length || selectedBooking.numPax} Persons)</span>
                    </h4>
                    <span className="text-[10px] text-sand-muted font-mono">
                      Aviation & Tour Security Manifest
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(selectedBooking.passengers && selectedBooking.passengers.length > 0
                      ? selectedBooking.passengers
                      : [
                          {
                            id: `${selectedBooking.id}-lead`,
                            fullName: selectedBooking.customer.fullName,
                            age: 30,
                            gender: 'Female' as const,
                            passportOrId: selectedBooking.bookingRef,
                            specialRequirements: selectedBooking.specialInstructions,
                            nationality: selectedBooking.customer.nationality || 'Filipino'
                          }
                        ]
                    ).map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className="p-3 bg-[#0B1015] rounded-xl border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30 flex items-center justify-center font-mono text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-ivory">{p.fullName}</div>
                            <div className="text-[11px] text-sand-muted font-mono flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span>{p.age || 28} yo • {p.gender || 'Passenger'}</span>
                              <span>• ID:</span>
                              {p.passportOrId === 'No ID (To Follow)' || p.passportOrId?.toLowerCase().includes('follow') ? (
                                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px]">
                                  To Follow / None on Hand
                                </span>
                              ) : (
                                <span className="text-ivory font-bold">{p.passportOrId || 'VERIFIED'}</span>
                              )}
                            </div>
                            {p.specialRequirements && (
                              <div className="text-[10px] text-amber-300 mt-0.5 font-sans-body">
                                Alert: {p.specialRequirements}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Registered
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flight, Hotel & Shuttle Logistics Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans-body">
                  {/* Flight Segment */}
                  <div className="p-4 rounded-2xl bg-[#070B0E] border border-white/10 space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-sand-muted flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-sky-400" />
                          <span>Flight / Airline</span>
                        </span>
                        {(!selectedBooking.flightReservation || selectedBooking.flightReservation.status === 'To Follow' || selectedBooking.flightReservation.airline.toLowerCase().includes('follow')) ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 font-mono tracking-wider uppercase animate-pulse">
                            To Follow
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 font-mono">
                            {selectedBooking.flightReservation.status || 'Confirmed'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-ivory">
                        {selectedBooking.flightReservation?.airline || 'Airline In Confirmation'}
                      </div>
                      <div className="text-[11px] text-sand-muted">
                        Flight: {selectedBooking.flightReservation?.flightNumber || 'TBA by Operations'}
                      </div>
                    </div>
                    <div className="text-[10px] text-sand-muted font-mono pt-1 border-t border-white/5">
                      PNR: {selectedBooking.flightReservation?.pnrCode || 'In Process'}
                    </div>
                  </div>

                  {/* Resort Accommodation Segment */}
                  <div className="p-4 rounded-2xl bg-[#070B0E] border border-white/10 space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-sand-muted flex items-center gap-1.5">
                          <Hotel className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Resort Hotel</span>
                        </span>
                        {(!selectedBooking.hotelReservation || selectedBooking.hotelReservation.status === 'To Follow' || selectedBooking.hotelReservation.hotelName.toLowerCase().includes('follow')) ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 font-mono tracking-wider uppercase animate-pulse">
                            To Follow
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 font-mono">
                            {selectedBooking.hotelReservation.status || 'Confirmed'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-ivory">
                        {selectedBooking.hotelReservation?.hotelName || 'Partner Resort In Process'}
                      </div>
                      <div className="text-[11px] text-sand-muted">
                        Room: {selectedBooking.hotelReservation?.roomType || 'Standard Deluxe (TBA)'}
                      </div>
                    </div>
                    <div className="text-[10px] text-sand-muted font-mono pt-1 border-t border-white/5">
                      Voucher: {selectedBooking.hotelReservation?.voucherCode || `HTL-${selectedBooking.bookingRef}`}
                    </div>
                  </div>

                  {/* Vehicle Shuttle Segment */}
                  <div className="p-4 rounded-2xl bg-[#070B0E] border border-white/10 space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-sand-muted flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-blue-400" />
                          <span>Shuttle Transfer</span>
                        </span>
                        {(!selectedBooking.transportReservation || selectedBooking.transportReservation.status === 'To Follow' || selectedBooking.transportReservation.vehicleType.toLowerCase().includes('follow')) ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 font-mono tracking-wider uppercase animate-pulse">
                            To Follow
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 font-mono">
                            {selectedBooking.transportReservation.status || 'Dispatched'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-ivory">
                        {selectedBooking.transportReservation?.vehicleType || 'Shuttle In Process'}
                      </div>
                      <div className="text-[11px] text-sand-muted">
                        Driver: {selectedBooking.transportReservation?.driverName || 'Designated Driver (TBA)'}
                      </div>
                    </div>
                    <div className="text-[10px] text-sand-muted font-mono pt-1 border-t border-white/5">
                      Plate: {selectedBooking.transportReservation?.plateNumber || 'TBA'}
                    </div>
                  </div>
                </div>

                {/* Assigned Tour Guide */}
                <div className="p-4 rounded-2xl bg-[#070B0E] border border-white/10 flex items-center justify-between font-sans-body">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral font-bold text-xs">
                      DOT
                    </div>
                    <div>
                      <div className="text-[11px] text-sunset-coral font-semibold">Assigned Tour Leader & Guide</div>
                      <div className="text-xs font-bold text-ivory">
                        {selectedBooking.assignedGuide || 'Licensed DOT Tour Leader (Briefing on Arrival)'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-sand-muted px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                    DOT Accredited
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#0B1015] border border-white/10 rounded-3xl text-sand-muted">
                Select a booking from the list to view manifest and voucher details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Re-upload Receipt Modal */}
      {isReuploadModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setIsReuploadModalOpen(false)}
        >
          <div 
            className="bg-[#0B1015] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-left cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif-display text-xl text-ivory">
                  Submit Clearer Payment Slip
                </h3>
                <p className="text-xs text-sand-muted">
                  Booking Ref: <strong className="text-sunset-coral font-mono">{selectedBooking.bookingRef}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReuploadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-sand-muted hover:text-ivory flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {reuploadImage ? (
                <div className="p-3 bg-[#070B0E] rounded-xl border border-cyan-500/40 text-center space-y-3">
                  <img
                    src={reuploadImage}
                    alt="New Payment Slip"
                    className="max-h-48 mx-auto object-contain rounded-lg border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setReuploadImage('')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-mono"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/15 hover:border-sunset-coral/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-[#070B0E] cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <UploadCloud className="w-7 h-7 text-sand-muted" />
                  <span className="text-xs text-ivory font-medium">
                    {isUploading ? 'Preparing receipt photo...' : 'Click to Upload High-Res Screenshot'}
                  </span>
                  <span className="text-[10px] text-sand-muted font-mono">
                    GCash, Maya, or Bank Deposit Slip (Max 8MB)
                  </span>
                </label>
              )}

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                <p className="text-[11px] leading-relaxed">
                  Our Finance Officer in Pasig will verify the reference number against our live merchant ledger within 2–4 business hours.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setIsReuploadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-sand-muted hover:text-ivory"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reuploadImage}
                onClick={handlePromptSubmitReupload}
                className="btn-pop px-5 py-2 rounded-xl bg-sunset-coral hover:bg-[#ff765b] disabled:opacity-40 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Attach & Submit to Finance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-upload Confirmation Safeguard */}
      {selectedBooking && (
        <ActionConfirmModal
          isOpen={isConfirmSubmitOpen}
          onClose={() => setIsConfirmSubmitOpen(false)}
          onConfirm={handleConfirmReupload}
          title="Submit Payment Slip to Finance?"
          message="This deposit slip / screenshot will be sent directly to the Holiday Travelers finance desk for official audit against merchant banking advice."
          details={[
            { label: 'Booking Reference', value: selectedBooking.bookingRef },
            { label: 'Passenger Name', value: selectedBooking.customer.fullName },
            { label: 'Tour Package', value: selectedBooking.tourTitle }
          ]}
          confirmText="Yes, Submit Deposit Slip"
          cancelText="No, Review Slip"
          variant="primary"
          warningNote="Please ensure the transaction reference number and timestamp are clearly readable."
        />
      )}

      {/* Official In-Person Receipt / Voucher Modal */}
      <InPersonReceiptModal
        booking={selectedBooking}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
