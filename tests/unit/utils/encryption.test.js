/**
 * Unit tests for encryption utilities
 */
const { encrypt, decrypt } = require('../../../src/utils/encryption');

describe('Encryption Utilities', () => {
  const testMasterKey = 'a'.repeat(32); // 32-byte test key
  const testValue = 'test-token-value-123';

  describe('encrypt', () => {
    it('should encrypt a value and return encrypted string with IV', () => {
      // Act
      const result = encrypt(testValue, testMasterKey);

      // Assert
      expect(result).toHaveProperty('encrypted');
      expect(result).toHaveProperty('iv');
      expect(result.encrypted).toContain('.');  // Should contain auth tag
      expect(typeof result.encrypted).toBe('string');
      expect(typeof result.iv).toBe('string');
    });

    it('should generate different IVs for same input', () => {
      // Act
      const result1 = encrypt(testValue, testMasterKey);
      const result2 = encrypt(testValue, testMasterKey);

      // Assert
      expect(result1.iv).not.toBe(result2.iv);
      expect(result1.encrypted).not.toBe(result2.encrypted);
    });

    it('should throw error for invalid master key', () => {
      // Act & Assert
      expect(() => encrypt(testValue, 'short-key'))
        .toThrow('Encryption failed');
    });
  });

  describe('decrypt', () => {
    it('should correctly decrypt an encrypted value', () => {
      // Arrange
      const { encrypted, iv } = encrypt(testValue, testMasterKey);

      // Act
      const decrypted = decrypt(encrypted, iv, testMasterKey);

      // Assert
      expect(decrypted).toBe(testValue);
    });

    it('should throw error for invalid encrypted value', () => {
      // Arrange
      const { iv } = encrypt(testValue, testMasterKey);

      // Act & Assert
      expect(() => decrypt('invalid.auth', iv, testMasterKey))
        .toThrow('Decryption failed');
    });

    it('should throw error for invalid IV', () => {
      // Arrange
      const { encrypted } = encrypt(testValue, testMasterKey);

      // Act & Assert
      expect(() => decrypt(encrypted, 'invalid-iv', testMasterKey))
        .toThrow('Decryption failed');
    });

    it('should throw error for invalid master key', () => {
      // Arrange
      const { encrypted, iv } = encrypt(testValue, testMasterKey);

      // Act & Assert
      expect(() => decrypt(encrypted, iv, 'wrong-key'))
        .toThrow('Decryption failed');
    });

    it('should throw error for tampered encrypted value', () => {
      // Arrange
      const { encrypted, iv } = encrypt(testValue, testMasterKey);
      const [value, authTag] = encrypted.split('.');
      const tamperedEncrypted = `${value}modified.${authTag}`;

      // Act & Assert
      expect(() => decrypt(tamperedEncrypted, iv, testMasterKey))
        .toThrow('Decryption failed');
    });
  });
});