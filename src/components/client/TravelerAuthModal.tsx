import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Compass,
  UserCheck,
  Send,
  Loader2
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  sendEmailOtp, 
  verifyEmailOtpToken,
  UserProfile 
} from '../../utils/supabaseClient';

interface TravelerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  onContinueAsGuest?: () => void;
  reasonMessage?: string;
  initialTab?: 'google_email' | 'signup' | 'guest';
}

export const TravelerAuthModal: React.FC<TravelerAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onContinueAsGuest,
  reasonMessage,
  initialTab = 'google_email'
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'otp' | 'guest'>(
    initialTab === 'signup' ? 'signup' : initialTab === 'guest' ? 'guest' : 'signin'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setOtpToken('');
    setIsOtpSent(false);
    setError(null);
    setSuccessMsg(null);
    setLoading(false);
    setGoogleLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setActiveTab(initialTab === 'signup' ? 'signup' : initialTab === 'guest' ? 'guest' : 'signin');
    } else {
      resetForm();
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const switchTab = (tab: 'signin' | 'signup' | 'otp' | 'guest') => {
    setActiveTab(tab);
    setPassword('');
    setOtpToken('');
    setError(null);
    setSuccessMsg(null);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setError(err?.message || 'Google sign-in could not be completed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await signInWithEmailPassword(email, password);
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url || null,
          role: 'Traveler',
          status: 'Active',
          auth_provider: 'email',
        };
        setSuccessMsg('Welcome back! Logging you in...');
        setTimeout(() => {
          onAuthSuccess(profile);
          resetForm();
          onClose();
        }, 150);
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !fullName.trim()) {
      setError('Please fill in your full name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await signUpWithEmailPassword(email, password, fullName);
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName.trim(),
          avatar_url: null,
          role: 'Traveler',
          status: 'Active',
          auth_provider: 'email',
        };
        setSuccessMsg('Account created successfully! Welcome to Holiday Travelers.');
        setTimeout(() => {
          onAuthSuccess(profile);
          resetForm();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMagicOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await sendEmailOtp(email);
      setIsOtpSent(true);
      setSuccessMsg(`A 6-digit verification code was sent to ${email}. Check your inbox!`);
    } catch (err: any) {
      setError(err?.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim()) {
      setError('Please enter the 6-digit code from your email.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await verifyEmailOtpToken(email, otpToken);
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatar_url: null,
          role: 'Traveler',
          status: 'Active',
          auth_provider: 'email_otp',
        };
        setSuccessMsg('Email verified! You are now logged in.');
        setTimeout(() => {
          onAuthSuccess(profile);
          resetForm();
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSelect = () => {
    if (onContinueAsGuest) {
      onContinueAsGuest();
    }
    resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/50 backdrop-blur-sm animate-fade-in"
      onClick={handleCloseModal}
      role="dialog"
      aria-modal="true"
      id="traveler-auth-modal"
    >
      <div 
        className="relative w-full max-w-md bg-[#080D11] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sunset-coral/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sunset-coral/20 to-amber-500/10 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
                Holiday Travelers
              </p>
              <h3 className="font-serif-display text-2xl text-ivory leading-tight">
                {activeTab === 'signin' ? 'Sign In to Account' : activeTab === 'signup' ? 'Create Traveler Profile' : activeTab === 'otp' ? 'Email Code Verification' : 'Guest Exploration'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-sand-muted hover:text-ivory hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reason Banner (e.g., checkout gate) */}
        {reasonMessage && (
          <div className="p-3.5 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 text-sunset-coral text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-light">{reasonMessage}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => switchTab('signin')}
            className={`py-2 rounded-lg font-medium transition-all ${
              activeTab === 'signin' || activeTab === 'otp'
                ? 'bg-sunset-coral text-white shadow-md'
                : 'text-sand-muted hover:text-ivory'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`py-2 rounded-lg font-medium transition-all ${
              activeTab === 'signup'
                ? 'bg-sunset-coral text-white shadow-md'
                : 'text-sand-muted hover:text-ivory'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => switchTab('guest')}
            className={`py-2 rounded-lg font-medium transition-all ${
              activeTab === 'guest'
                ? 'bg-sunset-coral text-white shadow-md'
                : 'text-sand-muted hover:text-ivory'
            }`}
          >
            Guest
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: SIGN IN (Google + Email) */}
        {/* ========================================================================= */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            {/* Google One-Tap Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full relative group flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Subtle Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-sand-muted">or email credentials</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleEmailPasswordSignIn} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                  <Mail className="w-3.5 h-3.5 text-sunset-coral" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-sunset-coral/80 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                    <Lock className="w-3.5 h-3.5 text-sunset-coral" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('otp')}
                    className="text-[11px] text-sunset-coral/90 hover:text-sunset-coral hover:underline"
                  >
                    Send Magic Code instead
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-sunset-coral/80 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sunset-coral to-[#ff765b] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-sunset-coral/25 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REGISTER */}
        {/* ========================================================================= */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                <User className="w-3.5 h-3.5 text-sunset-coral" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maria Santos"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-sunset-coral/80 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                <Mail className="w-3.5 h-3.5 text-sunset-coral" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-sunset-coral/80 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                <Lock className="w-3.5 h-3.5 text-sunset-coral" />
                <span>Password (min. 6 characters)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-sunset-coral/80 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sunset-coral to-[#ff765b] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-sunset-coral/25 disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MAGIC OTP */}
        {/* ========================================================================= */}
        {activeTab === 'otp' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                <Mail className="w-3.5 h-3.5 text-sunset-coral" />
                <span>Email Address</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-sunset-coral/80 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleSendMagicOtp}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-ivory text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-sunset-coral" />
                  <span>Send Code</span>
                </button>
              </div>
            </div>

            {isOtpSent && (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5 pt-2 border-t border-white/10 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-xs text-sand-muted flex items-center gap-1.5 font-light">
                    <KeyRound className="w-3.5 h-3.5 text-sunset-coral" />
                    <span>6-Digit Verification Code</span>
                  </label>
                  <input
                    type="text"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full bg-white/[0.04] border border-sunset-coral/50 rounded-xl px-4 py-3 text-center font-mono text-xl tracking-[0.4em] text-ivory focus:outline-none focus:border-sunset-coral transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpToken.length < 6}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-sunset-coral to-[#ff765b] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-sunset-coral/25 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-xs text-sand-muted hover:text-ivory underline"
              >
                Back to Password Sign-In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GUEST MODE */}
        {/* ========================================================================= */}
        {activeTab === 'guest' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-sand-muted/10 border border-white/10 mx-auto flex items-center justify-center text-sunset-coral">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif-display text-lg text-ivory">Explore as a Guest</h4>
              <p className="text-xs text-sand-muted leading-relaxed max-w-xs mx-auto font-light">
                You can browse expeditions, check live destination weather radar, and customize your travel party freely.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-left text-xs text-amber-200/90 space-y-1">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Notice on Final Checkout:</span>
              </p>
              <p className="text-[11px] text-amber-100/70 font-light leading-relaxed">
                Philippine DOT and IATA airline regulations require a verified email or Google profile to confirm booking vouchers and transmit flight manifests. You will be prompted to sign in when you finalize your reservation.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGuestSelect}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-ivory font-medium text-sm border border-white/15 transition-all cursor-pointer shadow-md"
            >
              Continue Browsing as Guest
            </button>
          </div>
        )}

        {/* Modal Footer Security Badge */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-sand-muted/70 font-light">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL & SSL Encrypted</span>
          </span>
          <span>Holiday Travelers Inc.</span>
        </div>
      </div>
    </div>
  );
};
