// models/MedicalRecord.js

const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  recordType: {
    type: String,
    enum: ['consultation', 'diagnosis', 'treatment', 'surgery', 'emergency', 'lab-result'],
    required: [true, 'Record type is required']
  },
  chiefComplaint: String,
  presentIllnessHistory: String,
  physicalExamination: {
    general: String,
    vitals: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number
    },
    systems: {
      cardiovascular: String,
      respiratory: String,
      gastrointestinal: String,
      neurological: String,
      musculoskeletal: String,
      dermatological: String
    }
  },
  diagnosis: {
    primary: String,
    secondary: [String],
    differential: [String],
    icdCodes: [String]
  },
  treatmentPlan: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labTests: [{
    test: String,
    ordered: Boolean,
    result: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['ordered', 'completed', 'pending']
    }
  }],
  imaging: [{
    type: String, // X-ray, CT, MRI, etc.
    bodyPart: String,
    findings: String,
    imageUrl: String,
    ordered: Boolean,
    completed: Boolean
  }],
  procedures: [{
    name: String,
    performedBy: String,
    date: Date,
    notes: String,
    complications: String
  }],
  followUp: {
    required: Boolean,
    date: Date,
    instructions: String
  },
  attachments: [{
    type: String,
    url: String,
    description: String,
    uploadedAt: Date
  }],
  isConfidential: {
    type: Boolean,
    default: false
  },
  accessLog: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: String,
    timestamp: Date,
    ipAddress: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ doctor: 1, createdAt: -1 });
medicalRecordSchema.index({ recordType: 1, createdAt: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);