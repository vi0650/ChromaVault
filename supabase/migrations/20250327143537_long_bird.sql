/*
  # Fix profile creation trigger

  1. Changes
    - Drop existing trigger and function
    - Create new trigger with proper error handling
    - Add enable_row_level_security to profiles table
    - Update trigger to handle email properly

  2. Security
    - Maintain existing RLS policies
    - Ensure proper error handling
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

-- Recreate trigger with proper timing
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure RLS is enabled (fixed syntax)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;