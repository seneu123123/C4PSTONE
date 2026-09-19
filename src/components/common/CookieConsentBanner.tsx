import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Settings2, 
  Check, 
  X, 
  Lock, 
  BarChart3, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { CookiePreferences } from '../../types/compliance';
import { 
  getStoredCookiePreferences, 
  saveCookiePreferences, 
  DEFAULT_COOKIE_PREFS 
} from '../../utils/analytics';

interface CookieConsentBannerProps {
  onOpenLegalModal: (tab: 'cookies' | 'privacy') => void;
  forceOpenPreferences?: boolean;
  onClosePreferencesModal?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenLegalModal,
  forceOpenPreferences = false,
  onClosePreferencesModal
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(() => getStoredCookiePreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Modal draft preferences
  const [draftAnalytics, setDraftAnalytics] = useState(false);
  const [draftMarketing, setDraftMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredCookiePreferences();
    if (!stored) {
      // Delay slightly for smooth page load transition
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    } else {
      setDraftAnalytics(stored.analytics);
      setDraftMarketing(stored.marketing);
    }
  }, []);

  useEffect(() => {
    if (forceOpenPreferences) {
      const current = getStoredCookiePreferences() || DEFAULT_COOKIE_PREFS;
      setDraftAnalytics(current.analytics);
      setDraftMarketing(current.marketing);
      setShowPreferencesModal(true);
    }
  }, [forceOpenPreferences]);

  const handleAcceptAll = () => {
    const updated = saveCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true
    });
    setPreferences(updated);
    setShowBanner(false);
    setShowPreferencesModal(false);
    if (onClosePreferencesModal) onClosePreferencesModal();
  };

  const handleRejectNonEssential = () => {
    const updated = saveCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false
    });
    setPreferences(updated);
    setShowBanner(false);
    setShowPreferencesModal(false);
    if (onClosePreferencesModal) onClosePreferencesModal();
  };

  const handleSaveCustom = () => {
    const updated = saveCookiePreferences({
      essential: true,
      analytics: draftAnalytics,
      marketing: draftMarketing
    });
    setPreferences(updated);
    setShowBanner(false);
    setShowPreferencesModal(false);
    if (onClosePreferencesModal) onClosePreferencesModal();
  };

  const handleClosePreferences = () => {
    setShowPreferencesModal(false);
    if (onClosePreferencesModal) onClosePreferencesModal();
  };

  return (
    <>
      {/* 1. Floating Bottom Banner (Only when no choice has been registered) */}
      {showBanner && !showPreferencesModal && (
        <aside
          role="region"
          aria-label="Cookie and Data Privacy Consent"
          className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 bg-[#090E14]/95 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl animate-fade-in text-sand-muted font-sans-body"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sunset-coral/20 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ivory tracking-wide uppercase">
                    Privacy & Cookie Controls
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    ISO/IEC 27001
                  </span>
                </div>
                <p className="text-xs text-sand-muted leading-relaxed font-light">
                  We value your privacy. We use essential storage for booking sessions and zero-trust security. You can choose whether to enable anonymized performance telemetry.
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLegalModal('cookies')}
                  className="text-[11px] text-sand-muted hover:text-ivory underline transition"
                >
                  Cookie Policy
                </button>
                <span className="text-white/20">•</span>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="text-[11px] text-sand-muted hover:text-ivory underline transition"
                >
                  Privacy Notice
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setShowPreferencesModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-ivory text-xs font-medium transition"
                  aria-label="Customize cookie choices"
                >
                  Preferences
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-sand-muted hover:text-ivory text-xs font-medium transition"
                  aria-label="Reject non-essential tracking"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white text-xs font-semibold tracking-wider transition shadow-md shadow-sunset-coral/20"
                  aria-label="Accept all cookies and analytics"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Granular Preferences Modal */}
      {showPreferencesModal && (
        <div 
          className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fade-in cursor-pointer"
          onClick={handleClosePreferences}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
        >
          <div 
            className="relative w-full max-w-xl bg-[#090E14] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-sunset-coral/15 flex items-center justify-center text-sunset-coral">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="cookie-preferences-title" className="font-serif-display text-2xl text-ivory font-light">
                    Cookie & Telemetry Preferences
                  </h3>
                  <p className="text-[11px] text-sand-muted font-light">
                    Compliant with ISO/IEC 27001 and RA 10173 standards.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreferencesModal(false);
                  if (onClosePreferencesModal) onClosePreferencesModal();
                }}
                aria-label="Close cookie preferences modal"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Toggles */}
            <div className="space-y-4 text-xs font-sans-body">
              {/* Category 1: Essential */}
              <div className="bg-[#0D141B] p-4 rounded-2xl border border-white/[0.08] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-ivory font-medium">Strictly Necessary & Security</span>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Always Active
                    </span>
                  </div>
                  <p className="text-sand-muted font-light text-[11px] leading-relaxed">
                    Essential for secure authentication, CSRF tokens, maintaining passenger manifest data in the booking portal, and preserving your privacy choices.
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className="bg-[#0D141B] p-4 rounded-2xl border border-white/[0.08] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-ivory font-medium">Performance & Usability Telemetry</span>
                  </div>
                  <p className="text-sand-muted font-light text-[11px] leading-relaxed">
                    Assists us in understanding page loading speeds, popular itinerary views, and checkout completion rates. All IP addresses are stripped, and no personal data is collected.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draftAnalytics}
                  onClick={() => setDraftAnalytics(!draftAnalytics)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-sunset-coral ${
                    draftAnalytics ? 'bg-sunset-coral' : 'bg-white/10'
                  }`}
                  aria-label="Toggle performance and analytics tracking"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      draftAnalytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Category 3: Personalization & Preferences */}
              <div className="bg-[#0D141B] p-4 rounded-2xl border border-white/[0.08] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-ivory font-medium">Archipelago Preferences</span>
                  </div>
                  <p className="text-sand-muted font-light text-[11px] leading-relaxed">
                    Stores custom weather units (°C/°F), high-contrast accessibility view toggles, and saved search filters for a smoother repeat expedition experience.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draftMarketing}
                  onClick={() => setDraftMarketing(!draftMarketing)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-sunset-coral ${
                    draftMarketing ? 'bg-sunset-coral' : 'bg-white/10'
                  }`}
                  aria-label="Toggle personalization and archipelago preferences"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      draftMarketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 rounded-full text-xs text-sand-muted hover:text-ivory transition"
              >
                Reject All Non-Essential
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCustom}
                  className="px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-ivory text-xs font-medium transition"
                >
                  Save Choices
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white text-xs font-semibold tracking-wider transition shadow-lg shadow-sunset-coral/20"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
