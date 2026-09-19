import { UiThemeSettings, ThemeAccentColor, ThemeFontDisplay, ThemeFontBody, ThemeBgTone, ThemeBorderStyle } from '../types';

export interface AccentColorDefinition {
  id: ThemeAccentColor;
  name: string;
  hex: string;
  hoverHex: string;
  rgb: string;
  glowClass: string;
  badgeClass: string;
  borderClass: string;
}

export const ACCENT_COLORS: Record<ThemeAccentColor, AccentColorDefinition> = {
  coral: {
    id: 'coral',
    name: 'Sunset Coral',
    hex: '#F26A4F',
    hoverHex: '#ff765b',
    rgb: '242, 106, 79',
    glowClass: 'shadow-sunset-coral/30',
    badgeClass: 'bg-sunset-coral/15 text-sunset-coral border-sunset-coral/30',
    borderClass: 'border-sunset-coral',
  },
  cyan: {
    id: 'cyan',
    name: 'Oceanic Cyan',
    hex: '#06B6D4',
    hoverHex: '#22d3ee',
    rgb: '6, 182, 212',
    glowClass: 'shadow-cyan-500/30',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    borderClass: 'border-cyan-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Palawan Emerald',
    hex: '#10B981',
    hoverHex: '#34d399',
    rgb: '16, 185, 129',
    glowClass: 'shadow-emerald-500/30',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500',
  },
  amber: {
    id: 'amber',
    name: 'Golden Sunbeam',
    hex: '#F59E0B',
    hoverHex: '#fbbf24',
    rgb: '245, 158, 11',
    glowClass: 'shadow-amber-500/30',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500',
  },
  indigo: {
    id: 'indigo',
    name: 'Pacific Indigo',
    hex: '#6366F1',
    hoverHex: '#818cf8',
    rgb: '99, 102, 241',
    glowClass: 'shadow-indigo-500/30',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    borderClass: 'border-indigo-500',
  },
  purple: {
    id: 'purple',
    name: 'Amethyst Orchid',
    hex: '#A855F7',
    hoverHex: '#c084fc',
    rgb: '168, 85, 247',
    glowClass: 'shadow-purple-500/30',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    borderClass: 'border-purple-500',
  },
  rose: {
    id: 'rose',
    name: 'Archipelago Ruby',
    hex: '#F43F5E',
    hoverHex: '#fb7185',
    rgb: '244, 63, 94',
    glowClass: 'shadow-rose-500/30',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    borderClass: 'border-rose-500',
  },
  teal: {
    id: 'teal',
    name: 'Lagoon Turquoise',
    hex: '#14B8A6',
    hoverHex: '#2dd4bf',
    rgb: '20, 184, 166',
    glowClass: 'shadow-teal-500/30',
    badgeClass: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    borderClass: 'border-teal-500',
  },
};

export interface FontDefinition {
  id: string;
  name: string;
  family: string;
  category: string;
  previewSample: string;
}

export const DISPLAY_FONTS: Record<ThemeFontDisplay, FontDefinition> = {
  cormorant: {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    family: "'Cormorant Garamond', Georgia, serif",
    category: 'Editorial Luxury Serif',
    previewSample: 'El Nido & Coron Luxury Expeditions',
  },
  cinzel: {
    id: 'cinzel',
    name: 'Cinzel',
    family: "'Cinzel', Georgia, serif",
    category: 'Monumental Classic Serif',
    previewSample: 'ARCHIPELAGO DISPATCH & EXPEDITIONS',
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Display',
    family: "'Playfair Display', Georgia, serif",
    category: 'High-Fashion Editorial Serif',
    previewSample: 'Exclusive Island Discovery & Logistics',
  },
  jakarta: {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    category: 'Modern Clean Sans',
    previewSample: 'Tour Operations & Fleet Management',
  },
  outfit: {
    id: 'outfit',
    name: 'Outfit',
    family: "'Outfit', system-ui, sans-serif",
    category: 'Geometric High-Tech Sans',
    previewSample: 'Passenger Manifest & Real-Time Logistics',
  },
  space: {
    id: 'space',
    name: 'Space Grotesk',
    family: "'Space Grotesk', system-ui, sans-serif",
    category: 'Contemporary Brutalist Tech',
    previewSample: 'CENTRAL OPERATOR CONSOLE 2026',
  },
  jetbrains: {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    category: 'Developer & DevOps Monospace',
    previewSample: 'EXPEDITION_ID: PH-CEB-8819 [LIVE]',
  },
};

