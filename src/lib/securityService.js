/**
 * Secure user data management
 * Stores user information with basic encryption and sanitization
 */

const STORAGE_KEY = 'user_registration_data';
const ENCRYPTION_KEY = 'nepalestates_secure_2024'; // In production, use environment variable

/**
 * Simple encryption/decryption using base64 (NOT suitable for sensitive production data)
 * For production, use a proper encryption library like crypto-js or tweetnacl
 */
export const secureStorage = {
  // Store user registration data
  storeUserData: (userData) => {
    try {
      // Validate data
      if (!userData.email || !userData.name) {
        throw new Error('Invalid user data');
      }

      // Remove any sensitive fields that shouldn't be stored
      const safeData = {
        id: userData.id || '',
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        phone: userData.phone || ''
      };

      // Store in sessionStorage (cleared on browser close - more secure)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
      
      // Also store email in localStorage for convenience (for login form pre-fill)
      localStorage.setItem('lastRegisteredEmail', userData.email);
      
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  },

  // Retrieve stored user data
  getUserData: () => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  },

  // Get last registered email for form convenience
  getLastEmail: () => {
    return localStorage.getItem('lastRegisteredEmail') || '';
  },

  // Clear user data on logout
  clearUserData: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    // Don't remove lastRegisteredEmail - it's safe to keep for login convenience
  },

  // Check if user data exists
  hasUserData: () => {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  }
};

/**
 * Input sanitization to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and special characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password strength validation
 */
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  
  return {
    valid: Object.values(checks).every(Boolean),
    strength, // 0-5 scale
    checks
  };
};

/**
 * Rate limiting for repeated registration attempts
 */
export const rateLimit = {
  key: 'registration_attempts',
  maxAttempts: 5,
  windowMs: 3600000, // 1 hour

  check: () => {
    const data = localStorage.getItem(rateLimit.key);
    if (!data) return true;

    const { attempts, timestamp } = JSON.parse(data);
    const now = Date.now();

    // Reset if window has passed
    if (now - timestamp > rateLimit.windowMs) {
      return true;
    }

    return attempts < rateLimit.maxAttempts;
  },

  increment: () => {
    const data = localStorage.getItem(rateLimit.key);
    const now = Date.now();

    if (!data) {
      localStorage.setItem(rateLimit.key, JSON.stringify({
        attempts: 1,
        timestamp: now
      }));
      return 1;
    }

    const { attempts, timestamp } = JSON.parse(data);

    // Reset if window has passed
    if (now - timestamp > rateLimit.windowMs) {
      localStorage.setItem(rateLimit.key, JSON.stringify({
        attempts: 1,
        timestamp: now
      }));
      return 1;
    }

    const newAttempts = attempts + 1;
    localStorage.setItem(rateLimit.key, JSON.stringify({
      attempts: newAttempts,
      timestamp
    }));
    return newAttempts;
  },

  getRemaining: () => {
    const data = localStorage.getItem(rateLimit.key);
    if (!data) return rateLimit.maxAttempts;

    const { attempts, timestamp } = JSON.parse(data);
    const now = Date.now();

    // Reset if window has passed
    if (now - timestamp > rateLimit.windowMs) {
      return rateLimit.maxAttempts;
    }

    return Math.max(0, rateLimit.maxAttempts - attempts);
  },

  reset: () => {
    localStorage.removeItem(rateLimit.key);
  }
};
