// services/auditService.js - Audit logging service
const AuditLog = require('../models/AuditLog');
const { logger } = require('../utils/logger');

/**
 * Create an audit log entry
 * @param {Object} params
 * @param {string} [params.user] - User ObjectId
 * @param {string} params.action - Action identifier, e.g., USER_LOGIN
 * @param {string} params.resource - Resource name, e.g., Auth, User
 * @param {string} [params.resourceId] - Related resource ObjectId
 * @param {Object} [params.details] - Additional details
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 * @param {string} [params.status]
 */
async function createAuditLog(params) {
  try {
    const audit = await AuditLog.create({
      user: params.user,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      status: params.status || 'success',
    });
    return audit;
  } catch (error) {
    logger.error('Failed to create audit log', { error: error.message });
    return null;
  }
}

module.exports = { createAuditLog };


