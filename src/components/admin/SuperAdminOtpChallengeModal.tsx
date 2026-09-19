import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  X, 
  RefreshCw, 
  Lock, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { 
  verifyEmailOtpCode, 
  generateEmailOtpCode, 
  dispatchEmailOtp, 
  getActiveEmailOtp,
  EmailVerificationSession
} from '../../utils/cryptoAuth';
import { 
  grantSuperAdminOtpSession, 
  logSecurityEvent,
  findStaffAccountByEmail 
} from '../../utils/rbac';

interface SuperAdminOtpChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  actionTitle: string;
  actionDescription: string;
  onSuccess: () => void;
}

export const SuperAdminOtpChallengeModal: React.FC<SuperAdminOtpChallengeModalProps> = ({
  isOpen,
  onClose,
  adminEmail,
  actionTitle,
  actionDescription,
  onSuccess
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [activeSession, setActiveSession] = useState<EmailVerificationSession | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [useBackupMode, setUseBackupMode] = useState(false);
  const [backupCodeInput, setBackupCodeInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const hasDispatchedForOpenRef = useRef(false);

  // Auto-dispatch or retrieve active OTP when modal opens
  useEffect(() => {
    if (!isOpen) {
      setOtpCode('');
      setError(null);
      setUseBackupMode(false);
      setBackupCodeInput('');
      hasDispatchedForOpenRef.current = false;
      return;
    }

    if (hasDispatchedForOpenRef.current) return;
    hasDispatchedForOpenRef.current = true;

    const emailToUse = adminEmail || 'karlljacob8@gmail.com';
    const existing = getActiveEmailOtp(emailToUse);

    if (existing && existing.expiresAt > Date.now() + 60000) {
      setActiveSession(existing);
    } else {
      handleDispatchNewOtp();
    }

    // Auto focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [isOpen, adminEmail]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDispatchNewOtp = async () => {
    const emailToUse = adminEmail || 'karlljacob8@gmail.com';
    setIsDispatching(true);
    setError(null);

    try {
      const staff = findStaffAccountByEmail(emailToUse);
      const toName = staff?.fullName || 'Super Administrator';
      
      // Generate & dispatch
      const { session } = await dispatchEmailOtp(emailToUse, toName);
      setActiveSession(session);
      setResendCooldown(30); // 30s cooldown
    } catch (err) {
      console.error('Failed to dispatch OTP', err);
      // Fallback local session
      const session = generateEmailOtpCode(emailToUse);
      setActiveSession(session);
      setResendCooldown(30);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsVerifying(true);

    const emailToUse = adminEmail || 'karlljacob8@gmail.com';
    const staff = findStaffAccountByEmail(emailToUse);

    try {
      if (useBackupMode) {
        if (!backupCodeInput.trim()) {
          setError('Please enter your emergency 2FA backup recovery code.');
          setIsVerifying(false);
          return;
        }

        const verification = verifyEmailOtpCode(emailToUse, backupCodeInput.trim(), staff?.backupCodes);
        if (!verification.valid) {
          setError(verification.error || 'Invalid emergency backup recovery code.');
          setIsVerifying(false);
          return;
        }
      } else {
        const cleanCode = otpCode.trim().replace(/\D/g, '');
        if (cleanCode.length !== 6) {
          setError('Please enter a valid 6-digit authentication passcode.');
          setIsVerifying(false);
          return;
        }

        const verification = verifyEmailOtpCode(emailToUse, cleanCode, staff?.backupCodes);
        if (!verification.valid) {
          setError(verification.error || 'Invalid or expired 6-digit verification code. Please check your email or resend.');
          setIsVerifying(false);
          return;
        }
      }

      // Granted 2-minute window (120,000 ms)
      grantSuperAdminOtpSession(emailToUse, 2 * 60 * 1000);

      await logSecurityEvent(
        emailToUse,
        'SUPER_ADMIN_ACTION_OTP_VERIFIED',
        `Super Admin successfully verified 6-digit OTP step-up challenge for action: "${actionTitle}". 2-Minute operational clearance window activated.`,
        'info',
        emailToUse
      );

      setIsVerifying(false);
      onClose();
      onSuccess();
    } catch (err) {
      setIsVerifying(false);
      setError('An unexpected authorization error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="superadmin-otp-title"
    >
      <div className="relative w-full max-w-lg bg-[#0B1014] border border-sunset-coral/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[95vh] overflow-y-auto overscroll-contain my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral shadow-lg shadow-sunset-coral/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="superadmin-otp-title" className="font-serif-display text-2xl text-ivory font-light">
                  Super Admin Authorization
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-mono uppercase font-bold tracking-wider">
                  2m Lease
                </span>
              </div>
              <p className="text-xs text-sand-muted mt-0.5 font-sans-body">
                Step-up 6-digit OTP verification required for high-clearance RBAC actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Description Card */}
        <div className="p-4 rounded-2xl bg-[#070B0E] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-sunset-coral font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Target Action
            </span>
            <span className="text-sand-muted font-mono">{adminEmail}</span>
          </div>
          <div className="text-sm font-semibold text-ivory">
            {actionTitle}
          </div>
          {actionDescription && (
            <p className="text-xs text-sand-muted font-light leading-relaxed">
              {actionDescription}
            </p>
          )}
          <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Once authorized, you receive a <strong>2-minute window</strong> to perform Super Admin actions without re-entering OTP.</span>
          </div>
        </div>

        {/* Email Dispatch Info Banner */}
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-medium">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Authentication Code Dispatched</span>
            </div>
            <span className="text-[10px] font-mono text-sand-muted">
              {activeSession?.dispatchedAt || 'Active'}
            </span>
          </div>
          <p className="text-sand-muted text-[11px] leading-relaxed">
            A secure single-use 6-digit verification code has been dispatched to <strong className="text-ivory font-mono">{adminEmail}</strong>. Please check your inbox to retrieve the passcode.
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form: Standard 6-Digit OTP or Backup Recovery Code */}
        {!useBackupMode ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2 text-center sm:text-left">
              <label className="block text-xs font-medium text-ivory">
                Enter 6-Digit Verification Code
              </label>
              
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(clean);
                    setError(null);
                  }}
                  className="w-full text-center tracking-[0.45em] font-mono text-3xl sm:text-4xl py-3 px-4 bg-[#070B0E] border-2 border-white/15 focus:border-sunset-coral rounded-2xl text-ivory focus:outline-none transition shadow-inner font-bold"
                  autoComplete="one-time-code"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isDispatching}
                  onClick={handleDispatchNewOtp}
                  className="text-sunset-coral hover:text-[#ff765b] disabled:text-sand-muted flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend 6-Digit Code'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUseBackupMode(true);
                    setError(null);
                  }}
                  className="text-sand-muted hover:text-ivory transition-colors underline decoration-dotted text-[11px]"
                >
                  Use Backup Recovery Code
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sand-muted hover:text-ivory transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={otpCode.length !== 6 || isVerifying}
                className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] disabled:bg-white/10 text-white font-semibold tracking-wider text-xs shadow-lg shadow-sunset-coral/25 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authorize Action (2m Window)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Backup Recovery Mode Form */
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-ivory">
                  Emergency 2FA Backup Recovery Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupMode(false);
                    setError(null);
                  }}
                  className="text-sunset-coral hover:text-[#ff765b] text-[11px]"
                >
                  ← Back to Email OTP
                </button>
              </div>

              <input
                type="text"
                placeholder="e.g. 5831-9241"
                value={backupCodeInput}
                onChange={(e) => setBackupCodeInput(e.target.value)}
                className="w-full font-mono text-base py-2.5 px-4 bg-[#070B0E] border border-white/15 focus:border-sunset-coral rounded-xl text-ivory focus:outline-none"
              />
              <p className="text-[11px] text-sand-muted font-light leading-relaxed">
                Enter any of the 5 emergency backup codes generated when your staff account was provisioned.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sand-muted hover:text-ivory transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!backupCodeInput.trim() || isVerifying}
                className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] disabled:bg-white/10 text-white font-semibold tracking-wider text-xs shadow-lg shadow-sunset-coral/25 transition-all"
              >
                {isVerifying ? 'Verifying...' : 'Authorize with Backup Code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

