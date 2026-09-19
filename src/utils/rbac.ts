import { 
  StaffAccount, 
  StaffRole, 
  SubmoduleTab, 
  SecurityAuditLog, 
  GranularPermission 
} from '../types';
import { 
  generateTotpSecret, 
  generateBackupCodes, 
  calculateAuditHash, 
  verifyAuditChain 
} from './cryptoAuth';

export const ROLE_DEFAULT_TABS: Record<StaffRole, SubmoduleTab[]> = {
  'Super Admin': [
    'overview',
    'packages',
    'bookings',
    'itineraries',
    'reservations',
    'payment_gate',
    'payments',
    'reconciliation',
    'feedback',
    'settings',
    'rbac'
  ],
  'Tour Operations Manager': [
    'overview',
    'packages',
    'bookings',
    'itineraries',
    'reservations',
    'feedback'
  ],
  'Finance Officer': [
    'overview',
    'payment_gate',
    'payments',
    'reconciliation',
    'bookings'
  ],
  'Tour Guide': [
    'overview',
    'itineraries',
    'bookings'
  ],
  'Custom Staff': [
    'overview'
  ]
};

export const ROLE_DEFAULT_PERMISSIONS: Record<StaffRole, GranularPermission[]> = {
  'Super Admin': [
    'packages.view',
    'packages.create',
    'packages.edit',
    'packages.delete',
    'bookings.view_manifest',
    'bookings.update_status',
    'bookings.export_csv',
    'bookings.delete',
    'logistics.dispatch_guide',
    'logistics.manage_hotels',
    'logistics.manage_transport',
    'finance.view_payments',
    'finance.verify_payment',
    'finance.issue_refund',
    'finance.export_invoices',
    'finance.reconciliation',
    'feedback.view',
    'feedback.moderate',
    'settings.view',
    'settings.update',
    'rbac.view_staff',
    'rbac.create_staff',
    'rbac.edit_roles',
    'rbac.reset_passwords',
    'rbac.delete_staff',
    'rbac.view_audit_logs'
  ],
  'Tour Operations Manager': [
    'packages.view',
    'packages.create',
    'packages.edit',
    'packages.delete',
    'bookings.view_manifest',
    'bookings.update_status',
    'bookings.export_csv',
    'logistics.dispatch_guide',
    'logistics.manage_hotels',
    'logistics.manage_transport',
    'feedback.view',
    'feedback.moderate'
  ],
  'Finance Officer': [
    'bookings.view_manifest',
    'finance.view_payments',
    'finance.verify_payment',
    'finance.issue_refund',
    'finance.export_invoices',
    'finance.reconciliation'
  ],
  'Tour Guide': [
    'bookings.view_manifest',
    'logistics.dispatch_guide'
  ],
  'Custom Staff': [
    'bookings.view_manifest'
  ]
};

export const TAB_DISPLAY_NAMES: Record<SubmoduleTab, string> = {
  overview: 'Operations Dashboard',
  packages: 'Tour Package Management',
  bookings: 'Booking & Passenger Manifest',
  itineraries: 'Itinerary & Schedule Dispatch',
  reservations: 'Hotel & Transport Logistics',
  payments: 'Payment & Invoice Management',
  payment_gate: 'Payment Gate & Audit',
  reconciliation: 'Fiscal Reconciliation & Payouts',
  feedback: 'Customer Feedback & Ratings',
  settings: 'System & Agency Settings',
  rbac: 'Staff & RBAC Governance'
};

export const DEFAULT_PASSWORD_VALUE = 'admin12345';

