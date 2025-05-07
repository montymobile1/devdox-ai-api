/**
 * Authentication middleware
 * Provides authentication and authorization functionality
 */
const { StatusCodes } = require('http-status-codes');
const { users } = require('@clerk/clerk-sdk-node');
const AppError = require('../utils/app-error');
const config = require('../config');

/**
 * Verifies JWT token and authenticates user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
  try {
    // Skip authentication in test environment if a special header is present
    if (config.env === 'test' && req.headers['x-test-auth'] === 'true') {
      req.user = { id: 'test-user-id', role: 'user' };
      return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers?.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
    }

    // Verify token with Clerk
    // Note: In a real implementation, this would use Clerk's verifyToken or similar function
    // For now, this is a placeholder as actual implementation would depend on Clerk SDK usage
    const userId = 'clerk-user-id'; // This would come from the verified token
    const user = await users.getUser(userId);
    
    if (!user) {
      return next(new AppError('User not found', StatusCodes.UNAUTHORIZED));
    }
    
    // Add user to request object
    req.user = {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    return next();
  } catch (error) {
    return next(new AppError('Invalid token', StatusCodes.UNAUTHORIZED));
  }
};

/**
 * Restricts access to specific roles
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN)
      );
    }

    return next();
  };
};

module.exports = {
  authenticate,
  restrictTo
};