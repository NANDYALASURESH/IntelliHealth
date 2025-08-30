// routes/admin.js - Admin Routes

const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getSystemLogs,
  createUser,
  deleteUser,
  getSystemHealth,
  assignPrimaryDoctor
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection and authorization to all admin routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard-stats
router.get('/dashboard-stats', getDashboardStats);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @route   POST /api/admin/users
router.post('/users', createUser);

// @route   PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', updateUserStatus);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// @route   GET /api/admin/logs
router.get('/logs', getSystemLogs);

// @route   GET /api/admin/system-health
router.get('/system-health', getSystemHealth);

// @route   POST /api/admin/assign-primary-doctor
router.post('/assign-primary-doctor', assignPrimaryDoctor);

module.exports = router;