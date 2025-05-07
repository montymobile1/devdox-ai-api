/**
 * Version API endpoints
 */
const express = require('express');
const versionController = require('../controllers/version.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route GET /api/version
 * @desc Get the current API version
 * @access Public
 */
router.get('/', versionController.getVersion);

/**
 * @route GET /api/version/details
 * @desc Get detailed version information
 * @access Private - requires authentication
 */
router.get('/details', authenticate, versionController.getVersionDetails);

module.exports = router;