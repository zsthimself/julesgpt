 -- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to enable the UUID extension
CREATE OR REPLACE FUNCTION create_uuid_extension()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  RETURN uuid_generate_v4();
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create uuid-ossp extension: %', SQLERRM;
END;
$$;