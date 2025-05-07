/**
 * Integration tests for version API endpoints
 */
const request = require('supertest');
const app = require('../../../src/app');
const config = require('../../../src/config');

describe('Version API', () => {
  describe('GET /api/version', () => {
    it('should return the current API version', async () => {
      // Act
      const response = await request(app).get('/api/version');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data.version).toBe(config.apiVersion);
    });
  });
  
  describe('GET /api/version/details', () => {
    it('should return 401 if not authenticated', async () => {
      // Act
      const response = await request(app).get('/api/version/details');
      
      // Assert
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
    
    it('should return version details when authenticated', async () => {
      // Act
      // Using the test authentication bypass header
      const response = await request(app)
        .get('/api/version/details')
        .set('x-test-auth', 'true');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('nodeVersion');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });
});