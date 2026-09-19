import React, { useState, useEffect } from 'react';
import { PromoPopupSettings } from '../../types';
import { X, Sparkles, Tag, ArrowRight, Check, Copy, Clock, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientPromoModalProps {
  promo: PromoPopupSettings;
  isOpen: boolean;
  onClose: () => void;
  onClaimPromo: () => void;
}

export const ClientPromoModal: React.FC<ClientPromoModalProps> = ({
  promo,
  isOpen,
  onClose,
  onClaimPromo
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!promo.discountCode) return;
    navigator.clipboard.writeText(promo.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismissToday = () => {
    localStorage.setItem('holiday_promo_dismissed_date', new Date().toDateString());
    onClose();
  };

  if (!isOpen || !promo.enabled) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto cursor-pointer"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#090E14] border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-auto grid grid-cols-1 md:grid-cols-12 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button Top-Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
            aria-label="Close Advertisement"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Visual Promo Photography & Watermark */}
          <div className="md:col-span-6 relative min-h-[260px] md:min-h-[480px] overflow-hidden bg-slate-950">
            <img
              src={promo.imageUrl || 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80'}
              alt={promo.title}
              className="w-full h-full object-cover brightness-[0.82] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090E14] via-transparent to-black/40" />

            {/* Floating Badge on Image */}
            <div className="absolute top-5 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sunset-coral text-white shadow-xl shadow-sunset-coral/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{promo.badge || 'Featured Promo'}</span>
              </span>
            </div>

            {/* Bottom Caption on Image */}
            <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1">
              <p className="text-xs text-white/70 font-mono tracking-wider uppercase">
                Holiday Travelers Inc. Special
              </p>
              <p className="font-serif-display text-xl text-ivory drop-shadow-md">
                {promo.tagline}
              </p>
            </div>
          </div>

          {/* Right Column: Promotional Copy, Voucher Code & Action CTA */}
          <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] uppercase font-mono tracking-widest text-sunset-coral font-semibold">
                  Exclusive Tour Offer
                </span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl text-ivory font-light leading-tight">
                {promo.title}
              </h2>

              <p className="text-xs sm:text-sm text-sand-muted leading-relaxed font-light">
                {promo.description}
              </p>

              {/* Discount Promo Code Box */}
              {promo.discountCode && (
                <div className="bg-[#070B0E] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sand-muted block">
                      Promotional Voucher Code
                    </span>
                    <span className="text-sm font-mono font-bold text-sunset-coral tracking-wider">
                      {promo.discountCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-sand-muted hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono border border-white/10 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {promo.expiresText && (
                <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{promo.expiresText}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClaimPromo();
                  onClose();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-sunset-coral hover:bg-[#ff765b] text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-sunset-coral/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span>{promo.actionText || 'Claim Promo & Reserve'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-sand-muted pt-1">
                <button
                  type="button"
                  onClick={handleDismissToday}
                  className="hover:text-white transition-colors cursor-pointer underline text-[11px]"
                >
                  Don't show this again today
                </button>
                <span className="text-white/30">•</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
