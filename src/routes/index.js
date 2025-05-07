/**
 * API routes definition
 * Centralizes all route imports and exports them as a single router
 */
const express = require('express');
const versionRoutes = require('./version.routes');

const router = express.Router();

// Mount route groups
router.use('/version', versionRoutes);

// Future route groups will be added here
// router.use('/users', userRoutes);
// router.use('/documents', documentRoutes);

module.exports = router;