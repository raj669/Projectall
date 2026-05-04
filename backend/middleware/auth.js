import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler.js';

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new CustomError('No token provided', 'NO_TOKEN', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.code) {
      return res.status(error.status).json({ error: error.message, code: error.code });
    }
    res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.userId = decoded.id;
    }
  } catch (error) {
    // Silently fail for optional auth
  }
  next();
};
