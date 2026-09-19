import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, Passenger, BookingStatus } from '../../types';
import { RubberStamp } from '../common/RubberStamp';
import { ActionConfirmModal } from '../common/ActionConfirmModal';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plane,
  Hotel, 
  Car, 
  FileText, 
  HeartPulse, 
  Sparkles,
  Printer
} from 'lucide-react';

interface BookingDetailDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenManifest?: () => void;
  onUpdateStatus?: (bookingId: string, status: BookingStatus) => void;
  onUpdateBooking?: (updatedBooking: Booking) => void;
  onUpdatePassengerStatus?: (bookingId: string, passengerIndex: number, status: 'boarded' | 'pending' | 'noshow') => void;
}

export const BookingDetailDrawer: React.FC<BookingDetailDrawerProps> = ({
  booking,
  isOpen,
  onClose,
  onOpenManifest,
  onUpdateStatus,
  onUpdateBooking,
  onUpdatePassengerStatus,
}) => {
  const [statusConfirmTarget, setStatusConfirmTarget] = useState<BookingStatus | null>(null);

  if (!isOpen || !booking) return null;

  const handlePassengerStatusChange = (paxIndex: number, newStatus: 'boarded' | 'pending' | 'noshow') => {
    if (!onUpdateBooking) return;
    const currentPassengers = booking.passengers && booking.passengers.length > 0 
      ? [...booking.passengers]
      : [
          {
            id: `${booking.id}-pax-0`,
            fullName: booking.customer.fullName,
            age: 32,
            gender: 'Female' as const,
            nationality: booking.customer.nationality || 'Filipino',
            passportOrId: booking.bookingRef,
            specialRequirements: booking.specialInstructions || 'Standard Pax',
            boardingStatus: 'pending' as const,
          }
        ];

    if (currentPassengers[paxIndex]) {
      currentPassengers[paxIndex] = {
        ...currentPassengers[paxIndex],
        boardingStatus: newStatus,
      };

      onUpdateBooking({
        ...booking,
        passengers: currentPassengers,
      });
    }
  };

  const handleExecuteStatusUpdate = () => {
    if (!statusConfirmTarget || !onUpdateStatus) return;
    onUpdateStatus(booking.id, statusConfirmTarget);
    setStatusConfirmTarget(null);
  };

  const passengers = booking.passengers && booking.passengers.length > 0 
    ? booking.passengers 
    : [
        {
          id: `${booking.id}-pax-0`,
          fullName: booking.customer.fullName,
          age: 32,
          gender: 'Female' as const,
          nationality: booking.customer.nationality || 'Filipino',
          passportOrId: booking.bookingRef,
          specialRequirements: booking.specialInstructions || 'Standard Pax',
          boardingStatus: 'pending' as const,
        }
      ];

  const boardedCount = passengers.filter(p => p.boardingStatus === 'boarded').length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-2xl bg-[#0B1015] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-[#070B0E] flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    {booking.bookingRef}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    booking.status === 'confirmed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : booking.status === 'completed'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : booking.status === 'cancelled'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <h2 className="font-serif-display text-xl text-ivory font-medium">
                  {booking.tourTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {onOpenManifest && (
                  <button
                    onClick={onOpenManifest}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sand-muted hover:text-ivory transition-colors cursor-pointer"
                    title="Print Aviation & Tour Manifest"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sand-muted hover:text-ivory transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Status Control Bar */}
              {onUpdateStatus && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-xs font-medium text-sand-muted uppercase tracking-wider block">
                    Booking Operational Status
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusConfirmTarget(st)}
                        className={`btn-pop py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer active:scale-95 ${
                          booking.status === st
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                            : 'bg-white/[0.03] text-sand-muted border-white/10 hover:bg-white/[0.06] hover:text-ivory'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lead Customer Card */}
              <div className="p-5 rounded-2xl bg-[#0F161E] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-ivory">Lead Traveler Contact</h4>
                      <p className="text-[11px] text-sand-muted font-light">Primary party organizer</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-medium">
                    {passengers.length} PAX ({boardedCount} Boarded)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-sand-muted block text-[11px]">Customer Full Name</span>
                    <span className="font-semibold text-ivory text-sm">{booking.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-sand-muted block text-[11px]">Nationality</span>
                    <span className="font-medium text-ivory">{booking.customer.nationality || 'Filipino'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-sand-muted" />
                    <span className="text-sand-light">{booking.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-sand-muted" />
                    <a href={`tel:${booking.customer.phone}`} className="text-cyan-400 hover:underline">
                      {booking.customer.phone}
                    </a>
                  </div>
                </div>

                {booking.specialInstructions && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-200 mb-0.5">
                      Special Notes / Dietary / Medical Requests:
                    </strong>
                    {booking.specialInstructions}
                  </div>
                )}
              </div>

              {/* Passenger Manifest Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ivory flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Boarding Manifest Roster
                  </h4>
                  <span className="text-xs text-sand-muted">
                    Click status to check in / roll call
                  </span>
                </div>

                <div className="space-y-2.5">
                  {passengers.map((p, idx) => {
                    const st = p.boardingStatus || 'pending';
                    return (
                      <div
                        key={p.id || idx}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-white/[0.06] text-sand-light font-mono text-xs font-semibold flex items-center justify-center border border-white/10">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-ivory text-sm flex items-center gap-2">
                              {p.fullName}
                              {p.specialRequirements && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  {p.specialRequirements}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-sand-muted font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>{p.gender || 'Adult'} • {p.age ? `${p.age} yo` : 'Pax'}</span>
                              <span>• ID:</span>
                              {p.passportOrId === 'No ID (To Follow)' || p.passportOrId?.toLowerCase().includes('follow') ? (
                                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded text-[10px]">
                                  To Follow / None
                                </span>
                              ) : (
                                <span className="text-ivory">{p.passportOrId || 'VERIFIED'}</span>
                              )}
                              <span>• {p.nationality || 'Filipino'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center p-1 bg-[#070B0E] border border-white/10 rounded-xl gap-1 shrink-0">
                          <button
                            onClick={() => handlePassengerStatusChange(idx, 'boarded')}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              st === 'boarded'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Boarded</span>
                          </button>
                          <button
                            onClick={() => handlePassengerStatusChange(idx, 'pending')}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              st === 'pending'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </button>
                          <button
                            onClick={() => handlePassengerStatusChange(idx, 'noshow')}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              st === 'noshow'
                                ? 'bg-rose-700 text-white shadow-sm'
                                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>No-Show</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logistics: Flight, Hotel & Transport */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ivory flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-sky-400" />
                      Airline Flight
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      booking.flightReservation?.status === 'Confirmed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {booking.flightReservation?.status || 'In Process'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-ivory">
                    {booking.flightReservation?.airline || 'To Follow / In Process'}
                  </div>
                  <div className="text-[11px] text-sand-muted font-mono">
                    Flight: {booking.flightReservation?.flightNumber || 'TBA'}
                  </div>
                  <div className="text-[10px] text-sand-muted font-mono">
                    PNR: {booking.flightReservation?.pnrCode || 'In Process'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ivory flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-cyan-400" />
                      Hotel Resort
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      booking.hotelReservation?.status === 'Confirmed'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {booking.hotelReservation?.status || 'In Process'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-ivory">
                    {booking.hotelReservation?.hotelName || 'To Follow / In Process'}
                  </div>
                  <div className="text-[11px] text-sand-muted">
                    Room: {booking.hotelReservation?.roomType || 'Standard Deluxe (TBA)'}
                  </div>
                  <div className="text-[10px] text-sand-muted font-mono">
                    Voucher: {booking.hotelReservation?.voucherCode || 'HTL-TO-FOLLOW'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ivory flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-400" />
                      Shuttle Transfer
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      booking.transportReservation?.status === 'Dispatched' || booking.transportReservation?.status === 'Scheduled'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {booking.transportReservation?.status || 'In Process'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-ivory">
                    {booking.transportReservation?.vehicleType || 'To Follow / In Process'}
                  </div>
                  <div className="text-[11px] text-sand-muted">
                    Driver: {booking.transportReservation?.driverName || 'Designated Driver (TBA)'}
                  </div>
                  <div className="text-[10px] text-sand-muted font-mono">
                    Plate: {booking.transportReservation?.plateNumber || 'TBA'}
                  </div>
                </div>
              </div>

              {/* Financial & Invoice Overview */}
              <div className="p-5 rounded-2xl bg-[#070B0E] border border-white/10 space-y-3 relative overflow-hidden">
                {/* Physical Official Rubber Stamp */}
                <div className="absolute top-3 right-3 sm:right-6 pointer-events-none z-10 scale-75 sm:scale-90 origin-top-right">
                  <RubberStamp
                    type={
                      booking.status === 'cancelled'
                        ? 'CANCELLED'
                        : (booking.invoice?.status === 'paid' || (booking.status === 'confirmed' && (booking.invoice?.balanceDue ?? 0) === 0))
                        ? 'PAID'
                        : (booking.invoice?.amountPaid ?? 0) > 0
                        ? 'PARTIAL'
                        : 'UNPAID'
                    }
                    subtext={
                      booking.status === 'cancelled'
                        ? 'EXPEDITION VOIDED'
                        : (booking.invoice?.status === 'paid' || (booking.status === 'confirmed' && (booking.invoice?.balanceDue ?? 0) === 0))
                        ? 'SETTLED IN FULL'
                        : (booking.invoice?.amountPaid ?? 0) > 0
                        ? 'DEPOSIT CONFIRMED'
                        : 'PAYMENT REQUIRED'
                    }
                    date={booking.date}
                    verificationCode={booking.bookingRef}
                    size="sm"
                    rotation={-7}
                    className="shadow-xl"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ivory flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Financial & Invoice Summary
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    booking.invoice?.status === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {booking.invoice?.status || 'Pending Payment'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-sand-muted block text-[11px]">Total Price</span>
                    <span className="font-bold text-ivory text-base">₱{booking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sand-muted block text-[11px]">Paid to Date</span>
                    <span className="font-bold text-emerald-400 text-base">
                      ₱{(booking.invoice?.amountPaid || (booking.status === 'confirmed' ? booking.totalPrice : 0)).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sand-muted block text-[11px]">Balance Due</span>
                    <span className="font-bold text-amber-400 text-base">
                      ₱{Math.max(0, booking.totalPrice - (booking.invoice?.amountPaid || (booking.status === 'confirmed' ? booking.totalPrice : 0))).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-white/10 bg-[#070B0E] flex items-center justify-between shrink-0">
              <span className="text-xs text-sand-muted font-mono">
                Booking Created: {new Date(booking.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={onClose}
                className="btn-pop px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] active:scale-95 text-xs font-semibold text-ivory border border-white/10 transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Status Change Safeguard Modal */}
      <ActionConfirmModal
        isOpen={statusConfirmTarget !== null}
        onClose={() => setStatusConfirmTarget(null)}
        onConfirm={handleExecuteStatusUpdate}
        title={`Change Booking Status to ${statusConfirmTarget ? statusConfirmTarget.toUpperCase() : ''}?`}
        message={`Are you sure you want to transition booking ${booking.bookingRef} from "${booking.status.toUpperCase()}" to "${statusConfirmTarget ? statusConfirmTarget.toUpperCase() : ''}"?`}
        details={[
          { label: 'Booking Ref', value: booking.bookingRef },
          { label: 'Lead Guest', value: booking.customer.fullName },
          { label: 'Expedition', value: booking.tourTitle },
          { label: 'Departure Date', value: booking.date },
          { label: 'Target Status', value: statusConfirmTarget?.toUpperCase() || '' },
        ]}
        confirmText={`Yes, Set as ${statusConfirmTarget?.toUpperCase() || ''}`}
        cancelText="Cancel Status Change"
        variant={statusConfirmTarget === 'cancelled' ? 'danger' : 'warning'}
        warningNote={statusConfirmTarget === 'cancelled' ? 'WARNING: Marking as Cancelled will release airline flight seats, hotel room blocks, shuttle transfer reservations, and require refund review.' : undefined}
      />
    </AnimatePresence>
  );
};
