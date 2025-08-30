const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin
} = require('../middleware/validation');

// @route   POST /api/auth/register
router.post('/register', validateUserRegistration, register);

// @route   POST /api/auth/login
router.post('/login', validateUserLogin, login);

// @route   POST /api/auth/logout
router.post('/logout', protect, logout);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   POST /api/auth/refresh-token
router.post('/refresh-token', refreshToken);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// @route   PUT /api/auth/reset-password/:resetToken
router.put('/reset-password/:resetToken', resetPassword);

// @route   GET /api/auth/verify-email/:verificationToken
router.get('/verify-email/:verificationToken', verifyEmail);

// @route   POST /api/auth/resend-verification
router.post('/resend-verification', protect, resendVerification);

module.exports = router;