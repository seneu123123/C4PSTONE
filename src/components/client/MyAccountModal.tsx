import React, { useState } from 'react';
import { 
  User, 
  X, 
  Check, 
  AlertCircle, 
  CreditCard, 
  Ticket, 
  Palette, 
  ShieldCheck, 
  Phone, 
  Globe, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  ExternalLink,
  ChevronRight,
  Clock,
  Heart,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { UserProfile, updateUserProfileInDb } from '../../utils/supabaseClient';
import { Booking, AppSettings } from '../../types';
import { dispatchAppNotification } from '../../utils/notifications';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelerUser: UserProfile | null;
  userBookings: Booking[];
  onUpdateProfile: (updated: UserProfile) => void;
  onUpdateAppSettings?: (settings: Partial<AppSettings>) => void;
  appSettings?: AppSettings;
  onOpenTracker?: (bookingRef?: string) => void;
}

export const MyAccountModal: React.FC<MyAccountModalProps> = ({
  isOpen,
  onClose,
  travelerUser,
  userBookings,
  onUpdateProfile,
  onUpdateAppSettings,
  appSettings,
  onOpenTracker
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'theme' | 'vouchers'>('overview');

  // Edit Profile Form State
  const [fullName, setFullName] = useState<string>(travelerUser?.full_name || '');
  const [phone, setPhone] = useState<string>(travelerUser?.phone || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(travelerUser?.emergency_contact || '');
  const [nationality, setNationality] = useState<string>(travelerUser?.nationality || 'Filipino');
  const [dietaryPreferences, setDietaryPreferences] = useState<string>(travelerUser?.dietary_preferences || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(travelerUser?.avatar_url || '');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string>('');

  // Theme Customization State
  const [selectedAccent, setSelectedAccent] = useState<string>(appSettings?.theme?.accentColor || 'coral');
  const [selectedTone, setSelectedTone] = useState<string>(appSettings?.theme?.bgTone || 'obsidian');
  const [cardGlow, setCardGlow] = useState<boolean>(appSettings?.theme?.cardGlow ?? true);

  if (!isOpen) return null;

  // Calculate Balance Breakdown
  const activeBookingsWithBalance = userBookings.filter((b) => (b.invoice?.balanceDue || 0) > 0);
  const totalOutstandingBalance = userBookings.reduce((sum, b) => sum + (b.invoice?.balanceDue || 0), 0);
  const totalPaidAmount = userBookings.reduce((sum, b) => sum + (b.invoice?.amountPaid || 0), 0);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerUser?.email) return;

    setIsSavingProfile(true);
    setProfileSuccessMsg('');

    try {
      const updated = await updateUserProfileInDb({
        id: travelerUser.id,
        email: travelerUser.email,
        full_name: fullName.trim() || travelerUser.full_name,
        phone: phone.trim(),
        emergency_contact: emergencyContact.trim(),
        nationality: nationality.trim(),
        dietary_preferences: dietaryPreferences.trim(),
        avatar_url: avatarUrl.trim() || travelerUser.avatar_url,
        role: travelerUser.role,
        status: travelerUser.status,
        auth_provider: travelerUser.auth_provider,
        theme_preferences: {
          accentColor: selectedAccent,
          bgTone: selectedTone,
          cardGlow
        }
      });

      onUpdateProfile(updated);
      setProfileSuccessMsg('Account details and database record synchronized successfully!');
      dispatchAppNotification({
        title: 'Profile Updated',
        message: 'Your personal traveler information has been updated in database records.',
        type: 'info'
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveTheme = () => {
    if (onUpdateAppSettings && appSettings) {
      onUpdateAppSettings({
        ...appSettings,
        theme: {
          ...appSettings.theme,
          accentColor: selectedAccent as any,
          bgTone: selectedTone as any,
          cardGlow
        }
      });
      dispatchAppNotification({
        title: 'Theme Applied',
        message: 'Your custom display theme and accent colors have been saved.',
        type: 'info'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#090E14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0F1722] via-[#090E14] to-[#0D1520] border-b border-white/10 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            {travelerUser?.avatar_url || avatarUrl ? (
              <img 
                src={avatarUrl || travelerUser?.avatar_url || ''} 
                alt={fullName || travelerUser?.full_name || 'Traveler'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-sunset-coral shadow-lg shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunset-coral/30 to-sunset-coral/10 border-2 border-sunset-coral/60 text-sunset-coral flex items-center justify-center text-xl font-bold font-serif-display shrink-0">
                {(fullName || travelerUser?.full_name || 'T').charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-display text-xl sm:text-2xl text-ivory font-light">
                  {fullName || travelerUser?.full_name || 'Traveler Profile'}
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Account</span>
                </span>
              </div>
              <p className="text-xs font-mono text-sand-muted mt-0.5">{travelerUser?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-sand-muted hover:text-ivory flex items-center justify-center transition-all cursor-pointer relative z-10"
            aria-label="Close My Account"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 overflow-x-auto bg-[#070B0E]">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-medium transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-sunset-coral text-sunset-coral bg-sunset-coral/10'
                : 'border-transparent text-sand-muted hover:text-ivory'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Overview & Balances</span>
            {totalOutstandingBalance > 0 && (
              <span className="w-2 h-2 rounded-full bg-sunset-coral animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-medium transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-sunset-coral text-sunset-coral bg-sunset-coral/10'
                : 'border-transparent text-sand-muted hover:text-ivory'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Edit Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-medium transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-sunset-coral text-sunset-coral bg-sunset-coral/10'
                : 'border-transparent text-sand-muted hover:text-ivory'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Display Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-medium transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'vouchers'
                ? 'border-sunset-coral text-sunset-coral bg-sunset-coral/10'
                : 'border-transparent text-sand-muted hover:text-ivory'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Active Tickets ({userBookings.length})</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: OVERVIEW & BALANCES */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Outstanding Balance Banner */}
              {totalOutstandingBalance > 0 ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-sunset-coral/10 to-amber-950/40 border-2 border-sunset-coral/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sunset-coral/20 border border-sunset-coral/50 flex items-center justify-center text-sunset-coral">
                        <AlertCircle className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sunset-coral font-bold block">
                          Outstanding Balance Reminder
                        </span>
                        <h4 className="text-xl font-serif-display text-ivory">
                          ₱{totalOutstandingBalance.toLocaleString()} Unpaid Remaining
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenTracker && activeBookingsWithBalance.length > 0) {
                          onOpenTracker(activeBookingsWithBalance[0].bookingRef);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs shadow-lg shadow-sunset-coral/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Settle Balance / Upload Proof</span>
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <span className="text-[11px] text-sand-muted font-mono uppercase block">Unpaid Bookings Breakdown:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeBookingsWithBalance.map((b) => (
                        <div key={b.id} className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-sunset-coral font-bold block">{b.bookingRef}</span>
                            <span className="text-[11px] text-sand-muted truncate block max-w-[180px]">{b.tourTitle}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-rose-300 font-mono font-bold block">₱{(b.invoice?.balanceDue || 0).toLocaleString()}</span>
                            <span className="text-[10px] text-sand-muted block">{b.travelDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your account is 100% fully settled! No outstanding balances pending for your reservations.</span>
                </div>
              )}

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans-body">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-sand-muted uppercase font-mono">Total Expeditions</span>
                  <p className="text-2xl font-serif-display text-ivory">{userBookings.length} Bookings</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-sand-muted uppercase font-mono">Total Settled Payment</span>
                  <p className="text-2xl font-serif-display text-emerald-400">₱{totalPaidAmount.toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-sand-muted uppercase font-mono">Total Remaining Balance</span>
                  <p className={`text-2xl font-serif-display ${totalOutstandingBalance > 0 ? 'text-sunset-coral' : 'text-emerald-400'}`}>
                    ₱{totalOutstandingBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Personal Essential Info Card */}
              <div className="bg-[#070B0E] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-serif-display text-base text-ivory flex items-center gap-2">
                    <User className="w-4 h-4 text-sunset-coral" />
                    <span>Essential Passenger File</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="text-xs text-sunset-coral hover:underline font-mono"
                  >
                    Edit Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-sand-muted font-mono uppercase block">Full Name:</span>
                    <span className="text-ivory font-medium">{fullName || travelerUser?.full_name || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-sand-muted font-mono uppercase block">Email Address:</span>
                    <span className="text-ivory font-mono">{travelerUser?.email || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-sand-muted font-mono uppercase block">Mobile Phone:</span>
                    <span className="text-ivory font-mono">{phone || travelerUser?.phone || 'Not configured'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-sand-muted font-mono uppercase block">Nationality:</span>
                    <span className="text-ivory font-medium">{nationality || travelerUser?.nationality || 'Filipino'}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-sand-muted font-mono uppercase block">Emergency Contact Person:</span>
                    <span className="text-ivory font-medium">{emergencyContact || travelerUser?.emergency_contact || 'Not configured'}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-sand-muted font-mono uppercase block">Dietary & Accessibility Preferences:</span>
                    <span className="text-ivory font-medium">{dietaryPreferences || travelerUser?.dietary_preferences || 'Standard passenger meal'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans-body">
              {profileSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Full Legal Name (Matching Passport or Government ID) <span className="text-sunset-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Maria Clara Santos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory text-xs focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Email Address (Read-only Account ID)
                  </label>
                  <input
                    type="email"
                    value={travelerUser?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sand-muted text-xs font-mono cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Mobile Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +63 917 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory text-xs font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Filipino, American, Japanese"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory text-xs focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Emergency Contact Person & Phone Number
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Juan Santos (Spouse) - 0918 987 6543"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory text-xs focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Dietary, Medical, or Accessibility Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={dietaryPreferences}
                    onChange={(e) => setDietaryPreferences(e.target.value)}
                    placeholder="e.g. Halal meals requested, seafood allergy, mobility assistance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory text-xs focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-sand-muted block font-mono">
                    Avatar Image Photo URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or profile image link"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory text-xs font-mono focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs shadow-lg shadow-sunset-coral/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving & Syncing to DB...' : 'Save Profile & Sync Database'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: THEME & DISPLAY SETTINGS */}
          {activeTab === 'theme' && (
            <div className="space-y-6 text-xs font-sans-body">
              <div className="space-y-3">
                <h4 className="font-serif-display text-base text-ivory flex items-center gap-2">
                  <Palette className="w-4 h-4 text-sunset-coral" />
                  <span>Accent Color Theme</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'coral', name: 'Sunset Coral', color: 'bg-[#F26A4F]' },
                    { id: 'emerald', name: 'Emerald Lagoon', color: 'bg-[#10B981]' },
                    { id: 'cyan', name: 'Azure Sky', color: 'bg-[#06B6D4]' },
                    { id: 'violet', name: 'Royal Violet', color: 'bg-[#8B5CF6]' },
                    { id: 'amber', name: 'Sunburst Amber', color: 'bg-[#F59E0B]' }
                  ].map((accent) => (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => setSelectedAccent(accent.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        selectedAccent === accent.id
                          ? 'border-sunset-coral bg-sunset-coral/15 text-ivory'
                          : 'border-white/10 bg-white/5 text-sand-muted hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${accent.color} shadow-md`} />
                      <span className="text-[11px] font-medium">{accent.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif-display text-base text-ivory flex items-center gap-2">
                  <Moon className="w-4 h-4 text-sunset-coral" />
                  <span>Background Tone Canvas Mode</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTone('obsidian')}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      selectedTone === 'obsidian'
                        ? 'border-sunset-coral bg-sunset-coral/15 text-ivory'
                        : 'border-white/10 bg-white/5 text-sand-muted'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#070B0E] border border-white/20 flex items-center justify-center text-ivory">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">Deep Obsidian Dark Mode</span>
                      <span className="text-[10px] text-sand-muted block">High-contrast volcanic aesthetic</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTone('soft')}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      selectedTone === 'soft'
                        ? 'border-sunset-coral bg-sunset-coral/15 text-ivory'
                        : 'border-white/10 bg-white/5 text-sand-muted'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#111822] border border-white/20 flex items-center justify-center text-cyan-300">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">Midnight Sapphire</span>
                      <span className="text-[10px] text-sand-muted block">Cool oceanic atmosphere</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-ivory block">Card Glow & Glassmorphism Effects</span>
                  <span className="text-[10px] text-sand-muted block">Enable ambient neon drop-shadows and subtle glass reflections</span>
                </div>
                <input
                  type="checkbox"
                  checked={cardGlow}
                  onChange={(e) => setCardGlow(e.target.checked)}
                  className="rounded bg-[#070B0E] border-white/20 text-sunset-coral focus:ring-sunset-coral cursor-pointer w-4 h-4"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTheme}
                  className="px-6 py-3 rounded-xl bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs shadow-lg shadow-sunset-coral/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Theme Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MY TICKETS & VOUCHERS */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4 text-xs">
              {userBookings.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Ticket className="w-8 h-8 text-sand-muted opacity-40 mx-auto" />
                  <p className="text-sand-muted font-sans-body">No active ticket vouchers found for your account.</p>
                </div>
              ) : (
                userBookings.map((b) => {
                  const balance = b.invoice?.balanceDue || 0;
                  return (
                    <div key={b.id} className="p-4 rounded-2xl bg-[#070B0E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sunset-coral">{b.bookingRef}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            balance > 0 
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/30' 
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {balance > 0 ? `Unpaid Balance: ₱${balance.toLocaleString()}` : 'Fully Settled'}
                          </span>
                        </div>
                        <h5 className="font-serif-display text-sm text-ivory">{b.tourTitle}</h5>
                        <p className="text-[11px] text-sand-muted font-mono">Departure: {b.travelDate} • {b.numPax} Passengers</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onOpenTracker) onOpenTracker(b.bookingRef);
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-ivory font-mono text-xs border border-white/15 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer"
                      >
                        <span>View Ticket Voucher</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
