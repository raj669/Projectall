/**
 * Login rate limiter — stored in localStorage.
 * Blocks brute-force attempts: max 5 failures per 15-minute window per email.
 * On lockout, returns the wait time so the UI can display a countdown.
 */

const STORAGE_KEY   = 'ne_rate_limits_v1';
const MAX_FAILURES  = 5;
const WINDOW_MS     = 15 * 60 * 1000;   // 15 minutes
const LOCKOUT_MS    = 15 * 60 * 1000;   // 15-minute lockout

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /**/ }
}

// Use hashed email key so real emails don't sit in localStorage unprotected
function emailKey(email) {
  // Simple obfuscation — not a security boundary but avoids plaintext storage
  return btoa(email.toLowerCase().trim()).replace(/=/g, '');
}

/**
 * Check if the email is currently rate-limited.
 * Returns { allowed: bool, remainingAttempts: int, lockoutSeconds: int }
 */
export function checkRateLimit(email) {
  const data = load();
  const key  = emailKey(email);
  const now  = Date.now();
  const record = data[key] || { failures: [], lockedUntil: 0 };

  // Hard lockout still active?
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed:           false,
      remainingAttempts: 0,
      lockoutSeconds:    Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  // Purge failures outside the rolling window
  const recent = record.failures.filter(t => now - t < WINDOW_MS);
  data[key] = { ...record, failures: recent };
  save(data);

  const remaining = Math.max(0, MAX_FAILURES - recent.length);
  return { allowed: true, remainingAttempts: remaining, lockoutSeconds: 0 };
}

/**
 * Record a failed login attempt. If threshold is hit, set a lockout.
 */
export function recordFailure(email) {
  const data = load();
  const key  = emailKey(email);
  const now  = Date.now();
  const record = data[key] || { failures: [], lockedUntil: 0 };
  const recent = [...record.failures.filter(t => now - t < WINDOW_MS), now];

  let lockedUntil = record.lockedUntil;
  if (recent.length >= MAX_FAILURES) {
    lockedUntil = now + LOCKOUT_MS;
  }

  data[key] = { failures: recent, lockedUntil };
  save(data);

  return {
    lockoutApplied: recent.length >= MAX_FAILURES,
    lockoutSeconds: lockedUntil > now ? Math.ceil((lockedUntil - now) / 1000) : 0,
    remainingAttempts: Math.max(0, MAX_FAILURES - recent.length),
  };
}

/**
 * Clear the rate limit for an email after a successful login.
 */
export function clearRateLimit(email) {
  const data = load();
  const key  = emailKey(email);
  delete data[key];
  save(data);
}
