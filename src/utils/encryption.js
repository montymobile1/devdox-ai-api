/**
 * Encryption utilities for secure token storage
 */
const crypto = require('node:crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits (recommended for GCM)
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Derives an encryption key from the master key
 * @param {string} masterKey - Master encryption key
 * @returns {Buffer} Derived key
 */
const deriveKey = (masterKey) => {
  return crypto.scryptSync(masterKey, 'salt', KEY_LENGTH);
};

/**
 * Encrypts a value using AES-256-GCM
 * @param {string} value - Value to encrypt
 * @param {string} masterKey - Master encryption key
 * @returns {Object} Object containing encrypted value and IV
 */
const encrypt = (value, masterKey) => {
  try {
    const key = deriveKey(masterKey);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: `${encrypted}.${authTag.toString('base64')}`,
      iv: iv.toString('base64'),
    };
  } catch (error) {
    throw new Error('Encryption failed');
  }
};

/**
 * Decrypts a value using AES-256-GCM
 * @param {string} encryptedValue - Encrypted value
 * @param {string} iv - Initialization vector
 * @param {string} masterKey - Master encryption key
 * @returns {string} Decrypted value
 */
const decrypt = (encryptedValue, iv, masterKey) => {
  try {
    const key = deriveKey(masterKey);
    const [encrypted, authTag] = encryptedValue.split('.');
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

module.exports = {
  encrypt,
  decrypt,
};