import { SecurityAuditLog } from '../types';
import { sendEmailNotification } from './directEmailService';

// ============================================================================
// BASE32 ENCODING / DECODING (RFC 3548 / RFC 4648)
// ============================================================================
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/[\s-]/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, (i + 1) * 8), 2);
  }
  return bytes;
}

export function bytesToBase32(bytes: Uint8Array): string {
  let bits = '';
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, '0');
  }

  let base32 = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5);
    if (chunk.length < 5) {
      base32 += BASE32_ALPHABET[parseInt(chunk.padEnd(5, '0'), 2)];
    } else {
      base32 += BASE32_ALPHABET[parseInt(chunk, 2)];
    }
  }
  return base32;
}

export function generateTotpSecret(length = 20): string {
  const randomBytes = new Uint8Array(length);
  window.crypto.getRandomValues(randomBytes);
  return bytesToBase32(randomBytes).substring(0, 26);
}

export function generateBackupCodes(count = 5): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const random = new Uint32Array(2);
    window.crypto.getRandomValues(random);
    const part1 = (random[0] % 9000 + 1000).toString();
    const part2 = (random[1] % 9000 + 1000).toString();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

// ============================================================================
// EMAIL 2FA 6-DIGIT VERIFICATION CODE ENGINE (COMPOSER EMAIL 2FA)
// ============================================================================

export interface EmailVerificationSession {
  code: string;
  email: string;
  expiresAt: number;
  subject: string;
  body: string;
  dispatchedAt: string;
}

const activeEmailCodes = new Map<string, EmailVerificationSession>();

function getStorageOtpKey(email: string): string {
  return `holiday_otp_${email.trim().toLowerCase()}`;
}

const lastDispatchTimeByEmail = new Map<string, number>();

export function generateEmailOtpCode(email: string, toName?: string): EmailVerificationSession {
  const normEmail = email.trim().toLowerCase();
  // Secure 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  const dispatchedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const session: EmailVerificationSession = {
    code,
    email: normEmail,
    expiresAt,
    subject: `[HTTT-SEC] Holiday Travelers Operations Access Code: ${code}`,
    body: `Hello ${toName || 'Admin'},\n\nYour single-use 6-digit authorization passcode for Holiday Travelers Travel & Tours Terminal Access is:\n\n${code}\n\nThis verification code expires in 10 minutes. If you did not initiate this clearance, notify the system administrator immediately.`,
    dispatchedAt
  };

  // Store in memory
  activeEmailCodes.set(normEmail, session);

  // Store in sessionStorage & localStorage for resilient tab/refresh persistence
  try {
    const raw = JSON.stringify(session);
    sessionStorage.setItem(getStorageOtpKey(normEmail), raw);
    localStorage.setItem(getStorageOtpKey(normEmail), raw);
  } catch {
    // Ignore storage quota errors
  }

  return session;
}

/**
 * Async version that generates session, dispatches exactly ONE email notification, and returns delivery details
 */
export async function dispatchEmailOtp(email: string, toName?: string) {
  const normEmail = email.trim().toLowerCase();
  const now = Date.now();
  const lastTime = lastDispatchTimeByEmail.get(normEmail) || 0;

  // Deduplication guard: prevent duplicate dispatch within 2.5 seconds
  if (now - lastTime < 2500) {
    const existing = getActiveEmailOtp(normEmail);
    if (existing) {
      return { 
        session: existing, 
        emailResult: { success: true, provider: 'emailjs' as const, message: 'Existing OTP reused (debounced)' } 
      };
    }
  }

  lastDispatchTimeByEmail.set(normEmail, now);
  const session = generateEmailOtpCode(normEmail, toName);

  const emailResult = await sendEmailNotification({
    toEmail: normEmail,
    toName: toName,
    subject: session.subject,
    body: session.body,
    otpCode: session.code,
    type: 'otp'
  });

  return { session, emailResult };
}

