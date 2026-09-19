export type TourCategory = 
  | 'Island Hopping' 
  | 'Adventure & Nature' 
  | 'Heritage & Culture' 
  | 'Luxury & Wellness' 
  | 'City Tour'
  | 'International & Pilgrimage'
  | 'Grand Asia & Far East'
  | 'European Grandeur';

export interface DayActivity {
  time: string;
  activity: string;
  location?: string;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  description: string;
  activities: DayActivity[];
  meals: string; // e.g., "Breakfast, Lunch"
  overnightHotel?: string;
}

export interface TourPackage {
  id: string;
  code: string; // e.g. PKG-ELNIDO-01
  title: string;
  subtitle?: string;
  destination: string;
  category: TourCategory;
  durationDays: number;
  durationNights: number;
  pricePerPax: number;
  maxCapacity: number;
  inclusions: string[];
  exclusions: string[];
  bannerUrl: string;
  rating: number;
  reviewCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  featured?: boolean;
  airline?: string;
  departureDates?: string[];
  specialFeatures?: string[];
  itinerary: DayItinerary[];
}

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  nationality?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export interface Passenger {
  id: string;
  fullName: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other' | '' | string;
  passportOrId: string;
  idType?: string;
  hasId?: boolean;
  specialRequirements?: string;
  nationality?: string;
  boardingStatus?: 'boarded' | 'pending' | 'noshow';
  dietaryPreference?: string;
}

export interface FlightReservation {
  id: string;
  airline: string;
  flightNumber: string;
  route: string;
  terminal?: string;
  departureDate?: string;
  returnDate?: string;
  etd?: string;
  eta?: string;
  pnrCode?: string;
  cabinClass?: string;
  baggageAllowance?: string;
  status: 'Confirmed' | 'Pending' | 'To Follow' | 'Cancelled';
  notes?: string;
}

export interface HotelReservation {
  id: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  voucherCode: string;
  status: 'Confirmed' | 'Pending' | 'To Follow' | 'Cancelled';
  contactPhone: string;
  location?: string;
  notes?: string;
}

export interface TransportReservation {
  id: string;
  vehicleType: string; // e.g., '14-Seater Coaster Van', 'Executive VIP Van', 'Airport Shuttle'
  driverName: string;
  driverContact: string;
  plateNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  status: 'Dispatched' | 'Scheduled' | 'Completed' | 'Pending' | 'To Follow';
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'GCash' | 'PayMaya' | 'Bank Transfer' | 'Credit Card' | 'Cash';
  referenceNo: string;
  status: 'Verified' | 'Pending Verification' | 'Flagged / Needs Re-upload' | 'Rejected';
  receiptProofUrl?: string;
  auditNote?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string; // e.g., INV-2026-001
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  items: InvoiceItem[];
  payments: PaymentRecord[];
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. TT-2026-8942
  tourPackageId: string;
  tourTitle: string;
  destination: string;
  customer: Customer;
  passengers: Passenger[];
  travelDate: string;
  numPax: number;
  totalPrice: number;
  depositRequired: number;
  bookingStatus: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  createdAt: string;
  assignedGuide?: string;
  flightReservation?: FlightReservation;
  hotelReservation?: HotelReservation;
  transportReservation?: TransportReservation;
  accommodationType?: 'Standard' | 'Deluxe' | 'Villa';
  packageTier?: 'Budget' | 'Mid-Range' | 'Luxury';
  adultCount?: number;
  childCount?: number;
  infantCount?: number;
  invoice: PaymentInvoice;
  specialInstructions?: string;
  appliedPromoCode?: string;
  discountAmount?: number;
  receiptProofUrl?: string;
  customerReferenceNo?: string;
  paymentVerificationStatus?: 'Verified' | 'Pending Verification' | 'Flagged / Needs Re-upload' | 'Rejected' | 'Unpaid';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'receipt' | 'payment_verified' | 'audit_flag' | 'info' | 'flight' | 'hotel' | 'transport' | 'logistics';
  read: boolean;
  bookingRef?: string;
  actionLabel?: string;
}

