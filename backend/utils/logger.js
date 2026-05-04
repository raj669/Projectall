import AuditLog from '../models/AuditLog.js';

export const logAction = async (userId, email, action, ipAddress, userAgent, details = {}) => {
  try {
    await AuditLog.create({
      userId,
      email,
      action,
      ipAddress,
      userAgent,
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to log action:', error.message);
  }
};

export const getClientIp = (req) => {
  return req.ip || req.connection.remoteAddress || 'unknown';
};

export const getUserAgent = (req) => {
  return req.get('user-agent') || 'unknown';
};
