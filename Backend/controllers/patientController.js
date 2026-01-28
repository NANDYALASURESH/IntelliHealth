// controllers/patientController.js - Patient Dashboard Controller

const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const LabResult = require('../models/LabResult');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Get patient dashboard statistics
// @route   GET /api/patient/dashboard-stats
// @access  Private (Patient only)
exports.getDashboardStats = async (req, res) => {
  try {
    const patientId = req.user.id;
    const today = new Date();

    const [
      upcomingAppointments,
      activePrescriptions,
      recentTests,
      nextAppointment,
      patient,
      appointments,
      prescriptions,
      labResults
    ] = await Promise.all([
      Appointment.countDocuments({
        patient: patientId,
        scheduledDate: { $gte: today },
        status: { $in: ['scheduled', 'confirmed'] }
      }),
      Prescription.countDocuments({
        patient: patientId,
        status: 'active',
        validUntil: { $gte: today }
      }),
      LabResult.countDocuments({
        patient: patientId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Appointment.findOne({
        patient: patientId,
        scheduledDate: { $gte: today },
        status: { $in: ['scheduled', 'confirmed'] }
      })
        .populate('doctor', 'name specialization')
        .sort({ scheduledDate: 1 }),
      Patient.findById(patientId)
        .select('vitalSigns healthScore primaryDoctor')
        .populate('primaryDoctor', 'name specialization department'),
      Appointment.find({
        patient: patientId,
        scheduledDate: { $gte: today },
        status: { $in: ['scheduled', 'confirmed'] }
      })
        .populate('doctor', 'name specialization')
        .sort({ scheduledDate: 1 })
        .limit(5),
      Prescription.find({
        patient: patientId,
        status: 'active'
      })
        .populate('doctor', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      LabResult.find({
        patient: patientId,
        status: 'completed'
      })
        .populate('orderedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const healthData = {
      upcomingAppointments,
      activePrescriptions,
      recentTests,
      healthScore: patient?.healthScore || 85,
      nextAppointment: nextAppointment ? {
        doctor: nextAppointment.doctor.name,
        date: nextAppointment.scheduledDate,
        time: nextAppointment.scheduledTime,
        type: nextAppointment.type
      } : null,
      vitalSigns: patient?.vitalSigns || {
        heartRate: 72,
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        },
        temperature: 98.6,
        weight: 70
      },
      primaryDoctor: patient?.primaryDoctor ? {
        id: patient.primaryDoctor._id,
        name: patient.primaryDoctor.name,
        specialization: patient.primaryDoctor.specialization,
        department: patient.primaryDoctor.department
      } : null
    };

    res.status(200).json(formatResponse(true, 'Patient dashboard data retrieved successfully', {
      healthData,
      appointments,
      prescriptions,
      labResults
    }));

  } catch (error) {
    console.error('Get patient dashboard stats error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving dashboard data', null));
  }
};

// @desc    Get patient's medical records
// @route   GET /api/patient/medical-records
// @access  Private (Patient only)
exports.getMedicalRecords = async (req, res) => {
  try {
    const patientId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type;

    let query = { patient: patientId };

    if (type) {
      query.recordType = type;
    }

    const total = await MedicalRecord.countDocuments(query);
    const records = await MedicalRecord.find(query)
      .populate('doctor', 'name specialization')
      .populate('appointment', 'scheduledDate type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(formatResponse(true, 'Medical records retrieved successfully', {
      records,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    console.error('Get patient medical records error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving medical records', null));
  }
};

// @desc    Get patient's appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient only)
exports.getAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = { patient: patientId };
    if (status) query.status = status;

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization')
      .sort({ scheduledDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(formatResponse(true, 'Appointments retrieved successfully', {
      appointments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving appointments', null));
  }
};

// @desc    Book appointment
// @route   POST /api/patient/appointments
// @access  Private (Patient only)
exports.bookAppointment = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      patient: req.user.id,
      status: 'scheduled'
    };
    const appt = await Appointment.create(payload);
    res.status(201).json(formatResponse(true, 'Appointment booked successfully', { appointment: appt }));
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(400).json(formatResponse(false, error.message, null));
  }
};

// @desc    Get patient's prescriptions
// @route   GET /api/patient/prescriptions
// @access  Private (Patient only)
exports.getPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;
    const items = await Prescription.find({ patient: patientId }).populate('doctor', 'name').sort({ createdAt: -1 });
    res.status(200).json(formatResponse(true, 'Prescriptions retrieved successfully', { items }));
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving prescriptions', null));
  }
};

// @desc    Get patient's lab results
// @route   GET /api/patient/lab-results
// @access  Private (Patient only)
exports.getLabResults = async (req, res) => {
  try {
    const patientId = req.user.id;
    const items = await LabResult.find({ patient: patientId }).populate('orderedBy', 'name').sort({ createdAt: -1 }).limit(50);
    res.status(200).json(formatResponse(true, 'Lab results retrieved successfully', { items }));
  } catch (error) {
    console.error('Get patient lab results error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving lab results', null));
  }
};

// @desc    Update patient profile
// @route   PUT /api/patient/profile
// @access  Private (Patient only)
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const patient = await Patient.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!patient) return res.status(404).json(formatResponse(false, 'Patient not found', null));
    res.status(200).json(formatResponse(true, 'Profile updated successfully', { patient }));
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(400).json(formatResponse(false, error.message, null));
  }
};
