/**
 * Global error handling middleware
 */
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/app-error');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Error normalization - converts various error types to AppError
 * @param {Error} err - The error object
 * @returns {AppError} Normalized AppError instance
 */
const normalizeError = (err) => {
  // Already an AppError instance
  if (err instanceof AppError) {
    return err;
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return new AppError('Database connection error', StatusCodes.SERVICE_UNAVAILABLE);
  }

  // Validation errors (express-validator)
  if (err.array && typeof err.array === 'function') {
    const validationErrors = err.array();
    return new AppError(
      'Validation error',
      StatusCodes.BAD_REQUEST,
      validationErrors
    );
  }

  // JSON parse error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return new AppError('Invalid JSON', StatusCodes.BAD_REQUEST);
  }

  // Default to internal server error
  return new AppError(
    config.env === 'production' ? 'Something went wrong' : err.message,
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  );
};

/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorMiddleware = (err, req, res, next) => {
  // Normalize the error
  const error = normalizeError(err);

  // Log error details
  if (error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    logger.error('ERROR 💥', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn('ERROR 💥', {
      message: err.message,
      statusCode: error.statusCode,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Send response
  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    ...(error.details && { details: error.details }),
    ...(config.env !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;