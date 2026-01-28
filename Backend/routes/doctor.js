const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPatients,
  getAppointments,
  updateAppointmentStatus,
  createMedicalRecord,
  getPatientHistory,
  prescribeMedication,
  getPatientDetails,
  orderLabTest
} = require('../controllers/doctorController');
// console.log('DEBUG: getPatientDetails is:', getPatientDetails);
const { protect, authorize } = require('../middleware/auth');

// Apply protection and authorization to all doctor routes
router.use(protect);
router.use(authorize('doctor'));

// @route   GET /api/doctor/dashboard-stats
router.get('/dashboard-stats', getDashboardStats);

// @route   GET /api/doctor/patients
router.get('/patients', getPatients);

// @route   GET /api/doctor/patients/:id
router.get('/patients/:id', getPatientDetails);

// @route   GET /api/doctor/appointments
router.get('/appointments', getAppointments);

// @route   PATCH /api/doctor/appointments/:id/status
router.patch('/appointments/:id/status', updateAppointmentStatus);

// @route   POST /api/doctor/medical-records
router.post('/medical-records', createMedicalRecord);

// @route   GET /api/doctor/patients/:id/history
router.get('/patients/:id/history', getPatientHistory);

// @route   POST /api/doctor/prescriptions
router.post('/prescriptions', prescribeMedication);

// @route   POST /api/doctor/lab-orders
router.post('/lab-orders', orderLabTest);

module.exports = router;
