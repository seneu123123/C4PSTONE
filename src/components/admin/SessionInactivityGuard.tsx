import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lock, Clock, ShieldAlert, LogOut, KeyRound } from 'lucide-react';
import { authenticateStaffCredentials, logSecurityEvent } from '../../utils/rbac';

interface SessionInactivityGuardProps {
  adminEmail: string;
  adminRole: string;
  onLogout: () => void;
  children: React.ReactNode;
  idleTimeoutMinutes?: number; // default 15 mins
  warningSeconds?: number; // default 120s before timeout
}

export const SessionInactivityGuard: React.FC<SessionInactivityGuardProps> = ({
  adminEmail,
  adminRole,
  onLogout,
  children,
  idleTimeoutMinutes = 15,
  warningSeconds = 120
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningSeconds);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const totalTimeoutMs = idleTimeoutMinutes * 60 * 1000;
  const warningThresholdMs = totalTimeoutMs - warningSeconds * 1000;

  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);

  // Reset activity timestamp on genuine user action
  const recordActivity = useCallback(() => {
    if (!isLocked) {
      lastActivityRef.current = Date.now();
      if (showWarning) {
        setShowWarning(false);
        setCountdown(warningSeconds);
      }
    }
  }, [isLocked, showWarning, warningSeconds]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleEvent = () => recordActivity();

    events.forEach((evt) => window.addEventListener(evt, handleEvent, { passive: true }));

    intervalRef.current = window.setInterval(() => {
      if (isLocked) return;

      const idleDuration = Date.now() - lastActivityRef.current;

      if (idleDuration >= totalTimeoutMs) {
        // Lock screen
        setIsLocked(true);
        setShowWarning(false);
        logSecurityEvent(
          adminEmail,
          'SESSION_IDLE_LOCKOUT',
          `Operations console locked automatically after ${idleTimeoutMinutes} minutes of inactivity.`,
          'warning'
        );
      } else if (idleDuration >= warningThresholdMs) {
        // Show warning countdown
        const remainingSec = Math.max(0, Math.ceil((totalTimeoutMs - idleDuration) / 1000));
        setShowWarning(true);
        setCountdown(remainingSec);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleEvent));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [adminEmail, idleTimeoutMinutes, isLocked, recordActivity, totalTimeoutMs, warningThresholdMs]);

  // Handle Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    setIsUnlocking(true);

    const auth = authenticateStaffCredentials(adminEmail, unlockPassword);
    if (!auth.success) {
      setUnlockError(auth.error || 'Incorrect password. Unlock failed.');
      setIsUnlocking(false);
      return;
    }

    logSecurityEvent(
      adminEmail,
      'SESSION_UNLOCKED',
      `Console unlocked successfully by ${adminEmail}.`,
      'info'
    );

    setIsLocked(false);
    setShowWarning(false);
    setUnlockPassword('');
    lastActivityRef.current = Date.now();
    setIsUnlocking(false);
  };

  return (
    <>
      {/* 1. Normal Content Render */}
      {children}

      {/* 2. Inactivity Warning Banner (Appears at 13 minutes) */}
      {showWarning && !isLocked && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#0B1014] border border-amber-500/40 rounded-2xl p-4 shadow-2xl shadow-black/80 animate-fade-in text-ivory">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Session Timeout Warning
                </span>
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {countdown}s
                </span>
              </div>
              <p className="text-[11px] text-sand-muted leading-relaxed">
                Your operations console will be locked due to inactivity to protect sensitive travel manifests.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={recordActivity}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-all active:scale-95"
                >
                  Keep Session Active
                </button>
                <button
                  type="button"
                  onClick={() => setIsLocked(true)}
                  className="px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted text-xs rounded-lg transition-colors"
                >
                  Lock Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Screen Lock Barrier (Requires Password to Resume) */}
      {isLocked && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#070B0E]/95 backdrop-blur-2xl animate-fade-in font-sans-body overflow-y-auto">
          <div className="w-full max-w-md bg-[#0B1014] border border-white/15 rounded-3xl p-8 shadow-2xl shadow-black text-center space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-900/30">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-ivory font-serif-display">
                Terminal Security Lock
              </h3>
              <p className="text-xs text-sand-muted mt-1.5">
                Session was locked due to {idleTimeoutMinutes} minutes of inactivity.
              </p>
            </div>

            <div className="p-3 bg-[#070B0E] rounded-xl border border-white/[0.08] text-xs text-sand-muted flex items-center justify-between">
              <div className="text-left">
                <div className="font-mono text-ivory font-medium line-clamp-1">{adminEmail}</div>
                <div className="text-[10px] text-rose-400">{adminRole}</div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/25">
                Locked
              </span>
            </div>

            {unlockError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400 flex items-center gap-2 text-left">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{unlockError}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#070B0E] rounded-xl border border-white/15 focus-within:border-sunset-coral transition-colors">
                <KeyRound className="w-4 h-4 text-sand-muted shrink-0" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="Enter your password to unlock"
                  className="bg-transparent text-sm text-ivory placeholder-sand-muted focus:outline-none w-full"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-rose-400 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>

                <button
                  type="submit"
                  disabled={isUnlocking || !unlockPassword}
                  className="flex-1 py-3 px-4 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs tracking-wide shadow-lg shadow-sunset-coral/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  {isUnlocking ? 'Verifying...' : 'Unlock Console'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