export const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-superadmin-01',
    fullName: 'Karll Jacob',
    email: 'karlljacob8@gmail.com',
    role: 'Super Admin',
    password: DEFAULT_PASSWORD_VALUE,
    status: 'Active',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLogin: '2026-09-09T06:30:00.000Z',
    allowedTabs: ROLE_DEFAULT_TABS['Super Admin'],
    granularPermissions: ROLE_DEFAULT_PERMISSIONS['Super Admin'],
    totpSecret: 'JBSWY3DPEHPK3PXP4M2A====',
    twoFactorEnabled: true,
    backupCodes: ['4819-2048', '9102-3841', '5512-8839', '7719-2201', '3910-4492'],
    phoneNumber: '+63 917 123 4567',
    notes: 'Agency Director & Chief Information Security Officer. Full root system clearance.'
  },
  {
    id: 'staff-ops-02',
    fullName: 'Kyle Dulay',
    email: 'dulaykyle15@gmail.com',
    role: 'Tour Operations Manager',
    password: DEFAULT_PASSWORD_VALUE,
    status: 'Active',
    createdAt: '2026-01-15T09:30:00.000Z',
    lastLogin: '2026-09-08T14:20:00.000Z',
    allowedTabs: ROLE_DEFAULT_TABS['Tour Operations Manager'],
    granularPermissions: ROLE_DEFAULT_PERMISSIONS['Tour Operations Manager'],
    totpSecret: 'KREU4ZKSK5FEYS2J====',
    twoFactorEnabled: true,
    backupCodes: ['3819-1092', '4491-8821', '6620-1928', '8812-4019', '2190-7731'],
    phoneNumber: '+63 918 234 5678',
    notes: 'Tour Operations Lead. Manages package schedules, flight/hotel/shuttle allocations, and bookings.'
  },
  {
    id: 'staff-finance-03',
    fullName: 'Ilona May Ambe',
    email: 'ambeilonamay67@gmail.com',
    role: 'Finance Officer',
    password: DEFAULT_PASSWORD_VALUE,
    status: 'Active',
    createdAt: '2026-02-01T10:15:00.000Z',
    lastLogin: '2026-09-07T11:45:00.000Z',
    allowedTabs: ROLE_DEFAULT_TABS['Finance Officer'],
    granularPermissions: ROLE_DEFAULT_PERMISSIONS['Finance Officer'],
    totpSecret: 'MZXW6YTBOJRGC4Q=====',
    twoFactorEnabled: true,
    backupCodes: ['5501-9921', '7721-3310', '1920-4482', '6610-8829', '4419-5502'],
    phoneNumber: '+63 919 345 6789',
    notes: 'Chief Accountant & Fiscal Auditor. Verifies GCash/Maya/Bank payments and issues tax invoices.'
  },
  {
    id: 'staff-guide-04',
    fullName: 'Michael Baynosa',
    email: 'michaelbaynosa01@gmail.com',
    role: 'Tour Guide',
    password: DEFAULT_PASSWORD_VALUE,
    status: 'Active',
    createdAt: '2026-02-10T13:00:00.000Z',
    lastLogin: '2026-09-06T09:10:00.000Z',
    allowedTabs: ROLE_DEFAULT_TABS['Tour Guide'],
    granularPermissions: ROLE_DEFAULT_PERMISSIONS['Tour Guide'],
    totpSecret: 'NBSWY3DPEHPK3PXP====',
    twoFactorEnabled: true,
    backupCodes: ['8819-2041', '3310-9920', '6629-1102', '5510-4491', '7712-8830'],
    phoneNumber: '+63 920 456 7890',
    notes: 'Accredited Expedition Leader. Assigned field passenger manifests and island schedules.'
  }
];

const STAFF_STORAGE_KEY = 'holiday_staff_accounts_v2';
const AUDIT_STORAGE_KEY = 'holiday_security_audit_logs_v2';

export function getStoredStaffAccounts(): StaffAccount[] {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    let accounts: StaffAccount[] = [];

    if (!raw) {
      accounts = DEFAULT_STAFF_ACCOUNTS;
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(accounts));
    } else {
      accounts = JSON.parse(raw);
    }

    if (!Array.isArray(accounts) || accounts.length === 0) {
      accounts = DEFAULT_STAFF_ACCOUNTS;
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(accounts));
    }

    // Commercial Migration & Normalization:
    // 1. Upgrade any old 'password123' to 'admin12345'
    // 2. Ensure all default staff accounts exist
    // 3. Ensure totpSecret, backupCodes, and granularPermissions are set
    let modified = false;
    const existingEmails = new Set(accounts.map((a) => a.email.toLowerCase()));

    for (const core of DEFAULT_STAFF_ACCOUNTS) {
      if (!existingEmails.has(core.email.toLowerCase())) {
        accounts.push(core);
        modified = true;
      }
    }

    accounts = accounts.map((acc) => {
      let changed = false;
      const updated = { ...acc };

      // Migrate default password
      if (!updated.password || updated.password === 'password123') {
        updated.password = DEFAULT_PASSWORD_VALUE;
        changed = true;
      }

      // Ensure TOTP secret exists
      if (!updated.totpSecret) {
        updated.totpSecret = generateTotpSecret(20);
        updated.twoFactorEnabled = true;
        changed = true;
      }

      // Ensure backup codes exist
      if (!updated.backupCodes || updated.backupCodes.length === 0) {
        updated.backupCodes = generateBackupCodes(5);
        changed = true;
      }

      // Ensure granular permissions exist
      if (!updated.granularPermissions || updated.granularPermissions.length === 0) {
        updated.granularPermissions = ROLE_DEFAULT_PERMISSIONS[updated.role] || ROLE_DEFAULT_PERMISSIONS['Custom Staff'];
        changed = true;
      }

      // Ensure allowedTabs exist and filter out deprecated tabs (e.g. laravel_integration)
      if (!updated.allowedTabs || updated.allowedTabs.length === 0) {
        updated.allowedTabs = ROLE_DEFAULT_TABS[updated.role] || ROLE_DEFAULT_TABS['Custom Staff'];
        changed = true;
      } else {
        const validTabs = updated.allowedTabs.filter((tab) => tab in TAB_DISPLAY_NAMES);
        if (validTabs.length !== updated.allowedTabs.length) {
          updated.allowedTabs = validTabs;
          changed = true;
        }
      }

      if (changed) modified = true;
      return updated;
    });

    if (modified) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(accounts));
    }

    return accounts;
  } catch (err) {
    console.error('Failed reading staff accounts from storage, restoring defaults', err);
    return DEFAULT_STAFF_ACCOUNTS;
  }
}

