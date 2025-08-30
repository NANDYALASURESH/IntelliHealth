const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Ordering doctor is required']
  },
  labTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  testType: {
    type: String,
    required: [true, 'Test type is required']
  },
  testCategory: {
    type: String,
    enum: ['blood', 'urine', 'stool', 'imaging', 'biopsy', 'culture', 'genetic'],
    required: [true, 'Test category is required']
  },
  specimen: {
    type: String,
    collectionDate: Date,
    collectionTime: String,
    collectedBy: String,
    volume: String,
    condition: String
  },
  testParameters: [{
    parameter: String,
    value: String,
    unit: String,
    normalRange: String,
    flag: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical']
    },
    notes: String
  }],
  overallResult: {
    type: String,
    enum: ['normal', 'abnormal', 'critical', 'inconclusive'],
    required: [true, 'Overall result is required']
  },
  interpretation: String,
  recommendations: String,
  status: {
    type: String,
    enum: ['ordered', 'collected', 'processing', 'completed', 'reviewed', 'reported'],
    default: 'ordered'
  },
  priority: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine'
  },
  reportDate: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  reviewedAt: Date,
  attachments: [{
    type: String,
    url: String,
    description: String
  }],
  isAbnormal: {
    type: Boolean,
    default: false
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
labResultSchema.index({ patient: 1, createdAt: -1 });
labResultSchema.index({ orderedBy: 1, status: 1 });
labResultSchema.index({ status: 1, priority: 1 });

// Pre-save middleware to check for abnormal/critical results
labResultSchema.pre('save', function(next) {
  // Check if any parameter is flagged as high, low, or critical
  this.isAbnormal = this.testParameters.some(param => 
    param.flag === 'high' || param.flag === 'low' || param.flag === 'critical'
  );
  
  this.isCritical = this.testParameters.some(param => param.flag === 'critical');
  
  next();
});

module.exports = mongoose.model('LabResult', labResultSchema);