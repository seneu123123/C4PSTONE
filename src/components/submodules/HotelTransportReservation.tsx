import React, { useState } from 'react';
import { Booking, HotelReservation, TransportReservation, FlightReservation } from '../../types';
import { getLogisticsSuggestions } from '../../utils/logisticsSuggestions';
import { 
  COUNTRY_LOGISTICS_DIRECTORY, 
  getLogisticsByDestinationOrCountry,
  CountryLogisticsData,
  AirlineDirectoryOption,
  HotelDirectoryOption,
  ShuttleDirectoryOption
} from '../../utils/logisticsDirectory';
import { dispatchAppNotification } from '../../utils/notifications';
import { 
  Hotel, 
  Car, 
  Plane,
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Search, 
  X, 
  Printer, 
  Luggage,
  ShieldCheck,
  User,
  Compass,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Globe,
  Bell,
  Check
} from 'lucide-react';

interface HotelTransportReservationProps {
  bookings: Booking[];
  onUpdateHotelReservation: (bookingId: string, hotel: HotelReservation) => void;
  onUpdateTransportReservation: (bookingId: string, transport: TransportReservation) => void;
  onUpdateFlightReservation?: (bookingId: string, flight: FlightReservation) => void;
  onUpdateBooking?: (booking: Booking) => void;
  isOperatorView: boolean;
}

