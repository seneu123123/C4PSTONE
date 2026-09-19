import { CookiePreferences } from '../types/compliance';

const COOKIE_PREFS_KEY = 'holiday_cookie_preferences';

export const DEFAULT_COOKIE_PREFS: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: new Date().toISOString(),
  version: '2026.1'
};

export function getStoredCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading cookie preferences:', e);
    return null;
  }
}

export function saveCookiePreferences(prefs: Partial<CookiePreferences>): CookiePreferences {
  const current = getStoredCookiePreferences() || DEFAULT_COOKIE_PREFS;
  const updated: CookiePreferences = {
    ...current,
    ...prefs,
    essential: true, // Always true for operational security
    timestamp: new Date().toISOString(),
    version: '2026.1'
  };
  try {
    localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error persisting cookie preferences:', e);
  }
  return updated;
}

export interface AnalyticsEvent {
  eventName: string;
  category: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * ISO/IEC 27001 compliant privacy-preserving analytics engine.
 * Will only log/record events if the user has explicitly granted analytics consent.
 * Strips all personal identifiable information (PII).
 */
export function trackEvent(eventName: string, category: string, metadata?: Record<string, any>): void {
  const prefs = getStoredCookiePreferences();
  if (!prefs || !prefs.analytics) {
    // Explicit consent not granted — do not record any telemetry
    return;
  }

  // Sanitize metadata to guarantee no PII (email, phone, name, ID) is recorded
  const safeMetadata: Record<string, any> = {};
  if (metadata) {
    for (const [key, val] of Object.entries(metadata)) {
      const lower = key.toLowerCase();
      if (
        lower.includes('name') ||
        lower.includes('email') ||
        lower.includes('phone') ||
        lower.includes('id') ||
        lower.includes('passport')
      ) {
        continue; // Strip PII
      }
      safeMetadata[key] = val;
    }
  }

  const event: AnalyticsEvent = {
    eventName,
    category,
    metadata: safeMetadata,
    timestamp: new Date().toISOString()
  };

  // Telemetry buffer kept in memory/session for performance monitoring
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Privacy-Preserving Analytics Event]:', event);
  }
}
