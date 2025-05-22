-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS users_clerk_id_idx ON users (clerk_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public read access for authenticated users
CREATE POLICY "Users are viewable by authenticated users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow the user to update their own record
CREATE POLICY "Users can update their own record"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = clerk_id)
  WITH CHECK (auth.uid()::text = clerk_id);

-- Admins can do everything
CREATE POLICY "Admins can do everything"
  ON users
  TO service_role
  USING (true); 