export const HotelTransportReservation: React.FC<HotelTransportReservationProps> = ({
  bookings,
  onUpdateHotelReservation,
  onUpdateTransportReservation,
  onUpdateFlightReservation,
  onUpdateBooking,
  isOperatorView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'flights' | 'hotels' | 'transport'>('flights');
  const [statusFilter, setStatusFilter] = useState<'all' | 'to_follow' | 'confirmed' | 'dispatched'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  
  // Modal Editing States & Country Selectors
  const [editingFlightBooking, setEditingFlightBooking] = useState<Booking | null>(null);
  const [flightForm, setFlightForm] = useState<Partial<FlightReservation>>({});
  const [flightCountryKey, setFlightCountryKey] = useState<string>('philippines');

  const [editingHotelBooking, setEditingHotelBooking] = useState<Booking | null>(null);
  const [hotelForm, setHotelForm] = useState<Partial<HotelReservation>>({});
  const [hotelCountryKey, setHotelCountryKey] = useState<string>('philippines');

  const [editingTransportBooking, setEditingTransportBooking] = useState<Booking | null>(null);
  const [transportForm, setTransportForm] = useState<Partial<TransportReservation>>({});
  const [transportCountryKey, setTransportCountryKey] = useState<string>('philippines');

  // Success Feedback Toast
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4000);
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(q) ||
      b.customer.fullName.toLowerCase().includes(q) ||
      b.tourTitle.toLowerCase().includes(q) ||
      b.destination.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (countryFilter !== 'all') {
      const countryData = getLogisticsByDestinationOrCountry(b.destination);
      if (countryData.countryId !== countryFilter) return false;
    }

    if (statusFilter === 'all') return true;

    if (activeSubTab === 'flights') {
      const status = b.flightReservation?.status || 'To Follow';
      if (statusFilter === 'to_follow') return status === 'To Follow' || status === 'Pending';
      if (statusFilter === 'confirmed') return status === 'Confirmed';
    } else if (activeSubTab === 'hotels') {
      const status = b.hotelReservation?.status || 'To Follow';
      if (statusFilter === 'to_follow') return status === 'To Follow' || status === 'Pending';
      if (statusFilter === 'confirmed') return status === 'Confirmed';
    } else if (activeSubTab === 'transport') {
      const status = b.transportReservation?.status || 'To Follow';
      if (statusFilter === 'to_follow') return status === 'To Follow' || status === 'Pending';
      if (statusFilter === 'dispatched' || statusFilter === 'confirmed') {
        return status === 'Dispatched' || status === 'Scheduled' || status === 'Completed';
      }
    }

    return true;
  });

  // -------------------------------------------------------------
  // Flight Modal Handlers
  // -------------------------------------------------------------
  const handleOpenFlightModal = (b: Booking) => {
    const countryData = getLogisticsByDestinationOrCountry(b.destination);
    const suggestion = getLogisticsSuggestions(b.destination, b.tourTitle);
    
    setEditingFlightBooking(b);
    setFlightCountryKey(countryData.countryId);
    setFlightForm(
      b.flightReservation || {
        id: `flt-${Date.now()}`,
        airline: suggestion.flight.airline,
        flightNumber: suggestion.flight.flightNumber,
        route: suggestion.flight.route,
        terminal: suggestion.flight.terminal,
        departureDate: b.travelDate,
        returnDate: b.travelDate,
        etd: suggestion.flight.etd,
        eta: suggestion.flight.eta,
        pnrCode: `PNR-${b.bookingRef.split('-')[2] || Math.floor(100000 + Math.random() * 900000)}`,
        cabinClass: suggestion.flight.cabinClass,
        baggageAllowance: suggestion.flight.baggageAllowance,
        status: 'Confirmed',
        notes: `Local carrier assignment for ${b.destination}`
      }
    );
  };

  const handleSelectAirlineOption = (airlineOpt: AirlineDirectoryOption) => {
    if (!editingFlightBooking) return;
    setFlightForm((prev) => ({
      ...prev,
      airline: airlineOpt.name,
      flightNumber: airlineOpt.defaultFlightNumber || prev.flightNumber || 'PR-2026',
      route: airlineOpt.popularRoutes?.[0] || `${editingFlightBooking.destination} Flight Segment`,
      terminal: airlineOpt.hubTerminal || prev.terminal || 'Terminal 2',
      baggageAllowance: airlineOpt.baggageAllowance || prev.baggageAllowance || '20kg Check-in',
      cabinClass: airlineOpt.cabinClass || prev.cabinClass || 'Economy',
      pnrCode: prev.pnrCode || `PNR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed'
    }));
  };

  const handleApplyFlightSuggestion = () => {
    if (!editingFlightBooking) return;
    const s = getLogisticsSuggestions(editingFlightBooking.destination, editingFlightBooking.tourTitle);
    setFlightForm((prev) => ({
      ...prev,
      airline: s.flight.airline,
      flightNumber: s.flight.flightNumber,
      route: s.flight.route,
      terminal: s.flight.terminal,
      etd: s.flight.etd,
      eta: s.flight.eta,
      cabinClass: s.flight.cabinClass,
      baggageAllowance: s.flight.baggageAllowance,
      status: 'Confirmed'
    }));
  };

  const handleSaveFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlightBooking) return;

    const savedFlight: FlightReservation = {
      id: flightForm.id || `flt-${Date.now()}`,
      airline: flightForm.airline || 'To Follow / In Process',
      flightNumber: flightForm.flightNumber || 'TBA',
      route: flightForm.route || `${editingFlightBooking.destination} Domestic Flight`,
      terminal: flightForm.terminal || 'Terminal TBA',
      departureDate: flightForm.departureDate || editingFlightBooking.travelDate,
      returnDate: flightForm.returnDate || editingFlightBooking.travelDate,
      etd: flightForm.etd || 'TBA',
      eta: flightForm.eta || 'TBA',
      pnrCode: flightForm.pnrCode || `PNR-${Date.now()}`,
      cabinClass: flightForm.cabinClass || 'Economy',
      baggageAllowance: flightForm.baggageAllowance || '20kg Check-in',
      status: (flightForm.status as any) || 'Confirmed',
      notes: flightForm.notes || ''
    };

    if (onUpdateFlightReservation) {
      onUpdateFlightReservation(editingFlightBooking.id, savedFlight);
    } else if (onUpdateBooking) {
      onUpdateBooking({ ...editingFlightBooking, flightReservation: savedFlight });
    }

    // Client Notification in Real-Time
    dispatchAppNotification({
      title: '✈️ Flight Ticket Booked & Confirmed',
      message: `Flight booked with ${savedFlight.airline} (Flight ${savedFlight.flightNumber}) for traveler ${editingFlightBooking.customer.fullName} (${editingFlightBooking.bookingRef}). Client receipt updated to Confirmed!`,
      type: 'flight',
      bookingRef: editingFlightBooking.bookingRef,
      actionLabel: 'View Ticket'
    });

    showToast(`Flight confirmed for ${editingFlightBooking.bookingRef}. Client receipt updated and notified!`);
    setEditingFlightBooking(null);
  };

  // -------------------------------------------------------------
  // Hotel Modal Handlers
  // -------------------------------------------------------------
  const handleOpenHotelModal = (b: Booking) => {
    const countryData = getLogisticsByDestinationOrCountry(b.destination);
    const suggestion = getLogisticsSuggestions(b.destination, b.tourTitle);
    
    setEditingHotelBooking(b);
    setHotelCountryKey(countryData.countryId);
    setHotelForm(
      b.hotelReservation || {
        id: `htl-${Date.now()}`,
        hotelName: suggestion.hotel.hotelName,
        roomType: suggestion.hotel.roomType,
        checkInDate: b.travelDate,
        checkOutDate: b.travelDate,
        nights: 2,
        voucherCode: `HTL-${b.bookingRef.split('-')[2] || Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Confirmed',
        contactPhone: suggestion.hotel.contactPhone,
        location: suggestion.hotel.location,
        notes: suggestion.hotel.inclusions
      }
    );
  };

  const handleSelectHotelOption = (hotelOpt: HotelDirectoryOption) => {
    if (!editingHotelBooking) return;
    setHotelForm((prev) => ({
      ...prev,
      hotelName: hotelOpt.name,
      roomType: hotelOpt.defaultRoomType || prev.roomType || 'Standard Deluxe Room',
      location: hotelOpt.location || editingHotelBooking.destination,
      contactPhone: hotelOpt.contactPhone || prev.contactPhone || '+63 917 000 0000',
      notes: hotelOpt.inclusions || prev.notes || '',
      voucherCode: prev.voucherCode || `HTL-${editingHotelBooking.bookingRef}`,
      status: 'Confirmed'
    }));
  };

  const handleApplyHotelSuggestion = () => {
    if (!editingHotelBooking) return;
    const s = getLogisticsSuggestions(editingHotelBooking.destination, editingHotelBooking.tourTitle);
    setHotelForm((prev) => ({
      ...prev,
      hotelName: s.hotel.hotelName,
      roomType: s.hotel.roomType,
      contactPhone: s.hotel.contactPhone,
      location: s.hotel.location,
      notes: s.hotel.inclusions,
      status: 'Confirmed'
    }));
  };

  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotelBooking) return;

    const savedHotel: HotelReservation = {
      id: hotelForm.id || `htl-${Date.now()}`,
      hotelName: hotelForm.hotelName || 'To Follow / In Process',
      roomType: hotelForm.roomType || 'Standard Deluxe',
      checkInDate: hotelForm.checkInDate || editingHotelBooking.travelDate,
      checkOutDate: hotelForm.checkOutDate || editingHotelBooking.travelDate,
      nights: Number(hotelForm.nights) || 2,
      voucherCode: hotelForm.voucherCode || `HTL-${Date.now()}`,
      status: (hotelForm.status as any) || 'Confirmed',
      contactPhone: hotelForm.contactPhone || '+63 917 000 0000',
      location: hotelForm.location || editingHotelBooking.destination,
      notes: hotelForm.notes || ''
    };

    onUpdateHotelReservation(editingHotelBooking.id, savedHotel);

    // Client Notification in Real-Time
    dispatchAppNotification({
      title: '🏨 Hotel Accommodation Confirmed',
      message: `Hotel voucher issued: ${savedHotel.hotelName} (${savedHotel.roomType}) for traveler ${editingHotelBooking.customer.fullName} (${editingHotelBooking.bookingRef}). Client receipt updated!`,
      type: 'hotel',
      bookingRef: editingHotelBooking.bookingRef,
      actionLabel: 'View Voucher'
    });

    showToast(`Hotel accommodation confirmed for ${editingHotelBooking.bookingRef}. Client receipt updated and notified!`);
    setEditingHotelBooking(null);
  };

  // -------------------------------------------------------------
  // Transport / Shuttle Modal Handlers
  // -------------------------------------------------------------
  const handleOpenTransportModal = (b: Booking) => {
    const countryData = getLogisticsByDestinationOrCountry(b.destination);
    const suggestion = getLogisticsSuggestions(b.destination, b.tourTitle);
    
    setEditingTransportBooking(b);
    setTransportCountryKey(countryData.countryId);
    setTransportForm(
      b.transportReservation || {
        id: `trp-${Date.now()}`,
        vehicleType: suggestion.transport.vehicleType,
        driverName: suggestion.transport.driverName,
        driverContact: suggestion.transport.driverContact,
        plateNumber: suggestion.transport.plateNumber,
        pickupLocation: suggestion.transport.pickupLocation,
        dropoffLocation: suggestion.transport.dropoffLocation,
        pickupTime: '09:00 AM',
        status: 'Dispatched',
        notes: `Operator: ${suggestion.transport.operator}`
      }
    );
  };

  const handleSelectShuttleOption = (shuttleOpt: ShuttleDirectoryOption) => {
    if (!editingTransportBooking) return;
    setTransportForm((prev) => ({
      ...prev,
      vehicleType: shuttleOpt.vehicleType,
      driverName: shuttleOpt.driverName || prev.driverName || 'Designated Escort Driver',
      driverContact: shuttleOpt.driverContact || prev.driverContact || '+63 900 000 0000',
      plateNumber: shuttleOpt.plateNumber || prev.plateNumber || 'NAA-8842',
      pickupLocation: shuttleOpt.defaultPickup || prev.pickupLocation || 'Airport Arrival Bay',
      dropoffLocation: shuttleOpt.defaultDropoff || prev.dropoffLocation || 'Hotel Lobby / City Center',
      notes: `Operator: ${shuttleOpt.operator}${shuttleOpt.capacity ? ` (${shuttleOpt.capacity})` : ''}`,
      status: 'Dispatched'
    }));
  };

  const handleApplyTransportSuggestion = () => {
    if (!editingTransportBooking) return;
    const s = getLogisticsSuggestions(editingTransportBooking.destination, editingTransportBooking.tourTitle);
    setTransportForm((prev) => ({
      ...prev,
      vehicleType: s.transport.vehicleType,
      driverName: s.transport.driverName,
      driverContact: s.transport.driverContact,
      plateNumber: s.transport.plateNumber,
      pickupLocation: s.transport.pickupLocation,
      dropoffLocation: s.transport.dropoffLocation,
      status: 'Dispatched',
      notes: `Operator: ${s.transport.operator}`
    }));
  };

  const handleSaveTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransportBooking) return;

    const savedTransport: TransportReservation = {
      id: transportForm.id || `trp-${Date.now()}`,
      vehicleType: transportForm.vehicleType || 'To Follow / In Process',
      driverName: transportForm.driverName || 'Designated Driver',
      driverContact: transportForm.driverContact || '+63 900 000 0000',
      plateNumber: transportForm.plateNumber || 'TBA',
      pickupLocation: transportForm.pickupLocation || 'Airport Arrival Bay',
      dropoffLocation: transportForm.dropoffLocation || 'Resort / Hotel Lobby',
      pickupTime: transportForm.pickupTime || '08:00 AM',
      status: (transportForm.status as any) || 'Dispatched',
      notes: transportForm.notes || ''
    };

    onUpdateTransportReservation(editingTransportBooking.id, savedTransport);

    // Client Notification in Real-Time
    dispatchAppNotification({
      title: '🚐 Shuttle Service Booked & Dispatched',
      message: `Shuttle service dispatched: ${savedTransport.vehicleType} (Driver: ${savedTransport.driverName}, Plate: ${savedTransport.plateNumber}) for traveler ${editingTransportBooking.customer.fullName} (${editingTransportBooking.bookingRef}). Client receipt updated!`,
      type: 'transport',
      bookingRef: editingTransportBooking.bookingRef,
      actionLabel: 'View Shuttle'
    });

    showToast(`Shuttle service dispatched for ${editingTransportBooking.bookingRef}. Client receipt updated and notified!`);
    setEditingTransportBooking(null);
  };

  // Active Country Data helpers for active modals
  const activeFlightCountryData = COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === flightCountryKey) || COUNTRY_LOGISTICS_DIRECTORY[0];
  const activeHotelCountryData = COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === hotelCountryKey) || COUNTRY_LOGISTICS_DIRECTORY[0];
  const activeTransportCountryData = COUNTRY_LOGISTICS_DIRECTORY.find((c) => c.countryId === transportCountryKey) || COUNTRY_LOGISTICS_DIRECTORY[0];

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      {feedbackNotice && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-white block">Logistics Dispatched & Synchronized</span>
            <span className="text-[11px] text-emerald-300/90">{feedbackNotice}</span>
          </div>
        </div>
      )}

      {/* Submodule Header */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-mono tracking-wider uppercase font-semibold">
              <Compass className="w-4 h-4" />
              <span>Operations Logistics & Dispatch Center</span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-light text-ivory tracking-wide">
              Flight, Hotel & Shuttle Logistics Assignment
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed font-sans-body">
              Select locally used airlines, partner resorts, and private shuttle services based on the country/destination. Clients are automatically notified and their receipts update in real-time when assigned.
            </p>
          </div>

          {/* Sub-tabs for Flight, Hotel, Transport */}
          <div className="flex items-center gap-1.5 bg-[#070B0E] p-1.5 rounded-2xl border border-white/10 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setActiveSubTab('flights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans-body font-medium transition cursor-pointer ${
                activeSubTab === 'flights'
                  ? 'bg-sunset-coral text-white shadow-md shadow-sunset-coral/25'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/5'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Airlines & Flights</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('hotels')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans-body font-medium transition cursor-pointer ${
                activeSubTab === 'hotels'
                  ? 'bg-sunset-coral text-white shadow-md shadow-sunset-coral/25'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/5'
              }`}
            >
              <Hotel className="w-3.5 h-3.5" />
              <span>Hotel Vouchers</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transport')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans-body font-medium transition cursor-pointer ${
                activeSubTab === 'transport'
                  ? 'bg-sunset-coral text-white shadow-md shadow-sunset-coral/25'
                  : 'text-sand-muted hover:text-ivory hover:bg-white/5'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Shuttle & Transfers</span>
            </button>
          </div>
        </div>

        {/* Search, Country Filter and Status Toolbar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-sand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search booking ref, guest name, tour or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070B0E] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-sunset-coral font-sans-body"
              />
            </div>

            {/* Country Quick Filter */}
            <div className="relative shrink-0">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-sand-light focus:outline-none focus:border-sunset-coral font-mono cursor-pointer"
              >
                <option value="all">🌍 All Countries</option>
                {COUNTRY_LOGISTICS_DIRECTORY.map((c) => (
                  <option key={c.countryId} value={c.countryId}>
                    {c.flag} {c.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-[11px] font-mono text-sand-muted hidden sm:inline">Status:</span>
            <div className="grid grid-cols-3 sm:flex gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white/15 text-ivory font-bold'
                    : 'bg-[#070B0E] text-sand-muted hover:text-ivory'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('to_follow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                  statusFilter === 'to_follow'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'bg-[#070B0E] text-sand-muted hover:text-ivory'
                }`}
              >
                In Process
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter(activeSubTab === 'transport' ? 'dispatched' : 'confirmed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                  statusFilter === 'confirmed' || statusFilter === 'dispatched'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'bg-[#070B0E] text-sand-muted hover:text-ivory'
                }`}
              >
                {activeSubTab === 'transport' ? 'Dispatched' : 'Confirmed'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((b) => {
          const flight = b.flightReservation;
          const hotel = b.hotelReservation;
          const transport = b.transportReservation;
          const countryData = getLogisticsByDestinationOrCountry(b.destination);

          // 1. FLIGHTS TAB
          if (activeSubTab === 'flights') {
            const isToFollow = !flight || flight.status === 'To Follow' || flight.status === 'Pending' || flight.airline.toLowerCase().includes('follow') || flight.flightNumber === 'TBA';

            return (
              <div
                key={b.id}
                className="bg-[#0B1014] border border-white/10 hover:border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-sunset-coral font-bold">{b.bookingRef}</span>
                      <span className="text-[11px]" title={countryData.countryName}>{countryData.flag}</span>
                    </div>
                    {isToFollow ? (
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                        In Process (Pending)
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {flight?.status || 'Confirmed'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif-display text-xl text-ivory">
                      {flight?.airline || 'Airline In Confirmation'}
                    </h3>
                    <p className="text-xs text-sand-muted font-mono mt-0.5">
                      Flight: {flight?.flightNumber || 'TBA'} • PNR: {flight?.pnrCode || 'In Process'}
                    </p>
                  </div>

                  <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs text-sand-muted font-sans-body">
                    <div className="flex justify-between">
                      <span>Route:</span>
                      <span className="text-ivory font-medium truncate max-w-[170px]">{flight?.route || `${b.destination} Flight Segment`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Passenger:</span>
                      <span className="text-ivory">{b.customer.fullName} ({b.numPax} Pax)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Departure:</span>
                      <span className="text-ivory font-mono">{flight?.departureDate || b.travelDate} ({flight?.etd || 'TBA'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Baggage / Class:</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{flight?.baggageAllowance || '20kg Included'}</span>
                    </div>
                  </div>

                  {/* Local Directory Preview */}
                  <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sand-muted flex items-start gap-2">
                    <Plane className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sky-300 font-medium">{countryData.countryName} Local Hub: </span>
                      <span className="text-ivory">{countryData.airlines[0]?.name} ({countryData.airlines[0]?.defaultFlightNumber})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-sand-muted font-mono">{b.destination}</span>
                  {isOperatorView && (
                    <button
                      type="button"
                      onClick={() => handleOpenFlightModal(b)}
                      className="px-4 py-1.5 bg-white/5 hover:bg-sunset-coral text-ivory hover:text-white rounded-full text-xs font-medium transition-all border border-white/10 cursor-pointer"
                    >
                      {flight && !isToFollow ? 'Update Flight' : 'Assign Local Airline'}
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // 2. HOTELS TAB
          if (activeSubTab === 'hotels') {
            const isToFollow = !hotel || hotel.status === 'To Follow' || hotel.status === 'Pending' || hotel.hotelName.toLowerCase().includes('follow');

            return (
              <div
                key={b.id}
                className="bg-[#0B1014] border border-white/10 hover:border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-sunset-coral font-bold">{b.bookingRef}</span>
                      <span className="text-[11px]" title={countryData.countryName}>{countryData.flag}</span>
                    </div>
                    {isToFollow ? (
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                        In Process (Pending)
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {hotel?.status || 'Confirmed'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif-display text-xl text-ivory">
                      {hotel?.hotelName || 'Hotel In Confirmation'}
                    </h3>
                    <p className="text-xs text-sand-muted font-sans-body">{hotel?.roomType || 'Standard Deluxe (In Process)'}</p>
                  </div>

                  <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs text-sand-muted font-sans-body">
                    <div className="flex justify-between">
                      <span>Voucher Code:</span>
                      <span className="font-mono text-sunset-coral font-bold">{hotel?.voucherCode || `HTL-${b.bookingRef}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Guest:</span>
                      <span className="text-ivory">{b.customer.fullName} ({b.numPax} Pax)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-In:</span>
                      <span className="text-ivory font-mono">{hotel?.checkInDate || b.travelDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact / Support:</span>
                      <span className="text-ivory font-mono text-[11px]">{hotel?.contactPhone || '+63 917 888 2026'}</span>
                    </div>
                  </div>

                  {/* Local Directory Preview */}
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-sand-muted flex items-start gap-2">
                    <Hotel className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-cyan-300 font-medium">{countryData.countryName} Local Partner: </span>
                      <span className="text-ivory">{countryData.hotels[0]?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-sand-muted font-mono">{b.destination}</span>
                  {isOperatorView && (
                    <button
                      type="button"
                      onClick={() => handleOpenHotelModal(b)}
                      className="px-4 py-1.5 bg-white/5 hover:bg-sunset-coral text-ivory hover:text-white rounded-full text-xs font-medium transition-all border border-white/10 cursor-pointer"
                    >
                      {hotel && !isToFollow ? 'Update Voucher' : 'Assign Local Resort'}
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // 3. TRANSPORT TAB
          const isToFollow = !transport || transport.status === 'To Follow' || transport.status === 'Pending' || transport.vehicleType.toLowerCase().includes('follow');

          return (
            <div
              key={b.id}
              className="bg-[#0B1014] border border-white/10 hover:border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-sunset-coral font-bold">{b.bookingRef}</span>
                    <span className="text-[11px]" title={countryData.countryName}>{countryData.flag}</span>
                  </div>
                  {isToFollow ? (
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                      In Process (Pending)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {transport?.status || 'Dispatched'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif-display text-xl text-ivory">
                    {transport?.vehicleType || 'Shuttle In Confirmation'}
                  </h3>
                  <p className="text-xs text-sand-muted font-mono">Plate: {transport?.plateNumber || 'Processing...'}</p>
                </div>

                <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs text-sand-muted font-sans-body">
                  <div className="flex justify-between">
                    <span>Driver / Escort:</span>
                    <span className="text-ivory font-medium">{transport?.driverName || 'Driver In Process'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup Time:</span>
                    <span className="text-sunset-coral font-mono">{transport?.pickupTime || '09:00 AM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="text-ivory truncate max-w-[160px]">{transport?.pickupLocation || 'Airport'} ➔ {transport?.dropoffLocation || 'Hotel'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Contact:</span>
                    <span className="text-ivory font-mono text-[11px]">{transport?.driverContact || '+63 928 333 4444'}</span>
                  </div>
                </div>

                {/* Local Directory Preview */}
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-sand-muted flex items-start gap-2">
                  <Car className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-blue-300 font-medium">{countryData.countryName} Local Shuttle: </span>
                    <span className="text-ivory">{countryData.shuttles[0]?.vehicleType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-sand-muted">{b.numPax} Passengers</span>
                {isOperatorView && (
                  <button
                    type="button"
                    onClick={() => handleOpenTransportModal(b)}
                    className="px-4 py-1.5 bg-white/5 hover:bg-sunset-coral text-ivory hover:text-white rounded-full text-xs font-medium transition-all border border-white/10 cursor-pointer"
                  >
                    {transport && !isToFollow ? 'Update Shuttle' : 'Assign Local Shuttle'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. FLIGHT ASSIGNMENT MODAL WITH COUNTRY & LOCAL AIRLINE DROPDOWN           */}
      {/* ========================================================================= */}
      {editingFlightBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1014] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sunset-coral font-bold">
                  {editingFlightBooking.bookingRef} • {editingFlightBooking.destination}
                </span>
                <h3 className="font-serif-display text-2xl text-ivory">Assign Airline & Flight Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingFlightBooking(null)}
                className="p-1.5 rounded-full text-sand-muted hover:text-ivory cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Country Selector & Local Airline Dropdown */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory flex items-center gap-2 font-mono">
                  <Globe className="w-4 h-4 text-sunset-coral" />
                  Select Country & Local Airline Provider
                </span>
                <span className="text-[10px] text-sand-muted font-mono">
                  Instant Dropdown Autofill
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">
                    Operating Country Destination
                  </label>
                  <select
                    value={flightCountryKey}
                    onChange={(e) => setFlightCountryKey(e.target.value)}
                    className="w-full bg-[#070B0E] border border-white/15 rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral font-sans-body cursor-pointer"
                  >
                    {COUNTRY_LOGISTICS_DIRECTORY.map((c) => (
                      <option key={c.countryId} value={c.countryId}>
                        {c.flag} {c.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">
                    Locally Used Airline in {activeFlightCountryData.countryName}
                  </label>
                  <select
                    onChange={(e) => {
                      const selected = activeFlightCountryData.airlines.find((a) => a.id === e.target.value);
                      if (selected) handleSelectAirlineOption(selected);
                    }}
                    defaultValue=""
                    className="w-full bg-[#070B0E] border border-sunset-coral/40 rounded-xl px-3 py-2 text-xs text-sunset-coral font-medium focus:outline-none focus:border-sunset-coral font-sans-body cursor-pointer"
                  >
                    <option value="" disabled>-- Pick Local Airline Carrier --</option>
                    {activeFlightCountryData.airlines.map((a) => (
                      <option key={a.id} value={a.id}>
                        ✈️ {a.name} ({a.defaultFlightNumber || a.iataCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-sand-muted pt-1">
                <span>Hub Terminal: <strong className="text-ivory font-mono">{activeFlightCountryData.airlines[0]?.hubTerminal || 'Terminal 2'}</strong></span>
                <button
                  type="button"
                  onClick={handleApplyFlightSuggestion}
                  className="text-sunset-coral hover:underline font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-suggest from tour package
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveFlight} className="space-y-4 text-xs font-sans-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Airline Carrier *</label>
                  <input
                    type="text"
                    required
                    value={flightForm.airline || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                    placeholder="e.g. Philippine Airlines / PAL Express"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Flight Number *</label>
                  <input
                    type="text"
                    required
                    value={flightForm.flightNumber || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })}
                    placeholder="e.g. PR-2196 / 5J-895"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-sunset-coral font-mono font-bold focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Flight Route *</label>
                <input
                  type="text"
                  required
                  value={flightForm.route || ''}
                  onChange={(e) => setFlightForm({ ...flightForm, route: e.target.value })}
                  placeholder="e.g. MNL (NAIA T2) ➔ ENI (El Nido Lio Airport)"
                  className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Terminal</label>
                  <input
                    type="text"
                    value={flightForm.terminal || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, terminal: e.target.value })}
                    placeholder="e.g. NAIA Terminal 2"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Departure (ETD)</label>
                  <input
                    type="text"
                    value={flightForm.etd || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, etd: e.target.value })}
                    placeholder="e.g. 07:15 AM"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Arrival (ETA)</label>
                  <input
                    type="text"
                    value={flightForm.eta || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, eta: e.target.value })}
                    placeholder="e.g. 08:40 AM"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">PNR / Ticket Ref</label>
                  <input
                    type="text"
                    value={flightForm.pnrCode || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, pnrCode: e.target.value })}
                    placeholder="e.g. PNR-PR90182"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Baggage Allowance</label>
                  <input
                    type="text"
                    value={flightForm.baggageAllowance || ''}
                    onChange={(e) => setFlightForm({ ...flightForm, baggageAllowance: e.target.value })}
                    placeholder="e.g. 20kg Check-in + 7kg Carry-on"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Reservation Status</label>
                  <select
                    value={flightForm.status || 'Confirmed'}
                    onChange={(e) => setFlightForm({ ...flightForm, status: e.target.value as any })}
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed (Ready & Notified)</option>
                    <option value="To Follow">In Process / To Follow</option>
                    <option value="Pending">Pending Ticketing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Saving will update the traveler's receipt from "In Process" to "Confirmed" and dispatch an instant client notification.</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFlightBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs text-sand-muted hover:text-ivory cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-sunset-coral text-white shadow-lg shadow-sunset-coral/20 cursor-pointer active:scale-95 transition-all"
                >
                  Save & Notify Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HOTEL ASSIGNMENT MODAL WITH COUNTRY & LOCAL HOTEL DROPDOWN              */}
      {/* ========================================================================= */}
      {editingHotelBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1014] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sunset-coral font-bold">
                  {editingHotelBooking.bookingRef} • {editingHotelBooking.destination}
                </span>
                <h3 className="font-serif-display text-2xl text-ivory">Assign Resort & Accommodation Voucher</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingHotelBooking(null)}
                className="p-1.5 rounded-full text-sand-muted hover:text-ivory cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Country Selector & Local Hotel Dropdown */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory flex items-center gap-2 font-mono">
                  <Globe className="w-4 h-4 text-sunset-coral" />
                  Select Country & Local Hotel/Resort
                </span>
                <span className="text-[10px] text-sand-muted font-mono">
                  Instant Dropdown Autofill
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">
                    Operating Country Destination
                  </label>
                  <select
                    value={hotelCountryKey}
                    onChange={(e) => setHotelCountryKey(e.target.value)}
                    className="w-full bg-[#070B0E] border border-white/15 rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral font-sans-body cursor-pointer"
                  >
                    {COUNTRY_LOGISTICS_DIRECTORY.map((c) => (
                      <option key={c.countryId} value={c.countryId}>
                        {c.flag} {c.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">
                    Locally Used Hotel in {activeHotelCountryData.countryName}
                  </label>
                  <select
                    onChange={(e) => {
                      const selected = activeHotelCountryData.hotels.find((h) => h.id === e.target.value);
                      if (selected) handleSelectHotelOption(selected);
                    }}
                    defaultValue=""
                    className="w-full bg-[#070B0E] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-400 font-sans-body cursor-pointer"
                  >
                    <option value="" disabled>-- Pick Local Partner Resort --</option>
                    {activeHotelCountryData.hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        🏨 {h.name} {h.stars ? `(${h.stars}★)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-sand-muted pt-1">
                <span>Location: <strong className="text-ivory">{activeHotelCountryData.hotels[0]?.location || editingHotelBooking.destination}</strong></span>
                <button
                  type="button"
                  onClick={handleApplyHotelSuggestion}
                  className="text-sunset-coral hover:underline font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-suggest from tour package
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveHotel} className="space-y-4 text-xs font-sans-body">
              <div>
                <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Hotel / Resort Name *</label>
                <input
                  type="text"
                  required
                  value={hotelForm.hotelName || ''}
                  onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                  placeholder="e.g. Seda Lio Resort / Henann Palm Beach Resort"
                  className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Room Type</label>
                  <input
                    type="text"
                    value={hotelForm.roomType || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, roomType: e.target.value })}
                    placeholder="e.g. Deluxe Ocean View Villa"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Voucher Code</label>
                  <input
                    type="text"
                    value={hotelForm.voucherCode || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, voucherCode: e.target.value })}
                    placeholder="e.g. HTL-2026-99"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-sunset-coral font-mono font-bold focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={hotelForm.checkInDate || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkInDate: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    value={hotelForm.checkOutDate || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkOutDate: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Hotel Status</label>
                  <select
                    value={hotelForm.status || 'Confirmed'}
                    onChange={(e) => setHotelForm({ ...hotelForm, status: e.target.value as any })}
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-ivory focus:outline-none focus:border-sunset-coral cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed (Voucher Issued)</option>
                    <option value="To Follow">In Process / To Follow</option>
                    <option value="Pending">Pending Room Allocation</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={hotelForm.contactPhone || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, contactPhone: e.target.value })}
                    placeholder="e.g. +63 917 888 2026"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Location / Inclusions</label>
                  <input
                    type="text"
                    value={hotelForm.location || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                    placeholder="e.g. Station 1 Beachfront / Lio Tourism Estate"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Saving will update the traveler's receipt and dispatch an instant accommodation confirmation notification.</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHotelBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs text-sand-muted hover:text-ivory cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-sunset-coral text-white shadow-lg shadow-sunset-coral/20 cursor-pointer active:scale-95 transition-all"
                >
                  Save Resort Voucher & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SHUTTLE ASSIGNMENT MODAL WITH COUNTRY & LOCAL SHUTTLE DROPDOWN         */}
      {/* ========================================================================= */}
      {editingTransportBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1014] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sunset-coral font-bold">
                  {editingTransportBooking.bookingRef} • {editingTransportBooking.destination}
                </span>
                <h3 className="font-serif-display text-2xl text-ivory">Dispatch Shuttle & Fleet Transfer</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTransportBooking(null)}
                className="p-1.5 rounded-full text-sand-muted hover:text-ivory cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Country Selector & Local Shuttle Dropdown */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory flex items-center gap-2 font-mono">
                  <Globe className="w-4 h-4 text-sunset-coral" />
                  Select Country & Local Shuttle Provider
                </span>
                <span className="text-[10px] text-sand-muted font-mono">
                  Instant Dropdown Autofill
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">
                    Operating Country Destination
                  </label>
                  <select
                    value={transportCountryKey}
                    onChange={(e) => setTransportCountryKey(e.target.value)}
                    className="w-full bg-[#070B0E] border border-white/15 rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral font-sans-body cursor-pointer"
                  >
                    {COUNTRY_LOGISTICS_DIRECTORY.map((c) => (
                      <option key={c.countryId} value={c.countryId}>
                        {c.flag} {c.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">
                    Locally Used Shuttle in {activeTransportCountryData.countryName}
                  </label>
                  <select
                    onChange={(e) => {
                      const selected = activeTransportCountryData.shuttles.find((s) => s.id === e.target.value);
                      if (selected) handleSelectShuttleOption(selected);
                    }}
                    defaultValue=""
                    className="w-full bg-[#070B0E] border border-blue-500/40 rounded-xl px-3 py-2 text-xs text-blue-300 font-medium focus:outline-none focus:border-blue-400 font-sans-body cursor-pointer"
                  >
                    <option value="" disabled>-- Pick Local Shuttle / Transfer Fleet --</option>
                    {activeTransportCountryData.shuttles.map((s) => (
                      <option key={s.id} value={s.id}>
                        🚐 {s.vehicleType} ({s.operator})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-sand-muted pt-1">
                <span>Default Pickup: <strong className="text-ivory">{activeTransportCountryData.shuttles[0]?.defaultPickup || 'Airport Arrival Bay'}</strong></span>
                <button
                  type="button"
                  onClick={handleApplyTransportSuggestion}
                  className="text-sunset-coral hover:underline font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-suggest from tour package
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveTransport} className="space-y-4 text-xs font-sans-body">
              <div>
                <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Vehicle Description *</label>
                <input
                  type="text"
                  required
                  value={transportForm.vehicleType || ''}
                  onChange={(e) => setTransportForm({ ...transportForm, vehicleType: e.target.value })}
                  placeholder="e.g. Toyota HiAce Grandia / 14-Seater Coaster Van"
                  className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Driver / Escort Name</label>
                  <input
                    type="text"
                    value={transportForm.driverName || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, driverName: e.target.value })}
                    placeholder="e.g. Kuya Ronald Mendoza"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Plate Number / Fleet Conduction ID</label>
                  <input
                    type="text"
                    value={transportForm.plateNumber || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, plateNumber: e.target.value })}
                    placeholder="e.g. NAA-8842"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-sunset-coral font-mono font-bold focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={transportForm.pickupTime || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, pickupTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Driver Contact</label>
                  <input
                    type="text"
                    value={transportForm.driverContact || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, driverContact: e.target.value })}
                    placeholder="e.g. +63 928 333 4444"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-ivory font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Transfer Status</label>
                  <select
                    value={transportForm.status || 'Dispatched'}
                    onChange={(e) => setTransportForm({ ...transportForm, status: e.target.value as any })}
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-ivory focus:outline-none focus:border-sunset-coral cursor-pointer"
                  >
                    <option value="Dispatched">Dispatched (Driver Assigned)</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="To Follow">In Process / To Follow</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={transportForm.pickupLocation || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, pickupLocation: e.target.value })}
                    placeholder="e.g. Airport Arrival Bay"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-sand-muted mb-1">Dropoff Location</label>
                  <input
                    type="text"
                    value={transportForm.dropoffLocation || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, dropoffLocation: e.target.value })}
                    placeholder="e.g. Hotel / Resort Lobby"
                    className="w-full bg-[#070B0E] border border-white/10 rounded-xl px-3.5 py-2 text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Saving will update the traveler's receipt with driver and fleet details, notifying them in real-time.</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTransportBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs text-sand-muted hover:text-ivory cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-sunset-coral text-white shadow-lg shadow-sunset-coral/20 cursor-pointer active:scale-95 transition-all"
                >
                  Save Dispatch & Notify Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
