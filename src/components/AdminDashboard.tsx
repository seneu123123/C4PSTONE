import React, { useState } from 'react';
import { Booking, CustomerFeedback, TourPackage } from '../types';
import { 
  TrendingUp, 
  MapPin, 
  UserCheck, 
  CreditCard, 
  Star, 
  CheckCircle2, 
  Hotel, 
  Car, 
  ArrowRight,
  Layers,
  Sparkles,
  Calendar,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  Users,
  Download,
  FileSpreadsheet,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { hasTabAccess, findStaffAccountByEmail } from '../utils/rbac';
import { ActionConfirmModal } from './common/ActionConfirmModal';
import { dispatchAppNotification } from '../utils/notifications';

interface AdminDashboardProps {
  packages: TourPackage[];
  bookings: Booking[];
  feedbacks: CustomerFeedback[];
  adminRole?: string;
  adminEmail?: string;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  packages,
  bookings,
  feedbacks,
  adminRole = 'Super Admin',
  adminEmail = 'karlljacob8@gmail.com',
  onNavigateTab
}) => {
  const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'field' | 'finance' | 'management'>('all');

  const staffAccount = findStaffAccountByEmail(adminEmail);
  const userContext = staffAccount || { email: adminEmail, role: adminRole };
  const canAccess = (tab: any) => hasTabAccess(userContext, tab);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.invoice.amountPaid, 0);
  const pendingRevenue = bookings.reduce((sum, b) => sum + b.invoice.balanceDue, 0);
  const activePackagesCount = packages.filter((p) => p.status === 'Active').length;
  const confirmedBookingsCount = bookings.filter((b) => b.bookingStatus === 'Confirmed').length;
  const totalPassengersCount = bookings.reduce((sum, b) => sum + (b.passengers?.length || b.numPax || 1), 0);

  const isGuide = adminRole.includes('Guide');
  const isFinance = adminRole.includes('Finance');
  const isOps = adminRole.includes('Operations');

  const handleDownloadExport = () => {
    const headers = [
      "Booking Reference",
      "Customer Name",
      "Email",
      "Phone",
      "Expedition Title",
      "Package Code",
      "Travel Date",
      "Pax Count",
      "Pickup / Muster Location",
      "Assigned Guide",
      "Booking Status",
      "Payment Status",
      "Total Amount (PHP)",
      "Amount Paid (PHP)",
      "Balance Due (PHP)",
      "Special Requests"
    ];

    const rows = bookings.map(b => [
      `"${b.id}"`,
      `"${b.customerName || ''}"`,
      `"${b.customerEmail || ''}"`,
      `"${b.customerPhone || ''}"`,
      `"${(b.packageTitle || '').replace(/"/g, '""')}"`,
      `"${b.packageId || ''}"`,
      `"${b.startDate || ''}"`,
      b.passengers?.length || b.numPax || 1,
      `"${(b.pickupLocation || '').replace(/"/g, '""')}"`,
      `"${b.assignedGuideName || 'Unassigned'}"`,
      `"${b.bookingStatus}"`,
      `"${b.paymentStatus}"`,
      b.invoice.totalAmount,
      b.invoice.amountPaid,
      b.invoice.balanceDue,
      `"${(b.specialRequests || []).join('; ').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ElNido-Operations-Briefing-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportConfirmOpen(false);

    dispatchAppNotification({
      title: 'Operations Briefing Exported',
      message: `Generated operational report with ${bookings.length} reservations for ${adminEmail}.`,
      type: 'info'
    });
  };

  const fieldModules = ['bookings', 'itineraries'];
  const financeModules = ['payment_gate', 'payments', 'reconciliation'];
  const managementModules = ['packages', 'reservations', 'feedback', 'rbac'];

  const countAccessible = (modules: string[]) => modules.filter(m => canAccess(m)).length;
  const allAccessibleCount = [...fieldModules, ...financeModules, ...managementModules].filter(m => canAccess(m)).length;

  const matchesCategory = (tab: string) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'field') return fieldModules.includes(tab);
    if (selectedCategory === 'finance') return financeModules.includes(tab);
    if (selectedCategory === 'management') return managementModules.includes(tab);
    return true;
  };

  return (
    <div className="space-y-8">
      {/* Overview Welcome Banner */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sunset-coral/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
              {isGuide ? 'Field Guide Dispatch Hub' : isFinance ? 'Finance & Revenue Ledger' : isOps ? 'Flight & Logistics Command' : 'Operations Control Tower'}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory tracking-wide leading-tight">
              {isGuide ? (
                <>My Assigned Expeditions & <br /><span className="italic font-normal text-white">Passenger Roster</span></>
              ) : isFinance ? (
                <>Fiscal Reconciliation & <br /><span className="italic font-normal text-white">Accounts Receivable</span></>
              ) : isOps ? (
                <>Tour Logistics, Flights & <br /><span className="italic font-normal text-white">Manifest Operations</span></>
              ) : (
                <>Tour Operations & <br /><span className="italic font-normal text-white">Booking Management System</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              {isGuide 
                ? 'Welcome back, Michael. Manage your daily passenger roll call, safety briefings, emergency contacts, and tour schedules.'
                : isFinance
                ? 'Welcome back, Ilona. Verify multi-channel payments, monitor downpayment aging, and generate official BIR 2307 tax receipts.'
                : isOps
                ? 'Welcome back, Kyle. Coordinate airline bookings, manage hotel and shuttle services, assign guides, and oversee bookings.'
                : 'Integrated operational suite managing core submodules: Catalog, Manifests, Dispatch, Logistics, Reconciliation, and RBAC.'}
            </p>
          </div>

          {/* Quick Command Action Group */}
          <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 shrink-0">
            {canAccess('payment_gate') && isFinance && (
              <button
                onClick={() => onNavigateTab('payment_gate')}
                className="btn-pop btn-shimmer-wrap inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium tracking-wide shadow-lg shadow-emerald-950/40 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Review Receipts</span>
              </button>
            )}

            <button
              onClick={() => setIsExportConfirmOpen(true)}
              className="btn-pop inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/[0.12] text-ivory text-xs font-medium tracking-wide shadow-md transition-all cursor-pointer"
              title="Download full operational records as CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Operations CSV</span>
              <Download className="w-3.5 h-3.5 text-sand-muted" />
            </button>
          </div>
        </div>

        {/* Role-Sanitized Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
          {isGuide ? (
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  My Assigned Tours
                </span>
                <div className="font-serif-display text-3xl text-emerald-400">
                  {bookings.length} <span className="text-sm font-sans-body text-sand-muted font-light">Runs</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Active assigned expedition schedules
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Passengers in Care
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {totalPassengersCount} <span className="text-sm font-sans-body text-sand-muted font-light">Pax</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Confirmed on active manifests
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  DOT Safety Status
                </span>
                <div className="font-serif-display text-3xl text-amber-300">
                  100% DOT
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Flight and airport transfer clearance active
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Next Departure
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  08:30 AM
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Manila NAIA Terminal 2 Domestic
                </div>
              </div>
            </>
          ) : isFinance ? (
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Total Collected (YTD)
                </span>
                <div className="font-serif-display text-3xl text-emerald-400">
                  ₱{totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Verified payments cleared
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Pending Receivables
                </span>
                <div className="font-serif-display text-3xl text-amber-300">
                  ₱{pendingRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Outstanding balance due
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Unverified Downpayments
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {bookings.filter(b => b.paymentStatus !== 'Paid').length} <span className="text-sm font-sans-body text-sand-muted font-light">Records</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Requires cashier reconciliation
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  VAT Output (12%)
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  ₱{(totalRevenue - totalRevenue / 1.12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  BIR Form 2550M ledger
                </div>
              </div>
            </>
          ) : isOps ? (
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Active Expeditions
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  {activePackagesCount} <span className="text-sm font-sans-body text-sand-muted font-light">Packages</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {packages.length} total inventory routes
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Passengers Manifested
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {totalPassengersCount} <span className="text-sm font-sans-body text-sand-muted font-light">Pax</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {confirmedBookingsCount} confirmed bookings
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-blue-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Flights & Shuttles Deployed
                </span>
                <div className="font-serif-display text-3xl text-blue-400">
                  6 Active
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Airlines & VIP airport coasters
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Customer CSAT
                </span>
                <div className="font-serif-display text-3xl text-amber-400 flex items-center gap-1.5">
                  <span>4.9</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {feedbacks.length} traveler reviews
                </div>
              </div>
            </>
          ) : (
            // Super Admin Overview
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Total Revenue Collected
                </span>
                <div className="font-serif-display text-3xl text-emerald-400">
                  ₱{totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  ₱{pendingRevenue.toLocaleString()} pending balance
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Active Manifest Bookings
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {confirmedBookingsCount} <span className="text-sm font-sans-body text-sand-muted font-light">Confirmed</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {bookings.length} total registered records
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Active Tour Catalog
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  {activePackagesCount} <span className="text-sm font-sans-body text-sand-muted font-light">Packages</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {packages.length} total inventory items
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Guest CSAT Rating
                </span>
                <div className="font-serif-display text-3xl text-amber-400 flex items-center gap-1.5">
                  <span>4.9</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {feedbacks.length} verified traveler reviews
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Submodule Quick Access Hub (Role Filtered & Categorized) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sand-muted" />
            <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sand-muted font-medium">
              Authorized Submodules Directory
            </p>
          </div>

          {/* Submodule Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-sunset-coral text-white shadow-sm'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
              }`}
            >
              <span>All Modules</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono font-bold">
                {allAccessibleCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('field')}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'field'
                  ? 'bg-sunset-coral text-white shadow-sm'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
              }`}
            >
              <span>Field & Logistics</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono font-bold">
                {countAccessible(fieldModules)}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('finance')}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'finance'
                  ? 'bg-sunset-coral text-white shadow-sm'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
              }`}
            >
              <span>Finance & Ledger</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono font-bold">
                {countAccessible(financeModules)}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('management')}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'management'
                  ? 'bg-sunset-coral text-white shadow-sm'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
              }`}
            >
              <span>Operations & RBAC</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono font-bold">
                {countAccessible(managementModules)}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Submodule: Packages */}
          {canAccess('packages') && matchesCategory('packages') && (
            <div
              onClick={() => onNavigateTab('packages')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Tour Package & Catalog Management
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Create and configure flight tour packages, itineraries, inclusions, pricing rules, and passenger limits.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {packages.length} Packages Configured →
              </div>
            </div>
          )}

          {/* Submodule: Bookings */}
          {canAccess('bookings') && matchesCategory('bookings') && (
            <div
              onClick={() => onNavigateTab('bookings')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  {isFinance ? 'Billing & Financial Manifest' : isGuide ? 'My Passenger Manifest' : 'Booking & Passenger Manifest'}
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  {isFinance 
                    ? 'Verify passenger billing records, deposit vouchers, and outstanding balance collections.'
                    : 'Track guest reservations, manage passenger manifests, verify identities, and monitor pickup locations.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {bookings.length} Bookings on Record →
              </div>
            </div>
          )}

          {/* Submodule: Itineraries */}
          {canAccess('itineraries') && matchesCategory('itineraries') && (
            <div
              onClick={() => onNavigateTab('itineraries')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  {isGuide ? 'My Assigned Tour Schedules' : 'Tour Scheduling & Guide Dispatch'}
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  {isGuide 
                    ? 'View day-by-day itineraries, flight details, and assigned hotel drop-off locations.'
                    : 'Schedule departure dates, assign certified local guides, and monitor daily activity milestone timelines.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {isGuide ? 'View My Calendar →' : 'Live Guide Dispatch →'}
              </div>
            </div>
          )}

          {/* Submodule: Hotel & Transport */}
          {canAccess('reservations') && matchesCategory('reservations') && (
            <div
              onClick={() => onNavigateTab('reservations')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Hotel & Transport Logistics
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Book airline flights, hotel reservations, and private airport transfer shuttles with country-specific service providers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                Flights, Hotels & Shuttles →
              </div>
            </div>
          )}

          {/* Submodule: Payment Gate Audit */}
          {canAccess('payment_gate') && matchesCategory('payment_gate') && (
            <div
              onClick={() => onNavigateTab('payment_gate')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-emerald-500/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Payment Gate & Receipt Audit
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Dedicated anti-fraud gate for Finance and Super Admin. Inspect uploaded client receipt photos, match transaction reference numbers, and detect duplicate submissions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-emerald-400 font-medium">
                Verify Proof of Payment →
              </div>
            </div>
          )}

          {/* Submodule: Payments */}
          {canAccess('payments') && matchesCategory('payments') && (
            <div
              onClick={() => onNavigateTab('payments')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Billing, Invoices & Payments
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Generate official invoices, verify GCash, Maya, and bank transfers, and balance outstanding accounts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                Ledger & Payments →
              </div>
            </div>
          )}

          {/* Submodule: Fiscal Reconciliation */}
          {canAccess('reconciliation') && matchesCategory('reconciliation') && (
            <div
              onClick={() => onNavigateTab('reconciliation')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-amber-400/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Fiscal Reconciliation & Payouts
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Channel settlements (GCash, Maya, Wire Transfers), downpayment aging analysis, and BIR 2307 Official Receipts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-amber-300 font-medium">
                Tax & Settlement Hub →
              </div>
            </div>
          )}

          {/* Submodule: Feedback */}
          {canAccess('feedback') && matchesCategory('feedback') && (
            <div
              onClick={() => onNavigateTab('feedback')}
              className="btn-pop bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <Star className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Customer Feedback & CSAT Moderation
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Collect post-tour ratings, calculate Net Promoter Scores, and moderate customer testimonials.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {feedbacks.length} Feedback Submissions →
              </div>
            </div>
          )}

          {/* Submodule: Staff & RBAC Governance */}
          {canAccess('rbac') && matchesCategory('rbac') && (
            <div
              onClick={() => onNavigateTab('rbac')}
              className="btn-pop bg-[#0B1014] border border-rose-500/20 hover:border-rose-500/60 hover:scale-[1.01] active:scale-[0.98] p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Staff & RBAC Governance Center
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Manage staff roles, cryptographic TOTP 2FA, granular sub-permissions, and immutable security audit chains.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-rose-400 font-medium">
                Super Admin Security Console →
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Operations Ledger Export Safeguard Modal */}
      <ActionConfirmModal
        isOpen={isExportConfirmOpen}
        onClose={() => setIsExportConfirmOpen(false)}
        onConfirm={handleDownloadExport}
        title="Export Operations Ledger & Manifest CSV?"
        message="You are about to export active reservation records, financial ledger details, passenger contact rosters, and assigned field guide allocations."
        details={[
          { label: 'Authorized Operator', value: adminEmail },
          { label: 'Security Clearance', value: adminRole },
          { label: 'Total Reservations', value: `${bookings.length} Bookings` },
          { label: 'Total Passengers', value: `${totalPassengersCount} Pax` },
          { label: 'Total Revenue Tracked', value: `₱${totalRevenue.toLocaleString()}` },
          { label: 'Export Format', value: 'RFC 4180 UTF-8 CSV' }
        ]}
        confirmText="Yes, Download Operations CSV"
        cancelText="Cancel Export"
        variant="info"
        warningNote="CONFIDENTIALITY NOTICE: This export includes guest personally identifiable information (PII) and internal agency rates. Comply with the Philippine Data Privacy Act of 2012 (RA 10173)."
      />
    </div>
  );
};