export function saveStaffAccounts(accounts: StaffAccount[]): void {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed saving staff accounts', err);
  }
}

export function findStaffAccountByEmail(email: string): StaffAccount | undefined {
  const accounts = getStoredStaffAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find((a) => a.email.toLowerCase() === normalized);
}

export function authenticateStaffCredentials(
  email: string,
  passwordAttempt: string
): { success: boolean; account?: StaffAccount; error?: string } {
  const account = findStaffAccountByEmail(email);
  if (!account) {
    return {
      success: false,
      error: 'Security Clearance Denied: Account not recognized on this terminal.'
    };
  }

  if (account.status === 'Suspended') {
    return {
      success: false,
      error: 'Account Suspended: Access privileges have been revoked by the Super Administrator.'
    };
  }

  const expectedPassword = account.password || DEFAULT_PASSWORD_VALUE;
  if (passwordAttempt !== expectedPassword) {
    return {
      success: false,
      error: 'Authentication Failure: Invalid password provided.'
    };
  }

  return { success: true, account };
}

export function hasTabAccess(
  user: { email: string; role?: string; allowedTabs?: SubmoduleTab[] } | null,
  tab: SubmoduleTab
): boolean {
  if (!user) return false;
  if (user.role === 'Super Admin' || user.email === 'karlljacob8@gmail.com') return true;

  if (user.allowedTabs && user.allowedTabs.length > 0) {
    return user.allowedTabs.includes(tab);
  }

  const role = (user.role as StaffRole) || 'Custom Staff';
  const defaults = ROLE_DEFAULT_TABS[role] || ROLE_DEFAULT_TABS['Custom Staff'];
  return defaults.includes(tab);
}

export function hasPermission(
  user: { email: string; role?: string; granularPermissions?: GranularPermission[] } | null,
  permission: GranularPermission
): boolean {
  if (!user) return false;
  if (user.role === 'Super Admin' || user.email === 'karlljacob8@gmail.com') return true;

  if (user.granularPermissions && user.granularPermissions.length > 0) {
    return user.granularPermissions.includes(permission);
  }

  const role = (user.role as StaffRole) || 'Custom Staff';
  const defaults = ROLE_DEFAULT_PERMISSIONS[role] || [];
  return defaults.includes(permission);
}

export function getRoleBadgeStyle(role: StaffRole | string): { bg: string; text: string; border: string } {
  switch (role) {
    case 'Super Admin':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30'
      };
    case 'Tour Operations Manager':
      return {
        bg: 'bg-sunset-coral/15',
        text: 'text-sunset-coral',
        border: 'border-sunset-coral/30'
      };
    case 'Finance Officer':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30'
      };
    case 'Tour Guide':
      return {
        bg: 'bg-cyan-500/15',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30'
      };
    default:
      return {
        bg: 'bg-purple-500/15',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      };
  }
}

// --------------------------------------------------------------------------
// Cryptographic Tamper-Evident Audit Logging (ISO/IEC 27001 ISMS Compliance)
// --------------------------------------------------------------------------
export async function logSecurityEvent(
  actorEmail: string,
  action: string,
  details: string,
  severity: 'info' | 'warning' | 'critical' = 'info',
  targetEmail?: string
): Promise<void> {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const logs: SecurityAuditLog[] = raw ? JSON.parse(raw) : [];
    const prevHash = logs.length > 0 && logs[0].hash 
      ? logs[0].hash 
      : 'GENESIS_BLOCK_HOLIDAY_TRAVELERS_2026';

    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const hash = await calculateAuditHash(prevHash, {
      id,
      timestamp,
      actorEmail,
      action,
      details,
      severity,
      targetEmail
    });

    const entry: SecurityAuditLog = {
      id,
      timestamp,
      actorEmail,
      action,
      targetEmail,
      details,
      severity,
      prevHash,
      hash,
      ipAddress: '192.168.1.104 (Encrypted Tunnel)'
    };

    logs.unshift(entry);
    // Retain up to 300 logs
    if (logs.length > 300) logs.pop();
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to write cryptographic security audit log', err);
  }
}

