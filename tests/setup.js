/**
 * Jest test setup file
 * Runs before the test suite
 */

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.API_VERSION = '1.0.0-test';

// Global test setup
beforeAll(async () => {
  // Setup test environment
  // e.g., mock external services, initialize test database, etc.
});

// Clean up after tests
afterAll(async () => {
  // Clean up test environment
  // e.g., close database connections, etc.
});