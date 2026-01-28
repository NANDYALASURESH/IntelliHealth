const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const LabResult = require('../models/LabResult');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Get doctor dashboard statistics
// @route   GET /api/doctor/dashboard-stats
// @access  Private (Doctor only)
exports.getDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      todayAppointments,
      totalPatients,
      pendingDiagnoses,
      completedToday,
      upcomingAppointments,
      recentPatients,
      recentLabResults
    ] = await Promise.all([
      Appointment.countDocuments({
        doctor: doctorId,
        scheduledDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      Patient.countDocuments({
        _id: { $in: await Appointment.distinct('patient', { doctor: doctorId }) }
      }),
      MedicalRecord.countDocuments({
        doctor: doctorId,
        'diagnosis.primary': { $exists: false }
      }),
      Appointment.countDocuments({
        doctor: doctorId,
        scheduledDate: { $gte: startOfDay, $lte: endOfDay },
        status: 'completed'
      }),
      Appointment.find({
        doctor: doctorId,
        scheduledDate: { $gte: startOfDay },
        status: { $in: ['scheduled', 'confirmed'] }
      })
        .populate('patient', 'name')
        .sort({ scheduledDate: 1, scheduledTime: 1 })
        .limit(5),
      Patient.find({
        _id: {
          $in: await Appointment.distinct('patient', {
            doctor: doctorId,
            updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          })
        }
      })
        .sort({ updatedAt: -1 })
        .limit(5),
      LabResult.find({
        orderedBy: doctorId,
        status: 'completed',
        updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Results from last week
      })
        .populate('patient', 'name')
        .sort({ updatedAt: -1 })
        .limit(5)
    ]);

    const stats = {
      todayAppointments,
      totalPatients,
      pendingDiagnoses,
      completedToday,
      weeklyStats: {
        appointments: await Appointment.countDocuments({
          doctor: doctorId,
          scheduledDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        diagnoses: await MedicalRecord.countDocuments({
          doctor: doctorId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      }
    };

    res.status(200).json(formatResponse(true, 'Doctor dashboard statistics retrieved successfully', {
      stats,
      upcomingAppointments,
      recentPatients,
      recentLabResults
    }));

  } catch (error) {
    console.error('Get doctor dashboard stats error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving dashboard statistics', null));
  }
};

// @desc    Get doctor's patients
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
exports.getPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    // Get patient IDs who have appointments with this doctor
    let patientIds = await Appointment.distinct('patient', { doctor: doctorId });

    let query = { _id: { $in: patientIds } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .select('name email phone dateOfBirth gender bloodGroup vitalSigns')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get last appointment for each patient
    const patientsWithLastAppointment = await Promise.all(
      patients.map(async (patient) => {
        const lastAppointment = await Appointment.findOne({
          doctor: doctorId,
          patient: patient._id
        })
          .sort({ scheduledDate: -1 })
          .select('scheduledDate type status');

        return {
          ...patient.toObject(),
          lastAppointment
        };
      })
    );

    res.status(200).json(formatResponse(true, 'Patients retrieved successfully', {
      patients: patientsWithLastAppointment,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving patients', null));
  }
};



// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor only)
exports.getAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const date = req.query.date;

    let query = { doctor: doctorId };

    if (status) {
      query.status = status;
    }

    if (date) {
      const searchDate = new Date(date);
      query.scheduledDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone age gender')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
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
    console.error('Get doctor appointments error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving appointments', null));
  }
};

// ==========================================
// @desc    Update appointment status
// @route   PATCH /api/doctor/appointments/:id/status
// @access  Private (Doctor only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json(formatResponse(false, 'Invalid status', null));
    }
    const appt = await Appointment.findOneAndUpdate(
      { _id: id, doctor: req.user.id },
      { status },
      { new: true }
    );
    if (!appt) return res.status(404).json(formatResponse(false, 'Appointment not found', null));
    res.json(formatResponse(true, 'Appointment status updated', { appointment: appt }));
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json(formatResponse(false, 'Error updating status', null));
  }
};

// @desc    Create medical record entry
// @route   POST /api/doctor/medical-records
// @access  Private (Doctor only)
exports.createMedicalRecord = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      doctor: req.user.id,
    };
    const record = await MedicalRecord.create(payload);
    res.status(201).json(formatResponse(true, 'Medical record created', { record }));
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(400).json(formatResponse(false, error.message, null));
  }
};

// @desc    Get patient history for doctor
// @route   GET /api/doctor/patients/:id/history
// @access  Private (Doctor only)
exports.getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id;
    const [records, appointments, labResults] = await Promise.all([
      MedicalRecord.find({ patient: patientId, doctor: req.user.id }).sort({ createdAt: -1 }),
      Appointment.find({ patient: patientId, doctor: req.user.id }).sort({ scheduledDate: -1 }),
      LabResult.find({ patient: patientId }).sort({ createdAt: -1 }) // Doctors can see all lab results for their patient
    ]);
    res.json(formatResponse(true, 'Patient history', { records, appointments, labResults }));
  } catch (error) {
    console.error('Get patient history error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving history', null));
  }
};

// @desc    Prescribe medication
// @route   POST /api/doctor/prescriptions
// @access  Private (Doctor only)
exports.prescribeMedication = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      doctor: req.user.id,
      issuedDate: req.body.issuedDate || new Date(),
    };
    const prescription = await Prescription.create(payload);
    res.status(201).json(formatResponse(true, 'Prescription created', { prescription }));
  } catch (error) {
    console.error('Prescribe medication error:', error);
    res.status(400).json(formatResponse(false, error.message, null));
  }
};

// @desc    Get patient by ID
// @route   GET /api/doctor/patients/:id
// @access  Private (Doctor only)
exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select('-password');

    if (!patient) {
      return res.status(404).json(formatResponse(false, 'Patient not found', null));
    }
    res.status(200).json(formatResponse(true, 'Patient details retrieved', { patient }));
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

// @desc    Order a lab test
// @route   POST /api/doctor/lab-orders
// @access  Private (Doctor only)
exports.orderLabTest = async (req, res) => {
  try {
    const { patientId, testType, testCategory, priority, notes } = req.body;

    const labResult = await LabResult.create({
      patient: patientId,
      orderedBy: req.user.id,
      testType,
      testCategory,
      priority: priority || 'routine',
      status: 'ordered',
      overallResult: 'inconclusive', // Placeholder
      specimen: { condition: notes }
    });

    res.status(201).json(formatResponse(true, 'Lab test ordered successfully', { labResult }));
  } catch (error) {
    console.error('Order lab test error:', error);
    res.status(500).json(formatResponse(false, error.message || 'Error ordering lab test', null));
  }
};