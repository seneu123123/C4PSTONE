import React, { useState } from 'react';
import { Booking, DayItinerary, TourPackage } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  Printer, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  FileText,
  Briefcase,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface ItineraryScheduleManagementProps {
  packages: TourPackage[];
  bookings: Booking[];
  onUpdateGuide: (bookingId: string, guideName: string) => void;
  isOperatorView: boolean;
}

export const ItineraryScheduleManagement: React.FC<ItineraryScheduleManagementProps> = ({
  packages,
  bookings,
  onUpdateGuide,
  isOperatorView
}) => {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || '');
  const [editingGuideBookingId, setEditingGuideBookingId] = useState<string | null>(null);
  const [guideInput, setGuideInput] = useState<string>('');

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const relatedBookings = bookings.filter((b) => b.tourPackageId === selectedPkgId);

  const handleSaveGuide = (bookingId: string) => {
    if (!guideInput.trim()) return;
    onUpdateGuide(bookingId, guideInput.trim());
    setEditingGuideBookingId(null);
    setGuideInput('');
  };

  const handlePrintSchedule = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print unavailable in iframe sandbox:', e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Submodule Header */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-sans-body tracking-[0.25em] uppercase font-medium">
              <Calendar className="w-4 h-4" />
              <span>Tour Scheduling & Guide Dispatch</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-ivory tracking-wide">
              Tour Scheduling & Guide Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              Organize day-by-day activity timelines, assign DOT-certified local tour guides, and manage departure group timelines.
            </p>
          </div>

          <button
            onClick={handlePrintSchedule}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-ivory font-sans-body tracking-wider text-xs rounded-full border border-white/10 transition"
          >
            <Printer className="w-4 h-4 text-sunset-coral" />
            <span>Print Dispatch Sheet</span>
          </button>
        </div>

        {/* Package Selector */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-6 border-t border-white/[0.08]">
          <span className="text-xs font-sans-body uppercase tracking-wider text-sand-muted">Select Tour Package:</span>
          <select
            value={selectedPkgId}
            onChange={(e) => setSelectedPkgId(e.target.value)}
            className="bg-[#070B0E] border border-white/[0.08] rounded-full px-4 py-2 text-xs text-sunset-coral font-medium focus:outline-none focus:border-sunset-coral max-w-md w-full"
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.code} — {pkg.title} ({pkg.destination})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedPkg && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Day-by-Day Itinerary Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <span className="text-[11px] font-sans-body tracking-[0.2em] uppercase text-sunset-coral font-medium">
                    Expedition Milestones
                  </span>
                  <h3 className="font-serif-display text-2xl text-ivory">
                    {selectedPkg.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-sand-muted">
                  {selectedPkg.durationDays} Days / {selectedPkg.durationNights} Nights
                </span>
              </div>

              {selectedPkg.itinerary && selectedPkg.itinerary.length > 0 ? (
                <div className="space-y-6">
                  {selectedPkg.itinerary.map((day) => (
                    <div key={day.dayNumber} className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-3">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#070B0E] border-2 border-sunset-coral flex items-center justify-center text-[10px] text-sunset-coral font-bold font-mono">
                        {day.dayNumber}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-serif-display text-lg sm:text-xl text-ivory">
                          Day {day.dayNumber}: {day.title}
                        </h4>
                        <span className="text-xs text-sand-muted font-light">{day.meals}</span>
                      </div>

                      <p className="text-xs text-sand-muted leading-relaxed font-light">
                        {day.description}
                      </p>

                      {day.activities && day.activities.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {day.activities.map((act, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 text-xs bg-[#070B0E] border border-white/[0.04] p-3 rounded-xl"
                            >
                              <span className="font-mono text-sunset-coral text-[11px] font-medium min-w-[50px]">
                                {act.time}
                              </span>
                              <span className="text-ivory font-light">{act.activity}</span>
                              {act.location && (
                                <span className="text-sand-muted text-[11px] ml-auto">
                                  ({act.location})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-sand-muted text-xs font-light">
                  No structured milestones added yet for this expedition package.
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Active Bookings & Assigned Guide */}
          <div className="space-y-6">
            <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-sans-body uppercase tracking-wider text-sand-muted font-medium">
                  Assigned Guide & Dispatch
                </span>
                <span className="text-xs font-mono text-sunset-coral">
                  {relatedBookings.length} Groups
                </span>
              </div>

              {relatedBookings.length === 0 ? (
                <p className="text-xs text-sand-muted font-light py-4 text-center">
                  No active departures booked for this tour.
                </p>
              ) : (
                <div className="space-y-3">
                  {relatedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#070B0E] border border-white/[0.06] p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-ivory font-bold">{b.bookingRef}</span>
                        <span className="text-[10px] uppercase font-bold text-sunset-coral bg-sunset-coral/10 px-2 py-0.5 rounded-full">
                          {b.travelDate}
                        </span>
                      </div>

                      <div className="text-xs text-sand-muted font-light">
                        Lead: <span className="text-ivory font-normal">{b.customer.fullName}</span> ({b.numPax} Pax)
                      </div>

                      {/* Guide Assignment */}
                      <div className="pt-2 border-t border-white/[0.04]">
                        {editingGuideBookingId === b.id ? (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              <button
                                type="button"
                                onClick={() => setGuideInput('Michael Baynosa (+63 920 456 7890) [Confirmed Field Leader]')}
                                className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded hover:bg-emerald-500/20 cursor-pointer"
                              >
                                + Michael Baynosa
                              </button>
                              <button
                                type="button"
                                onClick={() => setGuideInput('Capt. Roger Mendoza (+63 920 111 8899) [Confirmed]')}
                                className="text-[10px] bg-white/[0.05] border border-white/10 text-sand-muted px-2 py-0.5 rounded hover:text-ivory cursor-pointer"
                              >
                                + Roger Mendoza
                              </button>
                              <button
                                type="button"
                                onClick={() => setGuideInput('Danica Reyes (+63 917 334 1122) [Confirmed]')}
                                className="text-[10px] bg-white/[0.05] border border-white/10 text-sand-muted px-2 py-0.5 rounded hover:text-ivory cursor-pointer"
                              >
                                + Danica Reyes
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Enter Tour Guide Name..."
                              value={guideInput}
                              onChange={(e) => setGuideInput(e.target.value)}
                              className="w-full bg-[#0B1014] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setEditingGuideBookingId(null)}
                                className="px-3 py-1 text-[11px] text-sand-muted hover:text-ivory"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveGuide(b.id)}
                                className="px-3 py-1 bg-sunset-coral text-white rounded-md text-[11px] font-medium"
                              >
                                Assign
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs">
                              <User className="w-3.5 h-3.5 text-sunset-coral" />
                              <span className="text-ivory">
                                {b.assignedGuide || 'Unassigned Guide'}
                              </span>
                            </div>
                            {isOperatorView && (
                              <button
                                onClick={() => {
                                  setEditingGuideBookingId(b.id);
                                  setGuideInput(b.assignedGuide || '');
                                }}
                                className="text-[11px] text-sand-muted hover:text-sunset-coral transition"
                              >
                                Edit Guide
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
