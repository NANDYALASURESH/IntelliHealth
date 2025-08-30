// models/Patient.js - Patient-specific Model
const mongoose = require('mongoose');
const User = require('./User');

const patientSchema = new mongoose.Schema({
  primaryDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: String,
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    }
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    },
    notes: String
  }],
  allergies: [{
    substance: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    reaction: String
  }],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    effectiveDate: Date,
    expirationDate: Date
  },
  vitalSigns: {
    height: Number, // in cm
    weight: Number, // in kg
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      recordedAt: Date
    },
    heartRate: Number,
    temperature: Number, // in Celsius
    lastUpdated: Date
  },
  healthScore: {
    type: Number,
    default: 85,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Calculate age from date of birth
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Calculate BMI
patientSchema.virtual('bmi').get(function() {
  if (!this.vitalSigns?.height || !this.vitalSigns?.weight) return null;
  const heightInM = this.vitalSigns.height / 100;
  return (this.vitalSigns.weight / (heightInM * heightInM)).toFixed(1);
});

const Patient = User.discriminator('patient', patientSchema);

module.exports = Patient;