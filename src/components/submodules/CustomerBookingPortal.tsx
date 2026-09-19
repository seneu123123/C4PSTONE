import React, { useState, useMemo } from 'react';
import { 
  Booking, 
  Customer, 
  Passenger, 
  TourPackage, 
  HotelReservation, 
  TransportReservation, 
  PaymentInvoice 
} from '../../types';
import { ImageWithLoader } from '../common/ImageWithLoader';
import { BookingDetailDrawer } from './BookingDetailDrawer';
import { InstaPayQRCard } from '../client/InstaPayQRCard';
import { InPersonReceiptModal } from '../client/InPersonReceiptModal';
import { BookingGuidanceWalkthroughModal } from '../client/BookingGuidanceWalkthroughModal';
import { RubberStamp } from '../common/RubberStamp';
import { ActionConfirmModal } from '../common/ActionConfirmModal';
import { dispatchAppNotification } from '../../utils/notifications';
import { compressImageFile, getSampleGCashReceipt } from '../../utils/imageCompressor';
import { sendEmailNotification } from '../../utils/directEmailService';
import { 
  UserCheck, 
  Calendar, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  X, 
  Download, 
  Printer, 
  Sparkles,
  Phone,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Copy,
  SlidersHorizontal,
  Compass,
  Check,
  Plane,
  Hotel,
  Car,
  Eye,
  Smartphone,
  Ticket,
  MessageSquare,
  UploadCloud,
  FileCheck,
  Tag,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerBookingPortalProps {
  packages: TourPackage[];
  bookings: Booking[];
  onCreateBooking: (booking: Booking) => void;
  onUpdateBookingStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled') => void;
  onUpdateBooking?: (booking: Booking) => void;
  onGoToTracker?: (bookingRef: string) => void;
  isOperatorView: boolean;
  preSelectedPackage?: TourPackage | null;
  onClearPreSelectedPackage?: () => void;
  onOpenLegalPolicy?: (tab: 'privacy' | 'terms' | 'refund') => void;
  promoCode?: string;
  promoDiscountPct?: number;
  currentUser?: import('../../utils/supabaseClient').UserProfile | null;
  onRequireAuth?: () => void;
}

const DIETARY_HEALTH_PRESETS = [
  'Standard / No Restrictions',
  'Vegetarian Meal',
  'Halal Certified Meal',
  'Vegan Meal',
  'Gluten-Free',
  'Shellfish / Peanut Allergy',
  'Senior Assistance Required',
  'Child Life Vest Required'
];

export const PASSENGER_ID_OPTIONS = [
  { id: 'ph_passport', label: 'Philippine Passport', placeholder: 'e.g. P1829382A / P9823123B', hasInput: true },
  { id: 'foreign_passport', label: 'Foreign Passport (International)', placeholder: 'e.g. US-901238491 / E8192018', hasInput: true },
  { id: 'philsys', label: 'PhilSys National ID (Card / ePhilID)', placeholder: 'e.g. 1234-5678-9012-3456', hasInput: true },
  { id: 'driver_license', label: "Driver's License (LTO)", placeholder: 'e.g. N01-12-345678', hasInput: true },
  { id: 'umid_sss', label: 'UMID / SSS / GSIS Card', placeholder: 'e.g. CRN-0111-2345678-9', hasInput: true },
  { id: 'postal_id', label: 'Postal ID (Digitized)', placeholder: 'e.g. PRN-192838492', hasInput: true },
  { id: 'voter_id', label: "Voter's ID / Certificate (COMELEC)", placeholder: 'e.g. VIN-19283-A123', hasInput: true },
  { id: 'prc_id', label: 'PRC Professional License', placeholder: 'e.g. PRC-0192834', hasInput: true },
  { id: 'student_id', label: 'Student / School ID (Minors & Youth)', placeholder: 'e.g. School ID No. 2024-10293', hasInput: true },
  { id: 'birth_cert', label: 'PSA Birth Certificate (Minors / Infants)', placeholder: 'e.g. PSA Registry No. 2020-19283', hasInput: true },
  { id: 'other_govt', label: 'Other Government-Issued Photo ID', placeholder: 'Enter ID or permit reference number', hasInput: true },
  { id: 'none', label: "I don't have a Passport / ID yet (To follow / No ID on hand)", placeholder: '', hasInput: false },
] as const;

export const CustomerBookingPortal: React.FC<CustomerBookingPortalProps> = ({
  packages,
  bookings,
  onCreateBooking,
  onUpdateBookingStatus,
  onUpdateBooking,
  onGoToTracker,
  isOperatorView,
  preSelectedPackage,
  onClearPreSelectedPackage,
  onOpenLegalPolicy,
  promoCode: initialPromoCode,
  promoDiscountPct: initialDiscountPct = 8,
  currentUser,
  onRequireAuth
}) => {
  // Navigation View in Operator Mode
  const [operatorViewTab, setOperatorViewTab] = useState<'manifest' | 'new_booking'>(
    isOperatorView ? 'manifest' : 'new_booking'
  );

  // Modals
  const [selectedBookingForDrawer, setSelectedBookingForDrawer] = useState<Booking | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Accordion expanded row tracking in Manifest Table
  const [expandedBookingIds, setExpandedBookingIds] = useState<Set<string>>(new Set());

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [rollcallStatusFilter, setRollcallStatusFilter] = useState<'all' | 'boarded' | 'pending' | 'noshow'>('all');

  // Booking Wizard State
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(preSelectedPackage || null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [travelDate, setTravelDate] = useState<string>('2026-08-20');
  
  // Revamped Accommodation & Tier Selection (Image 1 & Image 2)
  const [accommodationType, setAccommodationType] = useState<'single' | 'double' | 'suite' | null>(null);
  const [packageTier, setPackageTier] = useState<'budget' | 'midrange' | 'luxury' | null>(null);
  
  // Tap Loading & Auto-Scroll Helpers
  const portalContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (portalContainerRef.current) {
      portalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const modalScrollParent = portalContainerRef.current?.closest('.overflow-y-auto');
    if (modalScrollParent) {
      modalScrollParent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerTapLoading = (action: () => void, msg = 'Updating options...', shouldScroll = false) => {
    action();
    if (shouldScroll) {
      setTimeout(() => {
        scrollToTop();
      }, 50);
    }
  };
  
  // Revamped Pax Counters (Image 2)
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [infantsCount, setInfantsCount] = useState<number>(0);
  const [numPax, setNumPax] = useState<number>(2);

  // Sync total pax count from adult + child + infant breakdown
  React.useEffect(() => {
    const total = Math.max(1, adultsCount + childrenCount + infantsCount);
    setNumPax(total);
    handlePaxCountChange(total);
  }, [adultsCount, childrenCount, infantsCount]);

  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'PayMaya' | 'Cash' | 'Bank Transfer' | null>(null);
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [receiptProofUrl, setReceiptProofUrl] = useState<string>('');
  const [isBankUploading, setIsBankUploading] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [isSlipPreviewModalOpen, setIsSlipPreviewModalOpen] = useState<boolean>(false);
  const [isGuidanceWalkthroughOpen, setIsGuidanceWalkthroughOpen] = useState<boolean>(false);
  const [copiedViberSummary, setCopiedViberSummary] = useState<boolean>(false);

  // Promo Code State
  const [enteredPromoCode, setEnteredPromoCode] = useState<string>(initialPromoCode || '');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number } | null>(
    initialPromoCode ? { code: initialPromoCode, pct: initialDiscountPct } : null
  );
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string>(
    initialPromoCode ? `Promo ${initialPromoCode} applied (${initialDiscountPct}% off)!` : ''
  );

  // ISO/IEC 27001 & DPA 2012 Consent
  const [consentTermsAccepted, setConsentTermsAccepted] = useState<boolean>(false);
  const [consentMarketingAccepted, setConsentMarketingAccepted] = useState<boolean>(false);
  const [consentError, setConsentError] = useState<boolean>(false);

  // Customer Contact State (Starts completely empty for passenger to fill in)
  const [customerInfo, setCustomerInfo] = useState<Customer>({
    fullName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    nationality: ''
  });

  // Passengers State (Starts completely empty for passengers to fill in)
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: 'p1', fullName: '', age: '' as any, gender: '', passportOrId: '', specialRequirements: '', nationality: '', boardingStatus: 'pending' },
    { id: 'p2', fullName: '', age: '' as any, gender: '', passportOrId: '', specialRequirements: '', nationality: '', boardingStatus: 'pending' }
  ]);

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isConfirmBookingOpen, setIsConfirmBookingOpen] = useState(false);
  const [paymentPhotoError, setPaymentPhotoError] = useState<string>('');

  const handlePromptFinalizeBooking = () => {
    if (!receiptProofUrl) {
      setPaymentPhotoError('Payment photo / screenshot is required to complete your reservation. Please attach your payment receipt or transfer screenshot.');
      return;
    }
    setPaymentPhotoError('');

    if (!consentTermsAccepted) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    if (!selectedPackage) return;
    setIsConfirmBookingOpen(true);
  };

  // Synchronize preSelectedPackage
  React.useEffect(() => {
    if (preSelectedPackage) {
      setSelectedPackage(preSelectedPackage);
      setBookingStep(1);
      if (isOperatorView) {
        setOperatorViewTab('new_booking');
      }
    }
  }, [preSelectedPackage, isOperatorView]);

  // Synchronize initialPromoCode when passed or updated
  React.useEffect(() => {
    if (initialPromoCode) {
      setEnteredPromoCode(initialPromoCode);
      setAppliedPromo({ code: initialPromoCode, pct: initialDiscountPct || 8 });
      setPromoSuccessMsg(`Promo "${initialPromoCode}" applied! ${initialDiscountPct || 8}% discount granted.`);
      setPromoError('');
    }
  }, [initialPromoCode, initialDiscountPct]);

  // Adjust passengers list dynamically when numPax changes
  const handlePaxCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(20, count));
    setNumPax(validCount);
    setPassengers((prev) => {
      const updated: Passenger[] = [];
      for (let i = 0; i < validCount; i++) {
        if (prev[i]) {
          updated.push(prev[i]);
        } else {
          updated.push({
            id: `p-${Date.now()}-${i + 1}`,
            fullName: '',
            age: '' as any,
            gender: '',
            passportOrId: '',
            specialRequirements: '',
            nationality: '',
            boardingStatus: 'pending'
          });
        }
      }
      return updated;
    });
  };

  // Quick helper: Autofill Passenger 1 from Lead Guest
  const handleCopyLeadToPaxOne = () => {
    if (!customerInfo.fullName) return;
    setPassengers((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          fullName: customerInfo.fullName,
          nationality: customerInfo.nationality || 'Filipino',
          passportOrId: updated[0].passportOrId || 'PH-VERIFIED'
        };
      }
      return updated;
    });
  };

  // Update a single passenger's field in the booking form
  const handleUpdatePassenger = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const getPassengerIdType = (p: Passenger): string => {
    if (p.idType) return p.idType;
    if (
      p.passportOrId === 'No ID (To Follow)' || 
      p.passportOrId?.toLowerCase().includes('follow') || 
      p.passportOrId?.toLowerCase().includes('none')
    ) {
      return 'none';
    }
    return 'ph_passport';
  };

  const handleIdTypeChange = (index: number, newType: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        if (newType === 'none') {
          updated[index] = {
            ...updated[index],
            idType: 'none',
            hasId: false,
            passportOrId: 'No ID (To Follow)'
          };
        } else {
          const wasNoId = updated[index].passportOrId === 'No ID (To Follow)' || !updated[index].passportOrId;
          updated[index] = {
            ...updated[index],
            idType: newType,
            hasId: true,
            passportOrId: wasNoId ? '' : updated[index].passportOrId
          };
        }
      }
      return updated;
    });
  };

  // Toggle row accordion
  const toggleRowAccordion = (bookingId: string) => {
    setExpandedBookingIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) {
        next.delete(bookingId);
      } else {
        next.add(bookingId);
      }
      return next;
    });
  };

  // Update passenger boarding status directly in a booking (live reactive state)
  const handleTogglePassengerBoarding = (
    bookingId: string, 
    passengerKey: string | number, 
    newStatus: 'boarded' | 'pending' | 'noshow'
  ) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    const currentPassengers = targetBooking.passengers && targetBooking.passengers.length > 0
      ? targetBooking.passengers
      : [{
          id: `${targetBooking.id}-lead`,
          fullName: targetBooking.customer.fullName,
          age: 30,
          gender: 'Female' as const,
          passportOrId: targetBooking.bookingRef,
          specialRequirements: targetBooking.specialInstructions,
          nationality: targetBooking.customer.nationality,
          boardingStatus: 'boarded' as const
        }];

    const updatedPassengers = currentPassengers.map((p) =>
      p.id === passengerKey || p.fullName === passengerKey ? { ...p, boardingStatus: newStatus } : p
    );

    const updatedBooking: Booking = {
      ...targetBooking,
      passengers: updatedPassengers
    };

    if (onUpdateBooking) {
      onUpdateBooking(updatedBooking);
    }

    if (selectedBookingForDrawer?.id === bookingId) {
      setSelectedBookingForDrawer(updatedBooking);
    }
  };

  // Promo Code Validation Handlers
  const handleApplyPromoCode = () => {
    setPromoError('');
    const code = enteredPromoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a voucher promo code.');
      return;
    }
    // Check if code matches standard HOLIDAY2026 or custom code
    if (code === 'HOLIDAY2026') {
      const pct = initialDiscountPct || 8;
      setAppliedPromo({ code, pct });
      setPromoSuccessMsg(`Promo "${code}" applied! ${pct}% discount granted.`);
    } else if (code === initialPromoCode?.toUpperCase()) {
      const pct = initialDiscountPct || 8;
      setAppliedPromo({ code, pct });
      setPromoSuccessMsg(`Promo "${code}" applied! ${pct}% discount granted.`);
    } else {
      setPromoError('Invalid or expired promo code. Try "HOLIDAY2026".');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoSuccessMsg('');
    setPromoError('');
  };

  // Calculate pricing with Accommodation Tier and Occupancy surcharges
  const tierSurcharge = packageTier === 'luxury' ? 3500 : packageTier === 'midrange' ? 1500 : 0;
  const occupancySurcharge = accommodationType === 'single' ? 2000 : accommodationType === 'suite' ? 1000 : 0;

  const rawBaseRate = selectedPackage ? selectedPackage.pricePerPax : 14500;
  const baseRate = rawBaseRate + tierSurcharge;
  const conservationFee = 500 * Math.max(1, numPax); // Marine sanctuary & environmental fee
  const baseSubtotal = (baseRate * Math.max(1, numPax)) + occupancySurcharge;
  const discountAmount = appliedPromo ? Math.round((baseSubtotal * appliedPromo.pct) / 100) : 0;
  const discountedSubtotal = Math.max(0, baseSubtotal - discountAmount);
  const grandTotal = discountedSubtotal + conservationFee;
  const depositAmount = Math.round(grandTotal * 0.3); // 30% Downpayment
  const amountToPayNow = paymentOption === 'full' ? grandTotal : depositAmount;
  const balanceDue = paymentOption === 'full' ? 0 : grandTotal - depositAmount;

  // Filtered Bookings for the Manifest Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!b) return false;
      const q = searchQuery ? searchQuery.toLowerCase() : '';
      const matchesSearch = 
        !q ||
        (b.bookingRef || '').toLowerCase().includes(q) ||
        (b.customer?.fullName || '').toLowerCase().includes(q) ||
        (b.customer?.email || '').toLowerCase().includes(q) ||
        (b.customer?.phone || '').includes(searchQuery) ||
        (b.tourTitle || '').toLowerCase().includes(q) ||
        (b.passengers && b.passengers.some((p) => 
          (p.fullName || '').toLowerCase().includes(q) ||
          (p.passportOrId || '').toLowerCase().includes(q)
        ));

      const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
      const matchesDest = destinationFilter === 'All' || b.destination.includes(destinationFilter);

      return matchesSearch && matchesStatus && matchesDest;
    });
  }, [bookings, searchQuery, statusFilter, destinationFilter]);

  // Aggregate stats for Operator Dashboard
  const operatorStats = useMemo(() => {
    let totalPaxCount = 0;
    let totalBoardedCount = 0;
    let alertsCount = 0;

    bookings.forEach((b) => {
      totalPaxCount += b.numPax;
      if (b.passengers && b.passengers.length > 0) {
        b.passengers.forEach((p) => {
          if (p.boardingStatus === 'boarded') totalBoardedCount++;
          if (p.specialRequirements) alertsCount++;
        });
      } else {
        // Assume lead passenger counted
        totalBoardedCount++;
      }
    });

    const completionRate = totalPaxCount > 0 ? Math.round((totalBoardedCount / totalPaxCount) * 100) : 100;

    return {
      totalBookings: bookings.length,
      totalPaxCount,
      totalBoardedCount,
      completionRate,
      alertsCount
    };
  }, [bookings]);

  // All manifested passengers for the Master Roll Call view
  const allManifestedPassengers = useMemo(() => {
    const list: Array<{
      bookingId: string;
      bookingRef: string;
      tourTitle: string;
      travelDate: string;
      leadName: string;
      passenger: Passenger;
    }> = [];

    filteredBookings.forEach((b) => {
      const paxList = b.passengers && b.passengers.length > 0
        ? b.passengers
        : [{
            id: `${b.id}-lead`,
            fullName: b.customer.fullName,
            age: 30,
            gender: 'Female' as const,
            passportOrId: b.bookingRef,
            specialRequirements: b.specialInstructions,
            nationality: b.customer.nationality,
            boardingStatus: 'boarded' as const
          }];

      paxList.forEach((p) => {
        const currentStatus = p.boardingStatus || 'boarded';
        if (rollcallStatusFilter === 'all' || currentStatus === rollcallStatusFilter) {
          list.push({
            bookingId: b.id,
            bookingRef: b.bookingRef,
            tourTitle: b.tourTitle,
            travelDate: b.travelDate,
            leadName: b.customer.fullName,
            passenger: p
          });
        }
      });
    });

    return list;
  }, [filteredBookings, rollcallStatusFilter]);

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Form submission: Create Official Booking
  const handleFinalizeBooking = () => {
    if (isSubmittingBooking) return;
    setIsSubmittingBooking(true);

    if (!currentUser) {
      setIsSubmittingBooking(false);
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }

    if (!consentTermsAccepted) {
      setIsSubmittingBooking(false);
      setConsentError(true);
      return;
    }
    setConsentError(false);

    if (!selectedPackage) {
      setIsSubmittingBooking(false);
      return;
    }

    const newBookingId = `bk-${Date.now()}`;
    // Systematic randomized reference format: HT-2026-[NUM][CHAR][NUM][CHAR] (e.g. HT-2026-8K4M)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const nums = '23456789';
    const c1 = chars.charAt(Math.floor(Math.random() * chars.length));
    const n1 = nums.charAt(Math.floor(Math.random() * nums.length));
    const c2 = chars.charAt(Math.floor(Math.random() * chars.length));
    const n2 = nums.charAt(Math.floor(Math.random() * nums.length));
    const generatedRef = `HT-2026-${n1}${c1}${n2}${c2}`;
    const invoiceNum = `INV-2026-${n1}${c1}${n2}${c2}`;

    const newInvoice: PaymentInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNum,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: travelDate,
      totalAmount: grandTotal,
      amountPaid: amountToPayNow,
      balanceDue: balanceDue,
      status: balanceDue === 0 ? 'Paid' : 'Partial',
      items: [
        {
          description: `${selectedPackage.title} (${numPax} Pax)`,
          quantity: numPax,
          unitPrice: baseRate,
          totalPrice: baseSubtotal
        },
        ...(appliedPromo && discountAmount > 0
          ? [
              {
                description: `Voucher Discount (${appliedPromo.code} - ${appliedPromo.pct}% Off)`,
                quantity: 1,
                unitPrice: -discountAmount,
                totalPrice: -discountAmount
              }
            ]
          : []),
        {
          description: `Tourism & Environmental Preservation Fees (${numPax} Pax)`,
          quantity: numPax,
          unitPrice: 500,
          totalPrice: conservationFee
        }
      ],
      payments: [
        {
          id: `pmt-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: amountToPayNow,
          method: paymentMethod,
          referenceNo: referenceNo.trim() || `${(paymentMethod || 'PAY').slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-8)}`,
          status: 'Pending Verification', // Strict Anti-Scam: Requires manual finance cross-audit
          notes: `${paymentOption === 'full' ? 'Full Settlement Upon Reservation' : '50% Outbound Guarantee Deposit'} via ${paymentMethod}${referenceNo ? ` (Ref: ${referenceNo})` : ''}`,
          receiptProofUrl: receiptProofUrl || undefined
        }
      ]
    };

    const newHotel: HotelReservation = {
      id: `htl-${Date.now()}`,
      hotelName: 'Partner Beachfront Eco-Resort & Spa',
      roomType: numPax > 2 ? 'Family Sea View Villa' : 'Deluxe Ocean Pavilion',
      checkInDate: travelDate,
      checkOutDate: new Date(new Date(travelDate).getTime() + (selectedPackage.durationNights || 2) * 86400000).toISOString().split('T')[0],
      nights: selectedPackage.durationNights || 2,
      voucherCode: `HTL-${generatedRef}`,
      status: 'Confirmed',
      contactPhone: '+63 917 888 1900'
    };

    const newTransport: TransportReservation = {
      id: `trp-${Date.now()}`,
      vehicleType: numPax > 4 ? '14-Seater Aircon Tourist Van' : 'Private Airport Transfer Car',
      driverName: 'Assigned Senior Tour Driver',
      driverContact: '+63 918 555 1234',
      plateNumber: 'TTR-2026',
      pickupLocation: 'Arrival Terminal / Hotel Lobby',
      dropoffLocation: `${selectedPackage.destination} Airport / Hotel Transfer`,
      pickupTime: '08:30 AM',
      status: 'Scheduled'
    };

    const createdBooking: Booking = {
      id: newBookingId,
      bookingRef: generatedRef,
      tourPackageId: selectedPackage.id,
      tourTitle: selectedPackage.title,
      destination: selectedPackage.destination,
      customer: customerInfo,
      passengers: passengers.map((p) => ({
        ...p,
        boardingStatus: 'boarded' // Initialized as boarded for new booking
      })),
      travelDate: travelDate,
      numPax: numPax,
      totalPrice: grandTotal,
      depositRequired: depositAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: balanceDue === 0 ? 'Paid' : 'Partial',
      createdAt: new Date().toISOString().split('T')[0],
      assignedGuide: 'Capt. Roger Mendoza (DOT Licensed Leader)',
      specialInstructions: specialInstructions,
      hotelReservation: newHotel,
      transportReservation: newTransport,
      invoice: newInvoice,
      appliedPromoCode: appliedPromo?.code,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      receiptProofUrl: receiptProofUrl || undefined,
      customerReferenceNo: referenceNo.trim() || undefined,
      paymentVerificationStatus: 'Pending Verification'
    };

    // Store reference in device local history so Check Tickets auto-suggests it
    try {
      const stored = localStorage.getItem('holiday_my_booking_refs');
      const parsed: string[] = stored ? JSON.parse(stored) : [];
      if (!parsed.includes(generatedRef)) {
        localStorage.setItem('holiday_my_booking_refs', JSON.stringify([generatedRef, ...parsed]));
      }
    } catch (e) {
      console.error(e);
    }

    // Dispatch real-time notification
    dispatchAppNotification({
      title: `Reservation Created • ${generatedRef}`,
      message: `Your booking for ${selectedPackage.title} was created! Track live verification under 'Check Tickets'.`,
      type: 'booking',
      bookingRef: generatedRef
    });

    // Dispatch automated EmailJS confirmation e-ticket to guest email
    if (customerInfo.email && customerInfo.email.includes('@')) {
      sendEmailNotification({
        toEmail: customerInfo.email,
        toName: customerInfo.fullName,
        subject: `Booking Confirmation: ${selectedPackage.title} [Ref: ${generatedRef}]`,
        body: `Dear ${customerInfo.fullName},\n\nYour expedition booking for "${selectedPackage.title}" has been received and confirmed.\n\nBooking Reference: ${generatedRef}\nTravel Date: ${travelDate}\nGuests: ${numPax} Pax\nAmount Paid: ₱${newInvoice.amountPaid.toLocaleString()}\n\nYou can track and download your digital voucher anytime at ${window.location.origin}/?track=${generatedRef}\n\nWarm regards,\nHoliday Travelers Travel and Tours Inc.`,
        bookingRef: generatedRef,
        bookingDetails: {
          customerName: customerInfo.fullName,
          tourTitle: selectedPackage.title,
          travelDate: travelDate,
          numPax: numPax,
          paymentStatus: balanceDue === 0 ? 'Paid' : 'Partial',
          amountPaid: newInvoice.amountPaid,
          totalPrice: grandTotal,
          balanceDue: balanceDue,
          trackingUrl: `${window.location.origin}/?track=${generatedRef}`,
          contactNumber: customerInfo.phone
        },
        type: 'booking_confirmation'
      }).then((res) => {
        if (res.success) {
          dispatchAppNotification({
            title: 'Confirmation Email Dispatched',
            message: `Official e-ticket confirmation sent to ${customerInfo.email}`,
            type: 'booking',
            bookingRef: generatedRef
          });
        }
      }).catch((err) => {
        console.warn('Auto confirmation email notice:', err);
      });
    }

    onCreateBooking(createdBooking);
    setConfirmedBooking(createdBooking);
    setBookingStep(4); // Success step
    setIsGuidanceWalkthroughOpen(true); // Guide client post-booking where updates appear
    setIsSubmittingBooking(false);

    // Smooth scroll modal container so Step 4 confirmation is immediately at top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const scrollableElements = document.querySelectorAll('.overflow-y-auto');
      scrollableElements.forEach((el) => {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }, 50);
  };

  const handleBankFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBankUploading(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.75);
      if (compressedDataUrl) {
        setReceiptProofUrl(compressedDataUrl);
        dispatchAppNotification({
          title: 'Bank Transfer Slip Attached',
          message: 'Deposit slip photo uploaded for manual bank statement audit.',
          type: 'receipt'
        });
      }
    } catch (err) {
      console.error('Bank upload compression error:', err);
    } finally {
      setIsBankUploading(false);
    }
  };

  const handleAttachBankSample = () => {
    const mockRef = referenceNo.trim() || `BDO-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`;
    if (!referenceNo.trim()) {
      setReferenceNo(mockRef);
    }
    const currentDue = paymentOption === 'deposit' ? depositAmount : grandTotal;
    const sample = getSampleGCashReceipt(mockRef, currentDue, customerInfo.fullName || 'Guest Passenger');
    setReceiptProofUrl(sample);
    dispatchAppNotification({
      title: 'Sample Deposit Slip Attached',
      message: `Sample transfer voucher attached (${mockRef}). Ready for finance audit.`,
      type: 'receipt'
    });
  };

  const handleResetBookingFlow = () => {
    setBookingStep(1);
    setConfirmedBooking(null);
    setCustomerInfo({
      fullName: '',
      email: '',
      phone: '',
      emergencyContact: '',
      nationality: 'Filipino'
    });
    setPassengers([
      { id: 'p1', fullName: '', age: 28, gender: 'Female', passportOrId: '', specialRequirements: '', nationality: 'Filipino', boardingStatus: 'pending' },
      { id: 'p2', fullName: '', age: 30, gender: 'Male', passportOrId: '', specialRequirements: '', nationality: 'Filipino', boardingStatus: 'pending' }
    ]);
    setConsentTermsAccepted(false);
    onClearPreSelectedPackage?.();
    if (isOperatorView) {
      setOperatorViewTab('manifest');
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. OPERATOR HEADER & TAB NAVIGATION (When in Operator Mode) */}
      {/* ========================================================================= */}
      {isOperatorView && (
        <div className="space-y-4">
          {/* Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#090E14] border border-white/10 p-4 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sand-muted block">Expeditions</span>
              <div className="font-serif-display text-2xl text-ivory mt-0.5">{operatorStats.totalBookings}</div>
              <span className="text-[10px] text-emerald-400 font-mono">Active Charters</span>
            </div>

            <div className="bg-[#090E14] border border-white/10 p-4 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sand-muted block">Total Manifested</span>
              <div className="font-serif-display text-2xl text-sunset-coral mt-0.5">{operatorStats.totalPaxCount} Pax</div>
              <span className="text-[10px] text-sand-muted font-mono">Passenger Manifest</span>
            </div>

            <div className="bg-[#090E14] border border-white/10 p-4 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sand-muted block">Boarded & Cleared</span>
              <div className="font-serif-display text-2xl text-emerald-400 mt-0.5">{operatorStats.totalBoardedCount} Pax</div>
              <span className="text-[10px] text-emerald-400 font-mono">{operatorStats.completionRate}% Completion</span>
            </div>

            <div className="bg-[#090E14] border border-white/10 p-4 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sand-muted block">Dietary & Health</span>
              <div className="font-serif-display text-2xl text-amber-300 mt-0.5">{operatorStats.alertsCount}</div>
              <span className="text-[10px] text-amber-400 font-mono">Special Attention</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#0D151F] to-[#070B0E] border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sunset-coral font-semibold">Security Clearance</span>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Flight Clear</span>
              </div>
              <span className="text-[9px] text-sand-muted font-mono">DOT NCR-2026 Synced</span>
            </div>
          </div>

          {/* Module Navigation Tabs with Animated Underline */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setOperatorViewTab('manifest')}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  operatorViewTab === 'manifest'
                    ? 'text-ivory bg-white/[0.08] shadow-sm'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.03]'
                }`}
              >
                <Users className="w-4 h-4 text-sunset-coral" />
                <span>Passenger Manifests & Bookings</span>
                {operatorViewTab === 'manifest' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-sunset-coral rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  setOperatorViewTab('new_booking');
                  setBookingStep(1);
                }}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  operatorViewTab === 'new_booking'
                    ? 'text-ivory bg-white/[0.08] shadow-sm'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.03]'
                }`}
              >
                <Plus className="w-4 h-4 text-sunset-coral" />
                <span>New Expedition Reservation</span>
                {operatorViewTab === 'new_booking' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-sunset-coral rounded-full"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB A: PASSENGER MANIFESTS & BOOKINGS (OPERATOR VIEW) */}
      {/* ========================================================================= */}
      {isOperatorView && operatorViewTab === 'manifest' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {/* Filter Bar */}
          <div className="bg-[#090E14] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-sand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Booking Ref, Guest, Pax, ID, Phone..."
                className="w-full bg-[#070B0E] border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ivory placeholder:text-sand-muted/50 focus:outline-none focus:border-sunset-coral transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-muted hover:text-ivory"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-sand-muted font-mono whitespace-nowrap">Status:</span>
              {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-sunset-coral text-white shadow-sm'
                      : 'bg-white/[0.04] text-sand-muted hover:text-ivory border border-white/5'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Manifest Table */}
          <div className="bg-[#090E14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0B1017] text-sand-muted text-[10px] font-mono uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center"></th>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Tour Expedition</th>
                    <th className="py-3.5 px-4">Lead Traveler</th>
                    <th className="py-3.5 px-4">Travel Date</th>
                    <th className="py-3.5 px-4 text-center">Manifested Pax</th>
                    <th className="py-3.5 px-4">Total & Paid</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-ivory text-xs">
                  {filteredBookings.map((b) => {
                    const isExpanded = expandedBookingIds.has(b.id);
                    const paxCount = b.passengers?.length || b.numPax;
                    const boardedPax = b.passengers
                      ? b.passengers.filter((p) => p.boardingStatus === 'boarded').length
                      : b.numPax;

                    return (
                      <React.Fragment key={b.id}>
                        {/* Master Booking Row */}
                        <tr className={`hover:bg-white/[0.02] transition-colors ${isExpanded ? 'bg-white/[0.03]' : ''}`}>
                          {/* Expand Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleRowAccordion(b.id)}
                              className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-sand-muted hover:text-ivory transition-all cursor-pointer"
                              title={isExpanded ? 'Collapse Passenger Manifest' : 'Expand Passenger Manifest'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-sunset-coral" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Ref */}
                          <td className="py-4 px-4">
                            <span className="font-mono font-bold text-sunset-coral bg-sunset-coral/10 px-2 py-0.5 rounded border border-sunset-coral/20">
                              {b.bookingRef}
                            </span>
                          </td>

                          {/* Tour Title */}
                          <td className="py-4 px-4 max-w-xs">
                            <div className="font-medium text-ivory line-clamp-1">{b.tourTitle}</div>
                            <div className="text-[11px] text-sand-muted flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-sunset-coral" />
                              <span className="line-clamp-1">{b.destination}</span>
                            </div>
                          </td>

                          {/* Lead Traveler */}
                          <td className="py-4 px-4">
                            <div className="font-medium text-ivory">{b.customer.fullName}</div>
                            <div className="text-[11px] text-sand-muted font-mono">{b.customer.phone}</div>
                          </td>

                          {/* Travel Date */}
                          <td className="py-4 px-4 font-mono text-sand-muted">
                            <div className="text-ivory font-medium">{b.travelDate}</div>
                            <div className="text-[10px] text-sand-muted font-sans-body">
                              Guide: {b.assignedGuide ? b.assignedGuide.split(' ')[0] : 'Assigned'}
                            </div>
                          </td>

                          {/* Pax Count & Boarding Bar */}
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono">
                              <Users className="w-3.5 h-3.5 text-sunset-coral" />
                              <strong>{paxCount} Pax</strong>
                            </span>
                            <div className="text-[10px] font-mono text-emerald-400 mt-1">
                              {boardedPax}/{paxCount} Boarded
                            </div>
                          </td>

                          {/* Billing */}
                          <td className="py-4 px-4 font-mono">
                            <div className="font-serif-display text-sm text-ivory">₱{b.totalPrice.toLocaleString()}</div>
                            <div className="text-[10px] text-emerald-400">
                              Paid: ₱{b.invoice.amountPaid.toLocaleString()}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.bookingStatus === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                              b.bookingStatus === 'Completed' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' :
                              b.bookingStatus === 'Pending' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                              'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}>
                              {b.bookingStatus}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedBookingForDrawer(b);
                                  setIsDetailDrawerOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border border-white/5 transition-colors cursor-pointer"
                                title="Inspect Full Booking Record"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              </button>

                              <select
                                value={b.bookingStatus}
                                onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as any)}
                                className="bg-[#070B0E] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-sand-muted focus:outline-none focus:border-sunset-coral cursor-pointer"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Passenger Manifest Sub-Row */}
                        {isExpanded && (
                          <tr className="bg-[#070B0E]/80">
                            <td colSpan={9} className="p-4 sm:p-6 border-y border-white/[0.08]">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Plane className="w-4 h-4 text-sunset-coral" />
                                    <h4 className="font-serif-display text-base text-ivory font-medium">
                                      Official Passenger Manifest Roster • {b.bookingRef}
                                    </h4>
                                    <span className="text-[11px] text-sand-muted font-mono">
                                      ({paxCount} registered persons)
                                    </span>
                                  </div>
                                </div>

                                {/* Passenger List Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {(b.passengers && b.passengers.length > 0 ? b.passengers : [
                                    {
                                      id: `${b.id}-lead`,
                                      fullName: b.customer.fullName,
                                      age: 30,
                                      gender: 'Female' as const,
                                      passportOrId: b.bookingRef,
                                      specialRequirements: b.specialInstructions,
                                      nationality: b.customer.nationality,
                                      boardingStatus: 'boarded' as const
                                    }
                                  ]).map((pax, idx) => {
                                    const boarding = pax.boardingStatus || 'boarded';
                                    return (
                                      <div
                                        key={pax.id || idx}
                                        className="bg-[#0B1017] p-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center font-serif-display text-xs text-ivory">
                                              {idx + 1}
                                            </div>
                                            <div>
                                              <div className="font-serif-display text-sm text-ivory font-medium line-clamp-1">
                                                {pax.fullName || 'Registered Guest'}
                                              </div>
                                              <div className="text-[11px] text-sand-muted font-mono">
                                                {pax.age || 28} yo • {pax.gender || 'F'} • {pax.nationality || 'Filipino'}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Boarding Status Pill Toggle */}
                                          <div className="flex items-center bg-[#070B0E] p-0.5 rounded-lg border border-white/10">
                                            <button
                                              onClick={() => handleTogglePassengerBoarding(b.id, pax.id, 'boarded')}
                                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase transition-all cursor-pointer ${
                                                boarding === 'boarded'
                                                  ? 'bg-emerald-600 text-white font-bold'
                                                  : 'text-sand-muted hover:text-ivory'
                                              }`}
                                              title="Mark Boarded"
                                            >
                                              Boarded
                                            </button>
                                            <button
                                              onClick={() => handleTogglePassengerBoarding(b.id, pax.id, 'pending')}
                                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase transition-all cursor-pointer ${
                                                boarding === 'pending'
                                                  ? 'bg-amber-600 text-white font-bold'
                                                  : 'text-sand-muted hover:text-ivory'
                                              }`}
                                              title="Mark Pending"
                                            >
                                              Pending
                                            </button>
                                            <button
                                              onClick={() => handleTogglePassengerBoarding(b.id, pax.id, 'noshow')}
                                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase transition-all cursor-pointer ${
                                                boarding === 'noshow'
                                                  ? 'bg-rose-700 text-white font-bold'
                                                  : 'text-sand-muted hover:text-ivory'
                                              }`}
                                              title="Mark No-Show"
                                            >
                                              No-Show
                                            </button>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] font-mono text-sand-muted pt-1 border-t border-white/5">
                                          <span>ID / Passport:</span>
                                          {pax.passportOrId === 'No ID (To Follow)' || pax.idType === 'none' ? (
                                            <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                                              To Follow / No ID
                                            </span>
                                          ) : (
                                            <span className="text-sunset-coral font-medium">{pax.passportOrId || 'VERIFIED'}</span>
                                          )}
                                        </div>

                                        {pax.specialRequirements && (
                                          <div className="text-[10px] p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 line-clamp-2">
                                            <strong>Note:</strong> {pax.specialRequirements}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Logistics strip */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                  <div className="p-3 bg-[#0B1017] rounded-xl border border-white/5 text-xs text-sand-muted flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Hotel className="w-4 h-4 text-sunset-coral" />
                                      <span>Hotel: <strong className="text-ivory">{b.hotelReservation?.hotelName || 'Assigned Resort'}</strong></span>
                                    </div>
                                    <span className="font-mono text-[10px] text-sunset-coral">{b.hotelReservation?.voucherCode}</span>
                                  </div>

                                  <div className="p-3 bg-[#0B1017] rounded-xl border border-white/5 text-xs text-sand-muted flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Car className="w-4 h-4 text-emerald-400" />
                                      <span>Vehicle: <strong className="text-ivory">{b.transportReservation?.vehicleType || 'Tourist Coaster'}</strong></span>
                                    </div>
                                    <span className="font-mono text-[10px] text-emerald-400">{b.transportReservation?.plateNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="p-12 text-center text-sand-muted space-y-2">
                  <AlertCircle className="w-8 h-8 text-sand-muted/50 mx-auto" />
                  <p className="font-serif-display text-lg text-ivory">No registered bookings match your search.</p>
                  <p className="text-xs">Adjust your search keyword or status filters above.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}



      {/* ========================================================================= */}
      {/* 4. TAB C: NEW EXPEDITION RESERVATION (CUSTOMER & OPERATOR BOOKING FLOW) */}
      {/* ========================================================================= */}
      {(!isOperatorView || operatorViewTab === 'new_booking') && (
        <motion.div
          ref={portalContainerRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-6 relative"
        >
          {/* Guest Sign-In Notice Banner */}
          {!currentUser && !isOperatorView && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Sign in required for checkout & manifest registration</p>
                  <p className="text-[11px] text-amber-200/80">Please log in to your account to complete your booking voucher and passenger manifest.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRequireAuth?.()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md whitespace-nowrap transition-all cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* Progress Step Indicator (Steps 1 to 3) */}
          {bookingStep <= 3 && (
            <div className="bg-[#090E14] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
              {[
                { step: 1, label: 'Expedition & Schedule', icon: Calendar },
                { step: 2, label: 'Passenger Manifest', icon: Users },
                { step: 3, label: 'Payment & Confirmation', icon: CreditCard }
              ].map((item) => {
                const IconComp = item.icon;
                const isCurrent = bookingStep === item.step;
                const isDone = bookingStep > item.step;

                return (
                  <div key={item.step} className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-black'
                          : isCurrent
                          ? 'bg-sunset-coral text-white shadow-lg shadow-sunset-coral/25'
                          : 'bg-white/[0.05] text-sand-muted border border-white/10'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : item.step}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[10px] font-mono uppercase text-sand-muted block">Step 0{item.step}</span>
                      <span className={`text-xs font-medium ${isCurrent ? 'text-ivory font-semibold' : 'text-sand-muted'}`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 1: Expedition & Schedule */}
          {bookingStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Form Inputs */}
              <div className="lg:col-span-2 space-y-6">
                {/* Package Selector (If not already chosen) */}
                {!selectedPackage && (
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-sand-muted block">
                      Select Destination Expedition Package
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {packages.map((pkg) => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <motion.div
                            key={pkg.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => triggerTapLoading(() => setSelectedPackage(pkg), `Selecting ${pkg.title}...`)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                              isSelected
                                ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                                : 'bg-[#0B121A] border-white/20 hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-sunset-coral uppercase tracking-wider font-bold">
                                {pkg.category}
                              </span>
                              <span className="text-xs font-bold text-ivory font-mono">
                                ₱{pkg.pricePerPax.toLocaleString()} / pax
                              </span>
                            </div>
                            <h4 className="font-serif-display text-base text-ivory line-clamp-1">{pkg.title}</h4>
                            <p className="text-[11px] text-sand-muted line-clamp-2">{pkg.subtitle}</p>
                            <div className="flex items-center gap-2 text-[11px] text-sand-muted pt-1">
                              <Clock className="w-3.5 h-3.5 text-sunset-coral" />
                              <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Package Banner */}
                {selectedPackage && (
                  <div className="bg-[#090E14] border border-white/10 rounded-2xl p-5 relative overflow-hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sunset-coral font-semibold">
                          Selected Expedition
                        </span>
                        <h3 className="font-serif-display text-2xl text-ivory mt-0.5">
                          {selectedPackage.title}
                        </h3>
                        <p className="text-xs text-sand-muted flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-sunset-coral" />
                          {selectedPackage.destination} • {selectedPackage.durationDays} Days / {selectedPackage.durationNights} Nights
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedPackage(null)}
                        className="text-xs text-sand-muted hover:text-ivory underline font-mono cursor-pointer"
                      >
                        Change Tour
                      </button>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-xs font-mono text-sand-muted border-t border-white/5">
                      <span>Rate: <strong className="text-ivory">₱{selectedPackage.pricePerPax.toLocaleString()}</strong> per passenger</span>
                      <span>•</span>
                      <span className="text-emerald-400">Accredited DOT Guide Included</span>
                    </div>
                  </div>
                )}

                {/* Schedule, Accommodation & Tier Controls */}
                <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Travel Duration Banner (Image 1 Top Card) */}
                  <div className="bg-gradient-to-r from-sunset-coral/15 via-amber-500/10 to-transparent border border-sunset-coral/30 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sunset-coral/20 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sunset-coral font-bold block">
                          Travel Duration Guarantee
                        </span>
                        <p className="text-xs font-semibold text-ivory">
                          The trip for this package will last for <span className="text-sunset-coral font-mono font-bold">{selectedPackage?.durationDays || 3} Days & {selectedPackage?.durationNights || 2} Nights</span>
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                      Instant Confirmation
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-serif-display text-lg text-ivory">
                        Departure Date & Schedule
                      </h4>
                      <p className="text-xs text-sand-muted">
                        Select your preferred embarkation date for guaranteed departure
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sunset-coral/10 text-sunset-coral border border-sunset-coral/20">
                      Guaranteed Departure
                    </span>
                  </div>

                  {/* Departure Date Selector (Image 1 Style) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-sand-muted flex items-center justify-between">
                      <span>Select Departure Date</span>
                      <span className="text-[10px] text-sunset-coral font-sans-body">Flexible Rescheduling</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-sunset-coral absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-[#070B0E] border border-white/10 rounded-xl pl-10 pr-3.5 py-3 text-xs text-ivory font-mono focus:outline-none focus:border-sunset-coral shadow-inner"
                      />
                    </div>
                    <p className="text-[11px] text-sand-muted font-mono pt-1">
                      You can select a departure date between <strong className="text-ivory">{new Date().toLocaleDateString('en-GB')}</strong> and <strong className="text-ivory">31/12/2026</strong>
                    </p>
                  </div>

                  {/* Accommodation Occupancy Selector (Image 1 & Image 2) */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div>
                      <h4 className="font-serif-display text-base text-ivory">Select Accommodation Type</h4>
                      <p className="text-xs text-sand-muted">What type of room occupancy do you prefer for your stay?</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Single Occupancy */}
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => triggerTapLoading(() => setAccommodationType('single'), 'Updating room occupancy...')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                          accommodationType === 'single'
                            ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                            : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-ivory flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${accommodationType === 'single' ? 'border-sunset-coral bg-sunset-coral' : 'border-white/30'}`}>
                              {accommodationType === 'single' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            Single Occupancy
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">+₱2,000 / room</span>
                        </div>
                        <p className="text-[11px] text-sand-muted pl-5">
                          Private room & solo accommodation for maximum privacy during trip.
                        </p>
                      </motion.div>

                      {/* Double Occupancy */}
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => triggerTapLoading(() => setAccommodationType('double'), 'Updating room occupancy...')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                          accommodationType === 'double'
                            ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                            : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-ivory flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${accommodationType === 'double' ? 'border-sunset-coral bg-sunset-coral' : 'border-white/30'}`}>
                              {accommodationType === 'double' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            Double Occupancy
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">Standard Included</span>
                        </div>
                        <p className="text-[11px] text-sand-muted pl-5">
                          Twin or double bed room for couples or travel companions willing to share.
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Select Package Tier (Image 1 & Image 2) */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div>
                      <h4 className="font-serif-display text-base text-ivory">Select Package Tier</h4>
                      <p className="text-xs text-sand-muted">Choose your resort tier and room amenities package</p>
                    </div>

                    <div className="space-y-2.5">
                      {/* Budget / Standard */}
                      <motion.div
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => triggerTapLoading(() => setPackageTier('budget'), 'Applying tier rates...')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          packageTier === 'budget'
                            ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                            : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${packageTier === 'budget' ? 'border-sunset-coral bg-sunset-coral' : 'border-white/30'}`}>
                            {packageTier === 'budget' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                          <div>
                            <div className="font-semibold text-xs text-ivory flex items-center gap-2">
                              <span>Budget / Standard Tier 😒</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-sand-muted">Garden View Room</span>
                            </div>
                            <p className="text-[11px] text-sand-muted mt-0.5">Cozy beachside room with essential amenities and aircon.</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-400 shrink-0">₱{rawBaseRate.toLocaleString()} / pax</span>
                      </motion.div>

                      {/* Mid-range / Deluxe */}
                      <motion.div
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => triggerTapLoading(() => setPackageTier('midrange'), 'Applying tier rates...')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          packageTier === 'midrange'
                            ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                            : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${packageTier === 'midrange' ? 'border-sunset-coral bg-sunset-coral' : 'border-white/30'}`}>
                            {packageTier === 'midrange' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                          <div>
                            <div className="font-semibold text-xs text-ivory flex items-center gap-2">
                              <span>Mid-Range / Deluxe Tier ✨</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sunset-coral/20 text-sunset-coral font-bold">Most Popular</span>
                            </div>
                            <p className="text-[11px] text-sand-muted mt-0.5">Ocean view room with private balcony and welcome drinks.</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">₱{(rawBaseRate + 1500).toLocaleString()} / pax</span>
                      </motion.div>

                      {/* Luxury / Villa */}
                      <motion.div
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => triggerTapLoading(() => setPackageTier('luxury'), 'Applying tier rates...')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          packageTier === 'luxury'
                            ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                            : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${packageTier === 'luxury' ? 'border-sunset-coral bg-sunset-coral' : 'border-white/30'}`}>
                            {packageTier === 'luxury' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                          <div>
                            <div className="font-semibold text-xs text-ivory flex items-center gap-2">
                              <span>Luxury / Pool Villa 💎</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">All-Inclusive</span>
                            </div>
                            <p className="text-[11px] text-sand-muted mt-0.5">Private infinity pool villa, personal butler, and massage sessions.</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-purple-400 shrink-0">₱{(rawBaseRate + 3500).toLocaleString()} / pax</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Important Alert Notice (Image 1 Style) */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-light">
                      Booking reservations for this tour date close <strong>3 days prior to departure</strong>. Marine conservation fees of ₱500/pax are pre-registered with the LGU.
                    </p>
                  </div>

                  {/* Included Perks / Reassurance Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/5 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-[#070B0E] border border-white/5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sand-muted">DOT Licensed Leaders</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#070B0E] border border-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="text-sand-muted">Aviation & Security Vetted</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#070B0E] border border-white/5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-sand-muted">Hotel & Transfers Arranged</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Reactive Cost Calculator Summary */}
              <div className="space-y-4">
                <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-4 sticky top-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h4 className="font-serif-display text-lg text-ivory">Reservation Summary</h4>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Live Rate
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-sand-muted">
                      <span>Base Rate (₱{baseRate.toLocaleString()} × {numPax})</span>
                      <span className="font-mono text-ivory">₱{baseSubtotal.toLocaleString()}</span>
                    </div>

                    {appliedPromo && discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Tag className="w-3 h-3" />
                          <span>{appliedPromo.code} ({appliedPromo.pct}% Off)</span>
                        </span>
                        <span className="font-mono font-semibold">-₱{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sand-muted">
                      <span>Tourism & Environmental Fees (₱500 × {numPax})</span>
                      <span className="font-mono text-ivory">₱{conservationFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sand-muted">
                      <span>Airport Terminal & Security Fees</span>
                      <span className="font-mono text-emerald-400">Included</span>
                    </div>

                    {/* Promo Code Input in Step 1 */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-sand-muted flex items-center justify-between">
                        <span>Promo Code / Voucher</span>
                        {appliedPromo && (
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="text-rose-400 hover:text-rose-300 normal-case underline text-[10px] cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={enteredPromoCode}
                          onChange={(e) => {
                            setEnteredPromoCode(e.target.value.toUpperCase());
                            setPromoError('');
                          }}
                          placeholder="e.g. HOLIDAY2026"
                          className="flex-1 bg-[#070B0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-ivory placeholder:text-sand-muted/50 focus:outline-none focus:border-sunset-coral"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromoCode}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-ivory text-xs font-mono font-medium transition-all cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-rose-400 font-mono">{promoError}</p>
                      )}
                      {promoSuccessMsg && (
                        <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{promoSuccessMsg}</span>
                        </p>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                      <span className="font-serif-display text-base text-ivory">Grand Total</span>
                      <span className="font-serif-display text-2xl text-sunset-coral font-bold">
                        ₱{grandTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-[#070B0E] p-3 rounded-xl border border-white/5 text-[11px] text-sand-muted space-y-1">
                      <div className="flex justify-between">
                        <span>50% Downpayment:</span>
                        <strong className="text-ivory font-mono">₱{depositAmount.toLocaleString()}</strong>
                      </div>
                      <div className="text-[10px] text-sand-muted/70">
                        Remaining balance payable upon arrival at destination.
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!selectedPackage}
                    onClick={() => {
                      if (!currentUser && !isOperatorView) {
                        if (onRequireAuth) {
                          onRequireAuth();
                        }
                        return;
                      }
                      triggerTapLoading(() => setBookingStep(2), 'Preparing passenger manifest...', true);
                    }}
                    className="w-full py-3 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-sunset-coral/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Passenger Manifest</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Passenger Manifest & Contact Register */}
          {bookingStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Detailed Guests & Passengers Counter Card (Image 2 Style) */}
              <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="font-serif-display text-lg text-ivory">
                      Travelers & Guest Breakdown
                    </h4>
                    <p className="text-xs text-sand-muted">
                      Specify the age category for each traveler in your group
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sunset-coral bg-sunset-coral/10 px-3 py-1 rounded-full border border-sunset-coral/20">
                    Total: {numPax} Passengers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Adults Counter */}
                  <div className="bg-[#070B0E] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-ivory">Adults</div>
                      <div className="text-[10px] text-sand-muted">Age 18+ years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                        disabled={adultsCount <= 1}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-ivory hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-ivory text-sm">{adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-ivory hover:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="bg-[#070B0E] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-ivory">Children</div>
                      <div className="text-[10px] text-sand-muted">Age 2-17 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        disabled={childrenCount <= 0}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-ivory hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-ivory text-sm">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-ivory hover:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants Counter */}
                  <div className="bg-[#070B0E] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-ivory">Infants</div>
                      <div className="text-[10px] text-sand-muted">Under 2 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                        disabled={infantsCount <= 0}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-ivory hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-ivory text-sm">{infantsCount}</span>
                      <button
                        type="button"
                        onClick={() => setInfantsCount(infantsCount + 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-ivory hover:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Guest Contact Register */}
              <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="font-serif-display text-lg text-ivory">
                      Lead Guest & Contact Information
                    </h4>
                    <p className="text-xs text-sand-muted">
                      Primary contact responsible for expedition notifications and voyage briefings
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLeadToPaxOne}
                    disabled={!customerInfo.fullName}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs text-sunset-coral font-medium border border-sunset-coral/40 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Passenger 1</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="lead-fullname" className="text-xs font-semibold text-ivory/90 block">
                      Lead Guest Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="lead-fullname"
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                      className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-email" className="text-xs font-semibold text-ivory/90 block">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="e.g. maria.santos@gmail.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-phone" className="text-xs font-semibold text-ivory/90 block">
                      Mobile / WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      placeholder="e.g. +63 917 123 4567"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="lead-emergency" className="text-xs font-semibold text-ivory/90 block">
                      Emergency Contact Name & Telephone <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="lead-emergency"
                      type="text"
                      required
                      placeholder="e.g. Roberto Santos (+63 918 222 9011)"
                      value={customerInfo.emergencyContact}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, emergencyContact: e.target.value })}
                      className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-nationality" className="text-xs font-semibold text-ivory/90 block">
                      Nationality
                    </label>
                    <input
                      id="lead-nationality"
                      type="text"
                      placeholder="e.g. Filipino, American, etc."
                      value={customerInfo.nationality}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, nationality: e.target.value })}
                      className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Individual Passenger Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-display text-lg text-ivory">
                      Official Passenger Manifest Roster ({passengers.length} Persons)
                    </h4>
                    <p className="text-xs text-sand-muted">
                      Mandatory registration under Civil Aviation & Tourism Security Regulations
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePaxCountChange(passengers.length + 1)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-ivory border border-white/15 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-sunset-coral" />
                    <span>Add Guest</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {passengers.map((p, index) => (
                    <motion.div
                      key={p.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#090E14] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30 flex items-center justify-center font-mono text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-serif-display text-base text-ivory font-medium">
                            Passenger {index + 1} {index === 0 && '(Lead Traveler)'}
                          </span>
                        </div>

                        {passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = passengers.filter((_, i) => i !== index);
                              setPassengers(updated);
                              setNumPax(updated.length);
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        {/* Name */}
                        <div className="sm:col-span-2 space-y-1.5">
                          <label htmlFor={`pax-${index}-fullname`} className="text-xs font-semibold text-ivory/90 block">
                            Full Legal Name (as in Passport / ID) <span className="text-rose-400">*</span>
                          </label>
                          <input
                            id={`pax-${index}-fullname`}
                            type="text"
                            required
                            placeholder="Full Name"
                            value={p.fullName}
                            onChange={(e) => handleUpdatePassenger(index, 'fullName', e.target.value)}
                            className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                          />
                        </div>

                        {/* Age */}
                        <div className="space-y-1.5">
                          <label htmlFor={`pax-${index}-age`} className="text-xs font-semibold text-ivory/90 block">
                            Age <span className="text-rose-400">*</span>
                          </label>
                          <input
                            id={`pax-${index}-age`}
                            type="number"
                            min="1"
                            max="110"
                            value={p.age || ''}
                            onChange={(e) => handleUpdatePassenger(index, 'age', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-1.5">
                          <label htmlFor={`pax-${index}-gender`} className="text-xs font-semibold text-ivory/90 block">
                            Gender
                          </label>
                          <select
                            id={`pax-${index}-gender`}
                            value={p.gender || ''}
                            onChange={(e) => handleUpdatePassenger(index, 'gender', e.target.value)}
                            className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral cursor-pointer transition-all"
                          >
                            <option value="" className="bg-[#0B131B] text-sand-muted">Select Gender</option>
                            <option value="Female" className="bg-[#0B131B] text-ivory">Female</option>
                            <option value="Male" className="bg-[#0B131B] text-ivory">Male</option>
                            <option value="Other" className="bg-[#0B131B] text-ivory">Other</option>
                          </select>
                        </div>

                        {/* ID Document Selection & Conditional Number Input */}
                        <div className="sm:col-span-4 space-y-2.5 pt-3 border-t border-white/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Dropdown for Document Type / Status */}
                            <div className="space-y-1.5">
                              <label htmlFor={`pax-${index}-idtype`} className="text-xs font-semibold text-ivory/90 flex items-center justify-between">
                                <span>Passport / Identification Option <span className="text-rose-400">*</span></span>
                                {getPassengerIdType(p) === 'none' ? (
                                  <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 bg-amber-500/15 rounded border border-amber-500/30">
                                    To Follow
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/15 rounded border border-emerald-500/30">
                                    ID Selected
                                  </span>
                                )}
                              </label>
                              <select
                                id={`pax-${index}-idtype`}
                                value={getPassengerIdType(p)}
                                onChange={(e) => handleIdTypeChange(index, e.target.value)}
                                className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral cursor-pointer transition-all"
                              >
                                <optgroup label="Government & Travel IDs" className="bg-[#0B131B] text-ivory font-semibold">
                                  <option value="ph_passport" className="bg-[#0B131B] text-ivory">Philippine Passport</option>
                                  <option value="foreign_passport" className="bg-[#0B131B] text-ivory">Foreign Passport (International)</option>
                                  <option value="philsys" className="bg-[#0B131B] text-ivory">PhilSys National ID (Card / ePhilID)</option>
                                  <option value="driver_license" className="bg-[#0B131B] text-ivory">Driver's License (LTO)</option>
                                  <option value="umid_sss" className="bg-[#0B131B] text-ivory">UMID / SSS / GSIS Card</option>
                                  <option value="postal_id" className="bg-[#0B131B] text-ivory">Postal ID (Digitized)</option>
                                  <option value="voter_id" className="bg-[#0B131B] text-ivory">Voter's ID / Certificate (COMELEC)</option>
                                  <option value="prc_id" className="bg-[#0B131B] text-ivory">PRC Professional License</option>
                                  <option value="student_id" className="bg-[#0B131B] text-ivory">Student / School ID (Minors & Youth)</option>
                                  <option value="birth_cert" className="bg-[#0B131B] text-ivory">PSA Birth Certificate (Minors / Infants)</option>
                                  <option value="other_govt" className="bg-[#0B131B] text-ivory">Other Government-Issued Photo ID</option>
                                </optgroup>
                                <optgroup label="No Document On Hand" className="bg-[#0B131B] text-amber-300 font-semibold">
                                  <option value="none" className="bg-[#0B131B] text-amber-300">I don't have a Passport / ID yet (To follow / No ID)</option>
                                </optgroup>
                              </select>
                            </div>

                            {/* Conditional input if they DO have the thing on the dropdown */}
                            {getPassengerIdType(p) !== 'none' ? (
                              <div className="space-y-1.5">
                                <label htmlFor={`pax-${index}-idnum`} className="text-xs font-semibold text-ivory/90 flex items-center justify-between">
                                  <span>
                                    {PASSENGER_ID_OPTIONS.find((o) => o.id === getPassengerIdType(p))?.label || 'ID'} Number <span className="text-rose-400">*</span>
                                  </span>
                                  <span className="text-[10px] text-sunset-coral font-mono">Required</span>
                                </label>
                                <input
                                  id={`pax-${index}-idnum`}
                                  type="text"
                                  placeholder={
                                    PASSENGER_ID_OPTIONS.find((o) => o.id === getPassengerIdType(p))?.placeholder ||
                                    'Enter document or passport number'
                                  }
                                  value={p.passportOrId === 'No ID (To Follow)' ? '' : p.passportOrId}
                                  onChange={(e) => handleUpdatePassenger(index, 'passportOrId', e.target.value)}
                                  className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory font-mono focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                                />
                              </div>
                            ) : (
                              <div className="flex items-end">
                                <div className="w-full p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs flex items-center gap-2.5 shadow-sm">
                                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                                  <span className="text-xs leading-relaxed text-amber-200 font-medium">
                                    No ID on hand yet. You can still complete booking! Passengers can present a school ID, birth certificate, or send ID details before tour departure.
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Special Requirements / Dietary */}
                        <div className="sm:col-span-4 space-y-1.5 pt-1">
                          <label htmlFor={`pax-${index}-special`} className="text-xs font-semibold text-ivory/90 block">
                            Special Needs, Dietary or Medical Alerts
                          </label>
                          <input
                            id={`pax-${index}-special`}
                            type="text"
                            placeholder="e.g. Vegetarian, Senior assistance, Wheelchair access, etc."
                            value={p.specialRequirements || ''}
                            onChange={(e) => handleUpdatePassenger(index, 'specialRequirements', e.target.value)}
                            className="w-full bg-[#0B131B] border border-white/20 hover:border-white/35 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder-sand-muted/70 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 focus:border-sunset-coral transition-all"
                          />
                        </div>
                      </div>

                      {/* Quick preset chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] font-mono text-sand-muted">Quick Tags:</span>
                        {DIETARY_HEALTH_PRESETS.slice(1, 6).map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const existing = p.specialRequirements ? `${p.specialRequirements}, ${preset}` : preset;
                              handleUpdatePassenger(index, 'specialRequirements', existing);
                            }}
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border border-white/5 transition-all cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Special Logistics Instructions */}
              <div className="bg-[#090E14] border border-white/10 rounded-2xl p-5 space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-sand-muted block">
                  Expedition Arrival & Logistics Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Flight arrival times, placard pickup requests, room preferences, or special anniversary setups..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#070B0E] border border-white/10 rounded-xl p-3 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => triggerTapLoading(() => setBookingStep(1), 'Returning to schedule...', true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-ivory font-medium transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Schedule</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
                      alert('Please complete the lead guest contact information before continuing.');
                      return;
                    }
                    triggerTapLoading(() => setBookingStep(3), 'Securing payment gateway...', true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 text-white text-xs font-medium shadow-lg shadow-sunset-coral/20 transition-all cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment & Reservation Confirmation */}
          {bookingStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                {/* Deposit vs Full Payment Options */}
                <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="font-serif-display text-lg text-ivory">
                    Choose Payment Option
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => triggerTapLoading(() => setPaymentOption('deposit'), 'Calculating downpayment terms...')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                        paymentOption === 'deposit'
                          ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                          : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase text-ivory">50% Downpayment Deposit</span>
                        {paymentOption === 'deposit' && <Check className="w-4 h-4 text-sunset-coral" />}
                      </div>
                      <div className="font-serif-display text-xl text-ivory font-bold">
                        ₱{depositAmount.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-sand-muted">
                        Guarantees your slot & hotel reservation. Remaining ₱{balanceDue.toLocaleString()} upon arrival.
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => triggerTapLoading(() => setPaymentOption('full'), 'Calculating full settlement...')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                        paymentOption === 'full'
                          ? 'bg-gradient-to-r from-sunset-coral/25 via-sunset-coral/10 to-[#0B121A] border-sunset-coral text-ivory ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/20'
                          : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase text-ivory">100% Full Settlement</span>
                        {paymentOption === 'full' && <Check className="w-4 h-4 text-sunset-coral" />}
                      </div>
                      <div className="font-serif-display text-xl text-ivory font-bold">
                        ₱{grandTotal.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-sand-muted">
                        Zero balance. Receive all confirmed tour vouchers and instant boarding passes.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Payment Gateway Methods */}
                <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-5">
                  <div>
                    <h4 className="font-serif-display text-lg text-ivory">
                      Choose Payment Method
                    </h4>
                    <p className="text-xs text-sand-muted">
                      Select your preferred settlement mode. Mobile wallets are powered by InstaPay / QR Ph national gateway.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'GCash', name: 'GCash e-Wallet', desc: 'InstaPay QR Ph', icon: Smartphone },
                      { id: 'PayMaya', name: 'Maya / Wallet', desc: 'InstaPay QR Ph', icon: Smartphone },
                      { id: 'Cash', name: 'Office Walk-In', desc: 'Pasig OTC Cash', icon: MapPin },
                      { id: 'Bank Transfer', name: 'Direct Bank', desc: 'BDO / BPI / UB', icon: CreditCard }
                    ].map((m) => {
                      const IconComp = m.icon;
                      const isSelected = paymentMethod === m.id;
                      return (
                        <motion.div
                          key={m.id}
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => triggerTapLoading(() => setPaymentMethod(m.id as any), `Connecting ${m.name}...`)}
                          className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-br from-sunset-coral/30 via-sunset-coral/15 to-[#0B121A] border-sunset-coral text-ivory font-semibold ring-2 ring-sunset-coral/40 shadow-xl shadow-sunset-coral/25'
                              : 'bg-[#0B121A] border-white/20 text-sand-muted hover:border-sunset-coral hover:bg-[#101A24] hover:shadow-xl hover:shadow-sunset-coral/15'
                          }`}
                        >
                          <IconComp className={`w-4.5 h-4.5 mx-auto mb-1.5 ${isSelected ? 'text-sunset-coral' : 'text-sand-muted'}`} />
                          <div className="text-xs text-ivory font-medium">{m.name}</div>
                          <div className="text-[10px] text-sand-muted font-mono">{m.desc}</div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Render Payment Method Body */}
                  {(paymentMethod === 'GCash' || paymentMethod === 'PayMaya') && (
                    <div className="pt-2 border-t border-white/10">
                      <InstaPayQRCard
                        amountDue={amountToPayNow}
                        paymentOption={paymentOption}
                        referenceNo={referenceNo}
                        onReferenceNoChange={setReferenceNo}
                        receiptProofUrl={receiptProofUrl}
                        onReceiptProofChange={setReceiptProofUrl}
                      />
                    </div>
                  )}

                  {paymentMethod === 'Cash' && (
                    <div className="pt-2 border-t border-white/10 space-y-4">
                      <div className="bg-[#070B0E] border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sunset-coral font-mono text-xs font-semibold uppercase">
                          <MapPin className="w-4 h-4" />
                          <span>Over-The-Counter Cash Settlement Policy</span>
                        </div>
                        <h5 className="font-serif-display text-base text-ivory">
                          Pay at our Ortigas Main Operations Desk
                        </h5>
                        <p className="text-xs text-sand-muted leading-relaxed font-light">
                          By completing this reservation, your slot is temporarily <strong>locked for 48 hours</strong>. Please present your generated Booking Reference Slip and settle the required payment in cash to receive your official BIR physical receipt.
                        </p>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs font-mono">
                          <span className="text-sand-muted block text-[10px] uppercase">Cashier Location:</span>
                          <span className="text-ivory font-medium block">
                            Unit 1101 City & Land Mega Plaza Inc., ADB Ave. cor. Garnet Rd., Ortigas Center, Pasig City
                          </span>
                          <span className="text-[11px] text-emerald-400 block pt-1">
                            Office Hours: Monday – Saturday (8:00 AM – 6:00 PM)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="pt-2 border-t border-white/10 space-y-4">
                      <div className="bg-[#070B0E] border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sunset-coral font-mono text-xs font-semibold uppercase">
                          <CreditCard className="w-4 h-4" />
                          <span>Official Corporate Banking Accounts</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                            <span className="text-[10px] text-sand-muted uppercase font-mono">BDO Unibank</span>
                            <p className="text-ivory font-mono font-bold">0067-8012-3490</p>
                            <p className="text-[11px] text-sand-muted">Holiday Travelers Travel & Tours Inc.</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                            <span className="text-[10px] text-sand-muted uppercase font-mono">Bank of the Philippine Islands (BPI)</span>
                            <p className="text-ivory font-mono font-bold">2940-1092-88</p>
                            <p className="text-[11px] text-sand-muted">Holiday Travelers Travel & Tours Inc.</p>
                          </div>
                        </div>

                        {/* Reference & Proof for Bank Transfer */}
                        <div className="space-y-3 pt-2">
                          <div className="space-y-1">
                            <label className="text-[11px] text-sand-muted block font-mono">
                              Bank Deposit / Online Transfer Reference Number
                            </label>
                            <input
                              type="text"
                              value={referenceNo}
                              onChange={(e) => setReferenceNo(e.target.value)}
                              placeholder="e.g. BDO-TRX-98214 or BPI Reference"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E14] border border-white/15 text-ivory font-mono text-xs focus:outline-none focus:border-sunset-coral"
                            />
                          </div>

                          {/* Bank Deposit Slip Upload */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-xs text-sand-muted block font-medium">
                              Upload Deposit Slip / Bank Mobile App Screenshot <span className="text-sunset-coral text-[11px] font-semibold">* Required</span>
                            </span>

                            {receiptProofUrl ? (
                              <div className="rounded-xl border border-cyan-500/40 bg-[#090E14] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={receiptProofUrl}
                                    alt="Bank Transfer Slip"
                                    className="w-14 h-14 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                                    onClick={() => setIsSlipPreviewModalOpen(true)}
                                    title="Click to preview receipt"
                                  />
                                  <div>
                                    <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                                      <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                                      <span>Transfer Slip Attached (Pending Audit)</span>
                                    </span>
                                    <span className="text-[10px] text-sand-muted block mt-0.5">
                                      Will be matched against corporate bank credit advice
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReceiptProofUrl('');
                                    setPaymentPhotoError('');
                                  }}
                                  className="text-xs text-sand-muted hover:text-rose-400 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer font-mono"
                                >
                                  Change Slip
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <label className="border-2 border-dashed border-white/15 hover:border-sunset-coral/50 active:scale-[0.99] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-[#090E14]/60 hover:bg-[#090E14] cursor-pointer transition-all">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      setPaymentPhotoError('');
                                      handleBankFileUpload(e);
                                    }}
                                    className="hidden"
                                  />
                                  <UploadCloud className="w-5 h-5 text-sand-muted" />
                                  <span className="text-xs text-ivory font-medium">
                                    {isBankUploading ? 'Compressing and uploading slip...' : 'Attach Bank Deposit / Transfer Screenshot'}
                                  </span>
                                  <span className="text-[10px] text-sand-muted font-mono">
                                    Supports JPG, PNG, WEBP
                                  </span>
                                </label>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPaymentPhotoError('');
                                      handleAttachBankSample();
                                    }}
                                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Attach Sample Bank Deposit Voucher (For Testing)</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ISO/IEC 27001 & DPA 2012 Form Consent */}
                <div className="bg-[#090E14] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent-terms"
                      checked={consentTermsAccepted}
                      onChange={(e) => setConsentTermsAccepted(e.target.checked)}
                      className="mt-1 rounded bg-[#070B0E] border-white/20 text-sunset-coral focus:ring-sunset-coral cursor-pointer"
                    />
                    <label htmlFor="consent-terms" className="text-xs text-sand-muted leading-relaxed cursor-pointer">
                      I certify that all passenger manifest details entered are complete and correct for civil aviation and tour manifest clearance. I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegalPolicy?.('terms')}
                        className="text-sunset-coral hover:underline"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegalPolicy?.('refund')}
                        className="text-sunset-coral hover:underline"
                      >
                        Cancellation & Refund Policy
                      </button>
                      .
                    </label>
                  </div>

                  {consentError && (
                    <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Please accept the terms and statutory manifest declaration to proceed.
                    </p>
                  )}

                  {paymentPhotoError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{paymentPhotoError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Finalization Summary Card */}
              <div className="space-y-4">
                <div className="bg-[#090E14] border border-white/10 rounded-2xl p-6 space-y-4 sticky top-6">
                  <h4 className="font-serif-display text-lg text-ivory border-b border-white/10 pb-3">
                    Expedition Checkout
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="font-medium text-ivory line-clamp-1">{selectedPackage?.title}</div>
                    <div className="text-sand-muted font-mono text-[11px]">{travelDate} • {numPax} Passengers</div>
                    
                    <div className="border-t border-white/10 pt-3 space-y-1.5">
                      <div className="flex justify-between text-sand-muted">
                        <span>Base Package Rate</span>
                        <span className="font-mono text-ivory">₱{baseSubtotal.toLocaleString()}</span>
                      </div>

                      {appliedPromo && discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Tag className="w-3 h-3" />
                            <span>Voucher ({appliedPromo.code})</span>
                          </span>
                          <span className="font-mono font-semibold">-₱{discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sand-muted">
                        <span>Marine & Conservation Fees</span>
                        <span className="font-mono text-ivory">₱{conservationFee.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-sand-muted">
                        <span>Total Expedition Cost</span>
                        <span className="font-mono text-ivory">₱{grandTotal.toLocaleString()}</span>
                      </div>

                      {/* Promo Code Entry in Step 3 */}
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-sand-muted flex items-center justify-between">
                          <span>Promo Code</span>
                          {appliedPromo && (
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="text-rose-400 hover:text-rose-300 normal-case underline text-[10px] cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={enteredPromoCode}
                            onChange={(e) => {
                              setEnteredPromoCode(e.target.value.toUpperCase());
                              setPromoError('');
                            }}
                            placeholder="e.g. HOLIDAY2026"
                            className="flex-1 bg-[#070B0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-ivory placeholder:text-sand-muted/50 focus:outline-none focus:border-sunset-coral"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromoCode}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-ivory text-xs font-mono font-medium transition-all cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-[10px] text-rose-400 font-mono">{promoError}</p>
                        )}
                        {promoSuccessMsg && (
                          <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{promoSuccessMsg}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between text-sand-muted pt-1">
                        <span>Payment Type</span>
                        <span className="font-mono text-sunset-coral uppercase">{paymentOption}</span>
                      </div>
                      <div className="flex justify-between text-sand-muted">
                        <span>Payment Channel</span>
                        <span className="font-mono text-ivory">{paymentMethod}</span>
                      </div>

                      <div className="border-t border-white/10 pt-2 flex justify-between items-baseline">
                        <span className="font-serif-display text-sm text-ivory">Amount Due Today</span>
                        <span className="font-serif-display text-2xl text-emerald-400 font-bold">
                          ₱{amountToPayNow.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerTapLoading(() => handlePromptFinalizeBooking(), 'Verifying consent & details...')}
                    className="btn-pop btn-shimmer-wrap w-full py-3.5 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 active:scale-95 text-white font-medium text-xs shadow-lg shadow-sunset-coral/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Generate Manifest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerTapLoading(() => setBookingStep(2), 'Returning to manifest...', true)}
                    className="btn-pop w-full py-2 text-xs text-sand-muted hover:text-ivory text-center font-mono cursor-pointer active:scale-95 transition-all"
                  >
                    Back to Passengers
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation & Voucher Generation */}
          {bookingStep === 4 && confirmedBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#090E14] border border-white/10 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Rubber Stamp Watermark on Voucher */}
              <div className="absolute top-6 right-6 z-10 pointer-events-none hidden sm:block">
                <RubberStamp
                  type={
                    confirmedBooking.paymentStatus === 'Paid' || confirmedBooking.paymentVerificationStatus === 'Verified'
                      ? 'PAID'
                      : confirmedBooking.invoice.amountPaid > 0
                      ? 'PARTIAL'
                      : 'UNPAID'
                  }
                  subtext={
                    confirmedBooking.paymentVerificationStatus === 'Verified'
                      ? 'OFFICIALLY VERIFIED'
                      : 'AUDIT IN QUEUE'
                  }
                  date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  verificationCode={confirmedBooking.bookingRef}
                  size="md"
                  rotation={-10}
                  className="animate-stamp-drop shadow-2xl"
                />
              </div>

              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono tracking-widest text-sunset-coral uppercase font-bold">
                  Flight & Tour Confirmed
                </p>
                <h3 className="font-serif-display text-3xl text-ivory">
                  Mabuhay! Your Expedition is Booked
                </h3>
                <p className="text-xs text-sand-muted max-w-md mx-auto">
                  Booking Reference <strong className="text-sunset-coral font-mono">{confirmedBooking.bookingRef}</strong> has been created and registered on the passenger manifest.
                </p>
              </div>

              {/* Recap Card */}
              <div className="bg-[#070B0E] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2 relative">
                <div className="flex justify-between">
                  <span className="text-sand-muted">Tour:</span>
                  <strong className="text-ivory">{confirmedBooking.tourTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-muted">Travel Date:</span>
                  <strong className="text-ivory">{confirmedBooking.travelDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-muted">Lead Guest:</span>
                  <strong className="text-ivory">{confirmedBooking.customer.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-muted">Passengers Manifested:</span>
                  <strong className="text-sunset-coral font-mono">{confirmedBooking.numPax} Persons</strong>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-sand-muted">Amount Paid:</span>
                  <strong className="text-emerald-400 font-mono">₱{confirmedBooking.invoice.amountPaid.toLocaleString()}</strong>
                </div>
              </div>

              {/* Expedition Logistics Status Card (To Follow / In Process) */}
              <div className="bg-[#070B0E] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-sand-muted font-bold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sunset-coral" />
                    <span>Flight, Hotel & Shuttle Logistics Status</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                    In Confirmation
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-sand-muted">
                      <span>Airline / Plane</span>
                      <span className="text-amber-400 font-bold">To Follow</span>
                    </div>
                    <div className="font-semibold text-ivory">
                      {confirmedBooking.flightReservation?.airline || 'Pending Admin Input'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-sand-muted">
                      <span>Resort Hotel</span>
                      <span className="text-amber-400 font-bold">To Follow</span>
                    </div>
                    <div className="font-semibold text-ivory">
                      {confirmedBooking.hotelReservation?.hotelName || 'Pending Admin Input'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-sand-muted">
                      <span>Tourist Shuttle</span>
                      <span className="text-amber-400 font-bold">To Follow</span>
                    </div>
                    <div className="font-semibold text-ivory">
                      {confirmedBooking.transportReservation?.vehicleType || 'Pending Admin Input'}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-sand-muted font-light leading-relaxed">
                  * Hotel vouchers, domestic/international airline flight numbers, and van shuttle assignments will be finalized and updated here by your designated operations officer once your payment audit is confirmed.
                </p>
              </div>

              {/* Payment Verification Status Alert - Strict Anti-Scam Notice */}
              <div className="p-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs text-left space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Awaiting Operations Finance Verification (Anti-Fraud Protocol)</span>
                </div>
                <p className="leading-relaxed font-sans-body text-sand-muted text-[11px]">
                  To prevent counterfeit and forged payment slips, your reference (<strong className="text-ivory font-mono">{confirmedBooking.invoice.payments[0]?.referenceNo}</strong>) and payment screenshot are queued for manual cross-audit by our Pasig operations staff against our live GCash/InstaPay merchant settlement ledger. Your tour slot is locked for 48 hours.
                </p>
                <p className="text-[10px] text-amber-400/90 font-mono">
                  You can track your live verification progress anytime under the "Check Tickets" tab.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {onGoToTracker && (
                  <button
                    type="button"
                    onClick={() => onGoToTracker(confirmedBooking.bookingRef)}
                    className="w-full py-3.5 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white text-xs font-semibold shadow-lg shadow-sunset-coral/25 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans-body active:scale-98"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Go to "Check Tickets" Tab to Track Live Updates</span>
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const text = `[HOLIDAY TRAVELERS INC. - RESERVATION CREATED]
Booking Ref: ${confirmedBooking.bookingRef}
Guest: ${confirmedBooking.customer.fullName}
Tour: ${confirmedBooking.tourTitle}
Date: ${confirmedBooking.travelDate}
Passengers: ${confirmedBooking.numPax} Persons
Amount: ₱${confirmedBooking.invoice.amountPaid.toLocaleString()}
Status: Pending Finance Verification

Office: Unit 1101 City & Land Mega Plaza, ADB Ave. cor. Garnet Rd., Ortigas Center, Pasig City
Phone: 0916 525 3517`;
                      navigator.clipboard.writeText(text);
                      setCopiedViberSummary(true);
                      setTimeout(() => setCopiedViberSummary(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-sand-muted hover:text-ivory border border-white/10 transition-all cursor-pointer font-sans-body"
                  >
                    {copiedViberSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <MessageSquare className="w-4 h-4 text-blue-400" />}
                    <span>{copiedViberSummary ? 'Summary Copied!' : 'Copy Viber / FB Summary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20 cursor-pointer font-sans-body"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Official Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetBookingFlow}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-sand-muted hover:text-ivory font-medium transition-all cursor-pointer font-sans-body"
                  >
                    {isOperatorView ? 'Return to Table' : 'Book Another Tour'}
                  </button>
                </div>
              </div>

              {/* In-Person Receipt Modal Mounted */}
              <InPersonReceiptModal
                booking={confirmedBooking}
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
              />
            </motion.div>
          )}
        </motion.div>
      )}



      {/* ========================================================================= */}
      {/* 6. DRAWER: BOOKING DETAIL INSPECTION SLIDE-OVER */}
      {/* ========================================================================= */}
      <BookingDetailDrawer
        booking={selectedBookingForDrawer}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onUpdateStatus={onUpdateBookingStatus}
        onUpdatePassengerStatus={handleTogglePassengerBoarding}
        onUpdateBooking={onUpdateBooking}
      />

      {/* ========================================================================= */}
      {/* 7. MODAL: POST-BOOKING GUIDANCE & REAL-TIME TRACKING WALKTHROUGH */}
      {/* ========================================================================= */}
      <BookingGuidanceWalkthroughModal
        isOpen={isGuidanceWalkthroughOpen}
        onClose={() => setIsGuidanceWalkthroughOpen(false)}
        booking={confirmedBooking}
        onGoToTracker={(ref) => {
          setIsGuidanceWalkthroughOpen(false);
          if (onGoToTracker) {
            onGoToTracker(ref || confirmedBooking?.bookingRef || '');
          }
        }}
      />

      {/* ========================================================================= */}
      {/* 8. MODAL: ACTION CONFIRMATION SAFEGUARD FOR BOOKING SUBMISSION */}
      {/* ========================================================================= */}
      <ActionConfirmModal
        isOpen={isConfirmBookingOpen}
        onClose={() => setIsConfirmBookingOpen(false)}
        onConfirm={() => {
          setIsConfirmBookingOpen(false);
          handleFinalizeBooking();
        }}
        title="Confirm Official Expedition Reservation?"
        message="Please verify your expedition details before final submission. Once registered, your passenger manifest is submitted to tour operations."
        details={[
          { label: 'Expedition Package', value: selectedPackage?.title || 'None Selected' },
          { label: 'Lead Traveler', value: customerInfo?.fullName || 'N/A' },
          { label: 'Manifest Count', value: `${numPax} Passenger(s)` },
          { label: 'Travel Date', value: travelDate || 'N/A' },
          { label: 'Payment Method', value: `${paymentMethod || 'Pending'} (${paymentOption ? paymentOption.toUpperCase() : 'N/A'})` },
          { label: 'Amount Due Today', value: `₱${(amountToPayNow || 0).toLocaleString()}` },
        ]}
        confirmText="Yes, Confirm & Reserve"
        cancelText="No, Review Details"
        variant="primary"
        warningNote="Ensure passenger names match their government or passport IDs for airline & tour verification."
      />

      {/* Bank Transfer Slip Fullscreen Zoom Modal */}
      {isSlipPreviewModalOpen && receiptProofUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsSlipPreviewModalOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-[#0B1014] border border-white/20 rounded-3xl p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold text-ivory">Attached Bank Transfer Slip</span>
              <button
                type="button"
                onClick={() => setIsSlipPreviewModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-white/10 bg-black flex items-center justify-center p-2">
              <img
                src={receiptProofUrl}
                alt="Bank Transfer Slip Full View"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
