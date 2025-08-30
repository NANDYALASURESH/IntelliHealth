const mongoose = require('mongoose');
const User = require('./User');

const doctorSchema = new mongoose.Schema({
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience required']
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    issueDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  workingHours: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  isAvailableForEmergency: {
    type: Boolean,
    default: false
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Virtual for total patients
doctorSchema.virtual('totalPatients').get(function() {
  return this.patients?.length || 0;
});

// Create discriminator
const Doctor = User.discriminator('doctor', doctorSchema);

module.exports = Doctor;