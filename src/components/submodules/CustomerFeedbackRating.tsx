import React, { useState } from 'react';
import { CustomerFeedback, Booking } from '../../types';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  User, 
  Calendar, 
  Plus, 
  X,
  Sparkles,
  BarChart3,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface CustomerFeedbackRatingProps {
  feedbacks: CustomerFeedback[];
  bookings: Booking[];
  onSubmitFeedback: (fb: CustomerFeedback) => void;
  isOperatorView: boolean;
}

export const CustomerFeedbackRating: React.FC<CustomerFeedbackRatingProps> = ({
  feedbacks,
  bookings,
  onSubmitFeedback,
  isOperatorView
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State
  const [selectedBookingRef, setSelectedBookingRef] = useState(bookings[0]?.bookingRef || '');
  const [overallRating, setOverallRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [hotelRating, setHotelRating] = useState(5);
  const [transportRating, setTransportRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [comment, setComment] = useState('');
  const [npsScore, setNpsScore] = useState(10);

  const avgOverall = (feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / (feedbacks.length || 1)).toFixed(1);
  const avgGuide = (feedbacks.reduce((sum, f) => sum + f.guideRating, 0) / (feedbacks.length || 1)).toFixed(1);
  const avgHotel = (feedbacks.reduce((sum, f) => sum + f.hotelRating, 0) / (feedbacks.length || 1)).toFixed(1);
  const avgTransport = (feedbacks.reduce((sum, f) => sum + f.transportRating, 0) / (feedbacks.length || 1)).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const relatedBooking = bookings.find((b) => b.bookingRef === selectedBookingRef) || bookings[0];

    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      bookingRef: selectedBookingRef,
      customerName: relatedBooking ? relatedBooking.customer.fullName : 'Valued Traveler',
      tourTitle: relatedBooking ? relatedBooking.tourTitle : 'Island Expedition',
      date: new Date().toISOString().split('T')[0],
      overallRating: overallRating,
      guideRating: guideRating,
      hotelRating: hotelRating,
      transportRating: transportRating,
      valueRating: valueRating,
      comment: comment || 'An extraordinary journey through the Philippine archipelago.',
      recommendationScore: npsScore,
      status: 'Approved'
    };

    onSubmitFeedback(newFeedback);
    setIsSubmitModalOpen(false);
    setComment('');
  };

  return (
    <div className="space-y-8">
      {/* Submodule Header */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-sans-body tracking-[0.25em] uppercase font-medium">
              <Star className="w-4 h-4" />
              <span>Customer Feedback & CSAT</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-ivory tracking-wide">
              Customer Feedback & CSAT Moderation
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              Measure post-expedition customer satisfaction (CSAT), track Net Promoter Scores (NPS), and curate guest reviews for public display.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sunset-coral hover:bg-[#D95339] text-white text-xs font-medium tracking-wider rounded-full shadow-lg shadow-sunset-coral/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Guest Review</span>
          </button>
        </div>

        {/* CSAT Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
          <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.06] text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted font-sans-body">Overall CSAT</span>
            <div className="font-serif-display text-3xl text-amber-400 flex items-center justify-center gap-1">
              <span>{avgOverall}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.06] text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted font-sans-body">Tour Guides</span>
            <div className="font-serif-display text-3xl text-ivory flex items-center justify-center gap-1">
              <span>{avgGuide}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.06] text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted font-sans-body">Resort Stay</span>
            <div className="font-serif-display text-3xl text-ivory flex items-center justify-center gap-1">
              <span>{avgHotel}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.06] text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted font-sans-body">Transport</span>
            <div className="font-serif-display text-3xl text-ivory flex items-center justify-center gap-1">
              <span>{avgTransport}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="bg-[#0B1014] border border-white/[0.06] hover:border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < fb.overallRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-sand-muted">{fb.date}</span>
              </div>

              <p className="text-xs text-sand-muted font-serif-display text-base text-ivory italic leading-relaxed">
                "{fb.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <span className="text-ivory font-medium block">{fb.customerName}</span>
                <span className="text-[11px] text-sunset-coral font-light">{fb.tourTitle}</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Review Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1014] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-xs font-sans-body uppercase tracking-wider text-sunset-coral font-medium">
                  Traveler Feedback
                </span>
                <h3 className="font-serif-display text-2xl text-ivory">Submit Tour Review</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-full text-sand-muted hover:text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Booking Reference</label>
                <select
                  value={selectedBookingRef}
                  onChange={(e) => setSelectedBookingRef(e.target.value)}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.bookingRef}>
                      {b.bookingRef} — {b.customer.fullName} ({b.tourTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-sand-muted mb-1.5 font-sans-body">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setOverallRating(val)}
                      className={`p-2 rounded-lg border transition ${
                        overallRating >= val
                          ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                          : 'bg-[#070B0E] border-white/10 text-sand-muted'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Your Impressions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your experience with the tour guide, boat captain, secret lagoons, and meals..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-sunset-coral"
                  aria-label="Feedback review and impressions"
                />
              </div>

              {/* Data Privacy Consent for Feedback Publication */}
              <div className="bg-[#070B0E] border border-white/[0.08] rounded-xl p-3 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sand-muted text-xs font-light leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 text-sunset-coral focus:ring-sunset-coral bg-[#0B1014] shrink-0"
                    aria-label="Consent to publish review"
                  />
                  <span>
                    I consent to the publication of this review and my traveler first name on the Holiday Archipelago portal in accordance with the Data Privacy Policy.
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-sand-muted hover:text-ivory"
                  aria-label="Cancel submitting review"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-medium bg-sunset-coral text-white shadow-lg shadow-sunset-coral/20 hover:bg-[#ff765b] transition"
                  aria-label="Post traveler review"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