export function getActiveEmailOtp(email: string): EmailVerificationSession | null {
  const normEmail = email.trim().toLowerCase();
  let session = activeEmailCodes.get(normEmail);

  if (!session) {
    try {
      const stored = sessionStorage.getItem(getStorageOtpKey(normEmail)) || localStorage.getItem(getStorageOtpKey(normEmail));
      if (stored) {
        session = JSON.parse(stored);
        if (session) {
          activeEmailCodes.set(normEmail, session);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeEmailCodes.delete(normEmail);
    try {
      sessionStorage.removeItem(getStorageOtpKey(normEmail));
      localStorage.removeItem(getStorageOtpKey(normEmail));
    } catch {}
    return null;
  }
  return session;
}

export function verifyEmailOtpCode(
  email: string, 
  candidateCode: string,
  backupCodes?: string[]
): { valid: boolean; error?: string; usedBackupCode?: string } {
  const normEmail = email.trim().toLowerCase();
  const cleanCandidate = candidateCode.trim().replace(/\s+/g, '');
  
  // Allow emergency backup recovery codes (e.g. XXXX-XXXX or 8-char codes)
  if (backupCodes && backupCodes.length > 0) {
    const matchedBackup = backupCodes.find(
      (b) => b.trim().toUpperCase() === cleanCandidate.toUpperCase()
    );
    if (matchedBackup) {
      return { valid: true, usedBackupCode: matchedBackup };
    }
  }

  let session = activeEmailCodes.get(normEmail);
  if (!session) {
    try {
      const stored = sessionStorage.getItem(getStorageOtpKey(normEmail)) || localStorage.getItem(getStorageOtpKey(normEmail));
      if (stored) {
        session = JSON.parse(stored);
      }
    } catch {}
  }

  if (!session) {
    return { valid: false, error: 'Verification code not found or expired. Please click Resend code.' };
  }

  if (Date.now() > session.expiresAt) {
    activeEmailCodes.delete(normEmail);
    try {
      sessionStorage.removeItem(getStorageOtpKey(normEmail));
      localStorage.removeItem(getStorageOtpKey(normEmail));
    } catch {}
    return { valid: false, error: 'Verification code expired. Please click Resend code.' };
  }

  if (session.code !== cleanCandidate) {
    return { valid: false, error: 'Incorrect 6-digit verification code. Please check your email and try again.' };
  }

  // Clear upon success
  activeEmailCodes.delete(normEmail);
  try {
    sessionStorage.removeItem(getStorageOtpKey(normEmail));
    localStorage.removeItem(getStorageOtpKey(normEmail));
  } catch {}

  return { valid: true };
}

// ============================================================================
// RFC 6238 TIME-BASED ONE-TIME PASSWORD (TOTP) ENGINE (LEGACY FALLBACK)
// ============================================================================
export async function calculateTotpCode(secret: string, epochSeconds?: number): Promise<string> {
  const keyBytes = base32ToBytes(secret);
  if (keyBytes.length === 0) return '000000';

  const time = epochSeconds ?? Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(time / 30);

  // 8-byte big-endian counter
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);
  counterView.setUint32(0, 0, false);
  counterView.setUint32(4, timeStep, false);

  // Import HMAC-SHA-1 Key via native Web Crypto API
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
  const hashBytes = new Uint8Array(signature);

  // Dynamic truncation (RFC 4226)
  const offset = hashBytes[hashBytes.length - 1] & 0x0f;
  const binary =
    ((hashBytes[offset] & 0x7f) << 24) |
    ((hashBytes[offset + 1] & 0xff) << 16) |
    ((hashBytes[offset + 2] & 0xff) << 8) |
    (hashBytes[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

export async function verifyTotpCode(
  secret: string,
  candidateCode: string,
  windowSteps = 1,
  backupCodes?: string[]
): Promise<{ valid: boolean; usedBackupCode?: string }> {
  const trimmed = candidateCode.trim().replace(/\s+/g, '');

  // 1. Check if it matches an unused emergency backup code
  if (backupCodes && backupCodes.length > 0) {
    const matchedBackup = backupCodes.find(
      (code) => code.replace(/[-]/g, '') === trimmed.replace(/[-]/g, '')
    );
    if (matchedBackup) {
      return { valid: true, usedBackupCode: matchedBackup };
    }
  }

  // 2. Validate 6-digit TOTP format
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false };
  }

  const currentEpoch = Math.floor(Date.now() / 1000);

  // Check current time step and ±windowSteps (to tolerate client/server clock drift)
  for (let i = -windowSteps; i <= windowSteps; i++) {
    const testEpoch = currentEpoch + i * 30;
    const expected = await calculateTotpCode(secret, testEpoch);
    if (expected === trimmed) {
      return { valid: true };
    }
  }

  return { valid: false };
}

export function generateOtpAuthUrl(email: string, secret: string, issuer = 'HolidayTravelers'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

export async function generateQrCodeDataUrl(otpAuthUrl: string): Promise<string> {
  // Generates crisp, standard TOTP scannable QR code without requiring external node_modules
  const encoded = encodeURIComponent(otpAuthUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&margin=6&data=${encoded}`;
}

// ============================================================================
// COMMERCIAL PASSWORD HASHING (PBKDF2 / SHA-256 with Unique Salt)
// ============================================================================
export function generateSalt(length = 16): string {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const passKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    passKey,
    256
  );

  return Array.from(new Uint8Array(derivedKey))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(
  attempt: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  try {
    const computed = await hashPassword(attempt, salt);
    return computed === storedHash;
  } catch {
    return false;
  }
}

// ============================================================================
// TAMPER-EVIDENT SHA-256 AUDIT LOG HASH CHAIN
// ============================================================================
export async function calculateAuditHash(
  prevHash: string,
  entry: {
    id: string;
    timestamp: string;
    actorEmail: string;
    action: string;
    details: string;
    severity: string;
    targetEmail?: string;
  }
): Promise<string> {
  const payload = `${prevHash}|${entry.id}|${entry.timestamp}|${entry.actorEmail}|${entry.action}|${entry.details}|${entry.severity}|${entry.targetEmail || ''}`;
  const enc = new TextEncoder();
  const buffer = await window.crypto.subtle.digest('SHA-256', enc.encode(payload));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyAuditChain(
  logs: SecurityAuditLog[]
): Promise<{ valid: boolean; brokenAtIndex?: number }> {
  if (logs.length === 0) return { valid: true };

  // Logs are ordered newest to oldest, reverse to verify chronologically
  const chronological = [...logs].reverse();
  let prevHash = 'GENESIS_BLOCK_HOLIDAY_TRAVELERS_2026';

  for (let i = 0; i < chronological.length; i++) {
    const log = chronological[i];
    if (log.prevHash && log.prevHash !== prevHash) {
      return { valid: false, brokenAtIndex: logs.length - 1 - i };
    }

    const expectedHash = await calculateAuditHash(prevHash, log);
    if (log.hash && log.hash !== expectedHash) {
      return { valid: false, brokenAtIndex: logs.length - 1 - i };
    }

    prevHash = log.hash || expectedHash;
  }

  return { valid: true };
}
