import { body, query, param, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map(e => `${e.path}: ${e.msg}`).join('; '),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};

export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  validateRequest
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
];

export const propertyValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('type')
    .isIn(['apartment', 'house', 'villa', 'commercial', 'land'])
    .withMessage('Invalid property type'),
  body('status')
    .isIn(['sale', 'rent'])
    .withMessage('Invalid property status'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('bedrooms')
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms')
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a non-negative integer'),
  body('area')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('contactPhone')
    .matches(/^[0-9\-\+\(\) ]{10,}$/)
    .withMessage('Invalid phone format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  validateRequest
];

export const favoriteValidation = [
  param('propertyId')
    .isMongoId()
    .withMessage('Invalid property ID'),
  validateRequest
];

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9\-\+\(\) ]{10,}$/)
    .withMessage('Invalid phone format'),
  validateRequest
];
