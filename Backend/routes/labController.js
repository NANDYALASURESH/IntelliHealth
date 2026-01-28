// controllers/labController.js - Lab Dashboard Controller
const LabResult = require('../models/LabResult');
const Patient = require('../models/Patient');
const { formatResponse } = require('../utils/responseFormatter');
// @desc    Get lab dashboard statistics
// @route   GET /api/lab/dashboard-stats
// @access  Private (Lab only)
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      pendingTests,
      completedToday,
      totalReports,
      urgentTests,
      pendingTestsList,
      recentResults,
      monthlyStats
    ] = await Promise.all([
      LabResult.countDocuments({
        status: { $in: ['ordered', 'collected', 'processing'] }
      }),
      LabResult.countDocuments({
        status: 'completed',
        reportDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      LabResult.countDocuments({ status: 'completed' }),
      LabResult.countDocuments({
        priority: { $in: ['urgent', 'stat'] },
        status: { $ne: 'completed' }
      }),
      LabResult.find({
        status: { $in: ['ordered', 'collected', 'processing'] }
      })
      .populate('patient', 'name')
      .populate('orderedBy', 'name')
      .sort({ priority: 1, createdAt: 1 })
      .limit(10),
      LabResult.find({
        status: 'completed',
        reportDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
      .populate('patient', 'name')
      .sort({ reportDate: -1 })
      .limit(5),
      LabResult.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const labData = {
      pendingTests,
      completedToday,
      totalReports,
      urgentTests,
      equipmentStatus: {
        active: 12,
        maintenance: 2,
        offline: 1
      },
      dailyCapacity: {
        current: pendingTests + completedToday,
        maximum: 120
      }
    };

    res.status(200).json(formatResponse(true, 'Lab dashboard statistics retrieved successfully', {
      labData,
      pendingTests: pendingTestsList,
      recentResults,
      monthlyStats
    }));

  } catch (error) {
    console.error('Get lab dashboard stats error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving lab dashboard statistics', null));
  }
};

// @desc    Get lab test results
// @route   GET /api/lab/test-results
// @access  Private (Lab only)
exports.getTestResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search;

    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    if (search) {
      const patients = await Patient.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      query.$or = [
        { testType: { $regex: search, $options: 'i' } },
        { patient: { $in: patients.map(p => p._id) } }
      ];
    }

    const total = await LabResult.countDocuments(query);
    const results = await LabResult.find(query)
      .populate('patient', 'name email')
      .populate('orderedBy', 'name')
      .sort({ priority: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(formatResponse(true, 'Test results retrieved successfully', {
      results,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    console.error('Get lab test results error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving test results', null));
  }
};

// @desc    Update lab test status
// @route   PATCH /api/lab/test-results/:id/status
// @access  Private (Lab only)
exports.updateTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['ordered', 'collected', 'processing', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json(formatResponse(false, 'Invalid status', null));
    }
    const result = await LabResult.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) return res.status(404).json(formatResponse(false, 'Lab result not found', null));
    res.json(formatResponse(true, 'Lab test status updated', { result }));
  } catch (error) {
    console.error('Update lab test status error:', error);
    res.status(500).json(formatResponse(false, 'Error updating test status', null));
  }
};

// @desc    Upload lab test result report (metadata only)
// @route   POST /api/lab/test-results/:id/upload
// @access  Private (Lab only)
exports.uploadTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportUrl } = req.body;
    const result = await LabResult.findByIdAndUpdate(
      id,
      { reportUrl, status: 'completed', reportDate: new Date() },
      { new: true }
    );
    if (!result) return res.status(404).json(formatResponse(false, 'Lab result not found', null));
    res.json(formatResponse(true, 'Lab report uploaded', { result }));
  } catch (error) {
    console.error('Upload lab test result error:', error);
    res.status(500).json(formatResponse(false, 'Error uploading test result', null));
  }
};

// @desc    Get pending tests list
// @route   GET /api/lab/pending-tests
exports.getPendingTests = async (req, res) => {
  try {
    const items = await LabResult.find({ status: { $in: ['ordered', 'collected', 'processing'] } })
      .populate('patient', 'name')
      .populate('orderedBy', 'name')
      .sort({ priority: 1, createdAt: 1 })
      .limit(20);
    res.json(formatResponse(true, 'Pending tests', { items }));
  } catch (error) {
    console.error('Get pending tests error:', error);
    res.status(500).json(formatResponse(false, 'Error retrieving pending tests', null));
  }
};

// @desc    Get equipment status (stubbed)
// @route   GET /api/lab/equipment-status
exports.getEquipmentStatus = async (req, res) => {
  try {
    const equipment = { active: 12, maintenance: 2, offline: 1 };
    res.json(formatResponse(true, 'Equipment status', { equipment }));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error retrieving equipment status', null));
  }
};