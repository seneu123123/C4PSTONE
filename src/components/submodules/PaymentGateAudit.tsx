import React, { useState } from 'react';
import { 
  Booking, 
  PaymentRecord 
} from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Maximize2, 
  Download, 
  Eye, 
  FileText, 
  X, 
  Check, 
  MessageSquare, 
  CreditCard,
  Building2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { dispatchAppNotification } from '../../utils/notifications';
import { RubberStamp } from '../common/RubberStamp';
import { ActionConfirmModal } from '../common/ActionConfirmModal';

interface PaymentGateAuditProps {
  bookings: Booking[];
  onUpdateBooking?: (booking: Booking) => void;
  onAddPaymentRecord?: (bookingId: string, payment: PaymentRecord) => void;
  adminEmail?: string;
  adminRole?: string;
}

type SortField = 'time' | 'name' | 'ref' | 'amount';
type SortOrder = 'asc' | 'desc';

export const PaymentGateAudit: React.FC<PaymentGateAuditProps> = ({
  bookings,
  onUpdateBooking,
  onAddPaymentRecord,
  adminEmail = 'finance@holidaytravelers.ph',
  adminRole = 'Finance Officer'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'flagged'>('all');
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Lightbox modal state
  const [inspectingBooking, setInspectingBooking] = useState<Booking | null>(null);
  const [flagNote, setFlagNote] = useState('');
  const [isFlagging, setIsFlagging] = useState(false);

  // Anti-Misclick Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    type: 'approve' | 'flag';
    booking: Booking;
    note?: string;
  } | null>(null);

  const promptApprove = (b: Booking) => {
    setConfirmModal({ type: 'approve', booking: b });
  };

  const promptFlag = (b: Booking, note: string) => {
    setConfirmModal({ type: 'flag', booking: b, note });
  };

  const handleExecuteConfirmedAction = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'approve') {
      handleApprovePayment(confirmModal.booking);
    } else if (confirmModal.type === 'flag') {
      handleFlagPayment(confirmModal.booking, confirmModal.note || flagNote);
    }
    setConfirmModal(null);
  };

  // Duplicate Reference Detector (Scam Prevention)
  const referenceCounts = bookings.reduce((acc, b) => {
    const ref = b.customerReferenceNo || b.invoice.payments[0]?.referenceNo;
    if (ref && ref.trim()) {
      const clean = ref.trim().toLowerCase();
      acc[clean] = (acc[clean] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(q) ||
      b.customer.fullName.toLowerCase().includes(q) ||
      b.customer.phone.toLowerCase().includes(q) ||
      (b.customerReferenceNo && b.customerReferenceNo.toLowerCase().includes(q)) ||
      (b.invoice.payments[0]?.referenceNo && b.invoice.payments[0].referenceNo.toLowerCase().includes(q));

    const pmtStatus = b.paymentVerificationStatus || b.invoice.payments[0]?.status || 'Pending Verification';

    if (statusFilter === 'pending') {
      return matchesSearch && (pmtStatus === 'Pending Verification' || b.paymentStatus !== 'Paid');
    }
    if (statusFilter === 'verified') {
      return matchesSearch && (pmtStatus === 'Verified' || b.paymentStatus === 'Paid');
    }
    if (statusFilter === 'flagged') {
      return matchesSearch && (pmtStatus === 'Flagged / Needs Re-upload' || pmtStatus === 'Rejected');
    }

    return matchesSearch;
  });

  // Sort Bookings systematically
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let result = 0;
    if (sortField === 'time') {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      result = timeA - timeB;
    } else if (sortField === 'name') {
      result = a.customer.fullName.localeCompare(b.customer.fullName);
    } else if (sortField === 'ref') {
      result = a.bookingRef.localeCompare(b.bookingRef);
    } else if (sortField === 'amount') {
      result = (a.invoice.amountPaid || 0) - (b.invoice.amountPaid || 0);
    }
    return sortOrder === 'asc' ? result : -result;
  });

  // Action: Approve & Mark Verified
  const handleApprovePayment = (b: Booking) => {
    const updatedPayments = b.invoice.payments.map((p) => ({
      ...p,
      status: 'Verified' as const,
      verifiedBy: adminEmail,
      verifiedAt: new Date().toISOString()
    }));

    const updatedBooking: Booking = {
      ...b,
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      paymentVerificationStatus: 'Verified',
      verifiedBy: adminEmail,
      verifiedAt: new Date().toISOString(),
      verificationNotes: 'Manually audited & verified against merchant bank statement by Finance.',
      invoice: {
        ...b.invoice,
        status: 'Paid',
        payments: updatedPayments
      }
    };

    onUpdateBooking?.(updatedBooking);

    // Dispatch real-time notification
    dispatchAppNotification({
      title: `Payment Verified • ${b.bookingRef}`,
      message: `Finance approved payment for ${b.customer.fullName}. Official voucher unlocked.`,
      type: 'payment_verified',
      bookingRef: b.bookingRef
    });

    if (inspectingBooking?.id === b.id) {
      setInspectingBooking(updatedBooking);
    }
  };

  // Action: Flag for Re-upload
  const handleFlagPayment = (b: Booking, noteText: string) => {
    const note = noteText.trim() || 'Receipt image unclear or reference mismatch. Please submit a clearer photo.';
    
    const updatedPayments = b.invoice.payments.map((p) => ({
      ...p,
      status: 'Flagged / Needs Re-upload' as const,
      auditNote: note,
      verifiedBy: adminEmail,
      verifiedAt: new Date().toISOString()
    }));

    const updatedBooking: Booking = {
      ...b,
      paymentVerificationStatus: 'Flagged / Needs Re-upload',
      verificationNotes: note,
      verifiedBy: adminEmail,
      verifiedAt: new Date().toISOString(),
      invoice: {
        ...b.invoice,
        payments: updatedPayments
      }
    };

    onUpdateBooking?.(updatedBooking);

    // Dispatch notification
    dispatchAppNotification({
      title: `Action Required • ${b.bookingRef}`,
      message: `Finance requested receipt re-upload: "${note}"`,
      type: 'audit_flag',
      bookingRef: b.bookingRef
    });

    setIsFlagging(false);
    setFlagNote('');
    if (inspectingBooking?.id === b.id) {
      setInspectingBooking(updatedBooking);
    }
  };

  // Quick stats
  const pendingCount = bookings.filter(
    (b) => (b.paymentVerificationStatus || b.invoice.payments[0]?.status) === 'Pending Verification'
  ).length;

  const verifiedCount = bookings.filter(
    (b) => (b.paymentVerificationStatus || b.invoice.payments[0]?.status) === 'Verified'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1015] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-sans-body uppercase tracking-[0.2em] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin & Finance Gate</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-ivory font-light">
              Payment Gate & Receipt Audit Desk
            </h2>
            <p className="text-xs text-sand-muted max-w-2xl font-light leading-relaxed">
              Strict manual verification desk to inspect client-uploaded payment receipts, prevent forged GCash/Maya slips, detect duplicate reference numbers, and issue official travel vouchers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="bg-[#070B0E] px-4 py-3 rounded-xl border border-white/10 text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-sand-muted block">
                Pending Audit
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xl font-bold text-amber-400">{pendingCount}</span>
                {pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
            </div>

            <div className="bg-[#070B0E] px-4 py-3 rounded-xl border border-white/10 text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-sand-muted block">
                Verified Cleared
              </span>
              <span className="font-mono text-xl font-bold text-emerald-400 mt-0.5 block">{verifiedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-sand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference #, guest, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070B0E] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-sunset-coral transition-colors"
            />
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'pending', label: `Pending Audit (${pendingCount})` },
              { id: 'verified', label: `Verified (${verifiedCount})` },
              { id: 'flagged', label: 'Flagged / Needs Action' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans-body whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
                    : 'bg-white/5 text-sand-muted hover:text-ivory hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-sand-muted bg-[#070B0E] p-1 rounded-xl border border-white/10">
              <ArrowUpDown className="w-3.5 h-3.5 text-sunset-coral ml-1.5" />
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="bg-transparent text-xs text-ivory focus:outline-none pr-2 cursor-pointer font-sans-body"
              >
                <option value="time" className="bg-[#0B1015]">Time Created</option>
                <option value="name" className="bg-[#0B1015]">Guest Name (Alphabetical)</option>
                <option value="ref" className="bg-[#0B1015]">Booking Reference</option>
                <option value="amount" className="bg-[#0B1015]">Amount Paid</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-ivory text-[10px] font-mono cursor-pointer"
                title="Toggle sort order"
              >
                {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans-body">
            <thead className="bg-[#070B0E] border-b border-white/10 text-sand-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Booking Ref & Date</th>
                <th className="py-3.5 px-5">Lead Guest</th>
                <th className="py-3.5 px-5">Expedition Tour</th>
                <th className="py-3.5 px-5">Settlement (₱)</th>
                <th className="py-3.5 px-5">Client Reference No</th>
                <th className="py-3.5 px-5">Receipt Photo</th>
                <th className="py-3.5 px-5">Audit Status</th>
                <th className="py-3.5 px-5 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sand-muted">
              {sortedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sand-muted space-y-2">
                    <ShieldCheck className="w-8 h-8 mx-auto opacity-30 text-sand-muted" />
                    <p className="text-xs">No matching transactions found in payment gate.</p>
                  </td>
                </tr>
              ) : (
                sortedBookings.map((b) => {
                  const refNo = b.customerReferenceNo || b.invoice.payments[0]?.referenceNo || 'None Provided';
                  const receiptUrl = b.receiptProofUrl || b.invoice.payments[0]?.receiptProofUrl;
                  const status = b.paymentVerificationStatus || b.invoice.payments[0]?.status || 'Pending Verification';
                  
                  // Check if duplicate reference exists (Scam alert)
                  const cleanRef = refNo.trim().toLowerCase();
                  const isDuplicate = cleanRef !== 'none provided' && (referenceCounts[cleanRef] || 0) > 1;

                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition">
                      {/* Booking Ref */}
                      <td className="py-4 px-5 font-mono">
                        <span className="font-bold text-sunset-coral tracking-wider text-sm block">
                          {b.bookingRef}
                        </span>
                        <span className="text-[10px] text-sand-muted">{b.createdAt}</span>
                      </td>

                      {/* Lead Guest */}
                      <td className="py-4 px-5">
                        <div className="font-medium text-ivory text-sm">{b.customer.fullName}</div>
                        <div className="text-[11px] text-sand-muted font-mono">{b.customer.phone}</div>
                        <div className="text-[10px] text-sand-muted">{b.numPax} Passengers</div>
                      </td>

                      {/* Tour Package */}
                      <td className="py-4 px-5">
                        <div className="font-medium text-ivory max-w-[170px] truncate">{b.tourTitle}</div>
                        <div className="text-[10px] text-sand-muted">{b.destination} • {b.travelDate}</div>
                      </td>

                      {/* Settlement Amount */}
                      <td className="py-4 px-5 font-mono tabular-nums">
                        <div className="text-emerald-400 font-bold text-sm">
                          ₱{b.invoice.amountPaid.toLocaleString()}
                        </div>
                        {b.invoice.balanceDue > 0 ? (
                          <div className="text-[10px] text-amber-400">
                            Bal: ₱{b.invoice.balanceDue.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-500/80">Full Settlement</span>
                        )}
                      </td>

                      {/* Customer Claimed Reference No & Duplicate Warning */}
                      <td className="py-4 px-5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-ivory bg-[#070B0E] px-2 py-1 rounded border border-white/10 text-xs font-semibold">
                            {refNo}
                          </span>
                        </div>
                        {isDuplicate && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-400 font-sans-body font-semibold">
                            <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>Duplicate Ref detected ({referenceCounts[cleanRef]} bookings)</span>
                          </div>
                        )}
                      </td>

                      {/* Receipt Photo Preview Thumbnail */}
                      <td className="py-4 px-5">
                        {receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setInspectingBooking(b)}
                            className="group relative flex items-center gap-2 p-1 rounded-xl border border-cyan-500/40 hover:border-cyan-400 bg-white/5 transition-all cursor-pointer"
                            title="Click to zoom receipt"
                          >
                            <img
                              src={receiptUrl}
                              alt="Receipt Proof"
                              className="w-11 h-11 object-cover rounded-lg"
                            />
                            <div className="text-left pr-2">
                              <span className="text-[11px] font-semibold text-cyan-300 group-hover:underline flex items-center gap-1">
                                <span>Inspect</span>
                                <Maximize2 className="w-2.5 h-2.5" />
                              </span>
                              <span className="text-[9px] text-sand-muted block">Photo uploaded</span>
                            </div>
                          </button>
                        ) : (
                          <span className="text-[10px] text-sand-muted italic font-mono">
                            No photo attached
                          </span>
                        )}
                      </td>

                      {/* Audit Status */}
                      <td className="py-4 px-5">
                        {status === 'Verified' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : status === 'Flagged / Needs Re-upload' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Flagged</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            <span>Pending Audit</span>
                          </span>
                        )}
                      </td>

                      {/* Action Gate Buttons */}
                      <td className="py-4 px-5 text-right space-x-2">
                        {status !== 'Verified' && (
                          <button
                            type="button"
                            onClick={() => promptApprove(b)}
                            className="btn-pop btn-shimmer-wrap px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                            title="Confirm that reference matches GCash / Bank ledger"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setInspectingBooking(b);
                            setIsFlagging(false);
                          }}
                          className="btn-pop px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-sand-muted hover:text-ivory text-xs border border-white/10 transition-all cursor-pointer"
                          title="Open inspector / flag re-upload"
                        >
                          Audit Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Inspector Lightbox Modal */}
      {inspectingBooking && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => {
            setInspectingBooking(null);
            setIsFlagging(false);
          }}
        >
          <div 
            className="bg-[#0B1015] border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl relative text-left my-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sunset-coral" />
                  <h3 className="font-serif-display text-xl text-ivory">
                    Receipt Inspection Lightbox • {inspectingBooking.bookingRef}
                  </h3>
                </div>
                <p className="text-xs text-sand-muted mt-0.5">
                  Cross-examine submitted screenshot against GCash / InstaPay merchant logs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInspectingBooking(null);
                  setIsFlagging(false);
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-sand-muted hover:text-ivory flex items-center justify-center cursor-pointer active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Viewer with Stamp */}
              <div className="md:col-span-7 bg-[#070B0E] p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                {inspectingBooking.receiptProofUrl || inspectingBooking.invoice.payments[0]?.receiptProofUrl ? (
                  <div className="space-y-3 w-full text-center relative">
                    <div className="relative inline-block max-w-full">
                      <img
                        src={inspectingBooking.receiptProofUrl || inspectingBooking.invoice.payments[0]?.receiptProofUrl}
                        alt="Uploaded Client Receipt"
                        className="max-h-[360px] w-auto mx-auto object-contain rounded-xl shadow-xl border border-white/10"
                      />
                      {/* Stamp Overlay on Receipt */}
                      <div className="absolute top-2 right-2 pointer-events-none z-10">
                        <RubberStamp
                          type={
                            inspectingBooking.paymentStatus === 'Paid' || inspectingBooking.paymentVerificationStatus === 'Verified'
                              ? 'PAID'
                              : inspectingBooking.paymentVerificationStatus === 'Flagged / Needs Re-upload'
                              ? 'UNPAID'
                              : 'PENDING'
                          }
                          subtext={
                            inspectingBooking.paymentStatus === 'Paid' || inspectingBooking.paymentVerificationStatus === 'Verified'
                              ? 'AUDIT PASSED'
                              : 'MANUAL REVIEW'
                          }
                          size="sm"
                          rotation={-10}
                          className="animate-stamp-drop shadow-2xl"
                        />
                      </div>
                    </div>
                    <div>
                      <a
                        href={inspectingBooking.receiptProofUrl || inspectingBooking.invoice.payments[0]?.receiptProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200"
                      >
                        <span>Open High-Resolution Original</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-sand-muted space-y-2">
                    <AlertCircle className="w-10 h-10 mx-auto text-sand-muted/40" />
                    <p className="text-xs">No receipt photo was uploaded by the customer.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Cross-Examination Details */}
              <div className="md:col-span-5 space-y-4 text-xs font-sans-body">
                <div className="bg-[#070B0E] p-4 rounded-xl border border-white/5 space-y-2.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-sand-muted block">
                    Claimed Transaction Details
                  </span>

                  <div>
                    <span className="text-sand-muted text-[11px] block">Customer Claimed Ref:</span>
                    <span className="text-ivory font-mono font-bold text-sm bg-black/40 px-2 py-0.5 rounded border border-white/10 inline-block mt-0.5">
                      {inspectingBooking.customerReferenceNo || inspectingBooking.invoice.payments[0]?.referenceNo || 'None'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-sand-muted text-[11px] block">Amount Paid:</span>
                      <span className="text-emerald-400 font-mono font-bold text-sm">
                        ₱{inspectingBooking.invoice.amountPaid.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sand-muted text-[11px] block">Balance Due:</span>
                      <span className="text-amber-400 font-mono font-bold text-sm">
                        ₱{inspectingBooking.invoice.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-2">
                    <span className="text-sand-muted text-[11px] block">Lead Passenger:</span>
                    <span className="text-ivory font-medium block">{inspectingBooking.customer.fullName}</span>
                    <span className="text-sand-muted font-mono text-[10px]">{inspectingBooking.customer.phone}</span>
                  </div>
                </div>

                {/* Audit Action Panel */}
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-sand-muted block">
                    Audit Verification Decision
                  </span>

                  <button
                    type="button"
                    onClick={() => promptApprove(inspectingBooking)}
                    className="btn-pop btn-shimmer-wrap w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify Payment</span>
                  </button>

                  {!isFlagging ? (
                    <button
                      type="button"
                      onClick={() => setIsFlagging(true)}
                      className="btn-pop w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-rose-400 text-xs font-medium border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag / Request Clearer Photo</span>
                    </button>
                  ) : (
                    <div className="bg-[#070B0E] p-3 rounded-xl border border-rose-500/30 space-y-2">
                      <label className="text-[11px] text-rose-300 font-medium block">
                        Reason for Flagging:
                      </label>
                      <textarea
                        rows={2}
                        value={flagNote}
                        onChange={(e) => setFlagNote(e.target.value)}
                        placeholder="e.g. Screenshot blurry, reference number doesn't match GCash balance..."
                        className="w-full p-2 bg-[#0B1015] border border-white/10 rounded-lg text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-rose-500 font-sans-body"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setIsFlagging(false)}
                          className="px-2.5 py-1 text-xs text-sand-muted hover:text-ivory cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => promptFlag(inspectingBooking, flagNote)}
                          className="btn-pop px-3.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold active:scale-95 cursor-pointer shadow-md shadow-rose-600/25"
                        >
                          Send Flag Alert
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Safeguard Modal for Financial Decisions */}
      {confirmModal && (
        <ActionConfirmModal
          isOpen={true}
          onClose={() => setConfirmModal(null)}
          onConfirm={handleExecuteConfirmedAction}
          title={
            confirmModal.type === 'approve'
              ? 'Approve & Release Official Booking?'
              : 'Flag Receipt for Customer Re-upload?'
          }
          message={
            confirmModal.type === 'approve'
              ? 'Are you certain you want to approve this transaction? This updates the financial ledger, changes the stamp to PAID IN FULL, unlocks the e-voucher with confirmed status, and notifies the passenger.'
              : 'This will notify the customer that their submitted proof cannot be reconciled, requesting them to submit a clearer deposit slip.'
          }
          details={[
            { label: 'Booking Reference', value: confirmModal.booking.bookingRef },
            { label: 'Passenger Name', value: confirmModal.booking.customer.fullName },
            { label: 'Amount Paid', value: `₱${confirmModal.booking.invoice.amountPaid.toLocaleString()}` },
            {
              label: 'Claimed Ref No.',
              value: confirmModal.booking.customerReferenceNo || confirmModal.booking.invoice.payments[0]?.referenceNo || 'None'
            }
          ]}
          confirmText={
            confirmModal.type === 'approve' ? 'Yes, Approve Payment' : 'Yes, Flag Receipt'
          }
          cancelText="No, Cancel Decision"
          variant={confirmModal.type === 'approve' ? 'success' : 'danger'}
          warningNote={
            confirmModal.type === 'approve'
              ? 'Double-check that the reference number appears in your GCash / InstaPay merchant statement.'
              : 'Please make sure you have double-checked the account number before rejecting.'
          }
        />
      )}
    </div>
  );
};