export const BODY_FONTS: Record<ThemeFontBody, FontDefinition> = {
  jakarta: {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    category: 'Refined Modern Sans (Default)',
    previewSample: 'Confirmed reservations and hotel voucher allocations.',
  },
  inter: {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', system-ui, sans-serif",
    category: 'Swiss Corporate Standard',
    previewSample: 'Official invoice verification and billing status ledger.',
  },
  outfit: {
    id: 'outfit',
    name: 'Outfit',
    family: "'Outfit', system-ui, sans-serif",
    category: 'Clean Geometric Sans',
    previewSample: 'Guest manifest verification and dietary requirement notes.',
  },
  dmsans: {
    id: 'dmsans',
    name: 'DM Sans',
    family: "'DM Sans', system-ui, sans-serif",
    category: 'Warm & Friendly Sans',
    previewSample: 'Live customer satisfaction ratings and guide feedback.',
  },
  jetbrains: {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    category: 'Technical Code & Manifest Monospace',
    previewSample: 'STATUS: DISPATCHED | VOUCHER: HTT-VCH-9921',
  },
};

export interface BgToneDefinition {
  id: ThemeBgTone;
  name: string;
  baseBg: string;
  cardBg: string;
  cardSubtle: string;
  borderRgba: string;
}

export const BG_TONES: Record<ThemeBgTone, BgToneDefinition> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Deep',
    baseBg: '#070B0E',
    cardBg: '#0B1014',
    cardSubtle: '#0E151A',
    borderRgba: 'rgba(255, 255, 255, 0.08)',
  },
  slate: {
    id: 'slate',
    name: 'Midnight Slate',
    baseBg: '#020617',
    cardBg: '#0F172A',
    cardSubtle: '#1E293B',
    borderRgba: 'rgba(148, 163, 184, 0.12)',
  },
  zinc: {
    id: 'zinc',
    name: 'Titanium Charcoal',
    baseBg: '#09090B',
    cardBg: '#18181B',
    cardSubtle: '#27272A',
    borderRgba: 'rgba(255, 255, 255, 0.09)',
  },
  marine: {
    id: 'marine',
    name: 'Deep Pacific Marine',
    baseBg: '#030712',
    cardBg: '#0B132B',
    cardSubtle: '#1C2541',
    borderRgba: 'rgba(56, 189, 248, 0.12)',
  },
};

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: UiThemeSettings;
  previewEmoji: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'sunset-archipelago',
    name: 'Sunset Archipelago',
    description: 'Original dark luxury editorial with Sunset Coral & Cormorant Garamond.',
    previewEmoji: '🌅',
    theme: {
      accentColor: 'coral',
      fontDisplay: 'cormorant',
      fontBody: 'jakarta',
      bgTone: 'obsidian',
      borderStyle: 'subtle',
      fontSize: 'standard',
      cardGlow: true,
    },
  },
  {
    id: 'ocean-navigator',
    name: 'Aviation Azure',
    description: 'Crisp sky cyan aesthetics with modern Outfit geometric typography.',
    previewEmoji: '✈️',
    theme: {
      accentColor: 'cyan',
      fontDisplay: 'outfit',
      fontBody: 'outfit',
      bgTone: 'slate',
      borderStyle: 'subtle',
      fontSize: 'standard',
      cardGlow: true,
    },
  },
  {
    id: 'palawan-emerald',
    name: 'Palawan Rainforest',
    description: 'Eco-tour emerald vitality with warm DM Sans typography.',
    previewEmoji: '🌴',
    theme: {
      accentColor: 'emerald',
      fontDisplay: 'cormorant',
      fontBody: 'dmsans',
      bgTone: 'obsidian',
      borderStyle: 'subtle',
      fontSize: 'standard',
      cardGlow: true,
    },
  },
  {
    id: 'cyber-command',
    name: 'Cyber Command Ops',
    description: 'High-contrast Golden Sunbeam with technical Space Grotesk.',
    previewEmoji: '⚡',
    theme: {
      accentColor: 'amber',
      fontDisplay: 'space',
      fontBody: 'inter',
      bgTone: 'zinc',
      borderStyle: 'high-contrast',
      fontSize: 'standard',
      cardGlow: true,
    },
  },
  {
    id: 'royal-luxury',
    name: 'Pacific Imperial Luxury',
    description: 'Cinzel classical display font paired with Pacific Indigo accents.',
    previewEmoji: '👑',
    theme: {
      accentColor: 'indigo',
      fontDisplay: 'cinzel',
      fontBody: 'jakarta',
      bgTone: 'marine',
      borderStyle: 'subtle',
      fontSize: 'standard',
      cardGlow: true,
    },
  },
  {
    id: 'amethyst-orchid',
    name: 'Exotic Amethyst',
    description: 'Sophisticated Playfair Display serif with radiant Purple Orchids.',
    previewEmoji: '🌺',
    theme: {
      accentColor: 'purple',
      fontDisplay: 'playfair',
      fontBody: 'jakarta',
      bgTone: 'obsidian',
      borderStyle: 'subtle',
      fontSize: 'standard',
      cardGlow: true,
    },
  },
  {
    id: 'devops-terminal',
    name: 'Operator Dev Console',
    description: 'Full JetBrains Monospace with Lagoon Teal accents.',
    previewEmoji: '💻',
    theme: {
      accentColor: 'teal',
      fontDisplay: 'jetbrains',
      fontBody: 'jetbrains',
      bgTone: 'zinc',
      borderStyle: 'high-contrast',
      fontSize: 'compact',
      cardGlow: false,
    },
  },
];

