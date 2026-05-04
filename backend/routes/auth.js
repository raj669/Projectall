import express from 'express';
import { register, login, logout, refresh } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middleware/validation.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerLimiter, registerValidation, register);
router.post('/login', loginLimiter, loginValidation, login);
router.post('/logout', auth, logout);
router.post('/refresh', refresh);

export default router;
