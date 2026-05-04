import { z } from 'zod';

// ─── Shared rules ─────────────────────────────────────────────────────────────

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const PHONE_RE    = /^(\+977[-\s]?)?[0-9]{7,12}$/;
const HTTPS_IMAGE = /^https:\/\/.+\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i;

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be 60 characters or fewer')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name may only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .email('Enter a valid email address')
    .max(100, 'Email must be 100 characters or fewer')
    .transform(v => v.toLowerCase().trim()),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or fewer')
    .regex(PASSWORD_RE,
      'Password must contain uppercase, lowercase, number, and special character'),

  confirmPassword: z.string(),

  agreeToTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the Terms of Service' }) }),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .transform(v => v.toLowerCase().trim()),

  password: z.string().min(1, 'Password is required'),

  rememberMe: z.boolean().optional().default(false),
});

// ─── Property listing schema ──────────────────────────────────────────────────

export const propertyListingSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must be 120 characters or fewer')
    .transform(v => v.trim()),

  type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land'], {
    errorMap: () => ({ message: 'Select a valid property type' }),
  }),

  status: z.enum(['sale', 'rent'], {
    errorMap: () => ({ message: 'Select For Sale or For Rent' }),
  }),

  price: z
    .number({ invalid_type_error: 'Enter a valid price' })
    .positive('Price must be greater than 0')
    .max(500_000_000, 'Price seems unusually high'),

  bedrooms: z.number().int().min(0).max(20).optional().default(0),
  bathrooms: z.number().int().min(0).max(20).optional().default(0),

  area: z
    .number({ invalid_type_error: 'Enter a valid area' })
    .positive('Area must be greater than 0')
    .max(100_000, 'Area seems unusually large'),

  area_unit: z.enum(['sqft', 'aana']).default('sqft'),

  city: z
    .string()
    .min(2, 'City is required')
    .max(60)
    .transform(v => v.trim()),

  district: z
    .string()
    .max(60)
    .optional()
    .default('')
    .transform(v => v.trim()),

  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200)
    .transform(v => v.trim()),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(3000, 'Description must be 3000 characters or fewer')
    .transform(v => v.trim()),

  contact_phone: z
    .string()
    .regex(PHONE_RE, 'Enter a valid Nepal phone number')
    .transform(v => v.trim()),

  images: z
    .array(
      z.string().url('Each image must be a valid URL').regex(HTTPS_IMAGE, 'Images must be HTTPS and end in jpg/png/webp/gif')
    )
    .min(1, 'Add at least one image')
    .max(8, 'Maximum 8 images allowed'),

  features: z
    .array(z.string().max(50))
    .max(20, 'Maximum 20 features')
    .optional()
    .default([]),
});

// ─── Profile update schema ────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60)
    .regex(/^[a-zA-Z\s'-]+$/, 'Name may only contain letters, spaces, hyphens, and apostrophes')
    .transform(v => v.trim()),

  phone: z
    .string()
    .regex(PHONE_RE, 'Enter a valid Nepal phone number')
    .optional()
    .or(z.literal(''))
    .transform(v => v?.trim() ?? ''),
});

// ─── Password strength scoring ────────────────────────────────────────────────

export function scorePassword(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password))    score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak',   color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair',   color: 'bg-orange-500' };
  if (score <= 4) return { score, label: 'Good',   color: 'bg-yellow-500' };
  if (score <= 5) return { score, label: 'Strong', color: 'bg-emerald-500' };
  return           { score, label: 'Very Strong', color: 'bg-green-600' };
}
