/*
  # Create Git tokens table and security policies

  1. New Tables
    - `git_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `label` (text, required)
      - `provider_type` (text, either 'github' or 'gitlab')
      - `provider_url` (text, defaults based on provider)
      - `token_value` (text, encrypted)
      - `iv` (text, for encryption)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `git_tokens` table
    - Add policies for authenticated users to:
      - Read their own tokens
      - Create new tokens
      - Update their tokens
      - Delete their tokens

  3. Indexes
    - Index on user_id for faster lookups
    - Composite index on (user_id, label) for uniqueness
*/

-- Create enum for provider types
CREATE TYPE git_provider_type AS ENUM ('github', 'gitlab');

-- Create git_tokens table
CREATE TABLE IF NOT EXISTS git_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  provider_type git_provider_type NOT NULL,
  provider_url text NOT NULL,
  token_value text NOT NULL,
  iv text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_label UNIQUE (user_id, label)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_git_tokens_user_id ON git_tokens(user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_git_tokens_updated_at
  BEFORE UPDATE ON git_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE git_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tokens"
  ON git_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tokens"
  ON git_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON git_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
  ON git_tokens
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);