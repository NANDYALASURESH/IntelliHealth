// middleware/validation.js - Input Validation Middleware

const { body, validationResult } = require('express-validator');
const { formatResponse } = require('../utils/responseFormatter');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json(formatResponse(
      false,
      'Validation failed',
      null,
      errorMessages
    ));
  }
  
  next();
};

// export so other modules can import directly if needed
exports.handleValidationErrors = handleValidationErrors;

// User registration validation
exports.validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .isIn(['admin', 'doctor', 'patient', 'lab'])
    .withMessage('Role must be one of: admin, doctor, patient, lab'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

// User login validation
exports.validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Appointment validation
exports.validateAppointment = [
  body('doctor')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  
  body('scheduledDate')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('scheduledTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  
  body('type')
    .isIn(['consultation', 'follow-up', 'emergency', 'check-up', 'surgery'])
    .withMessage('Please provide a valid appointment type'),
  
  body('reasonForVisit')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason for visit must be between 5 and 500 characters'),
  
  handleValidationErrors
];
