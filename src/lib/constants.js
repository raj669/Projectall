// App-wide constants
export const APP_NAME = 'NepalEstates';
export const APP_VERSION = '1.0.0';

// API constants
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;

// Routes
export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:id',
  CONTACT: '/contact',
  REPORT: '/report',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
};

// Auth error types
export const AUTH_ERROR_TYPES = {
  USER_NOT_REGISTERED: 'user_not_registered',
  AUTH_REQUIRED: 'auth_required',
  TOKEN_EXPIRED: 'token_expired',
  UNKNOWN: 'unknown',
};

// Query cache times (in milliseconds)
export const CACHE_TIMES = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60, // 1 hour
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Property categories
export const PROPERTY_CATEGORIES = [
  { id: 'residential', label: 'Residential', icon: '🏠' },
  { id: 'commercial', label: 'Commercial', icon: '🏢' },
  { id: 'land', label: 'Land', icon: '🌳' },
  { id: 'office', label: 'Office', icon: '💼' },
];

// Cities
export const CITIES = [
  'Kathmandu',
  'Bhaktapur',
  'Lalitpur',
  'Pokhara',
  'Biratnagar',
  'Janakpur',
  'Butwal',
  'Birgunj',
  'Dharan',
  'Nepalgunj',
  'Itahari',
  'Dhangadi',
];
