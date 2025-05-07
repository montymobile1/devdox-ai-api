/**
 * Application entry point
 */
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const port = config.port;

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', err);
  // Gracefully shutdown
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});