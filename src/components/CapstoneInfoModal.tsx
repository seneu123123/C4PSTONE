import React from 'react';
import { 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Layers, 
  MapPin, 
  UserCheck, 
  Calendar, 
  Hotel, 
  CreditCard, 
  Star,
  Award,
  BookOpen
} from 'lucide-react';

interface CapstoneInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const CapstoneInfoModal: React.FC<CapstoneInfoModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  if (!isOpen) return null;

  const submodules = [
    {
      num: 1,
      name: 'Tour Package Creation & Management',
      icon: MapPin,
      desc: 'Create, edit, duplicate, publish, and manage tour package details, pricing per pax, capacities, and inclusions.'
    },
    {
      num: 2,
      name: 'Customer Booking and Registration',
      icon: UserCheck,
      desc: 'Customer booking portal with passenger manifest registration, date selection, instant reference code, and booking status tracking.'
    },
    {
      num: 3,
      name: 'Itinerary and Schedule Management',
      icon: Calendar,
      desc: 'Day-by-day activity timelines, guide assignments, departure schedule slots, and printable tourist itinerary guides.'
    },
    {
      num: 4,
      name: 'Hotel and Transport Reservation',
      icon: Hotel,
      desc: 'Allocation and voucher tracking for airline flights, hotel stays, and private shuttle transport per booking.'
    },
    {
      num: 5,
      name: 'Payment and Invoice Management',
      icon: CreditCard,
      desc: 'Payment processing, deposit vs full payment ledger, receipt verification, and professional printable PDF invoices with QR codes.'
    },
    {
      num: 6,
      name: 'Customer Feedback and Rating System',
      icon: Star,
      desc: 'Post-tour review submissions, 5-star criteria breakdown (guide, hotel, transport), NPS score, and operator feedback analytics.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Capstone System Specification</h2>
            <p className="text-xs text-slate-400">
              Tour Operations & Customer Booking System Architecture
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
          This system fulfills all <strong>6 Core Submodules</strong> required for the Capstone Project. You can switch between <strong>Customer Portal</strong> (to simulate booking & reviews) and <strong>Tour Operator Portal</strong> (to manage packages, schedules, reservations, and invoices).
        </p>

        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Verified Submodules Checklist
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {submodules.map((sub) => {
              const Icon = sub.icon;
              return (
                <div
                  key={sub.num}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3 hover:border-cyan-500/40 transition"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{sub.num}. {sub.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (confirm('Reset all bookings, tour packages, and reviews to original seed data?')) {
                onResetData();
                onClose();
              }
            }}
            className="flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/20 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition"
          >
            Close & Explore App
          </button>
        </div>
      </div>
    </div>
  );
};
