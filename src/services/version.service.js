/**
 * Version service
 * Business logic for version-related operations
 */
const config = require('../config');

/**
 * Get the current API version
 * @returns {string} The current API version
 */
const getVersion = () => {
  return config.apiVersion;
};

/**
 * Get detailed version information
 * @returns {Object} Detailed version information
 */
const getVersionDetails = () => {
  return {
    version: config.apiVersion,
    nodeVersion: process.version,
    environment: config.env,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  getVersion,
  getVersionDetails
};