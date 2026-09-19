import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Eye, Lock, Database, Info, X, CheckCircle2 } from 'lucide-react';
import { RLSExecutionReport } from '../../utils/rowLevelSecurity';

interface RlsSecurityBadgeProps {
  report: RLSExecutionReport;
}

export const RlsSecurityBadge: React.FC<RlsSecurityBadgeProps> = ({ report }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isRestricted = report.isFiltered || report.maskedColumns.length > 0;

  return (
    <>
      {/* Compact Interactive Pill */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all border shadow-sm cursor-pointer active:scale-95 ${
          isRestricted
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
        }`}
        title="Inspect active Row Level Security (RLS) Policy"
      >
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">RLS Policy:</span>
        <span className="font-semibold text-ivory">{report.activePolicy}</span>
        {isRestricted ? (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30">
            {report.permittedRows}/{report.totalRows} Rows
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
            Full
          </span>
        )}
      </button>

      {/* RLS Policy Inspector Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans-body overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#0B1014] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-ivory font-serif-display">
                      Row-Level Security (RLS) Policy Inspector
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Zero-Trust
                    </span>
                  </div>
                  <p className="text-xs text-sand-muted mt-0.5">
                    PostgreSQL / Cloud SQL standard dataset isolation for table: <strong className="text-ivory font-mono">{report.tableName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#070B0E] border border-white/10 rounded-2xl">
                <div className="text-[10px] uppercase font-mono text-sand-muted">Session Identity</div>
                <div className="text-xs font-mono font-semibold text-ivory truncate mt-1">{report.userEmail}</div>
              </div>
              <div className="p-3 bg-[#070B0E] border border-white/10 rounded-2xl">
                <div className="text-[10px] uppercase font-mono text-sand-muted">Role Clearance</div>
                <div className="text-xs font-mono font-semibold text-sunset-coral mt-1">{report.role}</div>
              </div>
              <div className="p-3 bg-[#070B0E] border border-white/10 rounded-2xl">
                <div className="text-[10px] uppercase font-mono text-sand-muted">Permitted Rows</div>
                <div className="text-xs font-mono font-semibold text-emerald-400 mt-1">
                  {report.permittedRows} / {report.totalRows}
                </div>
              </div>
              <div className="p-3 bg-[#070B0E] border border-white/10 rounded-2xl">
                <div className="text-[10px] uppercase font-mono text-sand-muted">Blocked Rows</div>
                <div className="text-xs font-mono font-semibold text-rose-400 mt-1">
                  {report.restrictedRows} Rows
                </div>
              </div>
            </div>

            {/* Policy Details */}
            <div className="space-y-3">
              <div className="p-4 bg-[#070B0E] border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ivory flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Enforced Policy: <span className="font-mono text-cyan-300">{report.activePolicy}</span>
                  </span>
                  {report.isFiltered ? (
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Row-Filter Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Unfiltered Table
                    </span>
                  )}
                </div>
                <p className="text-xs text-sand-muted leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Column Masking info */}
              {report.maskedColumns.length > 0 ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl space-y-1.5">
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Column-Level Masking & PII Protection Active
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {report.maskedColumns.map((col) => (
                      <span key={col} className="px-2 py-0.5 rounded bg-black/40 border border-amber-500/30 text-[10px] font-mono text-amber-200">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No column masking applied. All attributes permitted under this clearance level.</span>
                </div>
              )}

              {/* SQL Equivalent Policy Script */}
              <div>
                <div className="text-[11px] uppercase font-mono text-sand-muted mb-1 flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-cyan-400" />
                  <span>PostgreSQL / Cloud SQL Equivalent RLS Directive</span>
                </div>
                <pre className="p-3 bg-black/70 border border-white/10 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                  {report.sqlEquivalent}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-ivory transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
