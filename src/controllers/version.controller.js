/**
 * Version controller
 * Handles requests related to API version information
 */
const { StatusCodes } = require('http-status-codes');
const versionService = require('../services/version.service');

/**
 * Get the current API version
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getVersion = async (req, res, next) => {
  try {
    const version = versionService.getVersion();
    
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: { version }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detailed version information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getVersionDetails = async (req, res, next) => {
  try {
    const versionDetails = versionService.getVersionDetails();
    
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: versionDetails
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getVersion,
  getVersionDetails
};