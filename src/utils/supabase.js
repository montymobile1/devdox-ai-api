/**
 * Supabase client initialization and utilities
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const logger = require('./logger');

// Initialize Supabase client
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;
const supabaseServiceKey = config.supabase.serviceKey;

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials');
  throw new Error('Missing Supabase credentials');
}

// Create client instance for regular operations
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// Create service role client for admin operations
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

/**
 * Execute database query with error handling and logging
 * @param {Function} queryFn - Function that executes the Supabase query
 * @returns {Promise<Object>} Query result
 * @throws {Error} Database error
 */
const executeQuery = async (queryFn) => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      logger.error('Database query error', {
        error: result.error,
        hint: result.error?.hint,
        details: result.error?.details,
      });
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    logger.error('Database operation failed', { error });
    throw error;
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  executeQuery,
};