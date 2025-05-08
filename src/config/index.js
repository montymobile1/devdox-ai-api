/**
 * Configuration management
 * Centralizes all configuration values and provides environment-specific settings
 */
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  
  // Clerk authentication configuration
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },

  // Encryption configuration
  encryption: {
    masterKey: process.env.ENCRYPTION_MASTER_KEY,
  },
  
  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || 'https://devdox.ai'
      : true,
    credentials: true,
  },
  
  // Logging configuration
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'console',
  },
  
  // API version
  apiVersion: process.env.API_VERSION || '1.0.0',
};

module.exports = config;