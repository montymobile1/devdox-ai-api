/**
 * Logger utility using Winston
 * Provides different log levels and formats based on the environment
 */
const winston = require('winston');
const config = require('../config');

// Define log format based on environment
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  config.env === 'production'
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
        )
      )
);

// Create Winston logger instance
const logger = winston.createLogger({
  level: config.logger.level,
  format: logFormat,
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    // Add file transports for production
    ...(config.env === 'production'
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
  // Prevent Winston from exiting on errors
  exitOnError: false,
});

module.exports = logger;