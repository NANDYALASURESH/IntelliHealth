const Prescription = require('../models/Prescription');
const User = require('../models/User');
const { formatResponse } = require('../utils/responseFormatter');
const { createAuditLog } = require('../services/auditService');

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
exports.createPrescription = async (req, res) => {
    try {
        // Verify user is a doctor
        if (req.user.role !== 'doctor') {
            return res.status(403).json(formatResponse(false, 'Not authorized to create prescriptions', null));
        }

        const { patientId, medications, diagnosis, instructions, validUntil } = req.body;

        // Validate required fields
        if (!patientId || !medications || medications.length === 0) {
            return res.status(400).json(formatResponse(false, 'Please provide patient and medications', null));
        }

        // Verify patient exists
        const patientUser = await User.findById(patientId);
        if (!patientUser) {
            return res.status(404).json(formatResponse(false, 'Patient not found', null));
        }

        const prescription = await Prescription.create({
            doctor: req.user.id,
            patient: patientId,
            medications,
            diagnosis,
            instructions,
            validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
            status: 'active'
        });

        // Create audit log
        await createAuditLog({
            user: req.user.id,
            action: 'PRESCRIPTION_CREATE',
            resource: 'Prescription',
            resourceId: prescription._id,
            details: { patient: patientId },
            ipAddress: req.ip
        });

        res.status(201).json(formatResponse(true, 'Prescription created successfully', { prescription }));
    } catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json(formatResponse(false, 'Server error creating prescription', null));
    }
};

// @desc    Get prescriptions for a specific patient
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (Doctor, Patient, Admin)
exports.getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Access control
        if (req.user.role === 'patient' && req.user.id !== patientId) {
            return res.status(403).json(formatResponse(false, 'Not authorized to view these prescriptions', null));
        }

        const prescriptions = await Prescription.find({ patient: patientId })
            .populate('doctor', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(formatResponse(true, 'Prescriptions retrieved successfully', { prescriptions }));
    } catch (error) {
        console.error('Get patient prescriptions error:', error);
        res.status(500).json(formatResponse(false, 'Server error retrieving prescriptions', null));
    }
};

// @desc    Get prescriptions by logged in doctor
// @route   GET /api/prescriptions/doctor/me
// @access  Private (Doctor only)
exports.getPrescriptionsByDoctor = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json(formatResponse(false, 'Not authorized', null));
        }

        const prescriptions = await Prescription.find({ doctor: req.user.id })
            .populate('patient', 'name email dateOfBirth')
            .sort({ createdAt: -1 });

        res.status(200).json(formatResponse(true, 'Prescriptions retrieved successfully', { prescriptions }));
    } catch (error) {
        console.error('Get doctor prescriptions error:', error);
        res.status(500).json(formatResponse(false, 'Server error retrieving prescriptions', null));
    }
};

// @desc    Get my prescriptions (for logged in patient)
// @route   GET /api/prescriptions/my
// @access  Private (Patient only)
exports.getMyPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id })
            .populate('doctor', 'name email specializations')
            .sort({ createdAt: -1 });

        res.status(200).json(formatResponse(true, 'My prescriptions retrieved successfully', { prescriptions }));
    } catch (error) {
        console.error('Get my prescriptions error:', error);
        res.status(500).json(formatResponse(false, 'Server error retrieving prescriptions', null));
    }
};

// @desc    Get single prescription details
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('doctor', 'name email')
            .populate('patient', 'name email');

        if (!prescription) {
            return res.status(404).json(formatResponse(false, 'Prescription not found', null));
        }

        // Access check
        if (req.user.role === 'patient' && prescription.patient._id.toString() !== req.user.id) {
            return res.status(403).json(formatResponse(false, 'Not authorized', null));
        }

        res.status(200).json(formatResponse(true, 'Prescription retrieved successfully', { prescription }));

    } catch (error) {
        console.error('Get prescription error:', error);
        res.status(500).json(formatResponse(false, 'Server error retrieving prescription', null));
    }
}
