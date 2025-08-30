// models/AuditLog.js

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: [true, 'Action is required']
  },
  resource: {
    type: String,
    required: [true, 'Resource is required']
  },
  resourceId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  sessionId: String,
  status: {
    type: String,
    enum: ['success', 'failed', 'error'],
    default: 'success'
  },
  errorMessage: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

// TTL index for automatic deletion of old logs (keep for 1 year)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);