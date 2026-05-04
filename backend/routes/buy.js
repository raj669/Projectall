import express from 'express';
import { getAllProperties, getPropertyById } from '../controllers/propertyController.js';
import { optionalAuth } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', generalLimiter, optionalAuth, getAllProperties);
router.get('/:id', optionalAuth, getPropertyById);

export default router;
