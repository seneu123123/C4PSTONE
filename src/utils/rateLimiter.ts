// Commercial Rate Limiting & Brute-Force Lockout Defense

interface AttemptRecord {
  failedAttempts: number;
  lockedUntil: number | null; // epoch ms
  lastAttemptTime: number;
}

const STORAGE_KEY = 'holiday_security_rate_limits';
const MAX_ATTEMPTS_BEFORE_CHALLENGE = 3;
const MAX_ATTEMPTS_BEFORE_LOCKOUT = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getRecords(): Record<string, AttemptRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRecords(records: Record<string, AttemptRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export interface RateLimitStatus {
  isLocked: boolean;
  lockoutRemainingSeconds: number;
  failedCount: number;
  requiresChallenge: boolean;
}

export function checkRateLimit(identifier: string): RateLimitStatus {
  const records = getRecords();
  const key = identifier.trim().toLowerCase();
  const record = records[key];

  if (!record) {
    return {
      isLocked: false,
      lockoutRemainingSeconds: 0,
      failedCount: 0,
      requiresChallenge: false
    };
  }

  const now = Date.now();

  // If lockout expired, auto-reset
  if (record.lockedUntil && now >= record.lockedUntil) {
    delete records[key];
    saveRecords(records);
    return {
      isLocked: false,
      lockoutRemainingSeconds: 0,
      failedCount: 0,
      requiresChallenge: false
    };
  }

  if (record.lockedUntil && now < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      lockoutRemainingSeconds: remaining,
      failedCount: record.failedAttempts,
      requiresChallenge: true
    };
  }

  return {
    isLocked: false,
    lockoutRemainingSeconds: 0,
    failedCount: record.failedAttempts,
    requiresChallenge: record.failedAttempts >= MAX_ATTEMPTS_BEFORE_CHALLENGE
  };
}

export function recordFailedAttempt(identifier: string): RateLimitStatus {
  const records = getRecords();
  const key = identifier.trim().toLowerCase();
  const now = Date.now();

  const record = records[key] || {
    failedAttempts: 0,
    lockedUntil: null,
    lastAttemptTime: now
  };

  record.failedAttempts += 1;
  record.lastAttemptTime = now;

  if (record.failedAttempts >= MAX_ATTEMPTS_BEFORE_LOCKOUT) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  records[key] = record;
  saveRecords(records);

  return checkRateLimit(identifier);
}

export function clearRateLimit(identifier: string): void {
  const records = getRecords();
  const key = identifier.trim().toLowerCase();
  if (records[key]) {
    delete records[key];
    saveRecords(records);
  }
}

export function generateMathChallenge(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 12) + 3;
  const b = Math.floor(Math.random() * 12) + 3;
  return {
    question: `Security Challenge: What is ${a} + ${b}?`,
    answer: a + b
  };
}
