/**
 * Input validation middleware
 */
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/app-error');

/**
 * Validates request input based on provided validation chain
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError('Validation error', StatusCodes.BAD_REQUEST, errorMessages));
  }
  
  return next();
};

module.exports = {
  validate
};