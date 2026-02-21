const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },
    subject: {
        type: String,
        trim: true
    },
    body: {
        type: String,
        required: [true, 'Message body is required'],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    category: {
        type: String,
        enum: ['general', 'appointment', 'prescription', 'billing', 'emergency'],
        default: 'general'
    },
    relatedId: mongoose.Schema.Types.ObjectId // e.g. Appointment ID or Prescription ID
}, {
    timestamps: true
});

// Index for efficient queries
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
