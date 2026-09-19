import React, { useState, useMemo } from 'react';
import { 
  Booking, 
  TourPackage, 
  CustomerFeedback, 
  Passenger 
} from '../../types';
import { 
  Compass, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare, 
  FileText, 
  Send, 
  LifeBuoy, 
  Activity, 
  UserCheck, 
  CheckSquare, 
  Sparkles,
  Info
} from 'lucide-react';

interface TourGuideCommandCenterProps {
  bookings: Booking[];
  packages: TourPackage[];
  feedbacks: CustomerFeedback[];
  adminEmail: string;
  onUpdateBooking?: (booking: Booking) => void;
  onUpdateGuide?: (bookingId: string, guideName: string) => void;
}

interface IncidentReport {
  id: string;
  timestamp: string;
  tourTitle: string;
  type: 'Weather' | 'Medical' | 'Delay' | 'General';
  description: string;
  status: 'Reported' | 'Acknowledged';
}

export const TourGuideCommandCenter: React.FC<TourGuideCommandCenterProps> = ({
  bookings,
  packages,
  feedbacks,
  adminEmail,
  onUpdateBooking,
  onUpdateGuide,
}) => {
  const guideName = 'Michael Baynosa';
  const guideLicense = 'DOT-8842-PALAWAN';

  // State for selected booking for live field rollcall
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  
  // State for milestone completion checkboxes
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    'm-1': true, // Safety briefing done
    'm-2': true  // Wharf departure
  });

  // Incident reports state
  const [incidentLogs, setIncidentLogs] = useState<IncidentReport[]>([
    {
      id: 'log-1',
      timestamp: '08:15 AM Today',
      tourTitle: 'El Nido Island Hopping Tour A',
      type: 'Weather',
      description: 'Smooth sea state, slight tide swelling near Secret Lagoon. All passengers equipped with Level-III life vests.',
      status: 'Acknowledged'
    }
  ]);
  const [newIncidentText, setNewIncidentText] = useState('');
  const [newIncidentType, setNewIncidentType] = useState<'Weather' | 'Medical' | 'Delay' | 'General'>('General');

  // Filter bookings assigned to or relevant for Michael Baynosa
  const assignedBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!b) return false;
      const guide = (b.assignedGuide || '').toLowerCase();
      return (
        guide.includes('michael') || 
        guide.includes('baynosa') || 
        guide.includes('unassigned') || 
        guide.includes('pending')
      );
    });
  }, [bookings]);

  // Current active booking selected for rollcall
  const activeBooking = useMemo(() => {
    if (selectedBookingId) {
      return assignedBookings.find((b) => b.id === selectedBookingId) || assignedBookings[0] || bookings[0];
    }
    return assignedBookings[0] || bookings[0];
  }, [assignedBookings, selectedBookingId, bookings]);

  // Passengers list for active booking
  const activePassengers: Passenger[] = useMemo(() => {
    if (!activeBooking) return [];
    if (activeBooking.passengers && activeBooking.passengers.length > 0) {
      return activeBooking.passengers;
    }
    return [
      {
        id: `${activeBooking.id}-lead`,
        fullName: activeBooking.customer?.fullName || 'Lead Passenger',
        age: 30,
        gender: 'Female',
        passportOrId: activeBooking.bookingRef,
        specialRequirements: activeBooking.specialInstructions || 'None',
        boardingStatus: 'boarded'
      }
    ];
  }, [activeBooking]);

  // Stats calculation
  const totalPassengersCount = useMemo(() => {
    return assignedBookings.reduce((sum, b) => sum + (b.passengers?.length || b.numPax || 1), 0);
  }, [assignedBookings]);

  const boardedCount = useMemo(() => {
    return activePassengers.filter((p) => p.boardingStatus === 'boarded').length;
  }, [activePassengers]);

  // Feedback specific to guide
  const guideFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const comment = (f.comment || '').toLowerCase();
      return comment.includes('guide') || comment.includes('michael') || f.guideRating >= 4;
    });
  }, [feedbacks]);

  // Toggle passenger boarding status
  const handleTogglePassengerStatus = (passengerId: string, currentStatus?: string) => {
    if (!activeBooking || !onUpdateBooking) return;
    const nextStatus = currentStatus === 'boarded' ? 'pending' : currentStatus === 'pending' ? 'noshow' : 'boarded';
    
    const updatedPassengers = activePassengers.map((p) => {
      if (p.id === passengerId) {
        return { ...p, boardingStatus: nextStatus as any };
      }
      return p;
    });

    onUpdateBooking({
      ...activeBooking,
      passengers: updatedPassengers
    });
  };

  // Confirm guide assignment as Michael Baynosa
  const handleConfirmAssignment = (bookingToConfirm: Booking) => {
    if (onUpdateBooking) {
      onUpdateBooking({
        ...bookingToConfirm,
        assignedGuide: 'Michael Baynosa (+63 920 456 7890) [Confirmed Field Leader]'
      });
    } else if (onUpdateGuide) {
      onUpdateGuide(bookingToConfirm.id, 'Michael Baynosa (+63 920 456 7890) [Confirmed Field Leader]');
    }
  };

  // Add incident log
  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentText.trim()) return;
    const newLog: IncidentReport = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      tourTitle: activeBooking?.tourTitle || 'General Expedition',
      type: newIncidentType,
      description: newIncidentText.trim(),
      status: 'Reported'
    };
    setIncidentLogs([newLog, ...incidentLogs]);
    setNewIncidentText('');
  };

  const toggleMilestone = (mId: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [mId]: !prev[mId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. TOUR GUIDE COMMAND CENTER HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1219] via-[#0F1720] to-[#070B0E] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sunset-coral/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sunset-coral/20 border border-sunset-coral/30 text-sunset-coral text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Field Tour Guide Command Center</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Licensed Leader Active</span>
              </span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-ivory">
              Welcome Back, <span className="text-sunset-coral">{guideName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl leading-relaxed">
              Dedicated Field Operations Module for assigned tour guides. Manage passenger roll calls, life vest verification, departure milestones, and safety logs.
            </p>
          </div>

          {/* Quick Guide Card Badge */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 w-full sm:w-auto shrink-0 font-mono text-xs">
            <div className="text-sand-muted flex items-center justify-between gap-4">
              <span>Guide License ID:</span>
              <strong className="text-ivory">{guideLicense}</strong>
            </div>
            <div className="text-sand-muted flex items-center justify-between gap-4">
              <span>Assigned Tours:</span>
              <strong className="text-sunset-coral">{assignedBookings.length} Trip(s)</strong>
            </div>
            <div className="text-sand-muted flex items-center justify-between gap-4">
              <span>Total Roster Pax:</span>
              <strong className="text-emerald-400">{totalPassengersCount} Guests</strong>
            </div>
          </div>
        </div>

        {/* Quick Stat Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-sand-muted text-xs mb-1">
              <Users className="w-4 h-4 text-sunset-coral" />
              <span>Manifest Roster</span>
            </div>
            <div className="text-xl font-bold text-ivory">{totalPassengersCount} Pax</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-sand-muted text-xs mb-1">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Boarded Today</span>
            </div>
            <div className="text-xl font-bold text-emerald-400">{boardedCount} / {activePassengers.length}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-sand-muted text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Safety Status</span>
            </div>
            <div className="text-sm font-bold text-amber-300">Coast Guard Cleared</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-sand-muted text-xs mb-1">
              <Star className="w-4 h-4 text-amber-400" />
              <span>CSAT Rating</span>
            </div>
            <div className="text-xl font-bold text-ivory">5.0 ★★★★★</div>
          </div>
        </div>
      </div>

      {/* 2. ASSIGNED EXPEDITIONS & CONFIRMATION CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-lg font-bold text-ivory flex items-center gap-2">
            <Compass className="w-5 h-5 text-sunset-coral" />
            <span>Assigned Expedition Trips for Michael Baynosa</span>
          </h3>
          <span className="text-xs text-sand-muted font-mono">{assignedBookings.length} Active Assignment(s)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedBookings.map((b) => {
            const isConfirmedGuide = (b.assignedGuide || '').includes('Confirmed') || (b.assignedGuide || '').includes('DOT');
            const isSelected = activeBooking?.id === b.id;

            return (
              <div 
                key={b.id}
                onClick={() => setSelectedBookingId(b.id)}
                className={`p-5 rounded-2xl transition-all cursor-pointer border relative overflow-hidden ${
                  isSelected 
                    ? 'bg-white/[0.05] border-sunset-coral shadow-lg shadow-sunset-coral/10' 
                    : 'bg-[#090E14] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-sand-muted uppercase tracking-wider block">Ref: {b.bookingRef}</span>
                    <h4 className="font-serif-display text-sm font-bold text-ivory line-clamp-1">{b.tourTitle}</h4>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                    isConfirmedGuide
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {isConfirmedGuide ? 'Guide Confirmed' : 'Needs Confirmation'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-sand-muted mb-4 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sunset-coral shrink-0" />
                    <span>Travel Date: <strong className="text-ivory">{b.travelDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Lead Guest: <strong className="text-ivory">{b.customer?.fullName || 'N/A'}</strong> ({b.numPax} Pax)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Hotel / Pickup: <strong className="text-ivory">{b.hotelReservation?.hotelName || 'El Nido Beach Resort'}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                  <span className="text-[11px] text-sand-muted">
                    {isSelected ? '✓ Active Rollcall' : 'Click to Load Rollcall'}
                  </span>

                  {!isConfirmedGuide && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmAssignment(b);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 shadow-md transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Confirm Assignment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN FIELD DASHBOARD: ROLL CALL & TIMELINE */}
      {activeBooking && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: PASSENGER MANIFEST ROLL CALL */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-[#090E14] border border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono text-sunset-coral uppercase tracking-wider block">Live Field Manifest Roll Call</span>
                  <h3 className="font-serif-display text-lg font-bold text-ivory">
                    {activeBooking.tourTitle}
                  </h3>
                  <p className="text-xs text-sand-muted">
                    Ref: <strong className="text-ivory">{activeBooking.bookingRef}</strong> • Date: <strong className="text-ivory">{activeBooking.travelDate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-sand-muted font-mono">
                    Boarded: <strong className="text-emerald-400">{boardedCount}</strong> / {activePassengers.length}
                  </span>
                </div>
              </div>

              {/* Passenger Interactive List */}
              <div className="space-y-3">
                {activePassengers.map((p, idx) => {
                  const status = p.boardingStatus || 'pending';
                  return (
                    <div 
                      key={p.id || idx}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-mono text-ivory flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-ivory">{p.fullName || `Passenger ${idx + 1}`}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-sand-muted font-mono">
                            {p.gender || 'F'}, {p.age || 30} yrs
                          </span>
                        </div>

                        <div className="text-xs text-sand-muted space-y-0.5 font-mono pl-8">
                          <div>ID/Passport: <strong className="text-sand-light">{p.passportOrId || 'Ph Passport'}</strong></div>
                          {p.specialRequirements && (
                            <div className="text-amber-300 text-[11px] flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              <span>Notes: {p.specialRequirements}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Boarding Status Toggle Button */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePassengerStatus(p.id, status)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                            status === 'boarded'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : status === 'noshow'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                        >
                          {status === 'boarded' && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Boarded & Cleared</span>
                            </>
                          )}
                          {status === 'pending' && (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-300" />
                              <span>Awaiting Boarding</span>
                            </>
                          )}
                          {status === 'noshow' && (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Marked No-Show</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Safety & Equipment Checklist Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <LifeBuoy className="w-4 h-4 text-amber-400" />
                  <span>Mandatory Field Safety Protocol (Michael Baynosa)</span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Verify every guest fits their SOLAS Level-III life vest before boarding the motorized banca. Check marine park environmental tickets and confirm lead guest emergency contact number.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COL: FIELD TIMELINE & INCIDENT REPORT LOG */}
          <div className="space-y-6">
            {/* Field Itinerary Milestones */}
            <div className="p-6 rounded-3xl bg-[#090E14] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-serif-display text-base font-bold text-ivory flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sunset-coral" />
                  <span>Today's Departure Timeline</span>
                </h3>
                <span className="text-[10px] text-sand-muted font-mono">El Nido Wharf</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { id: 'm-1', time: '07:30 AM', label: 'Resort Pickup & Attendance Check' },
                  { id: 'm-2', time: '08:15 AM', label: 'Life Vest & Wharf Safety Briefing' },
                  { id: 'm-3', time: '09:00 AM', label: 'Big Lagoon Kayak & Snorkel Entry' },
                  { id: 'm-4', time: '12:00 PM', label: 'Shimizu Island Beach Buffet Lunch' },
                  { id: 'm-5', time: '02:30 PM', label: '7 Commandos Beach Relaxation' },
                  { id: 'm-6', time: '04:30 PM', label: 'Harbor Return & Hotel Drop-off' },
                ].map((m) => {
                  const isChecked = Boolean(completedMilestones[m.id]);
                  return (
                    <div 
                      key={m.id}
                      onClick={() => toggleMilestone(m.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                          : 'bg-white/[0.02] border-white/5 text-sand-muted hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-white/20'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </span>
                        <div>
                          <strong className={isChecked ? 'text-ivory' : 'text-sand-light'}>{m.time}</strong>
                          <div className="text-[11px]">{m.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field Incident Log Reporter */}
            <div className="p-6 rounded-3xl bg-[#090E14] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-serif-display text-base font-bold text-ivory flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sunset-coral" />
                  <span>Field Logs & Incident Reporter</span>
                </h3>
              </div>

              {/* Log Input Form */}
              <form onSubmit={handleAddIncident} className="space-y-3">
                <div className="flex items-center gap-2">
                  <select
                    value={newIncidentType}
                    onChange={(e) => setNewIncidentType(e.target.value as any)}
                    className="bg-[#0B1017] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-sand-light focus:outline-none focus:border-sunset-coral cursor-pointer"
                  >
                    <option value="General">General Note</option>
                    <option value="Weather">Weather Update</option>
                    <option value="Medical">Medical / First Aid</option>
                    <option value="Delay">Schedule Delay</option>
                  </select>
                </div>

                <textarea
                  value={newIncidentText}
                  onChange={(e) => setNewIncidentText(e.target.value)}
                  placeholder="Log field observations, guest request, or sea condition notes..."
                  className="w-full h-20 bg-[#0B1017] border border-white/10 rounded-xl p-3 text-xs text-ivory placeholder:text-sand-muted/50 focus:outline-none focus:border-sunset-coral custom-scrollbar resize-none"
                />

                <button
                  type="submit"
                  disabled={!newIncidentText.trim()}
                  className="w-full py-2.5 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Log Entry</span>
                </button>
              </form>

              {/* Recent Incident Logs List */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-sand-muted uppercase tracking-wider block">Recent Logged Notes</span>
                {incidentLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-sand-muted font-mono text-[10px]">
                      <span className="text-sunset-coral font-bold">{log.type}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-sand-light text-[11px] leading-relaxed">{log.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Hotline Contact Card */}
            <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <Phone className="w-4 h-4" />
                <span>Field Emergency Hotline Dispatch</span>
              </div>
              <div className="space-y-1 text-[11px] text-rose-200">
                <div className="flex justify-between"><span>Coast Guard El Nido:</span> <strong className="text-white">+63 917 888 1234</strong></div>
                <div className="flex justify-between"><span>Tour Ops Manager (Kyle):</span> <strong className="text-white">+63 917 334 9900</strong></div>
                <div className="flex justify-between"><span>El Nido Hospital:</span> <strong className="text-white">(048) 433 2199</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECENT GUEST REVIEWS & FEEDBACK FOR MICHAEL BAYNOSA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090E14] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="font-serif-display text-lg font-bold text-ivory">
              Guest Feedback & Reviews for Michael Baynosa
            </h3>
          </div>
          <span className="text-xs text-sand-muted font-mono">{guideFeedbacks.length} Review(s) Received</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guideFeedbacks.map((f) => (
            <div key={f.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory">{f.customerName || 'Anonymous Traveler'}</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {'★'.repeat(f.guideRating || 5)}
                </div>
              </div>
              <p className="text-xs text-sand-muted italic leading-relaxed">
                "{f.comment || 'Awesome tour guide! Michael Baynosa was super knowledgeable and prioritized safety everywhere.'}"
              </p>
              <div className="text-[10px] font-mono text-sand-muted/60 text-right">
                {f.createdAt || 'Recent Review'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
