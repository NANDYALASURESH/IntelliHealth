

const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const { formatResponse } = require('../utils/responseFormatter');
const { createAuditLog } = require('../services/auditService');

// @desc    Create a new medical record (Diagnosis)
// @route   POST /api/medical-records
// @access  Private (Doctor only)
exports.createRecord = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json(formatResponse(false, 'Not authorized to create medical records', null));
    }

    const {
      patientId,
      recordType,
      diagnosis,
      treatmentPlan,
      medications,
      vitals,
      notes
    } = req.body;

    // Validate required fields
    if (!patientId || !recordType) {
      return res.status(400).json(formatResponse(false, 'Please provide patient and record type', null));
    }

    // Verify patient exists
    const patientUser = await User.findById(patientId);
    if (!patientUser) {
      return res.status(404).json(formatResponse(false, 'Patient not found', null));
    }

    const record = await MedicalRecord.create({
      doctor: req.user.id,
      patient: patientId,
      recordType,
      diagnosis: diagnosis || {},
      treatmentPlan,
      medications,
      'physicalExamination.vitals': vitals,
      notes, // Adjust schema matching if 'notes' isn't top level, check schema
      isConfidential: false
    });

    // Create audit log
    await createAuditLog({
      user: req.user.id,
      action: 'MEDICAL_RECORD_CREATE',
      resource: 'MedicalRecord',
      resourceId: record._id,
      details: { patient: patientId, type: recordType },
      ipAddress: req.ip
    });

    res.status(201).json(formatResponse(true, 'Medical record created successfully', { record }));
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json(formatResponse(false, 'Server error creating medical record', null));
  }
};

// @desc    Get medical records for a specific patient
// @route   GET /api/medical-records/patient/:patientId
// @access  Private (Doctor, Patient, Admin)
exports.getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Access control: Patient can only view their own
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json(formatResponse(false, 'Not authorized', null));
    }

    const records = await MedicalRecord.find({ patient: patientId })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(formatResponse(true, 'Medical records retrieved successfully', { records }));
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json(formatResponse(false, 'Server error retrieving records', null));
  }
};

// @desc    Get records created by logged in doctor
// @route   GET /api/medical-records/doctor/me
// @access  Private (Doctor only)
exports.getRecordsByDoctor = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json(formatResponse(false, 'Not authorized', null));
    }

    const records = await MedicalRecord.find({ doctor: req.user.id })
      .populate('patient', 'name email dateOfBirth')
      .sort({ createdAt: -1 });

    res.status(200).json(formatResponse(true, 'Records retrieved successfully', { records }));
  } catch (error) {
    console.error('Get doctor prescriptions error:', error);
    res.status(500).json(formatResponse(false, 'Server error retrieving records', null));
  }
};

// @desc    Get my medical records (for logged in patient)
// @route   GET /api/medical-records/my
// @access  Private (Patient only)
exports.getMyRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user.id })
      .populate('doctor', 'name email specializations')
      .sort({ createdAt: -1 });

    res.status(200).json(formatResponse(true, 'My medical records retrieved successfully', { records }));
  } catch (error) {
    console.error('Get my records error:', error);
    res.status(500).json(formatResponse(false, 'Server error retrieving records', null));
  }
};

// @desc    Get single record details
// @route   GET /api/medical-records/:id
// @access  Private
exports.getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('doctor', 'name email')
      .populate('patient', 'name email');

    if (!record) {
      return res.status(404).json(formatResponse(false, 'Record not found', null));
    }

    // Access check
    if (req.user.role === 'patient' && record.patient._id.toString() !== req.user.id) {
      return res.status(403).json(formatResponse(false, 'Not authorized', null));
    }

    // Log access
    if (req.user.id !== record.doctor._id.toString() && req.user.id !== record.patient._id.toString()) {
      // Maybe log if it's another doctor accessed it?
    }

    res.status(200).json(formatResponse(true, 'Record retrieved successfully', { record }));

  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json(formatResponse(false, 'Server error retrieving record', null));
  }
}


