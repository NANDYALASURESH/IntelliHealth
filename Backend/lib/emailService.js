// services/emailService.js - Email Service

const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');
const { isEmailConfigured } = require('../config/email');

// Create transporter
const createTransporter = () => {
  const port = Number(process.env.EMAIL_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - IntelliHealth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to IntelliHealth!</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering with IntelliHealth. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>IntelliHealth Team</p>
      </div>
    `
  }),

  appointmentConfirmation: (data) => ({
    subject: 'Appointment Confirmation - IntelliHealth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Appointment Confirmed</h2>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Type:</strong> ${data.type}</p>
        </div>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>Best regards,<br>IntelliHealth Team</p>
      </div>
    `
  }),

  labResultsReady: (data) => ({
    subject: 'Lab Results Available - IntelliHealth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Lab Results Ready</h2>
        <p>Hello ${data.patientName},</p>
        <p>Your lab results for <strong>${data.testType}</strong> are now available.</p>
        <p>Please log in to your IntelliHealth portal to view your results.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/patient-dashboard" 
             style="background-color: #10B981; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View Results
          </a>
        </div>
        <p>Best regards,<br>IntelliHealth Team</p>
      </div>
    `
  })
};

// Send email function
exports.sendEmail = async ({ email, subject, template, data }) => {
  try {
    if (!isEmailConfigured()) {
      logger.warn('Email not configured; skipping sendEmail');
      return { success: true, messageId: null, skipped: true };
    }

    const transporter = createTransporter();

    let emailContent;
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html: data.html || data.message };
    }

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: emailContent.subject || subject,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email}: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    // Do not throw to avoid breaking main flows when email fails
    return { success: false, error: error.message };
  }
};
