const Notification = require('../models/Notification');
const { formatResponse } = require('../utils/responseFormatter');

exports.list = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(formatResponse(true, 'Notifications', { items }));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to list notifications'));
  }
};


