// middleware/auth.js - Authentication Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { formatResponse } = require('../utils/responseFormatter');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json(formatResponse(false, 'Access denied. No token provided.', null));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json(formatResponse(false, 'Token is not valid. User not found.', null));
    }

    if (!user.isActive) {
      return res.status(401).json(formatResponse(false, 'Account has been deactivated.', null));
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(formatResponse(false, 'Invalid token.', null));
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(formatResponse(false, 'Token has expired.', null));
    }
    
    return res.status(500).json(formatResponse(false, 'Server error in authentication.', null));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(formatResponse(false, 'Access denied. Please login first.', null));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(formatResponse(false, `Access denied. ${req.user.role} role is not authorized for this resource.`, null));
    }

    next();
  };
};
