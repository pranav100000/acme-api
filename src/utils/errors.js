/**
 * @module errors
 * @description Custom error classes and utility functions for Express error handling.
 */

/**
 * Error thrown when a requested resource is not found.
 * Automatically sets HTTP status code to 404.
 * @extends Error
 */
class NotFoundError extends Error {
  /**
   * @param {string} [message='Not found'] - The error message
   */
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
    /** @type {number} */
    this.statusCode = 404;
  }
}

/**
 * Error thrown when request validation fails.
 * Automatically sets HTTP status code to 400.
 * @extends Error
 */
class ValidationError extends Error {
  /**
   * @param {string} [message='Validation failed'] - The error message
   */
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    /** @type {number} */
    this.statusCode = 400;
  }
}

/**
 * Wraps an async route handler to catch errors and forward them to the Express error handler.
 * @param {Function} fn - Async Express route handler (req, res, next) => Promise<void>
 * @returns {Function} Wrapped Express middleware that catches rejected promises
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { NotFoundError, ValidationError, asyncHandler };
