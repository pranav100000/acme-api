const { badRequest } = require('../utils/http');

/**
 * Validates email format in request body
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(badRequest('Invalid email format'));
  }
  next();
};

/**
 * Factory function that returns middleware to check for required fields
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];
      if (value === undefined || value === null || value === '') {
        return next(badRequest(`Missing required field: ${field}`));
      }
    }
    next();
  };
};

module.exports = { validateEmail, validateRequired };
