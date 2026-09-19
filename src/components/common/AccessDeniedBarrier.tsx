import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck } from 'lucide-react';
import { SubmoduleTab } from '../../types';
import { TAB_DISPLAY_NAMES } from '../../utils/rbac';

interface AccessDeniedBarrierProps {
  requiredTab: SubmoduleTab;
  currentRole: string;
  currentEmail: string;
  onNavigateHome: () => void;
}

export const AccessDeniedBarrier: React.FC<AccessDeniedBarrierProps> = ({
  requiredTab,
  currentRole,
  currentEmail,
  onNavigateHome
}) => {
  return (
    <div className="bg-[#0B1014] border border-rose-500/20 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 shadow-2xl space-y-6 animate-fade-in font-sans-body">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-xl shadow-rose-500/10">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          HTTP 403 Forbidden — Access Restricted
        </div>
        <h3 className="font-serif-display text-3xl text-ivory font-light tracking-wide">
          Insufficient Clearance
        </h3>
        <p className="text-sm text-sand-muted font-light max-w-md mx-auto leading-relaxed">
          The requested submodule (<strong className="text-ivory">{TAB_DISPLAY_NAMES[requiredTab] || requiredTab}</strong>) is restricted under Holiday Travelers' Role-Based Access Control policies.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#070B0E] border border-white/[0.06] text-xs text-sand-muted space-y-1 font-mono max-w-md mx-auto text-left">
        <div className="flex justify-between">
          <span>Active Identity:</span>
          <span className="text-ivory">{currentEmail}</span>
        </div>
        <div className="flex justify-between">
          <span>Designated Role:</span>
          <span className="text-rose-400 font-semibold">{currentRole}</span>
        </div>
        <div className="flex justify-between">
          <span>Enforcement Rule:</span>
          <span className="text-sand-muted">ISO/IEC 27001 Access Separation</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={onNavigateHome}
          className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white text-xs font-semibold tracking-wider flex items-center gap-2 shadow-lg shadow-sunset-coral/20 transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Authorized Dashboard</span>
        </button>
      </div>
    </div>
  );
};
