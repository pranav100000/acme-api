const { ValidationError } = require('../utils/errors');

function validateEmail(req, res, next) {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new ValidationError('Invalid email format'));
  }
  return next();
}

function validateRequired(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return next(new ValidationError(`Missing required field: ${field}`));
      }
    }

    return next();
  };
}

module.exports = { validateEmail, validateRequired };
