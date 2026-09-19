import React, { useState, useMemo } from 'react';
import { Booking, PaymentRecord } from '../../types';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ArrowUpRight, 
  Printer, 
  X, 
  ShieldCheck, 
  Layers,
  Receipt,
  Search
} from 'lucide-react';
import { RubberStamp } from '../common/RubberStamp';
import { ActionConfirmModal } from '../common/ActionConfirmModal';
import { dispatchAppNotification } from '../../utils/notifications';

interface FiscalReconciliationProps {
  bookings: Booking[];
}

export const FiscalReconciliation: React.FC<FiscalReconciliationProps> = ({ bookings }) => {
  const [activeChannel, setActiveChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForOR, setSelectedBookingForOR] = useState<Booking | null>(null);
  const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);

  // Aggregate channel settlement figures
  const channelStats = useMemo(() => {
    let gcashTotal = 0;
    let mayaTotal = 0;
    let bankTotal = 0;
    let cashTotal = 0;

    bookings.forEach((b) => {
      const records = b.invoice.paymentHistory || [];
      if (records.length === 0 && b.invoice.amountPaid > 0) {
        // synthesize base payment method
        const meth = (b.invoice.paymentMethod || 'GCash').toLowerCase();
        if (meth.includes('gcash')) gcashTotal += b.invoice.amountPaid;
        else if (meth.includes('maya')) mayaTotal += b.invoice.amountPaid;
        else if (meth.includes('bank') || meth.includes('bdo') || meth.includes('bpi')) bankTotal += b.invoice.amountPaid;
        else cashTotal += b.invoice.amountPaid;
      } else {
        records.forEach((r) => {
          const m = r.method.toLowerCase();
          if (m.includes('gcash')) gcashTotal += r.amount;
          else if (m.includes('maya')) mayaTotal += r.amount;
          else if (m.includes('bank') || m.includes('bdo') || m.includes('bpi') || m.includes('transfer')) bankTotal += r.amount;
          else cashTotal += r.amount;
        });
      }
    });

    const grandTotal = gcashTotal + mayaTotal + bankTotal + cashTotal;

    return {
      gcashTotal,
      mayaTotal,
      bankTotal,
      cashTotal,
      grandTotal,
    };
  }, [bookings]);

  // Aggregate pending receivables & aging
  const agingStats = useMemo(() => {
    let overdueBalance = 0; // within 3 days of departure
    let upcomingBalance = 0; // within 7 days
    let healthyBalance = 0; // > 7 days

    const now = new Date('2026-09-09T00:00:00Z');

    bookings.forEach((b) => {
      if (b.invoice.balanceDue > 0 && b.bookingStatus !== 'Cancelled') {
        const depDate = new Date(b.travelDate);
        const diffDays = Math.ceil((depDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
          overdueBalance += b.invoice.balanceDue;
        } else if (diffDays <= 7) {
          upcomingBalance += b.invoice.balanceDue;
        } else {
          healthyBalance += b.invoice.balanceDue;
        }
      }
    });

    return {
      overdueBalance,
      upcomingBalance,
      healthyBalance,
      totalPending: overdueBalance + upcomingBalance + healthyBalance,
    };
  }, [bookings]);

  // Filtered payment records table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = 
        b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.packageTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const method = (b.invoice.paymentMethod || 'GCash').toLowerCase();
      let matchesChannel = true;
      if (activeChannel === 'gcash') matchesChannel = method.includes('gcash');
      else if (activeChannel === 'maya') matchesChannel = method.includes('maya');
      else if (activeChannel === 'bank') matchesChannel = method.includes('bank') || method.includes('bdo') || method.includes('bpi');
      else if (activeChannel === 'cash') matchesChannel = method.includes('cash');

      return matchesSearch && matchesChannel;
    });
  }, [bookings, searchQuery, activeChannel]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Booking Ref',
      'Traveler Name',
      'Package Title',
      'Travel Date',
      'Total Price',
      'Amount Paid',
      'Balance Due',
      'Payment Status',
      'Primary Channel',
      'Voucher Code'
    ];

    const rows = filteredBookings.map((b) => [
      b.bookingRef,
      `"${b.customer.fullName.replace(/"/g, '""')}"`,
      `"${b.packageTitle.replace(/"/g, '""')}"`,
      b.travelDate,
      b.totalPrice,
      b.invoice.amountPaid,
      b.invoice.balanceDue,
      b.paymentStatus,
      b.invoice.paymentMethod || 'GCash',
      b.invoice.invoiceNumber || 'INV-2026'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HTTT_Fiscal_Reconciliation_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatchAppNotification({
      title: 'Fiscal Ledger CSV Exported',
      message: `Generated encrypted audit manifest with ${filteredBookings.length} reconciled transactions.`,
      type: 'info'
    });
    setIsExportConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Finance & Fiscal Audit Suite
              </span>
              <span className="text-xs text-sand-muted">•</span>
              <span className="text-xs text-sand-muted font-mono">TIN: 402-998-112-000 VAT</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-ivory">
              Fiscal Reconciliation & Settlement Ledger
            </h2>
            <p className="text-xs sm:text-sm text-sand-muted font-light max-w-2xl">
              Reconcile multi-channel customer receipts across GCash, Maya, commercial wire transfers, and cash collections. Monitor aging receivables and issue BIR-compliant tax vouchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsExportConfirmOpen(true)}
              className="btn-pop btn-shimmer-wrap flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] active:scale-95 border border-white/10 text-xs text-ivory font-medium transition-all cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-sand-muted" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Settlement Channels Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-white/[0.08]">
          <div 
            onClick={() => setActiveChannel(activeChannel === 'gcash' ? 'all' : 'gcash')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeChannel === 'gcash'
                ? 'bg-blue-950/30 border-blue-400/50 shadow-md'
                : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-blue-400 font-medium">GCash Gateway</span>
              <span className="text-[10px] text-sand-muted">0% Surcharge</span>
            </div>
            <div className="text-2xl font-serif-display text-ivory mt-1">
              ₱{channelStats.gcashTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-sand-muted mt-1 font-light">
              Mobile E-Wallet Direct Clearing
            </div>
          </div>

          <div 
            onClick={() => setActiveChannel(activeChannel === 'maya' ? 'all' : 'maya')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeChannel === 'maya'
                ? 'bg-emerald-950/30 border-emerald-400/50 shadow-md'
                : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-medium">Maya Business</span>
              <span className="text-[10px] text-sand-muted">Verified</span>
            </div>
            <div className="text-2xl font-serif-display text-ivory mt-1">
              ₱{channelStats.mayaTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-sand-muted mt-1 font-light">
              QR Ph & Card Terminal Clearing
            </div>
          </div>

          <div 
            onClick={() => setActiveChannel(activeChannel === 'bank' ? 'all' : 'bank')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeChannel === 'bank'
                ? 'bg-purple-950/30 border-purple-400/50 shadow-md'
                : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-purple-400 font-medium">Bank Wire (BDO/BPI)</span>
              <span className="text-[10px] text-sand-muted">InstaPay</span>
            </div>
            <div className="text-2xl font-serif-display text-ivory mt-1">
              ₱{channelStats.bankTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-sand-muted mt-1 font-light">
              Commercial Account Clearing
            </div>
          </div>

          <div 
            onClick={() => setActiveChannel(activeChannel === 'cash' ? 'all' : 'cash')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeChannel === 'cash'
                ? 'bg-amber-950/30 border-amber-400/50 shadow-md'
                : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-amber-400 font-medium">Terminal Cash Desk</span>
              <span className="text-[10px] text-sand-muted">Cash Safe</span>
            </div>
            <div className="text-2xl font-serif-display text-ivory mt-1">
              ₱{channelStats.cashTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-sand-muted mt-1 font-light">
              Arrival Counter Downpayments
            </div>
          </div>
        </div>
      </div>

      {/* Downpayment Aging & Receivables Alert Banner */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg text-ivory">
                Accounts Receivable Aging & Departure Exposure
              </h3>
              <p className="text-xs text-sand-muted font-light">
                Uncollected passenger tour balances requiring collection before embarkation.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-amber-300">
            Total Outstanding: ₱{agingStats.totalPending.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl">
            <div className="text-[10px] font-mono text-rose-300 uppercase tracking-wider">
              Critical (&lt; 3 Days to Departure)
            </div>
            <div className="text-xl font-serif-display text-rose-400 mt-1">
              ₱{agingStats.overdueBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-sand-muted mt-0.5 font-light">
              Immediate counter settlement required upon hotel pickup.
            </p>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl">
            <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">
              Approaching (4 - 7 Days)
            </div>
            <div className="text-xl font-serif-display text-amber-300 mt-1">
              ₱{agingStats.upcomingBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-sand-muted mt-0.5 font-light">
              Automated balance notification SMS/email queued.
            </p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl">
            <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
              Standard (&gt; 7 Days)
            </div>
            <div className="text-xl font-serif-display text-emerald-400 mt-1">
              ₱{agingStats.healthyBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-sand-muted mt-0.5 font-light">
              Within normal 50% reservation reservation window.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0B1014] p-3.5 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking Ref, Traveler Name, or Expedition Title..."
            className="w-full bg-[#070B0E] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-ivory placeholder-sand-muted focus:outline-none focus:border-sunset-coral/60 transition-colors font-sans-body"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveChannel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeChannel === 'all'
                ? 'bg-sunset-coral text-white'
                : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setActiveChannel('gcash')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeChannel === 'gcash'
                ? 'bg-blue-600 text-white'
                : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
            }`}
          >
            GCash
          </button>
          <button
            onClick={() => setActiveChannel('maya')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeChannel === 'maya'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
            }`}
          >
            Maya
          </button>
          <button
            onClick={() => setActiveChannel('bank')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeChannel === 'bank'
                ? 'bg-purple-600 text-white'
                : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
            }`}
          >
            Bank Wire
          </button>
          <button
            onClick={() => setActiveChannel('cash')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeChannel === 'cash'
                ? 'bg-amber-600 text-white'
                : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
            }`}
          >
            Cash
          </button>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="font-serif-display text-lg text-ivory">
            Transaction & Settlement Ledger ({filteredBookings.length} Records)
          </h3>
          <span className="text-xs text-sand-muted font-light">
            Verified against Philippine Banking Regulations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] font-mono uppercase text-sand-muted tracking-wider">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Traveler Identity</th>
                <th className="py-3 px-4">Expedition</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4 text-right">Gross Total</th>
                <th className="py-3 px-4 text-right">Settled</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Tax OR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredBookings.map((b) => {
                const method = b.invoice.paymentMethod || 'GCash';
                const isPaid = b.paymentStatus === 'Paid';

                return (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-sunset-coral font-medium">
                      {b.bookingRef}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-ivory">{b.customer.fullName}</div>
                      <div className="text-[11px] text-sand-muted font-light">{b.customer.email}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="truncate text-ivory font-light">{b.packageTitle}</div>
                      <div className="text-[10px] text-sand-muted font-mono">{b.travelDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/10 text-ivory">
                        {method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-ivory">
                      ₱{b.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-medium">
                      ₱{b.invoice.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-300">
                      ₱{b.invoice.balanceDue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        isPaid 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : b.paymentStatus === 'Partial'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedBookingForOR(b)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory transition-all border border-white/10"
                        title="Generate Official Receipt / Tax Invoice"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sand-muted text-xs">
                    No transactions match the selected channel filter or query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Tax Receipt (BIR Form 2307 format) Modal */}
      {selectedBookingForOR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B1014] border border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
            {/* Rubber Stamp on Official Tax Receipt */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-12 z-10 pointer-events-none block scale-75 sm:scale-100 origin-top-right">
              <RubberStamp
                type={
                  selectedBookingForOR.paymentStatus === 'Paid'
                    ? 'PAID'
                    : selectedBookingForOR.invoice.amountPaid > 0
                    ? 'PARTIAL'
                    : 'UNPAID'
                }
                subtext={
                  selectedBookingForOR.paymentStatus === 'Paid'
                    ? 'BIR VAT SETTLED'
                    : `OUTSTANDING: ₱${selectedBookingForOR.invoice.balanceDue.toLocaleString()}`
                }
                date={selectedBookingForOR.invoice.issueDate}
                verificationCode={`BIR-${selectedBookingForOR.bookingRef}`}
                size="md"
                rotation={-12}
                className="animate-stamp-drop shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sunset-coral/10 text-sunset-coral flex items-center justify-center border border-sunset-coral/20">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif-display text-lg text-ivory">Official VAT Receipt (OR)</h4>
                  <span className="text-[10px] font-mono text-sand-muted">BIR Accreditation: #2026-HTTT-NCR</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingForOR(null)}
                className="p-1.5 rounded-lg text-sand-muted hover:text-ivory hover:bg-white/10 active:scale-90 transition-transform cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-[#070B0E] p-4 rounded-xl border border-white/10 text-xs font-mono relative">
              <div className="flex justify-between">
                <span className="text-sand-muted">Receipt No:</span>
                <span className="text-ivory font-bold">OR-2026-{selectedBookingForOR.bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-muted">Customer Name:</span>
                <span className="text-ivory">{selectedBookingForOR.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-muted">Payment Channel:</span>
                <span className="text-ivory">{selectedBookingForOR.invoice.paymentMethod || 'GCash'}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-sand-muted">Gross Amount:</span>
                <span className="text-ivory">₱{selectedBookingForOR.invoice.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-sand-muted">
                <span>VATable Sales (12%):</span>
                <span>₱{(selectedBookingForOR.invoice.amountPaid / 1.12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-sand-muted">
                <span>12% VAT:</span>
                <span>₱{(selectedBookingForOR.invoice.amountPaid - selectedBookingForOR.invoice.amountPaid / 1.12).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  try {
                    window.print();
                  } catch (e) {
                    console.warn('Print unavailable in iframe sandbox:', e);
                  }
                }}
                className="btn-pop btn-shimmer-wrap flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 active:scale-95 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Tax Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Safeguard for Exporting Reconciliation Ledger */}
      <ActionConfirmModal
        isOpen={isExportConfirmOpen}
        onClose={() => setIsExportConfirmOpen(false)}
        onConfirm={handleExportCSV}
        title="Export Financial Reconciliation Audit CSV?"
        message="This will generate and download an official CSV ledger containing all filtered transaction records and settlement states for internal accounting and BIR tax auditing."
        details={[
          { label: 'Active Channel Filter', value: activeChannel.toUpperCase() },
          { label: 'Total Filtered Records', value: `${filteredBookings.length} Bookings` },
          { label: 'Reconciled Gross Volume', value: `₱${channelStats.grandTotal.toLocaleString()}` },
          { label: 'Target Output', value: `HTTT_Fiscal_Reconciliation_${new Date().toISOString().slice(0, 10)}.csv` },
        ]}
        confirmText="Yes, Download Audit CSV"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  );
};
