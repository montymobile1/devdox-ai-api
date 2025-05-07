/**
 * Unit tests for version service
 */
const versionService = require('../../../src/services/version.service');
const config = require('../../../src/config');

describe('Version Service', () => {
  describe('getVersion', () => {
    it('should return the correct API version from config', () => {
      // Arrange
      const expectedVersion = config.apiVersion;
      
      // Act
      const result = versionService.getVersion();
      
      // Assert
      expect(result).toBe(expectedVersion);
    });
  });
  
  describe('getVersionDetails', () => {
    it('should return an object with version details', () => {
      // Act
      const result = versionService.getVersionDetails();
      
      // Assert
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('nodeVersion');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('timestamp');
      expect(result.version).toBe(config.apiVersion);
      expect(result.nodeVersion).toBe(process.version);
      expect(result.environment).toBe(config.env);
      expect(typeof result.timestamp).toBe('string');
    });
    
    it('should include a valid ISO timestamp', () => {
      // Act
      const result = versionService.getVersionDetails();
      
      // Assert
      expect(() => new Date(result.timestamp)).not.toThrow();
    });
  });
});