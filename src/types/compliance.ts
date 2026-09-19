export type LegalPolicyTab = 
  | 'privacy' 
  | 'terms' 
  | 'refund' 
  | 'cookies' 
  | 'security-iso27001' 
  | 'accessibility-iso40500';

export interface CookiePreferences {
  essential: boolean; // strictly necessary, always true
  analytics: boolean; // opt-in for traffic & usage telemetry
  marketing: boolean; // opt-in for promotional updates & tailored experiences
  timestamp: string;
  version: string;
}

export interface ConsentRecord {
  bookingConsentAccepted: boolean;
  marketingConsentAccepted: boolean;
  acceptedAt: string;
  policyVersion: string;
}
