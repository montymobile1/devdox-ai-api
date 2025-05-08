/**
 * Git token model and validation
 */
const { z } = require('zod');

// Git token schema for validation
const gitTokenSchema = z.object({
  label: z.string()
    .min(1, 'Label is required')
    .max(100, 'Label must be 100 characters or less'),
  provider_type: z.enum(['github', 'gitlab'], {
    errorMap: () => ({ message: 'Provider must be either github or gitlab' }),
  }),
  provider_url: z.string()
    .url('Provider URL must be a valid URL')
    .default((val) => {
      if (!val) {
        return val?.provider_type === 'gitlab' ? 'https://gitlab.com' : 'https://github.com';
      }
      return val;
    }),
  token_value: z.string()
    .min(1, 'Token value is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Token contains invalid characters'),
});

// Export schema for use in validation middleware
module.exports = {
  gitTokenSchema,
};