import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { Booking, AppSettings } from '../../types';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Clock, 
  AlertCircle,
  FileCheck,
  Compass,
  Plane,
  Hotel,
  Car
} from 'lucide-react';
import { RubberStamp } from '../common/RubberStamp';

interface InPersonReceiptModalProps {
  booking: Booking;
  appSettings?: AppSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const InPersonReceiptModal: React.FC<InPersonReceiptModalProps> = ({
  booking,
  appSettings,
  isOpen,
  onClose
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!booking) return;
    try {
      const verifyPayload = JSON.stringify({
        ref: booking.bookingRef,
        lead: booking.customer.fullName,
        pax: booking.numPax,
        tour: booking.tourTitle,
        date: booking.travelDate,
        paid: booking.invoice.amountPaid,
        status: booking.paymentStatus,
        agency: 'Holiday Travelers Inc. - Pasig City'
      });

      QRCode.toDataURL(verifyPayload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 220,
        color: { dark: '#0A0F14', light: '#FFFFFF' }
      })
        .then((url) => {
          if (url) setQrCodeUrl(url);
        })
        .catch((err) => {
          console.warn('QR Code generation fallback:', err);
        });
    } catch (e) {
      console.warn('Failed to encode QR payload:', e);
    }
  }, [booking]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const agency = appSettings?.agency || {
    companyName: 'Holiday Travelers Inc.',
    address: 'Unit 1101 City & Land Mega Plaza Inc., ADB Ave., Corner Garnet Rd., Ortigas Center, Pasig City, Philippines, 1605',
    phone: '0916 525 3517',
    email: 'holidaytravelersinc2022@gmail.com',
    accreditationNo: 'DOT-ACCR-NCR-2026'
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Printing unavailable in iframe sandbox:', e);
    }
  };

  const isApproved = booking.paymentStatus === 'Paid' || (booking.paymentStatus === 'Partial' && booking.invoice.amountPaid > 0);

  const modalNode = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#090E14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:text-black print:bg-white cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0D141C] border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-sand-muted">
            <FileCheck className="w-4 h-4 text-sunset-coral" />
            <span>Official Electronic Voucher & In-Person Receipt</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-pop btn-shimmer-wrap inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sunset-coral text-white text-xs font-semibold hover:bg-sunset-coral/90 transition-all cursor-pointer shadow-lg shadow-sunset-coral/25 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sand-muted hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper Body */}
        <div className="p-6 sm:p-10 space-y-8 bg-[#090E14] print:bg-white print:text-black text-ivory print:space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/10 print:border-slate-300 pb-6 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sunset-coral/15 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral print:bg-slate-100 print:text-black print:border-black">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="font-serif-display text-2xl font-bold tracking-wide text-ivory print:text-black">
                    {agency.companyName}
                  </h1>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-sunset-coral print:text-slate-600 block">
                    Travel & Tours Operations
                  </span>
                </div>
              </div>
              <p className="text-xs text-sand-muted print:text-slate-600 max-w-md leading-relaxed font-light">
                {agency.address}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-sand-muted print:text-slate-600 font-mono">
                <span>Tel: {agency.phone}</span>
                <span>•</span>
                <span>Email: {agency.email}</span>
                <span>•</span>
                <span className="text-sunset-coral print:text-black font-semibold">{agency.accreditationNo}</span>
              </div>
            </div>

            {/* Official Status & Prominent Stamp */}
            <div className="text-right sm:self-center flex flex-col items-start sm:items-end gap-2 shrink-0">
              <RubberStamp
                type={
                  booking.paymentStatus === 'Paid'
                    ? 'PAID'
                    : booking.paymentStatus === 'Partial' && booking.invoice.amountPaid > 0
                    ? 'PARTIAL'
                    : booking.paymentVerificationStatus === 'Pending Verification'
                    ? 'PENDING'
                    : 'UNPAID'
                }
                verificationCode={booking.bookingRef}
                size="md"
                rotation={-8}
                className="animate-stamp-drop"
              />
              <span className="text-[10px] text-sand-muted print:text-slate-500 font-mono">
                Booking ID: {booking.bookingRef}
              </span>
            </div>
          </div>

          {/* Core Voucher Metadata & QR Authentication Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#070B0E] print:bg-slate-50 p-5 rounded-2xl border border-white/10 print:border-slate-300">
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-sand-muted print:text-slate-500 block">
                  Expedition / Tour Package
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl text-ivory print:text-black font-medium">
                  {booking.tourTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-sand-muted print:text-slate-500 block text-[11px]">Travel Date</span>
                  <span className="font-mono text-ivory print:text-black font-medium flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-sunset-coral print:text-black" />
                    {booking.travelDate}
                  </span>
                </div>
                <div>
                  <span className="text-sand-muted print:text-slate-500 block text-[11px]">Manifested Guests</span>
                  <span className="font-mono text-ivory print:text-black font-medium flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-sunset-coral print:text-black" />
                    {booking.numPax} Passengers
                  </span>
                </div>
                <div>
                  <span className="text-sand-muted print:text-slate-500 block text-[11px]">Lead Passenger</span>
                  <span className="font-medium text-ivory print:text-black">{booking.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-sand-muted print:text-slate-500 block text-[11px]">Contact Hotline</span>
                  <span className="font-mono text-ivory print:text-black">{booking.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* QR Verification Authenticator for Staff */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-white print:border print:border-slate-300">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Voucher Verification QR"
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-100 animate-pulse rounded" />
              )}
              <span className="text-[9px] font-mono text-slate-800 text-center font-bold tracking-wider mt-1 uppercase">
                Staff Scan & Authenticate
              </span>
            </div>
          </div>

          {/* Flight, Hotel & Transport Logistics Allocations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-ivory print:text-black font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sunset-coral print:text-black" />
                <span>Flight, Hotel & Shuttle Logistics Status</span>
              </span>
              <span className="text-[10px] text-sand-muted print:text-slate-500 font-normal">
                Real-Time Operations Sync
              </span>
            </h4>

            {/* In-Process Logistics Alert Banner on Receipt */}
            {(!booking.flightReservation || booking.flightReservation.status !== 'Confirmed' ||
              !booking.hotelReservation || booking.hotelReservation.status !== 'Confirmed' ||
              !booking.transportReservation || (booking.transportReservation.status !== 'Dispatched' && booking.transportReservation.status !== 'Scheduled')) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 print:text-slate-800 print:bg-slate-100 print:border-slate-400 flex items-start gap-2.5 text-xs">
                <Clock className="w-4 h-4 text-amber-400 print:text-black shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="font-bold font-sans-body">Logistics In Process (Pending Admin Confirmation):</span>
                  <p className="text-[11px] text-sand-muted print:text-slate-600 leading-relaxed font-sans-body">
                    Your flight tickets, hotel vouchers, and private shuttle allocations are currently being confirmed by the operations dispatch team. You will be automatically notified as each item is booked!
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Flight Box */}
              {(() => {
                const isFlightConfirmed = booking.flightReservation && booking.flightReservation.status === 'Confirmed' && !booking.flightReservation.airline.toLowerCase().includes('follow');
                return (
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isFlightConfirmed 
                      ? 'bg-[#070B0E] print:bg-slate-50 border-emerald-500/30 print:border-slate-300' 
                      : 'bg-amber-500/5 print:bg-slate-50 border-amber-500/25 print:border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="flex items-center gap-1 font-semibold text-sand-muted print:text-slate-700">
                        <Plane className="w-3.5 h-3.5 text-sky-400 print:text-black" />
                        <span>Flight / Airline</span>
                      </span>
                      <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isFlightConfirmed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}>
                        {isFlightConfirmed ? 'Confirmed' : 'In Process'}
                      </span>
                    </div>
                    <div className="font-bold text-ivory print:text-black text-xs">
                      {booking.flightReservation?.airline || 'Airline In Confirmation'}
                    </div>
                    <div className="text-[11px] text-sand-muted print:text-slate-600 font-mono">
                      Flight: {booking.flightReservation?.flightNumber || 'TBA (In Process)'}
                    </div>
                    <div className="text-[10px] text-sand-muted print:text-slate-500 font-mono">
                      PNR: {booking.flightReservation?.pnrCode || 'Processing...'}
                    </div>
                  </div>
                );
              })()}

              {/* Hotel Box */}
              {(() => {
                const isHotelConfirmed = booking.hotelReservation && booking.hotelReservation.status === 'Confirmed' && !booking.hotelReservation.hotelName.toLowerCase().includes('follow');
                return (
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isHotelConfirmed 
                      ? 'bg-[#070B0E] print:bg-slate-50 border-cyan-500/30 print:border-slate-300' 
                      : 'bg-amber-500/5 print:bg-slate-50 border-amber-500/25 print:border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="flex items-center gap-1 font-semibold text-sand-muted print:text-slate-700">
                        <Hotel className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                        <span>Hotel / Resort</span>
                      </span>
                      <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isHotelConfirmed
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}>
                        {isHotelConfirmed ? 'Confirmed' : 'In Process'}
                      </span>
                    </div>
                    <div className="font-bold text-ivory print:text-black text-xs">
                      {booking.hotelReservation?.hotelName || 'Resort In Confirmation'}
                    </div>
                    <div className="text-[11px] text-sand-muted print:text-slate-600">
                      Room: {booking.hotelReservation?.roomType || 'Standard Deluxe (In Process)'}
                    </div>
                    <div className="text-[10px] text-sand-muted print:text-slate-500 font-mono">
                      Voucher: {booking.hotelReservation?.voucherCode || `HTL-${booking.bookingRef}`}
                    </div>
                  </div>
                );
              })()}

              {/* Shuttle Box */}
              {(() => {
                const isTransportConfirmed = booking.transportReservation && (booking.transportReservation.status === 'Dispatched' || booking.transportReservation.status === 'Scheduled') && !booking.transportReservation.vehicleType.toLowerCase().includes('follow');
                return (
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isTransportConfirmed 
                      ? 'bg-[#070B0E] print:bg-slate-50 border-blue-500/30 print:border-slate-300' 
                      : 'bg-amber-500/5 print:bg-slate-50 border-amber-500/25 print:border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="flex items-center gap-1 font-semibold text-sand-muted print:text-slate-700">
                        <Car className="w-3.5 h-3.5 text-blue-400 print:text-black" />
                        <span>Shuttle Transfer</span>
                      </span>
                      <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isTransportConfirmed
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}>
                        {isTransportConfirmed ? 'Dispatched' : 'In Process'}
                      </span>
                    </div>
                    <div className="font-bold text-ivory print:text-black text-xs">
                      {booking.transportReservation?.vehicleType || 'Shuttle In Confirmation'}
                    </div>
                    <div className="text-[11px] text-sand-muted print:text-slate-600">
                      Driver: {booking.transportReservation?.driverName || 'Driver TBA (In Process)'}
                    </div>
                    <div className="text-[10px] text-sand-muted print:text-slate-500 font-mono">
                      Plate: {booking.transportReservation?.plateNumber || 'Processing...'}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Passenger Roster List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-ivory print:text-black font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sunset-coral print:text-black" />
              <span>Registered Passengers Manifest Roster</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-white/10 print:border-slate-300">
                <thead>
                  <tr className="bg-white/5 print:bg-slate-100 text-sand-muted print:text-black border-b border-white/10 print:border-slate-300 text-[11px] font-mono">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Passenger Full Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Dietary / Life Vest Requirements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  {booking.passengers && booking.passengers.length > 0 ? (
                    booking.passengers.map((p, idx) => (
                      <tr key={p.id || idx}>
                        <td className="p-2.5 font-mono text-sand-muted print:text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-medium text-ivory print:text-black">{p.fullName}</td>
                        <td className="p-2.5 text-sand-muted print:text-slate-600 capitalize">{p.passengerType || 'Adult'}</td>
                        <td className="p-2.5 text-sand-muted print:text-slate-600">{p.dietaryHealthRestrictions || 'None specified'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-2.5 font-mono text-sand-muted print:text-slate-500">1</td>
                      <td className="p-2.5 font-medium text-ivory print:text-black">{booking.customer.fullName}</td>
                      <td className="p-2.5 text-sand-muted print:text-slate-600">Lead Passenger</td>
                      <td className="p-2.5 text-sand-muted print:text-slate-600">Standard</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Financial Ledger */}
          <div className="bg-[#070B0E] print:bg-slate-50 p-5 rounded-2xl border border-white/10 print:border-slate-300 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-ivory print:text-black font-semibold">
              Financial Breakdown & Settlement Summary
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-sand-muted print:text-slate-600">
                <span>Total Tour Cost ({booking.numPax} Guests):</span>
                <span className="font-mono text-ivory print:text-black">₱{booking.totalPrice.toLocaleString()}</span>
              </div>

              {booking.appliedPromoCode && (
                <div className="flex justify-between text-xs text-emerald-400 print:text-emerald-700">
                  <span className="font-mono">Promo Code ({booking.appliedPromoCode}):</span>
                  <span className="font-mono font-medium">-₱{(booking.discountAmount || 0).toLocaleString()}</span>
                </div>
              )}

              {booking.invoice?.payments && booking.invoice.payments.length > 0 && (
                <div className="space-y-1 pt-1">
                  {booking.invoice.payments.map((pm, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-sand-muted print:text-slate-600 pl-2 border-l border-sunset-coral/50">
                      <span>{pm.method} (Ref: {pm.referenceNo || 'Direct Transfer'})</span>
                      <span className="font-mono text-emerald-400 print:text-emerald-700">
                        ₱{pm.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-white/10 print:border-slate-300 pt-2 flex justify-between font-bold text-sm">
                <span className="text-ivory print:text-black">Total Paid:</span>
                <span className="font-mono text-emerald-400 print:text-emerald-700">
                  ₱{(booking.invoice?.amountPaid || 0).toLocaleString()}
                </span>
              </div>

              {booking.invoice?.balanceDue > 0 && (
                <div className="flex justify-between text-xs text-amber-400 print:text-amber-700 font-medium">
                  <span>Balance Due Upon Tour Briefing:</span>
                  <span className="font-mono">₱{booking.invoice.balanceDue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* In-Person Verification & Instructions Notice */}
          <div className="p-4 rounded-xl bg-sunset-coral/10 print:bg-slate-100 border border-sunset-coral/30 print:border-slate-300 text-xs text-sand-muted print:text-slate-700 space-y-1">
            <p className="font-bold text-ivory print:text-black flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sunset-coral print:text-black" />
              <span>In-Person Presentation Instructions:</span>
            </p>
            <p className="leading-relaxed font-light">
              Please present this electronic receipt or printed voucher at our <strong>Ortigas Center Main Office (Unit 1101 City & Land Mega Plaza, Pasig City)</strong> or directly to our lead tour guide at the airport terminal meeting bay upon arrival.
            </p>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-4 border-t border-white/10 print:border-slate-300 flex justify-between items-center text-[10px] font-mono text-white/40 print:text-slate-500">
            <span>Generated electronically by Holiday Travelers Reservation System</span>
            <span>Doc ID: {booking.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalNode, document.body);
};
