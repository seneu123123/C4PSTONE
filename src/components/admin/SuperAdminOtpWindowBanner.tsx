import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  KeyRound
} from 'lucide-react';
import { SUPER_ADMIN_OTP_SESSION_DURATION_MS } from '../../utils/rbac';

interface SuperAdminOtpWindowBannerProps {
  adminEmail: string;
  remainingMs: number;
  onLockSession?: () => void;
  onLockNow?: () => void;
  onRequestOtp?: (actionName: string, actionDesc: string, actionFn: () => void) => void;
  onUnlockNow?: () => void;
}

export const SuperAdminOtpWindowBanner: React.FC<SuperAdminOtpWindowBannerProps> = ({
  adminEmail,
  remainingMs,
  onLockSession,
  onLockNow,
  onRequestOtp,
  onUnlockNow
}) => {
  const isAuthorized = remainingMs > 0;
  
  const handleLock = () => {
    if (onLockNow) {
      onLockNow();
    } else if (onLockSession) {
      onLockSession();
    }
  };

  const handleUnlock = () => {
    if (onUnlockNow) {
      onUnlockNow();
    } else if (onRequestOtp) {
      onRequestOtp(
        'Pre-Authorize Super Admin Session',
        'Pre-authorizing 2-minute operational window for RBAC modifications',
        () => {}
      );
    }
  };
  
  // Format MM:SS
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage (out of 120s = 2 minutes)
  const totalDurationSeconds = SUPER_ADMIN_OTP_SESSION_DURATION_MS / 1000;
  const progressPercent = Math.min(100, Math.max(0, (totalSeconds / totalDurationSeconds) * 100));

  // Determine urgency color
  let accentColorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let barColorClass = 'bg-emerald-500';
  let clockColor = 'text-emerald-300';
  
  if (totalSeconds < 30) {
    accentColorClass = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    barColorClass = 'bg-rose-500';
    clockColor = 'text-rose-400 animate-pulse';
  } else if (totalSeconds < 60) {
    accentColorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    barColorClass = 'bg-amber-500';
    clockColor = 'text-amber-300';
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isAuthorized 
          ? 'bg-gradient-to-r from-[#0B1510] via-[#09110D] to-[#0B1510] border-emerald-500/30 shadow-xl shadow-emerald-950/20' 
          : 'bg-gradient-to-r from-[#120B0A] via-[#0E0909] to-[#120B0A] border-sunset-coral/25 shadow-lg'
      } p-5 sm:p-6`}
      id="super-admin-otp-window-monitor"
    >
      {/* Background Subtle Ambient Glow */}
      <div 
        className={`absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isAuthorized ? 'bg-emerald-500/10 opacity-70' : 'bg-sunset-coral/10 opacity-60'
        }`} 
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Status and Information */}
        <div className="flex items-start gap-4">
          <div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
              isAuthorized 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-sunset-coral/15 border-sunset-coral/30 text-sunset-coral'
            }`}
          >
            {isAuthorized ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ivory flex items-center gap-1.5">
                {isAuthorized ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-300">Super Admin OTP Session Authorized</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-sand-muted">Super Admin Action Guard Active</span>
                  </>
                )}
              </span>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${accentColorClass}`}>
                {isAuthorized ? '2-Minute Window Open' : 'OTP Verification Required'}
              </span>
            </div>

            <p className="text-xs text-sand-muted font-light max-w-2xl leading-relaxed">
              {isAuthorized ? (
                <>
                  High-privilege actions (provisioning, role updates, password resets, capability matrices, and revocations) execute with direct clearance for <strong className="text-ivory font-mono">{adminEmail}</strong>.
                </>
              ) : (
                <>
                  Any Super Admin modification will trigger a 6-digit Email OTP challenge. Once verified, you will have a <strong className="text-ivory">2-minute operational window</strong> before re-authentication is required.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Timer & Interactive Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:self-center shrink-0">
          {isAuthorized ? (
            <>
              {/* Countdown Display Box */}
              <div className="flex items-center gap-3 bg-black/40 border border-emerald-500/30 rounded-2xl px-4 py-2.5 shadow-inner">
                <Clock className={`w-5 h-5 ${clockColor}`} />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/80">
                    Window Remaining
                  </div>
                  <div className={`font-mono text-2xl font-bold tracking-widest ${clockColor}`}>
                    {formattedTime}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="lock-super-admin-otp-btn"
                  onClick={handleLock}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Immediately lock Super Admin session"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Now</span>
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              id="authorize-super-admin-otp-btn"
              onClick={handleUnlock}
              className="px-5 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold tracking-wider text-xs shadow-lg shadow-sunset-coral/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authorize 2-Min Window Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Live Countdown Bar when Authorized */}
      {isAuthorized && (
        <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/80">
            <span>2-Minute Lease Progress</span>
            <span>{totalSeconds}s of {totalDurationSeconds}s left</span>
          </div>
          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-emerald-500/20">
            <div 
              className={`h-full ${barColorClass} transition-all duration-1000 ease-linear rounded-full`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

