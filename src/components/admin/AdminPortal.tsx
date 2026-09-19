  import React, { useMemo } from 'react';
  import { 
    Booking, 
    CustomerFeedback, 
    FlightReservation,
    HotelReservation, 
    PaymentRecord, 
    SubmoduleTab, 
    TourPackage, 
    TransportReservation,
    AppSettings
  } from '../../types';
  import { AdminDashboard } from '../AdminDashboard';
  import { TourPackageManagement } from '../submodules/TourPackageManagement';
  import { CustomerBookingPortal } from '../submodules/CustomerBookingPortal';
  import { ItineraryScheduleManagement } from '../submodules/ItineraryScheduleManagement';
  import { HotelTransportReservation } from '../submodules/HotelTransportReservation';
  import { PaymentInvoiceManagement } from '../submodules/PaymentInvoiceManagement';
  import { CustomerFeedbackRating } from '../submodules/CustomerFeedbackRating';
  import { SystemSettings } from '../submodules/SystemSettings';
  import { UserRbacManagement } from '../submodules/UserRbacManagement';
  import { FiscalReconciliation } from '../submodules/FiscalReconciliation';
  import { PaymentGateAudit } from '../submodules/PaymentGateAudit';
  import { TourGuideCommandCenter } from '../submodules/TourGuideCommandCenter';
  import { AccessDeniedBarrier } from '../common/AccessDeniedBarrier';
  import { hasTabAccess, findStaffAccountByEmail } from '../../utils/rbac';
  import { applyBookingsRLS, applyReservationsRLS } from '../../utils/rowLevelSecurity';
  import { RlsSecurityBadge } from './RlsSecurityBadge';
  import { ShieldCheck, ShieldAlert, Lock, Database } from 'lucide-react';

  interface AdminPortalProps {
    activeTab: SubmoduleTab;
    onTabChange: (tab: SubmoduleTab) => void;
    packages: TourPackage[];
    bookings: Booking[];
    feedbacks: CustomerFeedback[];
    appSettings: AppSettings;
    adminEmail: string;
    adminRole: string;
    onSavePackage: (pkg: TourPackage) => void;
    onDeletePackage: (id: string) => void;
    onDuplicatePackage: (pkg: TourPackage) => void;
    onUpdateBookingStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled') => void;
    onUpdateBooking?: (booking: Booking) => void;
    onUpdateGuide: (bookingId: string, guideName: string) => void;
    onUpdateHotelReservation: (bookingId: string, hotel: HotelReservation) => void;
    onUpdateTransportReservation: (bookingId: string, transport: TransportReservation) => void;
    onUpdateFlightReservation?: (bookingId: string, flight: FlightReservation) => void;
    onAddPaymentRecord: (bookingId: string, payment: PaymentRecord) => void;
    onSubmitFeedback: (feedback: CustomerFeedback) => void;
    onUpdateSettings: (settings: AppSettings) => void;
    onResetSettings: () => void;
  }

  export const AdminPortal: React.FC<AdminPortalProps> = ({
    activeTab,
    onTabChange,
    packages,
    bookings,
    feedbacks,
    appSettings,
    adminEmail,
    adminRole,
    onSavePackage,
    onDeletePackage,
    onDuplicatePackage,
    onUpdateBookingStatus,
    onUpdateBooking,
    onUpdateGuide,
    onUpdateHotelReservation,
    onUpdateTransportReservation,
    onUpdateFlightReservation,
    onAddPaymentRecord,
    onSubmitFeedback,
    onUpdateSettings,
    onResetSettings
  }) => {
    const staffAccount = findStaffAccountByEmail(adminEmail);
    const effectiveRole = staffAccount?.role || adminRole;

    const isAuthorized = hasTabAccess(
      staffAccount || { email: adminEmail, role: effectiveRole },
      activeTab
    );

    // Apply Row-Level Security (RLS) dynamically to bookings & manifests
    const { data: rlsBookings, report: bookingsRlsReport } = useMemo(() => {
      return applyBookingsRLS(bookings, { email: adminEmail, role: effectiveRole });
    }, [bookings, adminEmail, effectiveRole]);

    // Apply Row-Level Security (RLS) dynamically to hotel & transport reservations
    const { data: rlsReservations, report: reservationsRlsReport } = useMemo(() => {
      return applyReservationsRLS(bookings, { email: adminEmail, role: effectiveRole });
    }, [bookings, adminEmail, effectiveRole]);

    if (!isAuthorized) {
      return (
        <AccessDeniedBarrier
          requiredTab={activeTab}
          currentEmail={adminEmail}
          currentRole={effectiveRole}
          onNavigateHome={() => onTabChange('overview')}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Dynamic Row-Level Security (RLS) Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 bg-[#0B1014] border border-white/10 rounded-2xl text-xs font-mono">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-sand-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <strong className="text-ivory">{adminEmail}</strong>
            </span>
            <span className="text-sand-muted">•</span>
            <span className="text-sunset-coral font-semibold">{effectiveRole}</span>
            {bookingsRlsReport.isFiltered && (
              <>
                <span className="text-sand-muted">•</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Row-Level Filter Enforced ({bookingsRlsReport.permittedRows}/{bookingsRlsReport.totalRows} Rows)
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <RlsSecurityBadge report={bookingsRlsReport} />
          </div>
        </div>

        {/* 0. Operations Overview */}
        {activeTab === 'overview' && (
          <AdminDashboard
            packages={packages}
            bookings={rlsBookings}
            feedbacks={feedbacks}
            adminEmail={adminEmail}
            adminRole={effectiveRole}
            onNavigateTab={onTabChange}
          />
        )}

        {/* Tour Guide Field Command Submodule (Michael Baynosa & Tour Guides) */}
        {activeTab === 'guide_command' && (
          <TourGuideCommandCenter
            bookings={rlsBookings}
            packages={packages}
            feedbacks={feedbacks}
            adminEmail={adminEmail}
            onUpdateBooking={onUpdateBooking}
            onUpdateGuide={onUpdateGuide}
          />
        )}

        {/* 1. Tour Package Management (Full Operator CRUD) */}
        {activeTab === 'packages' && (
          <TourPackageManagement
            packages={packages}
            onSavePackage={onSavePackage}
            onDeletePackage={onDeletePackage}
            onDuplicatePackage={onDuplicatePackage}
            isOperatorView={true} // Full admin CRUD enabled
            onSelectBookPackage={() => {}}
          />
        )}

        {/* 2. Customer Bookings & Passenger Manifest (RLS Enforced) */}
        {activeTab === 'bookings' && (
          <CustomerBookingPortal
            packages={packages}
            bookings={rlsBookings}
            onCreateBooking={onSavePackage ? (newBk) => onUpdateBooking?.(newBk) : () => {}}
            onUpdateBookingStatus={onUpdateBookingStatus}
            onUpdateBooking={onUpdateBooking}
            isOperatorView={true} // Manifest table with status management & print actions
          />
        )}

        {/* 3. Itinerary & Tour Guide Dispatch (RLS Enforced) */}
        {activeTab === 'itineraries' && (
          <ItineraryScheduleManagement
            packages={packages}
            bookings={rlsBookings}
            onUpdateGuide={onUpdateGuide}
            isOperatorView={true}
          />
        )}

        {/* 4. Hotel, Flight & Transport Allocations (RLS Enforced) */}
        {activeTab === 'reservations' && (
          <HotelTransportReservation
            bookings={rlsReservations}
            onUpdateHotelReservation={onUpdateHotelReservation}
            onUpdateTransportReservation={onUpdateTransportReservation}
            onUpdateFlightReservation={onUpdateFlightReservation}
            onUpdateBooking={onUpdateBooking}
            isOperatorView={true}
          />
        )}

        {/* Payment Gate & Receipt Photo Audit (Finance Officer & Super Admin) */}
        {activeTab === 'payment_gate' && (
          <PaymentGateAudit
            bookings={rlsBookings}
            onUpdateBooking={onUpdateBooking}
            onAddPaymentRecord={onAddPaymentRecord}
            adminEmail={adminEmail}
            adminRole={effectiveRole}
          />
        )}

        {/* 5. Payment & Invoices Ledger (RLS Enforced) */}
        {activeTab === 'payments' && (
          <PaymentInvoiceManagement
            bookings={rlsBookings}
            onAddPaymentRecord={onAddPaymentRecord}
            isOperatorView={true}
          />
        )}

        {/* Fiscal Reconciliation & Payouts (Finance Officer / Super Admin) */}
        {activeTab === 'reconciliation' && (
          <FiscalReconciliation
            bookings={rlsBookings}
          />
        )}

        {/* 6. Customer Feedback & CSAT Moderation */}
        {activeTab === 'feedback' && (
          <CustomerFeedbackRating
            feedbacks={feedbacks}
            bookings={rlsBookings}
            onSubmitFeedback={onSubmitFeedback}
            isOperatorView={true}
          />
        )}

        {/* 8. System Settings & Agency Branding */}
        {activeTab === 'settings' && (
          <SystemSettings
            settings={appSettings}
            onUpdateSettings={onUpdateSettings}
            onResetSettings={onResetSettings}
          />
        )}

        {/* 9. Staff & RBAC Governance Center (Super Admin) */}
        {activeTab === 'rbac' && (
          <UserRbacManagement
            currentAdminEmail={adminEmail}
            currentAdminRole={effectiveRole}
          />
        )}
      </div>
    );
  };
