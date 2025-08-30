// models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Notification title is required']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required']
  },
  type: {
    type: String,
    enum: ['appointment', 'lab-result', 'prescription', 'emergency', 'reminder', 'system', 'message'],
    required: [true, 'Notification type is required']
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  data: mongoose.Schema.Types.Mixed, // Additional data related to notification
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  deliveryMethod: {
    type: String,
    enum: ['push', 'email', 'sms', 'in-app'],
    default: 'in-app'
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  expiresAt: Date,
  actionUrl: String,
  actionRequired: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });

// TTL index for automatic deletion of expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);