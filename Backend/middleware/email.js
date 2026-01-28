// config/email.js - SMTP configuration and transporter helper
const nodemailer = require('nodemailer');

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

function createEmailTransporter() {
  const port = Number(process.env.EMAIL_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

module.exports = { isEmailConfigured, createEmailTransporter };


