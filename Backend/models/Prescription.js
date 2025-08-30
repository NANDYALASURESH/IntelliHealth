const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
  medicalRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  prescriptionNumber: {
    type: String,
    unique: true,
    required: [true, 'Prescription number is required']
  },
  medications: [{
    name: {
      type: String,
      required: [true, 'Medication name is required']
    },
    genericName: String,
    strength: String,
    dosageForm: {
      type: String,
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler']
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required']
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required']
    },
    duration: String,
    quantity: Number,
    refills: {
      type: Number,
      default: 0
    },
    instructions: String,
    beforeAfterMeals: {
      type: String,
      enum: ['before', 'after', 'with', 'anytime']
    }
  }],
  diagnosis: String,
  instructions: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued', 'expired'],
    default: 'active'
  },
  validUntil: {
    type: Date,
    required: [true, 'Prescription validity date is required']
  },
  isDigital: {
    type: Boolean,
    default: true
  },
  pharmacy: {
    name: String,
    address: String,
    phone: String,
    dispensedAt: Date,
    dispensedBy: String
  },
  refillHistory: [{
    date: Date,
    pharmacy: String,
    dispensedBy: String,
    quantity: Number
  }]
}, {
  timestamps: true
});

// Generate prescription number before saving
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionNumber = `RX${Date.now()}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Index for efficient queries
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ prescriptionNumber: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);