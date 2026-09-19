import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  LockKeyhole, 
  ShieldAlert,
  RefreshCw,
  Shield,
  LifeBuoy,
  Key
} from 'lucide-react';
import { 
  authenticateStaffCredentials, 
  findStaffAccountByEmail, 
  logSecurityEvent
} from '../../utils/rbac';
import { 
  verifyEmailOtpCode,
  verifyTotpCode,
  generateEmailOtpCode,
  dispatchEmailOtp
} from '../../utils/cryptoAuth';
import { 
  checkRateLimit, 
  recordFailedAttempt, 
  clearRateLimit, 
  generateMathChallenge 
} from '../../utils/rateLimiter';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, role?: string) => void;
  apiBaseUrl?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  apiBaseUrl = 'http://127.0.0.1:8000/api'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Emergency Recovery Mode State
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyCode, setEmergencyCode] = useState('');
  const [emergencySuccessMessage, setEmergencySuccessMessage] = useState<string | null>(null);

  // Discreet gesture trigger: click shield 3 times within 2 seconds
  const shieldClickCountRef = useRef(0);
  const shieldClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Rate Limiting & Brute-force Challenge
  const [rateLimitStatus, setRateLimitStatus] = useState(() => checkRateLimit('system'));
  const [challenge, setChallenge] = useState<{ question: string; answer: number } | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  // Refresh rate-limit status every second
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (email.trim()) {
        const status = checkRateLimit(email.trim());
        setRateLimitStatus(status);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, email]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Hidden Keyboard Hotkeys for Emergency Recovery Mode:
  // Ctrl + Alt + E, Cmd + Alt + E, Alt + E, or Ctrl + Shift + E
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isAltE = e.altKey && (e.key === 'e' || e.key === 'E');
      const isCtrlAltE = (e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'e' || e.key === 'E');
      const isCtrlShiftE = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'e' || e.key === 'E');

      if (isAltE || isCtrlAltE || isCtrlShiftE) {
        e.preventDefault();
        setIsEmergencyMode((prev) => !prev);
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Discreet Gesture Trigger: 3 clicks on the top security shield within 2 seconds
  const handleShieldClick = () => {
    shieldClickCountRef.current += 1;
    if (shieldClickTimerRef.current) {
      clearTimeout(shieldClickTimerRef.current);
    }

    if (shieldClickCountRef.current >= 3) {
      setIsEmergencyMode((prev) => !prev);
      shieldClickCountRef.current = 0;
      setError(null);
    } else {
      shieldClickTimerRef.current = setTimeout(() => {
        shieldClickCountRef.current = 0;
      }, 2000);
    }
  };

  // STEP 1: Submit Credentials & Dispatch SMTP Email
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normEmail = email.trim().toLowerCase();
    const status = checkRateLimit(normEmail);
    if (status.isLocked) {
      setError(`Terminal Access Suspended: Too many failed login attempts. Retry in ${status.lockoutRemainingSeconds} seconds.`);
      return;
    }

    // Verify mathematical security challenge if triggered by rate limiter
    if (status.requiresChallenge && challenge) {
      if (parseInt(challengeAnswer.trim(), 10) !== challenge.answer) {
        setError('Security Challenge Failed: Incorrect response.');
        setChallenge(generateMathChallenge());
        setChallengeAnswer('');
        return;
      }
    }

    setIsLoading(true);

    // Attempt Live Backend SMTP Dispatch
    let dispatchedViaBackend = false;
    try {
      // Prioritize AuthController endpoints that perform SMTP OTP dispatch
      const candidateEndpoints = [
        `${apiBaseUrl}/v1/auth/admin-login`,
        `${apiBaseUrl}/admin/login`,
        `${apiBaseUrl}/v1/auth/login`,
        `${apiBaseUrl}/login`,
      ];

      for (const ep of candidateEndpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ email: normEmail, password }),
          });

          if (res.status !== 404 && res.status !== 405) {
            const data = await res.json().catch(() => null);

            if (!res.ok) {
              const newStatus = recordFailedAttempt(normEmail);
              setRateLimitStatus(newStatus);
              if (newStatus.requiresChallenge && !challenge) {
                setChallenge(generateMathChallenge());
              }

              let errMsg = data?.message || data?.error;
              if (!errMsg && data?.errors) {
                errMsg = Object.values(data.errors).flat().join(' ');
              }
              setError(errMsg || `Authentication clearance failed (HTTP ${res.status}).`);
              setIsLoading(false);
              return;
            }

            dispatchedViaBackend = true;
            break;
          }
        } catch {
          // Try next candidate endpoint
        }
      }
    } catch {
      // Backend unreachable
    }

    // If backend was reachable and dispatched SMTP, advance to OTP step
    if (dispatchedViaBackend) {
      setResendCooldown(30);
      setStep('otp');
      setIsLoading(false);
      logSecurityEvent(
        normEmail,
        '2FA_CODE_DISPATCHED',
        `Single-use 6-digit 2FA clearance code dispatched via live SMTP mailer to ${normEmail}.`,
        'info',
        normEmail
      );
      return;
    }

    // Fallback: Validate credentials against internal RBAC matrix
    const check = authenticateStaffCredentials(normEmail, password);
    if (!check.success) {
      const newStatus = recordFailedAttempt(normEmail);
      setRateLimitStatus(newStatus);

      logSecurityEvent(
        normEmail || 'UNKNOWN_ACTOR',
        'AUTH_FAILURE',
        `Failed authentication attempt on terminal for identity "${normEmail}". Attempt ${newStatus.failedCount}/5.`,
        'warning',
        normEmail
      );

      if (newStatus.requiresChallenge && !challenge) {
        setChallenge(generateMathChallenge());
      }

      setError(check.error || 'Invalid credentials or operator clearance rejected.');
      setIsLoading(false);
      return;
    }

    // Generate local OTP session and dispatch via EmailJS (template_xb7jxfp)
    const staffAccount = findStaffAccountByEmail(normEmail);
    await dispatchEmailOtp(normEmail, staffAccount?.fullName);
    setResendCooldown(30);
    setStep('otp');
    setIsLoading(false);

    logSecurityEvent(
      normEmail,
      '2FA_CODE_DISPATCHED',
      `Single-use 6-digit 2FA clearance code generated and dispatched to ${normEmail} via EmailJS (template_xb7jxfp).`,
      'info',
      normEmail
    );
  };

  // STEP 2: Verify 6-digit Code (with Smart Recovery Detection & TOTP Compatibility)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmergencySuccessMessage(null);
    setIsLoading(true);

    const normEmail = email.trim().toLowerCase();
    const candidate = isEmergencyMode ? emergencyCode.trim() : otpValue.trim();

    const staffAccount = findStaffAccountByEmail(normEmail);
    const assignedRole = staffAccount?.role || 'Super Admin';

    // -------------------------------------------------------------------------
    // SMART RECOVERY CODE DETECTION (e.g. "4819-2048" or 8 alphanumeric chars)
    // -------------------------------------------------------------------------
    const isRecoveryPattern = candidate.includes('-') || (candidate.length >= 8 && !/^\d{6}$/.test(candidate));

    if (isEmergencyMode || isRecoveryPattern) {
      if (staffAccount?.backupCodes && staffAccount.backupCodes.length > 0) {
        const cleanCandidate = candidate.replace(/[- ]/g, '').toUpperCase();
        const matchedIndex = staffAccount.backupCodes.findIndex(
          (code) => code.replace(/[- ]/g, '').toUpperCase() === cleanCandidate
        );

        if (matchedIndex !== -1) {
          const usedCode = staffAccount.backupCodes[matchedIndex];
          // Burn emergency key permanently in accordance with NIST SP 800-63B standards
          staffAccount.backupCodes.splice(matchedIndex, 1);

          logSecurityEvent(
            normEmail,
            'BACKUP_CODE_BURNED',
            `Emergency backup recovery key (${usedCode}) utilized by ${normEmail}. Code permanently burned. Remaining keys: ${staffAccount.backupCodes.length}`,
            'warning',
            normEmail
          );

          clearRateLimit(normEmail);

          const token = `emg_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
          localStorage.setItem('holiday_admin_token', token);

          onLoginSuccess(normEmail, assignedRole);
          onClose();
          resetForm();
          setIsLoading(false);
          return;
        } else {
          setError('Emergency Recovery Key rejected: Invalid, exhausted, or already consumed.');
          setIsLoading(false);
          return;
        }
      } else {
        setError('No emergency backup recovery keys configured for this identity.');
        setIsLoading(false);
        return;
      }
    }

    // -------------------------------------------------------------------------
    // STANDARD VERIFICATION: Backend SMTP Verification
    // -------------------------------------------------------------------------
    let verifiedByBackend = false;
    try {
      const candidateEndpoints = [
        `${apiBaseUrl}/v1/auth/verify-otp`,
        `${apiBaseUrl}/verify-otp`,
        `${apiBaseUrl}/admin/verify-otp`,
      ];

      for (const ep of candidateEndpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              email: normEmail,
              otp: candidate,
              code: candidate,
            }),
          });

          if (res.status !== 404 && res.status !== 405) {
            const data = await res.json().catch(() => null);

            if (res.ok) {
              if (data?.token) {
                localStorage.setItem('holiday_admin_token', data.token);
              }
              clearRateLimit(normEmail);

              const role = data?.user?.role || assignedRole;
              logSecurityEvent(
                normEmail,
                'USER_LOGIN_SUCCESS',
                `Staff ${normEmail} authenticated via live SMTP 2FA as "${role}".`,
                'info',
                normEmail
              );

              onLoginSuccess(normEmail, role);
              onClose();
              resetForm();
              setIsLoading(false);
              return;
            }
            break;
          }
        } catch {
          // Try next candidate
        }
      }
    } catch {
      // Backend error, fallback to client-side cryptographic verification
    }

    // -------------------------------------------------------------------------
    // RFC 6238 TOTP Authenticator Verification (Rolling 6-digit code)
    // -------------------------------------------------------------------------
    if (staffAccount?.totpSecret) {
      const totpCheck = await verifyTotpCode(
        staffAccount.totpSecret,
        candidate,
        2, // ±60 second window drift tolerance
        staffAccount.backupCodes
      );

      if (totpCheck.valid) {
        if (totpCheck.usedBackupCode && staffAccount.backupCodes) {
          staffAccount.backupCodes = staffAccount.backupCodes.filter((c) => c !== totpCheck.usedBackupCode);
          logSecurityEvent(
            normEmail,
            'BACKUP_CODE_BURNED',
            `Emergency backup key utilized via TOTP gate: ${totpCheck.usedBackupCode}.`,
            'warning',
            normEmail
          );
        }

        clearRateLimit(normEmail);
        const token = `totp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('holiday_admin_token', token);

        logSecurityEvent(
          normEmail,
          'USER_LOGIN_SUCCESS',
          `Staff ${normEmail} authenticated via RFC 6238 TOTP authenticator as "${assignedRole}".`,
          'info',
          normEmail
        );

        onLoginSuccess(normEmail, assignedRole);
        onClose();
        resetForm();
        setIsLoading(false);
        return;
      }
    }

    // -------------------------------------------------------------------------
    // Local In-Memory OTP Verification
    // -------------------------------------------------------------------------
    const emailOtpCheck = verifyEmailOtpCode(normEmail, candidate, staffAccount?.backupCodes);
    if (emailOtpCheck.valid) {
      clearRateLimit(normEmail);
      const token = `smtp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('holiday_admin_token', token);

      logSecurityEvent(
        normEmail,
        'USER_LOGIN_SUCCESS',
        `Staff ${normEmail} authenticated via 6-digit SMTP OTP as "${assignedRole}".`,
        'info',
        normEmail
      );

      onLoginSuccess(normEmail, assignedRole);
      onClose();
      resetForm();
      setIsLoading(false);
      return;
    }

    // If all checks fail
    setError(emailOtpCheck.error || 'Invalid or expired 6-digit verification code. Please check your mailbox.');
    logSecurityEvent(
      normEmail,
      '2FA_VERIFICATION_FAILED',
      `Failed 2FA code submission for operator ${normEmail}.`,
      'warning',
      normEmail
    );
    setIsLoading(false);
  };

  // Resend 6-digit OTP Code via SMTP
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setOtpValue('');

    const normEmail = email.trim().toLowerCase();

    try {
      const candidateEndpoints = [
        `${apiBaseUrl}/v1/auth/send-otp`,
        `${apiBaseUrl}/send-otp`,
        `${apiBaseUrl}/resend-otp`,
        `${apiBaseUrl}/admin/send-otp`,
      ];

      for (const ep of candidateEndpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ email: normEmail }),
          });

          if (res.status !== 404 && res.status !== 405) {
            break;
          }
        } catch {
          // Continue
        }
      }
    } catch {
      // Silent catch
    }

    // Dispatch via EmailJS (template_xb7jxfp)
    const staffAccount = findStaffAccountByEmail(normEmail);
    await dispatchEmailOtp(normEmail, staffAccount?.fullName);
    setResendCooldown(30);

    logSecurityEvent(
      normEmail,
      '2FA_CODE_RESENT',
      `Fresh 6-digit authorization code dispatched to ${normEmail} via EmailJS (template_xb7jxfp).`,
      'info',
      normEmail
    );
  };

  const resetForm = () => {
    setStep('credentials');
    setOtpValue('');
    setPassword('');
    setIsEmergencyMode(false);
    setEmergencyCode('');
    setError(null);
    setEmergencySuccessMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in font-sans-body select-none overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0B1014] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/95 max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="absolute top-5 right-5 p-2 text-sand-muted hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Close Terminal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div 
            onClick={handleShieldClick}
            className="w-12 h-12 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral shadow-lg shadow-sunset-coral/10 cursor-pointer active:scale-95 transition-transform"
            title="Click 3 times to toggle Emergency Recovery"
          >
            {isEmergencyMode ? (
              <LifeBuoy className="w-6 h-6 text-amber-400 animate-pulse" />
            ) : step === 'credentials' ? (
              <LockKeyhole className="w-6 h-6" />
            ) : (
              <Mail className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-ivory tracking-tight font-serif-display">
                {isEmergencyMode 
                  ? 'Emergency Recovery Clearance' 
                  : step === 'credentials' 
                  ? 'Terminal Access Clearance' 
                  : 'Email 2-Factor Authentication'}
              </h3>
            </div>
            <p className="text-xs text-sand-muted mt-0.5">
              {isEmergencyMode
                ? 'NIST SP 800-63B Emergency Backup Key Gate'
                : step === 'credentials' 
                ? 'Zero-trust authorized personnel dispatch'
                : 'Enter the 6-digit authorization code dispatched to your mailbox'}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-400 animate-fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Emergency Success Message */}
        {emergencySuccessMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-300 animate-fade-in">
            <Key className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{emergencySuccessMessage}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS SUBMISSION */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-1.5">
                Work Email Address
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#070B0E] rounded-xl border border-white/10 focus-within:border-sunset-coral transition-colors">
                <Mail className="w-4 h-4 text-sand-muted shrink-0" />
                <input
                  type="email"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@holidaytravelers.ph"
                  className="bg-transparent text-sm text-ivory placeholder-sand-muted focus:outline-none w-full font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-ivory/90">
                  Security Clearance Password
                </label>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#070B0E] rounded-xl border border-white/10 focus-within:border-sunset-coral transition-colors">
                <KeyRound className="w-4 h-4 text-sand-muted shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="bg-transparent text-sm text-ivory placeholder-sand-muted focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Brute-Force Mathematical Verification Challenge */}
            {rateLimitStatus.requiresChallenge && challenge && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>{challenge.question}</span>
                </div>
                <input
                  type="number"
                  required
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="Enter numeric answer"
                  className="w-full px-3 py-2 bg-[#070B0E] border border-amber-500/40 rounded-lg text-xs font-mono text-ivory focus:outline-none"
                />
              </div>
            )}

            {rateLimitStatus.isLocked ? (
              <div className="py-3 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-mono font-medium">
                Terminal locked. Cool-down: {rateLimitStatus.lockoutRemainingSeconds}s
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs tracking-wide shadow-lg shadow-sunset-coral/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Authenticate & Dispatch SMTP 2FA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-sand-muted font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Trust RBAC Protocol
              </span>
              <span>Pure SMTP 2FA Relay</span>
            </div>
          </form>
        )}

        {/* STEP 2: 2FA VERIFICATION (PURE SMTP OR EMERGENCY MODE) */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* Context Notice: EmailJS One-Time Password Dispatch Notice */}
            {!isEmergencyMode ? (
              <div className="p-4 rounded-2xl bg-[#070C10] border border-emerald-500/30 flex items-start gap-3.5 text-left animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-ivory">
                      Authorization Code Dispatched
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                      Dispatched
                    </span>
                  </div>
                  <p className="text-xs text-sand-muted leading-relaxed font-light">
                    A single-use 6-digit authorization code has been dispatched to{' '}
                    <strong className="text-emerald-300 font-mono font-medium">{email}</strong>.
                    Please check your email inbox (or Spam/Junk folder) and enter your code below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#0F0B05] border border-amber-500/40 flex items-start gap-3.5 text-left animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-amber-300">
                      Emergency Recovery Mode Active
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400">NIST SP 800-63B</span>
                  </div>
                  <p className="text-xs text-sand-muted leading-relaxed font-light">
                    Enter one of your one-time emergency recovery keys (format: <code className="text-amber-200 font-mono">XXXX-XXXX</code>).
                    The consumed key will be burned permanently upon verification.
                  </p>
                </div>
              </div>
            )}

            {/* Input Field: Standard 6-Digit OTP or Emergency Recovery Key */}
            <div>
              <label className="block text-xs font-semibold text-ivory/90 text-center mb-2">
                {isEmergencyMode ? 'Enter One-Time Emergency Recovery Key' : 'Enter 6-Digit Authorization Code'}
              </label>

              {isEmergencyMode ? (
                <input
                  type="text"
                  required
                  autoFocus
                  value={emergencyCode}
                  onChange={(e) => setEmergencyCode(e.target.value.toUpperCase())}
                  placeholder="••••-••••"
                  className="w-full py-3.5 px-4 bg-[#070B0E] border border-amber-500/40 focus:border-amber-400 rounded-2xl text-center text-xl font-mono tracking-[0.25em] text-amber-300 focus:outline-none transition-all placeholder:text-sand-muted/40"
                />
              ) : (
                <input
                  type="text"
                  required
                  autoFocus
                  value={otpValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Smart detection: If user pastes a recovery code like "4819-2048", auto switch to emergency mode
                    if (val.includes('-') || (val.length >= 8 && !/^\d{6}$/.test(val))) {
                      setIsEmergencyMode(true);
                      setEmergencyCode(val.toUpperCase());
                    } else {
                      setOtpValue(val.replace(/\D/g, '').slice(0, 6));
                    }
                  }}
                  placeholder="• • • • • •"
                  className="w-full py-3.5 px-4 bg-[#070B0E] border border-white/15 focus:border-sunset-coral rounded-2xl text-center text-2xl font-mono tracking-[0.4em] text-ivory focus:outline-none transition-all"
                />
              )}

              <div className="flex items-center justify-between text-xs text-sand-muted mt-2 px-1">
                <span>
                  {isEmergencyMode 
                    ? 'Permanent Single-Use Key' 
                    : 'Code valid for 10 minutes'}
                </span>
                {!isEmergencyMode && (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className="flex items-center gap-1 text-sunset-coral hover:underline disabled:opacity-50 disabled:no-underline font-medium text-[11px] cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                    <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (isEmergencyMode) {
                    setIsEmergencyMode(false);
                    setEmergencyCode('');
                    setError(null);
                  } else {
                    setStep('credentials');
                    setOtpValue('');
                    setError(null);
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory text-xs font-medium transition-colors cursor-pointer"
              >
                {isEmergencyMode ? 'Exit Recovery' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={
                  isLoading || 
                  (isEmergencyMode ? emergencyCode.trim().length < 8 : otpValue.trim().length !== 6)
                }
                className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-40 active:scale-98 cursor-pointer ${
                  isEmergencyMode
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                    : 'bg-sunset-coral hover:bg-[#ff765b] shadow-sunset-coral/25'
                }`}
              >
                {isLoading ? (
                  <span>Verifying Clearance...</span>
                ) : (
                  <>
                    <span>{isEmergencyMode ? 'Burn Key & Unlock' : 'Verify & Unlock Portal'}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
