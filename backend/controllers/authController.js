import User from '../models/User.js';
import { generateTokens, setRefreshTokenCookie, verifyRefreshToken, clearRefreshTokenCookie } from '../utils/jwt.js';
import { logAction, getClientIp, getUserAgent } from '../utils/logger.js';
import { CustomError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('Email already registered', 'EMAIL_EXISTS', 400);
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, refreshToken);

    await logAction(user._id, email, 'register', getClientIp(req), getUserAgent(req));

    res.status(201).json({
      user: user.toJSON(),
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      await logAction(null, email, 'failed_login', getClientIp(req), getUserAgent(req), { reason: 'user_not_found' });
      throw new CustomError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await logAction(user._id, email, 'failed_login', getClientIp(req), getUserAgent(req), { reason: 'invalid_password' });
      throw new CustomError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, refreshToken);

    await logAction(user._id, email, 'login', getClientIp(req), getUserAgent(req));

    res.json({
      user: user.toJSON(),
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    await logAction(req.userId, req.user?.email, 'logout', getClientIp(req), getUserAgent(req));

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError('No refresh token provided', 'NO_REFRESH_TOKEN', 401);
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new CustomError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new CustomError('User not found', 'USER_NOT_FOUND', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      user: user.toJSON(),
      accessToken
    });
  } catch (error) {
    next(error);
  }
};