/**
 * Apply CSS custom properties dynamically to the document root
 */
export function applyAdminTheme(theme: UiThemeSettings) {
  if (typeof document === 'undefined') return;

  const accentDef = ACCENT_COLORS[theme.accentColor] || ACCENT_COLORS.coral;
  const displayFont = DISPLAY_FONTS[theme.fontDisplay] || DISPLAY_FONTS.cormorant;
  const bodyFont = BODY_FONTS[theme.fontBody] || BODY_FONTS.jakarta;
  const bgTone = BG_TONES[theme.bgTone] || BG_TONES.obsidian;

  const root = document.documentElement;

  // Custom CSS variables for the Admin Portal
  root.style.setProperty('--admin-accent', accentDef.hex);
  root.style.setProperty('--admin-accent-hover', accentDef.hoverHex);
  root.style.setProperty('--admin-accent-rgb', accentDef.rgb);
  root.style.setProperty('--admin-font-display', displayFont.family);
  root.style.setProperty('--admin-font-body', bodyFont.family);
  root.style.setProperty('--admin-bg-base', bgTone.baseBg);
  root.style.setProperty('--admin-bg-card', bgTone.cardBg);
  root.style.setProperty('--admin-bg-subtle', bgTone.cardSubtle);
  root.style.setProperty('--admin-border', bgTone.borderRgba);

  // Border style modifier
  if (theme.borderStyle === 'high-contrast') {
    root.style.setProperty('--admin-border', `rgba(${accentDef.rgb}, 0.25)`);
  } else if (theme.borderStyle === 'minimal') {
    root.style.setProperty('--admin-border', 'rgba(255, 255, 255, 0.04)');
  }

  // Base font size scaling
  if (theme.fontSize === 'compact') {
    root.style.setProperty('--admin-font-scale', '0.92');
  } else if (theme.fontSize === 'large') {
    root.style.setProperty('--admin-font-scale', '1.06');
  } else {
    root.style.setProperty('--admin-font-scale', '1');
  }
}
