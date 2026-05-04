import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  action: {
    type: String,
    enum: ['login', 'logout', 'register', 'property_added', 'property_deleted', 'property_updated', 'favorite_added', 'favorite_removed', 'failed_login', 'rate_limit_exceeded'],
    required: true
  },
  email: {
    type: String,
    default: null
  },
  ipAddress: String,
  userAgent: String,
  details: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
    expire: 2592000 // Auto-delete after 30 days
  }
});

export default mongoose.model('AuditLog', auditLogSchema);
