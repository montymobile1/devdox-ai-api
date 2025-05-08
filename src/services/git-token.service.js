/**
 * Git token service
 * Handles business logic for git token operations
 */
const { StatusCodes } = require('http-status-codes');
const { supabase } = require('../utils/supabase');
const { encrypt, decrypt } = require('../utils/encryption');
const AppError = require('../utils/app-error');
const config = require('../config');

/**
 * List all git tokens for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of git tokens
 */
const listTokens = async (userId) => {
  const { data, error } = await supabase
    .from('git_tokens')
    .select('id, label, provider_type, provider_url, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError('Failed to fetch git tokens', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return data;
};

/**
 * Get a specific git token
 * @param {string} tokenId - Token ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Git token with decrypted value
 */
const getToken = async (tokenId, userId) => {
  const { data, error } = await supabase
    .from('git_tokens')
    .select('*')
    .eq('id', tokenId)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new AppError('Failed to fetch git token', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  if (!data) {
    throw new AppError('Git token not found', StatusCodes.NOT_FOUND);
  }

  // Decrypt token value
  try {
    const decryptedValue = decrypt(data.token_value, data.iv, config.encryption.masterKey);
    return {
      ...data,
      token_value: decryptedValue,
    };
  } catch (error) {
    throw new AppError('Failed to decrypt token', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  listTokens,
  getToken,
};