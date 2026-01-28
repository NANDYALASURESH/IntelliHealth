const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const LabResult = require('../models/LabResult');
const AuditLog = require('../models/AuditLog');
const { formatResponse } = require('../utils/responseFormatter');
const { createAuditLog } = require('../services/auditService');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      doctorCount,
      patientCount,
      labReportCount,
      totalAppointments,
      pendingAppointments,
      todayAppointments,
      recentActivity
    ] = await Promise.all([
      Doctor.countDocuments({ isActive: true }),
      Patient.countDocuments({ isActive: true }),
      LabResult.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'scheduled' }),
      Appointment.countDocuments({
        scheduledDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      AuditLog.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('user', 'name role')
    ]);

    const stats = {
      doctors: doctorCount,
      patients: patientCount,
      labReports: labReportCount,
      pendingApprovals: pendingAppointments,
      systemHealth: 98, // This could be calculated based on system metrics
      activeUsers: await User.countDocuments({
        isActive: true,
        lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      dailyAppointments: todayAppointments,
      totalAppointments: totalAppointments
    };

    res.status(200).json(formatResponse(true, 'Dashboard statistics retrieved successfully', {
      stats,
      recentActivity: recentActivity.map(log => ({
        id: log._id,
        action: log.action,
        user: log.user?.name || 'System',
        time: log.timestamp,
        type: log.resource.toLowerCase()
      }))
    }));

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving dashboard statistics', null));
  }
};

// @desc    Create a user (stub)
// @route   POST /api/admin/users
// @access  Private (Admin only)
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      dateOfBirth,
      password,
      role,
      emergencyContact,
      // Doctor specific fields
      specialization,
      licenseNumber,
      experience,
      department,
      consultationFee,
      education,
      certifications,
      workingHours,
      bio,
      isAvailableForEmergency
    } = req.body;

    // Basic validation for all users
    if (!name || !email || !password || !role) {
      return res.status(400).json(formatResponse(false, 'Name, email, password, and role are required for all users', null));
    }

    // Validate emergency contact for all users
    if (!emergencyContact || !emergencyContact.name || !emergencyContact.phone) {
      return res.status(400).json(formatResponse(false, 'Emergency contact name and phone are required', null));
    }

    // Validate required fields based on role
    if (role === 'doctor') {
      if (!specialization || !licenseNumber || !experience || !department || !consultationFee) {
        return res.status(400).json(formatResponse(false, 'Doctor requires: specialization, licenseNumber, experience, department, and consultationFee', null));
      }

      // Validate experience is a positive number
      if (typeof experience !== 'number' || experience < 0) {
        return res.status(400).json(formatResponse(false, 'Experience must be a positive number', null));
      }

      // Validate consultation fee is a positive number
      if (typeof consultationFee !== 'number' || consultationFee < 0) {
        return res.status(400).json(formatResponse(false, 'Consultation fee must be a positive number', null));
      }
    }

    // Create base user data
    const userData = {
      name,
      email,
      gender,
      dateOfBirth,
      password,
      role,
      emergencyContact
    };

    let user;

    if (role === 'doctor') {
      // Create doctor with all required fields
      user = new Doctor({
        ...userData,
        specialization,
        licenseNumber,
        experience,
        department,
        consultationFee,
        education: education || [],
        certifications: certifications || [],
        workingHours: workingHours || {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '13:00', available: false },
          sunday: { start: '09:00', end: '13:00', available: false }
        },
        bio: bio || '',
        isAvailableForEmergency: isAvailableForEmergency || false
      });
    } else {
      // Create regular user
      user = new User(userData);
    }

    await user.save();
    res.status(201).json(formatResponse(true, 'User created successfully', { user }));
  } catch (error) {
    console.error('Create user error:', error);

    // Handle validation errors more gracefully
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(formatResponse(false, `Validation failed: ${validationErrors.join(', ')}`, null));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json(formatResponse(false, `${field} already exists`, null));
    }

    res.status(500).json(formatResponse(false, 'Error creating user', null));
  }
};

// @desc    Delete a user (stub)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    return res.status(501).json(formatResponse(false, 'Admin delete user not implemented', null));
  } catch (error) {
    return res.status(500).json(formatResponse(false, 'Server error deleting user', null));
  }
};

// @desc    System health summary
// @route   GET /api/admin/system-health
// @access  Private (Admin only)
exports.getSystemHealth = async (req, res) => {
  try {
    const health = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        api: 'ok',
        database: 'unknown',
      }
    };
    return res.status(200).json(formatResponse(true, 'System health', { health }));
  } catch (error) {
    return res.status(500).json(formatResponse(false, 'Failed to get system health', null));
  }
};

// @desc    Assign primary doctor to patient
// @route   POST /api/admin/assign-primary-doctor
// @access  Private (Admin only)
exports.assignPrimaryDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    if (!patientId || !doctorId) {
      return res.status(400).json(formatResponse(false, 'patientId and doctorId are required', null));
    }

    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      Doctor.findById(doctorId)
    ]);

    if (!patient) return res.status(404).json(formatResponse(false, 'Patient not found', null));
    if (!doctor) return res.status(404).json(formatResponse(false, 'Doctor not found', null));

    patient.primaryDoctor = doctor._id;
    await patient.save({ validateBeforeSave: false });

    await createAuditLog({
      user: req.user.id,
      action: 'ASSIGN_PRIMARY_DOCTOR',
      resource: 'Patient',
      resourceId: patient._id,
      details: { doctor: doctor._id },
      ipAddress: req.ip
    });

    return res.status(200).json(formatResponse(true, 'Primary doctor assigned', {
      patient: {
        id: patient._id,
        primaryDoctor: patient.primaryDoctor
      }
    }));
  } catch (error) {
    console.error('Assign primary doctor error:', error);
    return res.status(500).json(formatResponse(false, 'Server error assigning primary doctor', null));
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(formatResponse(true, 'Users retrieved successfully', {
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving users', null));
  }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json(formatResponse(false, 'User not found', null));
    }

    // Create audit log
    await createAuditLog({
      user: req.user.id,
      action: 'USER_STATUS_UPDATE',
      resource: 'User',
      resourceId: id,
      details: { isActive, targetUser: user.email },
      ipAddress: req.ip
    });

    res.status(200).json(formatResponse(true, 'User status updated successfully', { user }));

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json(formatResponse(false, 'Error updating user status', null));
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private (Admin only)
exports.getSystemLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const action = req.query.action;
    const resource = req.query.resource;
    const status = req.query.status;

    let query = {};

    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (status) query.status = status;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(formatResponse(true, 'System logs retrieved successfully', {
      logs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving system logs', null));
  }
};