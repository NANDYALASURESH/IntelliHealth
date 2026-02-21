const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { formatResponse } = require('../utils/responseFormatter');
const { createAuditLog } = require('../services/auditService');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, subject, body, category, relatedId } = req.body;

        if (!recipientId || !body) {
            return res.status(400).json(formatResponse(false, 'Recipient and body are required'));
        }

        const message = await Message.create({
            sender: req.user.id,
            recipient: recipientId,
            subject,
            body,
            category,
            relatedId
        });

        // Notify recipient
        await Notification.create({
            recipient: recipientId,
            sender: req.user.id,
            title: 'New Message',
            message: `You have received a new message from ${req.user.name}`,
            type: 'message',
            data: { messageId: message._id }
        });

        // Audit log
        await createAuditLog({
            user: req.user.id,
            action: 'MESSAGE_SEND',
            resource: 'Message',
            resourceId: message._id,
            ipAddress: req.ip
        });

        res.status(201).json(formatResponse(true, 'Message sent successfully', { message }));
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json(formatResponse(false, 'Server error sending message'));
    }
};

// @desc    Get inbox (latest messages from all contacts)
// @route   GET /api/messages/inbox
// @access  Private
exports.getInbox = async (req, res) => {
    try {
        // This is a simplified inbox: latest 50 messages where user is recipient
        const messages = await Message.find({ recipient: req.user.id })
            .populate('sender', 'name email role')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(formatResponse(true, 'Inbox retrieved', { messages }));
    } catch (error) {
        res.status(500).json(formatResponse(false, 'Server error retrieving inbox'));
    }
};

// @desc    Get conversation with a specific user
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: userId },
                { sender: userId, recipient: req.user.id }
            ]
        })
            .populate('sender', 'name email role')
            .populate('recipient', 'name email role')
            .sort({ createdAt: 1 });

        // Mark as read if user is recipient
        await Message.updateMany(
            { sender: userId, recipient: req.user.id, isRead: false },
            { isRead: true, readAt: Date.now() }
        );

        res.json(formatResponse(true, 'Conversation retrieved', { messages }));
    } catch (error) {
        res.status(500).json(formatResponse(false, 'Server error retrieving conversation'));
    }
};
