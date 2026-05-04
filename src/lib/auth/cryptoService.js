/**
 * Cryptographic primitives using the Web Crypto API only (no dependencies).
 * All operations are async and use hardware-accelerated native crypto.
 */

const PBKDF2_ITERATIONS = 100_000; // NIST SP 800-63B recommendation
const PBKDF2_KEY_BITS   = 256;
const TOKEN_EXPIRY_MS   = 24 * 60 * 60 * 1000; // 24 hours

// ─── HMAC signing key (derived once per session from app secret) ──────────────

const APP_SECRET = import.meta.env.VITE_APP_SECRET || 'nepal-estates-secure-key-v1-2024';

let _signingKey = null;
async function getSigningKey() {
  if (_signingKey) return _signingKey;
  const enc = new TextEncoder();
  const rawKey = enc.encode(APP_SECRET);
  const baseKey = await crypto.subtle.importKey('raw', rawKey, 'PBKDF2', false, ['deriveKey']);
  _signingKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('session-signing-salt'), iterations: 1000, hash: 'SHA-256' },
    baseKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  return _signingKey;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function b64url(input) {
  const str = typeof input === 'string' ? input : String.fromCharCode(...new Uint8Array(input));
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlDecode(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
  return atob(s + pad);
}

// Constant-time string comparison to prevent timing attacks
function constantTimeEquals(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Password hashing (PBKDF2 + SHA-256) ─────────────────────────────────────

/**
 * Hash a plaintext password. Returns an opaque string — never store plaintext.
 */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc  = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    PBKDF2_KEY_BITS,
  );
  return `pbkdf2:${b64url(salt)}:${b64url(bits)}`;
}

/**
 * Verify a plaintext password against a stored hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(password, stored) {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;
  const [, saltB64, hashB64] = parts;
  const salt = Uint8Array.from(b64urlDecode(saltB64), c => c.charCodeAt(0));
  const enc  = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    PBKDF2_KEY_BITS,
  );
  return constantTimeEquals(b64url(bits), hashB64);
}

// ─── Session tokens (signed with HMAC-SHA256) ─────────────────────────────────

/**
 * Create a signed, expiring session token. Token is NOT stored; the session
 * ID it contains is validated against the server-side session store.
 */
export async function createSessionToken(payload, expiresInMs = TOKEN_EXPIRY_MS) {
  const key     = await getSigningKey();
  const now     = Date.now();
  const full    = { ...payload, iat: now, exp: now + expiresInMs, jti: generateId() };
  const header  = b64url(JSON.stringify({ alg: 'HS256', typ: 'SESSION' }));
  const body    = b64url(JSON.stringify(full));
  const enc     = new TextEncoder();
  const rawSig  = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`));
  const sig     = b64url(rawSig);
  return `${header}.${body}.${sig}`;
}

/**
 * Verify and decode a session token. Returns payload or null if invalid/expired.
 */
export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sigStr] = parts;
  const key    = await getSigningKey();
  const enc    = new TextEncoder();
  const sigBuf = Uint8Array.from(b64urlDecode(sigStr), c => c.charCodeAt(0));
  try {
    const valid = await crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(`${header}.${body}`));
    if (!valid) return null;
    const payload = JSON.parse(b64urlDecode(body));
    if (Date.now() > payload.exp) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

// ─── CSRF token ────────────────────────────────────────────────────────────────

export function generateCsrfToken() {
  return b64url(crypto.getRandomValues(new Uint8Array(32)));
}

export function verifyCsrfToken(submitted, stored) {
  if (!submitted || !stored) return false;
  return constantTimeEquals(submitted, stored);
}

// ─── Secure random ID ─────────────────────────────────────────────────────────

export function generateId() {
  return crypto.randomUUID();
}

// ─── Email masking (for logs — never store real email in logs) ────────────────

export function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  const masked = local.length <= 2 ? '***' : `${local[0]}${local[1]}***`;
  return `${masked}@${domain}`;
}
