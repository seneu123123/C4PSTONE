import React, { useState, useEffect } from 'react';
import { 
  AppSettings, 
  UiThemeSettings, 
  ThemeAccentColor, 
  ThemeFontDisplay, 
  ThemeFontBody, 
  ThemeBgTone, 
  ThemeBorderStyle, 
  ThemeFontSize,
  PromoPopupSettings
} from '../../types';
import { ClientPromoModal } from '../client/ClientPromoModal';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Palette, 
  Download, 
  RotateCcw, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Sparkles,
  Eye,
  FileText,
  Compass,
  Type,
  Moon,
  Layout,
  Crown,
  Zap,
  SlidersHorizontal,
  Laptop
} from 'lucide-react';
import { 
  ACCENT_COLORS, 
  DISPLAY_FONTS, 
  BODY_FONTS, 
  BG_TONES, 
  THEME_PRESETS, 
  applyAdminTheme 
} from '../../utils/theme';

interface SystemSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetSettings: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'theme' | 'agency' | 'promo' | 'backup'>('theme');
  const [isPreviewPromoOpen, setIsPreviewPromoOpen] = useState(false);

  // Keep local state in sync if prop changes
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handlePromoChange = (field: keyof PromoPopupSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      promo: {
        ...(prev.promo || {
          enabled: true,
          badge: 'Limited Season Promo',
          title: 'Discover the World with 8% Off',
          tagline: 'Domestic & International Early Bird Reservations',
          description: 'Lock in your summer island expedition with only 50% downpayment today.',
          discountCode: 'HOLIDAY2026',
          discountPct: 8,
          imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
          actionText: 'Claim Promo & Reserve Now',
          actionUrl: '#expeditions',
          expiresText: 'Limited to first 25 bookings this season'
        }),
        [field]: value
      }
    }));
  };

  const handleAgencyChange = (field: keyof AppSettings['agency'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      agency: {
        ...prev.agency,
        [field]: value
      }
    }));
  };

  const handleThemeChange = <K extends keyof UiThemeSettings>(field: K, value: UiThemeSettings[K]) => {
    const updatedTheme: UiThemeSettings = {
      ...formData.theme,
      [field]: value
    };

    const newFormData: AppSettings = {
      ...formData,
      theme: updatedTheme
    };

    setFormData(newFormData);
    // Real-time live visual feedback immediately
    applyAdminTheme(updatedTheme);
  };

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    const updatedTheme: UiThemeSettings = {
      ...formData.theme,
      ...preset.theme
    };

    const newFormData: AppSettings = {
      ...formData,
      theme: updatedTheme
    };

    setFormData(newFormData);
    applyAdminTheme(updatedTheme);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSettings(formData);
    applyAdminTheme(formData.theme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    onResetSettings();
    const defaultTheme: UiThemeSettings = {
      accentColor: 'coral',
      fontDisplay: 'cormorant',
      fontBody: 'jakarta',
      bgTone: 'obsidian',
      borderStyle: 'subtle',
      fontSize: 'standard',
      cardGlow: true,
    };
    applyAdminTheme(defaultTheme);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `holiday_travelers_settings_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentAccent = ACCENT_COLORS[formData.theme.accentColor] || ACCENT_COLORS.coral;
  const currentDisplayFont = DISPLAY_FONTS[formData.theme.fontDisplay] || DISPLAY_FONTS.cormorant;
  const currentBodyFont = BODY_FONTS[formData.theme.fontBody] || BODY_FONTS.jakarta;
  const currentBgTone = BG_TONES[formData.theme.bgTone] || BG_TONES.obsidian;

  return (
    <div className="space-y-8">
      {/* Module Header Banner */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-sans-body tracking-[0.25em] uppercase font-medium" style={{ color: currentAccent.hex }}>
              <Palette className="w-4 h-4" />
              <span>Operator Command Center Settings</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-ivory tracking-wide">
              Theme Aesthetics & Agency Configuration
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              Personalize typography styles, accent palettes, and atmospheric dark modes, or manage <span className="text-ivory font-normal">{formData.agency.companyName}</span> DOT registration details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2 rounded-full text-xs font-sans-body text-sand-muted hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={() => handleSave()}
              type="button"
              style={{ backgroundColor: currentAccent.hex }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Configuration Applied!</span>
                </>
              ) : (
                <>
                  <SettingsIcon className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/[0.08] text-xs font-sans-body overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('theme')}
            style={activeSubTab === 'theme' ? { backgroundColor: currentAccent.hex, color: '#FFFFFF' } : {}}
            className={`px-4 py-2 rounded-full tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'theme'
                ? 'font-semibold shadow-lg shadow-black/40'
                : 'bg-white/[0.04] text-sand-muted hover:text-ivory hover:bg-white/[0.08]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme Colors & Fonts</span>
          </button>
          <button
            onClick={() => setActiveSubTab('agency')}
            style={activeSubTab === 'agency' ? { backgroundColor: currentAccent.hex, color: '#FFFFFF' } : {}}
            className={`px-4 py-2 rounded-full tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'agency'
                ? 'font-semibold shadow-lg shadow-black/40'
                : 'bg-white/[0.04] text-sand-muted hover:text-ivory hover:bg-white/[0.08]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Agency Information & DOT</span>
          </button>
          <button
            onClick={() => setActiveSubTab('promo')}
            style={activeSubTab === 'promo' ? { backgroundColor: currentAccent.hex, color: '#FFFFFF' } : {}}
            className={`px-4 py-2 rounded-full tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'promo'
                ? 'font-semibold shadow-lg shadow-black/40'
                : 'bg-white/[0.04] text-sand-muted hover:text-ivory hover:bg-white/[0.08]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advertisement Promo Popup</span>
          </button>
          <button
            onClick={() => setActiveSubTab('backup')}
            style={activeSubTab === 'backup' ? { backgroundColor: currentAccent.hex, color: '#FFFFFF' } : {}}
            className={`px-4 py-2 rounded-full tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'backup'
                ? 'font-semibold shadow-lg shadow-black/40'
                : 'bg-white/[0.04] text-sand-muted hover:text-ivory hover:bg-white/[0.08]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Data Backup & JSON Export</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: THEME & FONT CUSTOMIZATION                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'theme' && (
        <div className="space-y-8">
          {/* 1. Quick Presets Carousel Bar */}
          <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans-body uppercase tracking-[0.2em] text-sand-muted">
                <Sparkles className="w-4 h-4" style={{ color: currentAccent.hex }} />
                <span>1-Click Curated Theme Presets</span>
              </div>
              <span className="text-[11px] text-sand-muted font-light">Instant live preview on select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isSelected = 
                  formData.theme.accentColor === preset.theme.accentColor &&
                  formData.theme.fontDisplay === preset.theme.fontDisplay &&
                  formData.theme.bgTone === preset.theme.bgTone;
                const presetAccent = ACCENT_COLORS[preset.theme.accentColor];

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-xl text-left border transition-all duration-300 relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/[0.08] shadow-lg'
                        : 'bg-[#070B0E] border-white/[0.05] hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                    style={isSelected ? { borderColor: presetAccent.hex } : {}}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{preset.previewEmoji}</span>
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: presetAccent.hex }}
                        />
                      </div>
                      <h4 className="text-sm font-medium text-ivory group-hover:text-white transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-sand-muted mt-1 line-clamp-2 font-light">
                        {preset.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: presetAccent.hex }}>
                        <Check className="w-3 h-3" />
                        <span>Active Preset</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Palette & Background Tone Customizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accent Color Palette */}
            <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" style={{ color: currentAccent.hex }} />
                  <h3 className="font-serif-display text-2xl text-ivory">Primary Accent Color</h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.05] text-sand-muted border border-white/[0.08]">
                  {currentAccent.hex}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.keys(ACCENT_COLORS) as ThemeAccentColor[]).map((key) => {
                  const color = ACCENT_COLORS[key];
                  const isSelected = formData.theme.accentColor === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange('accentColor', key)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center ${
                        isSelected
                          ? 'bg-white/[0.08] shadow-md'
                          : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20'
                      }`}
                      style={isSelected ? { borderColor: color.hex } : {}}
                    >
                      <div className="relative">
                        <div 
                          className="w-10 h-10 rounded-xl shadow-md transition-transform group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-ivory block leading-tight">{color.name}</span>
                        <span className="text-[10px] font-mono text-sand-muted">{color.hex}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Atmosphere Tone */}
            <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4" style={{ color: currentAccent.hex }} />
                  <h3 className="font-serif-display text-2xl text-ivory">Atmospheric Background Tone</h3>
                </div>
                <span className="text-xs text-sand-muted font-sans-body">{currentBgTone.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(BG_TONES) as ThemeBgTone[]).map((key) => {
                  const tone = BG_TONES[key];
                  const isSelected = formData.theme.bgTone === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange('bgTone', key)}
                      className={`p-4 rounded-xl border flex flex-col justify-between text-left transition-all ${
                        isSelected
                          ? 'bg-white/[0.08] shadow-md'
                          : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20'
                      }`}
                      style={isSelected ? { borderColor: currentAccent.hex } : {}}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 rounded-md border border-white/20"
                            style={{ backgroundColor: tone.baseBg }}
                          />
                          <div 
                            className="w-5 h-5 rounded-md border border-white/20"
                            style={{ backgroundColor: tone.cardBg }}
                          />
                        </div>
                        {isSelected && <Check className="w-4 h-4" style={{ color: currentAccent.hex }} />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-ivory block">{tone.name}</span>
                        <span className="text-[10px] font-mono text-sand-muted">Base: {tone.baseBg}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Border & Glow Styling Controls */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-sand-muted block mb-1.5 font-sans-body">
                    Card Border Contrast
                  </label>
                  <select
                    value={formData.theme.borderStyle}
                    onChange={(e) => handleThemeChange('borderStyle', e.target.value as ThemeBorderStyle)}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none"
                    style={{ borderColor: formData.theme.borderStyle === 'high-contrast' ? currentAccent.hex : undefined }}
                  >
                    <option value="subtle">Subtle Ambient (Standard)</option>
                    <option value="high-contrast">High-Contrast Accent Wireframe</option>
                    <option value="minimal">Ultra Minimalist Dark</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-sand-muted block mb-1.5 font-sans-body">
                    Interface Font Scale
                  </label>
                  <select
                    value={formData.theme.fontSize}
                    onChange={(e) => handleThemeChange('fontSize', e.target.value as ThemeFontSize)}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none"
                  >
                    <option value="compact">Compact Density (92%)</option>
                    <option value="standard">Standard Balance (100%)</option>
                    <option value="large">Comfortable Legibility (106%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Typography & Font Family Customizer */}
          <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5" style={{ color: currentAccent.hex }} />
                <h3 className="font-serif-display text-2xl text-ivory">Admin Panel Typography & Fonts</h3>
              </div>
              <span className="text-xs text-sand-muted font-sans-body">
                Custom font engine loaded via Google Fonts
              </span>
            </div>

            {/* Display / Heading Font Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-sand-muted font-medium">
                  A. Heading & Title Display Font
                </span>
                <span className="text-xs font-mono text-ivory" style={{ color: currentAccent.hex }}>
                  Active: {currentDisplayFont.name} ({currentDisplayFont.category})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {(Object.keys(DISPLAY_FONTS) as ThemeFontDisplay[]).map((key) => {
                  const font = DISPLAY_FONTS[key];
                  const isSelected = formData.theme.fontDisplay === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange('fontDisplay', key)}
                      className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-white/[0.08] shadow-lg'
                          : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                      style={isSelected ? { borderColor: currentAccent.hex } : {}}
                    >
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-ivory group-hover:text-white">
                            {font.name}
                          </span>
                          <span className="text-[10px] text-sand-muted font-sans-body">
                            {font.category}
                          </span>
                        </div>
                        <div 
                          className="text-lg text-ivory py-1 line-clamp-1 font-light"
                          style={{ fontFamily: font.family }}
                        >
                          {font.previewSample}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px]">
                        <span className="font-mono text-sand-muted">{font.id}</span>
                        {isSelected ? (
                          <span className="font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: currentAccent.hex }}>
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        ) : (
                          <span className="text-sand-muted group-hover:text-ivory">Apply Font →</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body / Interface Font Grid */}
            <div className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-sand-muted font-medium">
                  B. Body & Navigation Interface Font
                </span>
                <span className="text-xs font-mono text-ivory" style={{ color: currentAccent.hex }}>
                  Active: {currentBodyFont.name} ({currentBodyFont.category})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {(Object.keys(BODY_FONTS) as ThemeFontBody[]).map((key) => {
                  const font = BODY_FONTS[key];
                  const isSelected = formData.theme.fontBody === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange('fontBody', key)}
                      className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-white/[0.08] shadow-lg'
                          : 'bg-[#070B0E] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                      style={isSelected ? { borderColor: currentAccent.hex } : {}}
                    >
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-ivory group-hover:text-white">
                            {font.name}
                          </span>
                          <span className="text-[10px] text-sand-muted font-sans-body">
                            {font.category}
                          </span>
                        </div>
                        <p 
                          className="text-xs text-sand-muted/90 py-1 line-clamp-2 leading-relaxed"
                          style={{ fontFamily: font.family }}
                        >
                          {font.previewSample}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px]">
                        <span className="font-mono text-sand-muted">{font.id}</span>
                        {isSelected ? (
                          <span className="font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: currentAccent.hex }}>
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        ) : (
                          <span className="text-sand-muted group-hover:text-ivory">Apply Font →</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Live Interactive Component Sandbox Preview Card */}
          <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" style={{ color: currentAccent.hex }} />
                <h3 className="font-serif-display text-2xl text-ivory">Live Interactive Admin Component Preview</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${currentAccent.hex}22`, color: currentAccent.hex }}>
                Live Sandbox
              </span>
            </div>

            <div 
              className="p-6 rounded-xl border transition-all duration-300 space-y-6"
              style={{
                backgroundColor: currentBgTone.cardBg,
                borderColor: formData.theme.borderStyle === 'high-contrast' ? `${currentAccent.hex}55` : currentBgTone.borderRgba,
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: `${currentAccent.hex}25`, color: currentAccent.hex }}
                    >
                      Expedition Active
                    </span>
                    <span className="text-xs text-sand-muted font-sans-body">HT-EXP-2026-981</span>
                  </div>
                  <h4 
                    className="text-2xl sm:text-3xl text-ivory font-light"
                    style={{ fontFamily: currentDisplayFont.family }}
                  >
                    Coron Secret Lagoons & Kayangan Reef Expedition
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-sand-muted block font-sans-body">Total Fare</span>
                  <span 
                    className="text-2xl sm:text-3xl font-semibold text-ivory"
                    style={{ fontFamily: currentDisplayFont.family }}
                  >
                    ₱38,500
                  </span>
                </div>
              </div>

              <p 
                className="text-xs text-sand-muted leading-relaxed"
                style={{ fontFamily: currentBodyFont.family }}
              >
                Passenger manifest verified for 4 guests. Flight boarding passes issued, hotel reservation confirmed, and airport private shuttle ready for arrival pickup. All tourism and environmental fees settled.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <button 
                    style={{ backgroundColor: currentAccent.hex }}
                    className="px-5 py-2 rounded-full text-xs font-semibold text-white tracking-wider shadow-lg hover:brightness-110 transition"
                  >
                    Dispatch Expedition
                  </button>
                  <button className="px-4 py-2 rounded-full text-xs text-sand-muted hover:text-ivory bg-white/[0.04] border border-white/[0.08] transition">
                    View Manifest
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-sand-muted">
                  <span>Display: <strong className="text-ivory">{currentDisplayFont.name}</strong></span>
                  <span>•</span>
                  <span>Body: <strong className="text-ivory">{currentBodyFont.name}</strong></span>
                  <span>•</span>
                  <span>Accent: <strong style={{ color: currentAccent.hex }}>{currentAccent.name}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: AGENCY INFO & ACCREDITATION                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'agency' && (
        <form onSubmit={handleSave} className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-serif-display text-2xl text-ivory">
              Agency Registered Identity & DOT Accreditations
            </h3>
            <span className="text-xs text-sand-muted font-sans-body">Official Tourist Enterprise Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                Company Legal Name
              </label>
              <input
                type="text"
                value={formData.agency.companyName}
                onChange={(e) => handleAgencyChange('companyName', e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                DOT Accreditation Number
              </label>
              <input
                type="text"
                value={formData.agency.accreditationNo}
                onChange={(e) => handleAgencyChange('accreditationNo', e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none"
                style={{ color: currentAccent.hex }}
              />
            </div>

            <div>
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                Official Hotline Phone
              </label>
              <input
                type="text"
                value={formData.agency.phone}
                onChange={(e) => handleAgencyChange('phone', e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                Support & Inquiries Email
              </label>
              <input
                type="email"
                value={formData.agency.email}
                onChange={(e) => handleAgencyChange('email', e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.agency.tagline}
                onChange={(e) => handleAgencyChange('tagline', e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                Default Downpayment Requirement (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={formData.agency.defaultDownpaymentPct}
                onChange={(e) => handleAgencyChange('defaultDownpaymentPct', Number(e.target.value))}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                Headquarters Physical Address
              </label>
              <input
                type="text"
                value={formData.agency.address}
                onChange={(e) => handleAgencyChange('address', e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <button
              type="submit"
              style={{ backgroundColor: currentAccent.hex }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white tracking-wider shadow-lg hover:brightness-110 transition"
            >
              Update Agency Profile
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: PROMOTIONAL ADVERTISEMENT POPUP                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'promo' && (
        <div className="space-y-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave(e);
            }}
            className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl"
          >
            {/* Header & Preview CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="font-serif-display text-2xl text-ivory flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sunset-coral" />
                  <span>Full-Screen Promo Advertisement Popup</span>
                </h3>
                <p className="text-xs text-sand-muted font-sans-body mt-1">
                  Customize the full-screen advertisement modal that greets customers when they open the website.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewPromoOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-sunset-coral bg-sunset-coral/10 hover:bg-sunset-coral/20 border border-sunset-coral/30 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Test & Preview Popup</span>
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentAccent.hex }}
                  className="px-6 py-2 rounded-full text-xs font-semibold text-white tracking-wider shadow-lg hover:brightness-110 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#070B0E] border border-white/[0.08]">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ivory flex items-center gap-2">
                  <span>Display Promo Popup on Website Visit</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    formData.promo?.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {formData.promo?.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </label>
                <p className="text-[11px] text-sand-muted">
                  When enabled, visitors will see the full-screen promotional modal upon entering the homepage.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.promo?.enabled)}
                  onChange={(e) => handlePromoChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sunset-coral"></div>
              </label>
            </div>

            {/* Promo Content Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Promo Badge Pill
                </label>
                <input
                  type="text"
                  value={formData.promo?.badge || ''}
                  onChange={(e) => handlePromoChange('badge', e.target.value)}
                  placeholder="e.g., Limited Season Promo, Early Bird Deal"
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Voucher Discount Code
                </label>
                <input
                  type="text"
                  value={formData.promo?.discountCode || ''}
                  onChange={(e) => handlePromoChange('discountCode', e.target.value.toUpperCase())}
                  placeholder="e.g., HOLIDAY2026, SUMMER20"
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={formData.promo?.title || ''}
                  onChange={(e) => handlePromoChange('title', e.target.value)}
                  placeholder="e.g., Discover the Archipelago with 20% Off"
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.promo?.discountPct ?? 20}
                  onChange={(e) => handlePromoChange('discountPct', Number(e.target.value))}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Subtitle / Destination Tagline
                </label>
                <input
                  type="text"
                  value={formData.promo?.tagline || ''}
                  onChange={(e) => handlePromoChange('tagline', e.target.value)}
                  placeholder="e.g., Palawan & Batanes Early Bird Reservations"
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Promotional Description Body
                </label>
                <textarea
                  rows={3}
                  value={formData.promo?.description || ''}
                  onChange={(e) => handlePromoChange('description', e.target.value)}
                  placeholder="Describe your special promo terms, inclusions, or perks..."
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  CTA Action Button Text
                </label>
                <input
                  type="text"
                  value={formData.promo?.actionText || 'Claim Promo & Reserve Now'}
                  onChange={(e) => handlePromoChange('actionText', e.target.value)}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Expiration / Limit Notice
                </label>
                <input
                  type="text"
                  value={formData.promo?.expiresText || ''}
                  onChange={(e) => handlePromoChange('expiresText', e.target.value)}
                  placeholder="e.g., Limited to first 25 bookings this season"
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-sand-muted focus:outline-none focus:border-sunset-coral"
                />
              </div>

              {/* Promo Banner Imagery with Presets */}
              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted">
                  Promo Visual Image URL
                </label>
                <input
                  type="text"
                  value={formData.promo?.imageUrl || ''}
                  onChange={(e) => handlePromoChange('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />

                <div className="space-y-1.5">
                  <span className="text-[11px] text-sand-muted">Or pick from curated destination photography:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { name: 'Palawan El Nido', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Batanes Rolling Hills', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Siargao Palms', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Boracay Sunset', url: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePromoChange('imageUrl', preset.url)}
                        className={`text-left p-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                          formData.promo?.imageUrl === preset.url
                            ? 'border-sunset-coral bg-sunset-coral/10 text-white font-semibold'
                            : 'border-white/10 bg-[#070B0E] text-sand-muted hover:text-ivory hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsPreviewPromoOpen(true)}
                className="px-4 py-2 rounded-full text-xs text-sand-muted hover:text-ivory bg-white/[0.04] border border-white/10 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Advertisement Modal</span>
              </button>

              <button
                type="submit"
                style={{ backgroundColor: currentAccent.hex }}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white tracking-wider shadow-lg hover:brightness-110 transition"
              >
                Save & Apply Promo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: BACKUP & DATA EXPORT                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'backup' && (
        <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-serif-display text-2xl text-ivory">Data Backup & JSON Configuration Export</h3>
            <p className="text-xs text-sand-muted font-light leading-relaxed max-w-2xl">
              Export system configuration, package catalog schema, and theme customizations as an offline JSON snapshot file for disaster recovery or testing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#070B0E] border border-white/[0.06] space-y-3">
            <span className="text-xs font-mono text-sand-muted block">Current Settings Payload Snapshot:</span>
            <pre className="text-[11px] font-mono text-emerald-400 bg-black/60 p-4 rounded-lg overflow-x-auto max-h-60 border border-white/5">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>

          <div>
            <button
              onClick={handleExportJson}
              style={{ backgroundColor: currentAccent.hex }}
              className="px-6 py-3 text-white text-xs font-semibold tracking-wider rounded-full shadow-lg hover:brightness-110 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download System Configuration JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Preview Modal for Admin */}
      {formData.promo && (
        <ClientPromoModal
          promo={formData.promo}
          isOpen={isPreviewPromoOpen}
          onClose={() => setIsPreviewPromoOpen(false)}
          onClaimPromo={() => setIsPreviewPromoOpen(false)}
        />
      )}
    </div>
  );
};
