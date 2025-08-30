const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTestResults,
  updateTestStatus,
  uploadTestResult,
  getPendingTests,
  getEquipmentStatus
} = require('../controllers/labController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection and authorization to all lab routes
router.use(protect);
router.use(authorize('lab'));

// @route   GET /api/lab/dashboard-stats
router.get('/dashboard-stats', getDashboardStats);

// @route   GET /api/lab/test-results
router.get('/test-results', getTestResults);

// @route   GET /api/lab/pending-tests
router.get('/pending-tests', getPendingTests);

// @route   PATCH /api/lab/test-results/:id/status
router.patch('/test-results/:id/status', updateTestStatus);

// @route   POST /api/lab/test-results/:id/upload
router.post('/test-results/:id/upload', uploadTestResult);

// @route   GET /api/lab/equipment-status
router.get('/equipment-status', getEquipmentStatus);

module.exports = router;