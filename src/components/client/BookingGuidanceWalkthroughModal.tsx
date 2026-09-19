import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Ticket, 
  Printer, 
  Clock, 
  X,
  Compass
} from 'lucide-react';
import { Booking } from '../../types';

interface BookingGuidanceWalkthroughModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToTracker: (bookingRef: string) => void;
  onPrintManifest?: () => void;
}

export const BookingGuidanceWalkthroughModal: React.FC<BookingGuidanceWalkthroughModalProps> = ({
  booking,
  isOpen,
  onClose,
  onGoToTracker,
  onPrintManifest
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedViber, setCopiedViber] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.bookingRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleCopyViberSummary = () => {
    const summaryText = `[HOLIDAY TRAVELERS INC. - RESERVATION CONFIRMATION]
Booking Ref: ${booking.bookingRef}
Lead Passenger: ${booking.customer.fullName}
Tour Package: ${booking.tourTitle}
Destination: ${booking.destination}
Travel Date: ${booking.travelDate}
Pax Count: ${booking.numPax} Persons
Amount Paid: ₱${booking.invoice.amountPaid.toLocaleString()}
Payment Ref: ${booking.customerReferenceNo || booking.invoice.payments[0]?.referenceNo || 'Pending'}
Status: Pending Manual Finance Audit

Unit 1101 City & Land Mega Plaza, ADB Ave. cor. Garnet Rd., Ortigas Center, Pasig City
Phone: 0916 525 3517 | Email: holidaytravelersinc2022@gmail.com`;

    navigator.clipboard.writeText(summaryText);
    setCopiedViber(true);
    setTimeout(() => setCopiedViber(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-[#0B1015] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left my-8 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-sand-muted hover:text-ivory flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close walkthrough"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with celebratory badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-sans-body uppercase tracking-[0.2em] text-sunset-coral font-bold block">
            Reservation Registered & Manifest Created
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-ivory">
            Mabuhay! Your Voyage is Reserved
          </h2>
          <p className="text-xs text-sand-muted max-w-md mx-auto">
            Please review where and how your updates will appear as our operations team verifies your details.
          </p>
        </div>

        {/* Highlight Step 1: Booking Reference */}
        <div className="bg-[#070B0E] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sand-muted uppercase tracking-wider">
              Step 1 • Your Official Booking Reference
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30">
              Systematic Code
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1015] p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-sunset-coral shrink-0" />
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-ivory">
                {booking.bookingRef}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-sunset-coral/20 hover:bg-sunset-coral/30 active:scale-95 text-sunset-coral text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-sunset-coral/30 cursor-pointer"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Code Copied!' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyViberSummary}
                className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-sand-muted hover:text-ivory text-xs font-medium flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                title="Copy formatted summary to paste into Viber or Facebook Messenger"
              >
                {copiedViber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copiedViber ? 'Viber Copied' : 'Viber/FB Snippet'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Step 2: Where to Look for Updates */}
        <div className="bg-[#070B0E] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Step 2 • Where to Look for Real-Time Updates</span>
          </div>
          <p className="text-xs text-sand-muted leading-relaxed font-sans-body">
            You can check your reservation status, travel guide assignments, and hotel vouchers at any time by clicking the <strong className="text-ivory">"Check Tickets"</strong> tab on the top menu bar.
          </p>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-center justify-between">
            <span className="text-[11px]">Your code <strong className="font-mono">{booking.bookingRef}</strong> will be auto-suggested on this browser!</span>
          </div>
        </div>

        {/* Highlight Step 3: Anti-Scam & Manual Audit Notice */}
        <div className="bg-[#070B0E] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Step 3 • Anti-Fraud & Manual Ledger Cross-Check</span>
          </div>
          <p className="text-xs text-sand-muted leading-relaxed">
            To combat fraudulent receipts, our Finance Officer in Pasig City manually verifies your payment slip against our official bank/GCash merchant statement. Your booking status will remain <span className="text-amber-300 font-medium">"Pending Verification"</span> until cleared.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/10">
          {onPrintManifest && (
            <button
              type="button"
              onClick={onPrintManifest}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-sand-muted hover:text-ivory font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Manifest</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToTracker(booking.bookingRef);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sunset-coral hover:bg-[#ff765b] active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sunset-coral/25 transition-all cursor-pointer"
          >
            <span>Go to Check Tickets Tab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
