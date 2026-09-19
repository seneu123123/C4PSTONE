import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Cookie, 
  Lock, 
  Eye, 
  X, 
  Printer, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Mail,
  Scale
} from 'lucide-react';
import { LegalPolicyTab } from '../../types/compliance';
import { ALL_POLICIES } from '../../data/legalPolicies';

interface LegalComplianceModalProps {
  isOpen: boolean;
  initialTab?: LegalPolicyTab;
  onClose: () => void;
  onOpenCookiePreferences?: () => void;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  onOpenCookiePreferences
}) => {
  const [activeTab, setActiveTab] = useState<LegalPolicyTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen) return null;

  const currentDoc = ALL_POLICIES[activeTab];

  const tabs: { id: LegalPolicyTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'refund', label: 'Refund Policy', icon: RotateCcw },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
    { id: 'security-iso27001', label: 'ISO/IEC 27001 Security', icon: Lock },
    { id: 'accessibility-iso40500', label: 'ISO/IEC 40500 Accessibility', icon: Eye }
  ];

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print unavailable in iframe sandbox:', e);
    }
  };

  // Filtered sections if search query is entered
  const filteredSections = searchQuery.trim()
    ? currentDoc.sections.filter(
        (sec) =>
          sec.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.paragraphs.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
          sec.bulletPoints?.some((bp) => bp.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : currentDoc.sections;

  const modalNode = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fade-in cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        className="relative w-full max-w-5xl bg-[#080D11] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#0B1015] border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans-body uppercase tracking-[0.2em] text-sunset-coral font-semibold">
                  Legal & Governance Center
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DOT Accredited · ISO Conforming
                </span>
              </div>
              <h2 id="legal-modal-title" className="font-serif-display text-2xl sm:text-3xl text-ivory font-light">
                {currentDoc.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label="Print this legal policy document"
              title="Print document"
              className="p-2.5 rounded-full border border-white/10 text-sand-muted hover:text-ivory hover:bg-white/5 transition-all"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close legal policy modal"
              className="p-2.5 rounded-full border border-white/10 text-sand-muted hover:text-ivory hover:bg-white/5 transition-all"
              id="legal-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="bg-[#05080A] border-b border-white/[0.06] px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
                }`}
                aria-selected={isActive}
                role="tab"
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Meta Bar */}
        <div className="px-6 py-3 bg-[#0A0F14] border-b border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-sand-muted">
            <span className="font-mono text-[11px] text-sunset-coral">{currentDoc.standardReference}</span>
            <span>•</span>
            <span>Last reviewed: {currentDoc.lastUpdated}</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-sand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search within ${currentDoc.title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#06090D] border border-white/10 rounded-full pl-8 pr-4 py-1.5 text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-sunset-coral transition"
              aria-label="Search within current policy document"
            />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Executive Summary Card */}
          <div className="bg-[#0C1217] p-5 rounded-2xl border border-white/[0.08] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-sunset-coral/20 flex items-center justify-center text-sunset-coral shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-sans-body tracking-wider text-sunset-coral font-semibold">
                Overview & Policy Intent
              </h4>
              <p className="text-xs text-sand-muted leading-relaxed font-light">
                {currentDoc.summary}
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {filteredSections.length === 0 ? (
              <div className="py-12 text-center text-sand-muted text-xs">
                No matching policy clauses found for "{searchQuery}".
              </div>
            ) : (
              filteredSections.map((sec) => (
                <div key={sec.id} className="space-y-3">
                  <h3 className="font-serif-display text-xl sm:text-2xl text-ivory font-normal flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sunset-coral inline-block" />
                    <span>{sec.heading}</span>
                  </h3>
                  <div className="space-y-2.5 pl-3.5 border-l border-white/[0.08]">
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-sand-muted font-light leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="space-y-2 pt-2">
                        {sec.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="text-xs sm:text-sm text-ivory/85 font-light flex items-start gap-2.5">
                            <span className="text-sunset-coral text-xs mt-1">▸</span>
                            <span className="leading-relaxed">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Contact & DPO Footer Card */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0A0E13] border border-white/[0.06] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-sunset-coral font-medium">
                <Mail className="w-3.5 h-3.5" />
                <span>Data Protection Officer</span>
              </div>
              <p className="text-sand-muted font-light">
                For statutory inquiries under RA 10173 or data deletion requests, contact{' '}
                <a href="mailto:dpo@holidaytravelers.ph" className="text-ivory underline hover:text-sunset-coral">
                  dpo@holidaytravelers.ph
                </a>.
              </p>
            </div>

            {activeTab === 'cookies' && onOpenCookiePreferences && (
              <div className="p-4 rounded-xl bg-[#0A0E13] border border-white/[0.06] flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="text-ivory font-medium block">Cookie Preferences</span>
                  <p className="text-sand-muted font-light text-[11px]">Adjust your storage & analytics toggles.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCookiePreferences();
                  }}
                  className="px-4 py-2 bg-sunset-coral hover:bg-[#ff765b] text-white rounded-full text-xs font-medium transition shadow-md"
                >
                  Manage Cookies
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-4 bg-[#0A0E13] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-sand-muted">
          <p>© {new Date().getFullYear()} Holiday Travelers Travel & Tours Inc. · Regulated by DOT & NPC</p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-ivory text-xs transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalNode, document.body);
};
