
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { sendEmail } = require('../services/emailService');
const { createAuditLog } = require('../services/auditService');
const { formatResponse } = require('../utils/responseFormatter');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(formatResponse(false, 'User already exists with this email', null));
    }

    let user;

    // Create user based on role
    switch (role) {
      case 'patient':
        user = new Patient({
          name,
          email,
          password,
          role,
          ...additionalData
        });
        break;
      
      case 'doctor':
        user = new Doctor({
          name,
          email,
          password,
          role,
          ...additionalData
        });
        break;
      
      default:
        user = new User({
          name,
          email,
          password,
          role,
          ...additionalData
        });
    }

    await user.save();

    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    // Send verification email (non-blocking)
    try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - IntelliHealth',
      template: 'emailVerification',
        data: { name: user.name, verificationUrl }
      });
    } catch (e) {
      // Already swallowed in service, but keep safe guard
    }

    // Create audit log
    await createAuditLog({
      user: user._id,
      action: 'USER_REGISTER',
      resource: 'User',
      resourceId: user._id,
      details: { role: user.role },
      ipAddress: req.ip
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json(formatResponse(true, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token,
      refreshToken
    }));

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(formatResponse(false, 'Server error during registration', null));
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json(formatResponse(false, 'Please provide email and password', null));
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json(formatResponse(false, 'Invalid credentials', null));
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json(formatResponse(false, 'Account temporarily locked due to too many failed login attempts', null));
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(423).json(formatResponse(false, 'Account has been deactivated', null));
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      await user.incLoginAttempts();
      await createAuditLog({
        user: user._id,
        action: 'LOGIN_FAILED',
        resource: 'Auth',
        details: { reason: 'Invalid password' },
        ipAddress: req.ip,
        status: 'failed'
      });
      return res.status(401).json(formatResponse(false, 'Invalid credentials', null));
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Create audit log
    await createAuditLog({
      user: user._id,
      action: 'USER_LOGIN',
      resource: 'Auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set httpOnly cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json(formatResponse(true, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      },
      token
    }));

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(formatResponse(false, 'Server error during login', null));
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    // Create audit log
    await createAuditLog({
      user: req.user.id,
      action: 'USER_LOGOUT',
      resource: 'Auth',
      ipAddress: req.ip
    });

    res.status(200).json(formatResponse(true, 'Logout successful', null));
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(formatResponse(false, 'Server error during logout', null));
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    let user;
    
    // Get user with role-specific data
    switch (req.user.role) {
      case 'patient':
        user = await Patient.findById(req.user.id).select('-password');
        break;
      case 'doctor':
        user = await Doctor.findById(req.user.id).select('-password');
        break;
      default:
        user = await User.findById(req.user.id).select('-password');
    }

    res.status(200).json(formatResponse(true, 'User profile retrieved successfully', { user }));
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json(formatResponse(false, 'Server error retrieving user profile', null));
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json(formatResponse(false, 'Refresh token not provided', null));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json(formatResponse(false, 'Invalid refresh token', null));
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json(formatResponse(true, 'Token refreshed successfully', {
      token: newAccessToken
    }));

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json(formatResponse(false, 'Invalid refresh token', null));
  }
};
// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(formatResponse(false, 'No user found with this email', null));
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: 'Password Reset - IntelliHealth',
      data: {
        html: `<p>You requested a password reset.</p><p>Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`
      }
    });

    await createAuditLog({
      user: user._id,
      action: 'PASSWORD_RESET_REQUEST',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip
    });

    return res.status(200).json(formatResponse(true, 'Password reset email sent', null));
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json(formatResponse(false, 'Server error processing request', null));
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json(formatResponse(false, 'Invalid or expired token', null));
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json(formatResponse(false, 'Password must be at least 6 characters', null));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await createAuditLog({
      user: user._id,
      action: 'PASSWORD_RESET',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip
    });

    return res.status(200).json(formatResponse(true, 'Password reset successful', null));
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json(formatResponse(false, 'Server error resetting password', null));
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:verificationToken
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.verificationToken).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json(formatResponse(false, 'Invalid or expired verification token', null));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    await createAuditLog({
      user: user._id,
      action: 'EMAIL_VERIFIED',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip
    });

    return res.status(200).json(formatResponse(true, 'Email verified successfully', null));
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json(formatResponse(false, 'Server error verifying email', null));
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(formatResponse(false, 'User not found', null));
    }

    if (user.isEmailVerified) {
      return res.status(400).json(formatResponse(false, 'Email already verified', null));
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - IntelliHealth',
      template: 'emailVerification',
      data: { name: user.name, verificationUrl }
    });

    return res.status(200).json(formatResponse(true, 'Verification email sent', null));
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json(formatResponse(false, 'Server error resending verification email', null));
  }
};