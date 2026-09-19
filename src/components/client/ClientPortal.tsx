import React, { useState, useEffect } from 'react';
import { 
  Booking, 
  CustomerFeedback, 
  TourPackage 
} from '../../types';
import { UserProfile } from '../../utils/supabaseClient';
import { ClientHero } from './ClientHero';
import { ClientEthos } from './ClientEthos';
import { ClientSpecialties } from './ClientSpecialties';
import { ClientDestinations } from './ClientDestinations';
import { ClientExpeditions } from './ClientExpeditions';
import { ClientBookingTracker } from './ClientBookingTracker';
import { CustomerBookingPortal } from '../submodules/CustomerBookingPortal';
import { CustomerFeedbackRating } from '../submodules/CustomerFeedbackRating';
import { X, Calendar, Compass, MessageSquareQuote, ThumbsUp, Star, ShieldCheck } from 'lucide-react';

interface ClientPortalProps {
  packages: TourPackage[];
  bookings: Booking[];
  feedbacks: CustomerFeedback[];
  onCreateBooking: (booking: Booking) => void;
  onUpdateBooking?: (booking: Booking) => void;
  onSubmitFeedback: (feedback: CustomerFeedback) => void;
  preSelectedPackage: TourPackage | null;
  onSelectBookPackage: (pkg: TourPackage) => void;
  onClearPreSelectedPackage: () => void;
  isTrackerOpen: boolean;
  onCloseTracker: () => void;
  onOpenTracker?: (ref?: string) => void;
  trackerTargetRef?: string;
  isBookingModalOpen: boolean;
  onCloseBookingModal: () => void;
  onOpenBookingModal: (pkg?: TourPackage) => void;
  onOpenWeatherRadar?: () => void;
  onOpenLegalPolicy?: (tab: 'privacy' | 'terms' | 'refund') => void;
  promoCode?: string;
  promoDiscountPct?: number;
  currentUser?: UserProfile | null;
  onRequireAuth?: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  packages,
  bookings,
  feedbacks,
  onCreateBooking,
  onUpdateBooking,
  onSubmitFeedback,
  preSelectedPackage,
  onSelectBookPackage,
  onClearPreSelectedPackage,
  isTrackerOpen,
  onCloseTracker,
  onOpenTracker,
  trackerTargetRef,
  isBookingModalOpen,
  onCloseBookingModal,
  onOpenBookingModal,
  onOpenWeatherRadar,
  onOpenLegalPolicy,
  promoCode,
  promoDiscountPct,
  currentUser,
  onRequireAuth
}) => {
  const [showReviewsSection, setShowReviewsSection] = useState(false);
  const [localTrackerRef, setLocalTrackerRef] = useState<string | undefined>(trackerTargetRef);

  useEffect(() => {
    if (trackerTargetRef) {
      setLocalTrackerRef(trackerTargetRef);
    }
  }, [trackerTargetRef]);

  // Handle ESC key to dismiss open modals smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTrackerOpen) {
          setLocalTrackerRef(undefined);
          onCloseTracker();
        } else if (isBookingModalOpen) {
          onCloseBookingModal();
          onClearPreSelectedPackage();
        }
      }
    };

    if (isTrackerOpen || isBookingModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrackerOpen, isBookingModalOpen, onCloseTracker, onCloseBookingModal, onClearPreSelectedPackage]);

  const activePackages = packages.filter((p) => p.status === 'Active');

  return (
    <div className="w-full bg-obsidian-deep overflow-hidden">
      {/* 1. Cinematic Full-Screen Hero */}
      <ClientHero
        onExploreClick={() => {
          const ethos = document.getElementById('ethos');
          if (ethos) ethos.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookClick={() => onOpenBookingModal()}
        onWeatherClick={onOpenWeatherRadar}
      />

      {/* 2. Core Agency Capabilities & Specialties */}
      <ClientSpecialties onOpenBooking={() => onOpenBookingModal()} />

      {/* 3. Slow Travel Manifesto Ethos */}
      <ClientEthos />

      {/* 4. Featured Island Destinations Spotlight */}
      <ClientDestinations />

      {/* 5. Curated Expeditions (2-Column Emergent Journey Cards) */}
      <ClientExpeditions
        packages={activePackages}
        onSelectPackage={(pkg) => {
          onSelectBookPackage(pkg);
          onOpenBookingModal(pkg);
        }}
      />

      {/* 6. Guest Reviews & Verified Facebook Recommendations */}
      <section id="reviews" className="py-24 px-6 sm:px-8 bg-[#06090C] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium flex items-center gap-2">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Verified Recommendations</span>
              </p>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-light text-ivory">
                Voices of our <span className="italic font-normal">travelers</span>
              </h2>
              <p className="text-sand-muted text-xs sm:text-sm font-light max-w-xl">
                Real feedback from clients regarding our Hong Kong & Macau tours, visa approvals, and fast-track passport assistance.
              </p>
            </div>
            <button
              onClick={() => setShowReviewsSection(!showReviewsSection)}
              className="text-xs font-sans-body tracking-wider text-sand-muted hover:text-ivory flex items-center gap-2 border border-white/10 hover:border-sunset-coral px-5 py-2.5 rounded-full transition-all"
            >
              <MessageSquareQuote className="w-4 h-4 text-sunset-coral" />
              <span>{showReviewsSection ? 'Collapse Review Feed' : 'View Full Feed & Rating Analytics'}</span>
            </button>
          </div>

          {showReviewsSection ? (
            <div className="glass-obsidian rounded-2xl p-6 sm:p-8">
              <CustomerFeedbackRating
                feedbacks={feedbacks}
                bookings={bookings}
                onSubmitFeedback={onSubmitFeedback}
                isOperatorView={false}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-[#0B1014] p-6 rounded-2xl border border-white/[0.07] hover:border-sunset-coral/30 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-white/40">{fb.date}</span>
                    </div>

                    <p className="text-sand-muted text-xs leading-relaxed font-light italic">
                      "{fb.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-serif-display text-base text-ivory font-normal group-hover:text-sunset-coral transition-colors">
                        {fb.customerName}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Recommended</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-sunset-coral/90 font-light truncate" title={fb.tourTitle}>
                      {fb.tourTitle}
                    </p>
                    <p className="text-[10px] text-white/30 tracking-wider uppercase">
                      {fb.source || 'Facebook Recommendation'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: RESERVATION & BOOKING WIZARD */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fade-in cursor-pointer"
          onClick={() => {
            onCloseBookingModal();
            onClearPreSelectedPackage();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div 
            className="relative w-full max-w-4xl bg-[#090E13] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
                  Direct Guest Checkout
                </p>
                <h3 id="booking-modal-title" className="font-serif-display text-3xl sm:text-4xl text-ivory mt-1">
                  Begin Your Expedition
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  onCloseBookingModal();
                  onClearPreSelectedPackage();
                }}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-sand-muted hover:text-ivory hover:bg-white/10 transition-all cursor-pointer"
                id="close-booking-modal-btn"
                aria-label="Close Reservation Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Wizard Form */}
            <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              <CustomerBookingPortal
                packages={activePackages}
                bookings={bookings}
                onCreateBooking={onCreateBooking}
                onGoToTracker={(bookingRef) => {
                  setLocalTrackerRef(bookingRef);
                  onCloseBookingModal();
                  if (onOpenTracker) {
                    onOpenTracker(bookingRef);
                  }
                }}
                onUpdateBookingStatus={() => {}}
                isOperatorView={false}
                preSelectedPackage={preSelectedPackage}
                onClearPreSelectedPackage={onClearPreSelectedPackage}
                onOpenLegalPolicy={onOpenLegalPolicy}
                promoCode={promoCode}
                promoDiscountPct={promoDiscountPct}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: GUEST BOOKING & VOUCHER TRACKER */}
      {/* ========================================================================= */}
      {isTrackerOpen && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fade-in cursor-pointer"
          onClick={() => {
            setLocalTrackerRef(undefined);
            onCloseTracker();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracker-modal-title"
        >
          <div 
            className="relative w-full max-w-4xl bg-[#090E13] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
                  Self-Service Portal
                </p>
                <h3 id="tracker-modal-title" className="font-serif-display text-3xl sm:text-4xl text-ivory mt-1">
                  Track Official Voucher & Itinerary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocalTrackerRef(undefined);
                  onCloseTracker();
                }}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-sand-muted hover:text-ivory hover:bg-white/10 transition-all cursor-pointer"
                id="close-tracker-modal-btn"
                aria-label="Close Tracker Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Tracker Component */}
            <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              <ClientBookingTracker
                bookings={bookings}
                initialSelectedRef={localTrackerRef || trackerTargetRef}
                onUpdateBooking={onUpdateBooking}
                currentUser={currentUser}
                onNavigateToBook={() => {
                  setLocalTrackerRef(undefined);
                  onCloseTracker();
                  onOpenBookingModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