export interface CustomerFeedback {
  id: string;
  bookingRef: string;
  customerName: string;
  tourTitle: string;
  date: string;
  overallRating: number; // 1-5
  guideRating: number;
  hotelRating: number;
  transportRating: number;
  valueRating: number;
  comment: string;
  recommendationScore: number; // 1-10 NPS
  status: 'Approved' | 'Pending Review';
  source?: string;
  verifiedBadge?: boolean;
}

export type ViewMode = 'customer' | 'operator';
export type SubmoduleTab = 
  | 'overview'
  | 'guide_command'
  | 'packages'
  | 'bookings'
  | 'itineraries'
  | 'reservations'
  | 'payment_gate'
  | 'payments'
  | 'reconciliation'
  | 'feedback'
  | 'settings'
  | 'rbac';

export type StaffRole = 
  | 'Super Admin' 
  | 'Tour Operations Manager' 
  | 'Finance Officer' 
  | 'Tour Guide' 
  | 'Custom Staff';

export type GranularPermission = 
  | 'packages.view'
  | 'packages.create'
  | 'packages.edit'
  | 'packages.delete'
  | 'bookings.view_manifest'
  | 'bookings.update_status'
  | 'bookings.export_csv'
  | 'bookings.delete'
  | 'logistics.dispatch_guide'
  | 'logistics.manage_hotels'
  | 'logistics.manage_transport'
  | 'finance.view_payments'
  | 'finance.verify_payment'
  | 'finance.issue_refund'
  | 'finance.export_invoices'
  | 'finance.reconciliation'
  | 'feedback.view'
  | 'feedback.moderate'
  | 'settings.view'
  | 'settings.update'
  | 'rbac.view_staff'
  | 'rbac.create_staff'
  | 'rbac.edit_roles'
  | 'rbac.reset_passwords'
  | 'rbac.delete_staff'
  | 'rbac.view_audit_logs';

export interface StaffAccount {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
  requiresPasswordChange?: boolean;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  allowedTabs?: SubmoduleTab[];
  granularPermissions?: GranularPermission[];
  totpSecret?: string;
  twoFactorEnabled?: boolean;
  backupCodes?: string[];
  phoneNumber?: string;
  notes?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  targetEmail?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  prevHash?: string;
  hash?: string;
  ipAddress?: string;
}

export interface AgencyBrandingSettings {
  companyName: string;
  shortName: string;
  accreditationNo: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currencySymbol: string;
  defaultDownpaymentPct: number;
}

export type ThemeAccentColor = 'coral' | 'cyan' | 'emerald' | 'amber' | 'indigo' | 'purple' | 'rose' | 'teal';
export type ThemeFontDisplay = 'cormorant' | 'jakarta' | 'cinzel' | 'outfit' | 'space' | 'playfair' | 'jetbrains';
export type ThemeFontBody = 'jakarta' | 'inter' | 'outfit' | 'dmsans' | 'jetbrains';
export type ThemeBgTone = 'obsidian' | 'slate' | 'zinc' | 'marine';
export type ThemeBorderStyle = 'subtle' | 'high-contrast' | 'minimal';
export type ThemeFontSize = 'compact' | 'standard' | 'large';

export interface UiThemeSettings {
  accentColor: ThemeAccentColor;
  fontDisplay: ThemeFontDisplay;
  fontBody: ThemeFontBody;
  bgTone: ThemeBgTone;
  borderStyle: ThemeBorderStyle;
  fontSize: ThemeFontSize;
  cardGlow: boolean;
  colorScheme?: 'coral' | 'cyan' | 'amber' | 'emerald' | 'indigo' | 'rose';
  density?: 'spacious' | 'compact';
  showBorders?: boolean;
  enableAnimations?: boolean;
}

export interface PromoPopupSettings {
  enabled: boolean;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  discountCode?: string;
  discountPct?: number;
  imageUrl: string;
  actionText: string;
  actionUrl: string;
  expiresText?: string;
}

export interface AppSettings {
  agency: AgencyBrandingSettings;
  theme: UiThemeSettings;
  promo: PromoPopupSettings;
}
