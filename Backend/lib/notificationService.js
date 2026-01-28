// ==========================================
// services/notificationService.js - Notification Service

const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const { logger } = require('../utils/logger');

class NotificationService {
  
  // Create and send notification
  async createNotification({
    recipient,
    sender = null,
    title,
    message,
    type,
    priority = 'normal',
    data = null,
    deliveryMethod = 'in-app',
    actionUrl = null,
    actionRequired = false,
    expiresIn = null
  }) {
    try {
      const notification = new Notification({
        recipient,
        sender,
        title,
        message,
        type,
        priority,
        data,
        deliveryMethod,
        actionUrl,
        actionRequired,
        expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : null
      });

      await notification.save();

      // Send via different delivery methods
      switch (deliveryMethod) {
        case 'email':
          await this.sendEmailNotification(notification);
          break;
        case 'push':
          await this.sendPushNotification(notification);
          break;
        case 'sms':
          await this.sendSMSNotification(notification);
          break;
        default:
          // In-app notification is already saved to database
          break;
      }

      // Send real-time notification via Socket.IO
      await this.sendRealTimeNotification(notification);

      return notification;

    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  // Send email notification
  async sendEmailNotification(notification) {
    try {
      const User = require('../models/User');
      const user = await User.findById(notification.recipient);
      
      if (user && user.email) {
        await sendEmail({
          email: user.email,
          subject: notification.title,
          template: 'notification',
          data: {
            name: user.name,
            title: notification.title,
            message: notification.message,
            actionUrl: notification.actionUrl
          }
        });

        notification.isDelivered = true;
        notification.deliveredAt = new Date();
        await notification.save();
      }
    } catch (error) {
      logger.error('Failed to send email notification:', error);
    }
  }

  // Send real-time notification via Socket.IO
  async sendRealTimeNotification(notification) {
    try {
      const io = require('../server').get('io');
      if (io) {
        io.to(`user_${notification.recipient}`).emit('notification', {
          id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          createdAt: notification.createdAt
        });
      }
    } catch (error) {
      logger.error('Failed to send real-time notification:', error);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      return notification;
    } catch (error) {
      logger.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      let query = { recipient: userId };
      
      if (unreadOnly) {
        query.isRead = false;
      }

      const total = await Notification.countDocuments(query);
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sender', 'name');

      return {
        notifications,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Failed to get user notifications:', error);
      throw error;
    }
  }

  // Send appointment reminder
  async sendAppointmentReminder(appointment) {
    const User = require('../models/User');
    const patient = await User.findById(appointment.patient);
    const doctor = await User.findById(appointment.doctor);

    if (patient && doctor) {
      await this.createNotification({
        recipient: appointment.patient,
        title: 'Appointment Reminder',
        message: `You have an appointment with Dr. ${doctor.name} tomorrow at ${appointment.scheduledTime}`,
        type: 'appointment',
        priority: 'normal',
        data: { appointmentId: appointment._id },
        deliveryMethod: 'email',
        actionUrl: '/patient/appointments'
      });
    }
  }

  // Send lab result notification
  async sendLabResultNotification(labResult) {
    const User = require('../models/User');
    const patient = await User.findById(labResult.patient);

    if (patient) {
      const priority = labResult.isCritical ? 'urgent' : 'normal';
      
      await this.createNotification({
        recipient: labResult.patient,
        title: 'Lab Results Available',
        message: `Your ${labResult.testType} results are ready for review`,
        type: 'lab-result',
        priority,
        data: { labResultId: labResult._id },
        deliveryMethod: 'email',
        actionUrl: '/patient/lab-results'
      });
    }
  }
}

module.exports = new NotificationService();