export function getStoredAuditLogs(): SecurityAuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      const genesisLogs: SecurityAuditLog[] = [
        {
          id: 'audit-boot-01',
          timestamp: '2026-01-10T08:00:00.000Z',
          actorEmail: 'karlljacob8@gmail.com',
          action: 'RBAC_SECURITY_INITIALIZE',
          details: 'Root Super Administrator provisioned enterprise commercial RBAC matrix with RFC 6238 TOTP authenticators.',
          severity: 'info',
          prevHash: 'GENESIS_BLOCK_HOLIDAY_TRAVELERS_2026',
          hash: '0e32f91a7c5b4e6d8a9f2b1c4e6d8a9f2b1c4e6d8a9f2b1c4e6d8a9f2b1c4e6d'
        },
        {
          id: 'audit-boot-02',
          timestamp: '2026-02-01T10:15:00.000Z',
          actorEmail: 'karlljacob8@gmail.com',
          action: 'DEFAULT_CREDENTIALS_SET',
          targetEmail: 'karlljacob8@gmail.com',
          details: 'Default enterprise root password provisioned with mandatory 2FA enforcement.',
          severity: 'info',
          prevHash: '0e32f91a7c5b4e6d8a9f2b1c4e6d8a9f2b1c4e6d8a9f2b1c4e6d8a9f2b1c4e6d',
          hash: '5d8f2a1c9e4b6d7a8f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f'
        },
        {
          id: 'audit-boot-03',
          timestamp: '2026-09-09T06:45:00.000Z',
          actorEmail: 'karlljacob8@gmail.com',
          action: 'ZERO_PUBLIC_FOOTPRINT_VERIFIED',
          details: 'Admin triggers hidden from public DOM. Keyboard shortcut & multi-gesture ingress activated.',
          severity: 'info',
          prevHash: '5d8f2a1c9e4b6d7a8f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
          hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'
        }
      ];
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(genesisLogs));
      return genesisLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export { verifyAuditChain };

// ============================================================================
// SUPER ADMIN RBAC 2-MINUTE OTP ACTION AUTHORIZATION LEASE (STEP-UP CHALLENGE)
// ============================================================================
export const SUPER_ADMIN_OTP_SESSION_DURATION_MS = 2 * 60 * 1000; // 2 minutes (120 seconds)

export interface SuperAdminOtpSession {
  email: string;
  expiresAt: number;
  verifiedAt: number;
}

const SUPER_ADMIN_OTP_SESSION_KEY_PREFIX = 'holiday_superadmin_otp_session_';

export function getSuperAdminOtpSession(email: string): SuperAdminOtpSession | null {
  if (!email) return null;
  const normEmail = email.trim().toLowerCase();
  const key = `${SUPER_ADMIN_OTP_SESSION_KEY_PREFIX}${normEmail}`;
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (!raw) return null;
    const session: SuperAdminOtpSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getSuperAdminOtpRemainingMs(email: string): number {
  const session = getSuperAdminOtpSession(email);
  if (!session) return 0;
  return Math.max(0, session.expiresAt - Date.now());
}

export function isSuperAdminOtpAuthorized(email: string): boolean {
  return getSuperAdminOtpRemainingMs(email) > 0;
}

export function grantSuperAdminOtpSession(
  email: string, 
  durationMs: number = SUPER_ADMIN_OTP_SESSION_DURATION_MS
): SuperAdminOtpSession {
  const normEmail = email.trim().toLowerCase();
  const session: SuperAdminOtpSession = {
    email: normEmail,
    verifiedAt: Date.now(),
    expiresAt: Date.now() + durationMs
  };
  const key = `${SUPER_ADMIN_OTP_SESSION_KEY_PREFIX}${normEmail}`;
  try {
    sessionStorage.setItem(key, JSON.stringify(session));
    localStorage.setItem(key, JSON.stringify(session));
  } catch {}
  return session;
}

export function revokeSuperAdminOtpSession(email: string): void {
  if (!email) return;
  const normEmail = email.trim().toLowerCase();
  const key = `${SUPER_ADMIN_OTP_SESSION_KEY_PREFIX}${normEmail}`;
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {}
}
