exports.formatResponse = (success, message, data = null, errors = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (errors !== null) {
    response.errors = errors;
  }

  return response;
};

// Success responses
exports.successResponse = (message, data = null) => {
  return this.formatResponse(true, message, data);
};

// Error responses
exports.errorResponse = (message, errors = null) => {
  return this.formatResponse(false, message, null, errors);
};

// Pagination helper
exports.paginationResponse = (data, pagination) => {
  return {
    success: true,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
};
