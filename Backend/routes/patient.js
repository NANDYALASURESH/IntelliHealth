const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMedicalRecords,
  getAppointments,
  bookAppointment,
  getPrescriptions,
  getLabResults,
  updateProfile
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

// Apply protection and authorization to all patient routes
router.use(protect);
router.use(authorize('patient'));

// @route   GET /api/patient/dashboard-stats
router.get('/dashboard-stats', getDashboardStats);

// @route   GET /api/patient/medical-records
router.get('/medical-records', getMedicalRecords);

// @route   GET /api/patient/appointments
router.get('/appointments', getAppointments);

// @route   POST /api/patient/appointments
router.post('/appointments', validateAppointment, bookAppointment);

// @route   GET /api/patient/prescriptions
router.get('/prescriptions', getPrescriptions);

// @route   GET /api/patient/lab-results
router.get('/lab-results', getLabResults);

// @route   PUT /api/patient/profile
router.put('/profile', updateProfile);

module.exports = router;