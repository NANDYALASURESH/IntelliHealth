// models/Appointment.js

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'check-up', 'surgery'],
    required: [true, 'Appointment type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal'
  },
  symptoms: [{
    description: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    duration: String
  }],
  reasonForVisit: {
    type: String,
    required: [true, 'Reason for visit is required']
  },
  notes: String,
  diagnosis: String,
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  followUpDate: Date,
  consultationFee: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  cancelReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ doctor: 1, scheduledDate: 1 });
appointmentSchema.index({ patient: 1, scheduledDate: -1 });
appointmentSchema.index({ status: 1, scheduledDate: 1 });

// Virtual for appointment date-time
appointmentSchema.virtual('appointmentDateTime').get(function () {
  if (!this.scheduledDate || !this.scheduledTime) return null;
  const [hours, minutes] = this.scheduledTime.split(':');
  const dateTime = new Date(this.scheduledDate);
  dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateTime;
});

module.exports = mongoose.model('Appointment', appointmentSchema);