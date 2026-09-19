import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  X, 
  ArrowRight,
  Lock
} from 'lucide-react';

export interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  details?: Array<{ label: string; value: string | React.ReactNode }>;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'primary';
  confirmIcon?: React.ReactNode;
  warningNote?: string;
  isLoading?: boolean;
}

export const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  details,
  confirmText = 'Yes, Confirm Action',
  cancelText = 'No, Go Back',
  variant = 'primary',
  confirmIcon,
  warningNote,
  isLoading = false
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  const variantConfig = {
    danger: {
      icon: <ShieldAlert className="w-7 h-7 text-rose-400" />,
      iconBg: 'bg-rose-500/15 border-rose-500/30',
      confirmBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 border-rose-500',
      accentBorder: 'border-rose-500/40',
      highlightBadge: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    warning: {
      icon: <AlertTriangle className="w-7 h-7 text-amber-400" />,
      iconBg: 'bg-amber-500/15 border-amber-500/30',
      confirmBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/30 border-amber-400',
      accentBorder: 'border-amber-500/40',
      highlightBadge: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    success: {
      icon: <CheckCircle2 className="w-7 h-7 text-emerald-400" />,
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      confirmBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 border-emerald-500',
      accentBorder: 'border-emerald-500/40',
      highlightBadge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    primary: {
      icon: <HelpCircle className="w-7 h-7 text-sunset-coral" />,
      iconBg: 'bg-sunset-coral/15 border-sunset-coral/30',
      confirmBtn: 'bg-sunset-coral hover:bg-[#ff765b] text-white shadow-sunset-coral/30 border-sunset-coral',
      accentBorder: 'border-sunset-coral/40',
      highlightBadge: 'text-sunset-coral bg-sunset-coral/10 border-sunset-coral/30'
    }
  }[variant];

  const modalNode = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-lg bg-[#0A0F14] border ${variantConfig.accentBorder} rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-left my-auto max-h-[90vh] overflow-y-auto overscroll-contain`}
          >
            {/* Header with Icon and Close Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl border ${variantConfig.iconBg} flex items-center justify-center shrink-0 shadow-inner`}>
                  {variantConfig.icon}
                </div>
                <div>
                  <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${variantConfig.highlightBadge} font-semibold`}>
                    Confirmation Required
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-ivory font-serif-display mt-1">
                    {title}
                  </h3>
                </div>
              </div>

              {!isLoading && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-sand-muted hover:text-ivory flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-sand-muted font-sans-body leading-relaxed">
              {message}
            </p>

            {/* Structured Details Box (if provided) */}
            {details && details.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#060A0D] border border-white/10 space-y-2 text-xs">
                {details.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 pb-1.5 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-sand-muted font-sans-body">{item.label}</span>
                    <span className="font-mono text-ivory font-semibold text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Safety Warning Note */}
            {warningNote && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span className="leading-snug">{warningNote}</span>
              </div>
            )}

            {/* Yes/No Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-sand-muted hover:text-ivory text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className={`px-6 py-2.5 rounded-xl border font-semibold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 ${variantConfig.confirmBtn} disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  confirmIcon || <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalNode, document.body);
};
