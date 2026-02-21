const Notification = require('../models/Notification');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
exports.list = async (req, res) => {
  try {
    const items = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(formatResponse(true, 'Notifications retrieved', { items }));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to list notifications'));
  }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true, readAt: Date.now() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json(formatResponse(false, 'Notification not found'));
    }

    res.json(formatResponse(true, 'Notification marked as read', { notification }));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to update notification'));
  }
};

// @desc    Mark all notifications as read for current user
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.json(formatResponse(true, 'All notifications marked as read'));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to update notifications'));
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json(formatResponse(false, 'Notification not found'));
    }

    res.json(formatResponse(true, 'Notification deleted'));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to delete notification'));
  }
};
