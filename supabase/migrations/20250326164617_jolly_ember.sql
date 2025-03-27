/*
  # Create palettes table and related schemas

  1. New Tables
    - `palettes`
      - `id` (uuid, primary key)
      - `colors` (text array, stores hex codes)
      - `tags` (text array, for searchable tags)
      - `likes` (integer, default 0)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on palettes table
    - Add policies for:
      - Anyone can view palettes
      - Only authenticated users can create palettes
      - Only palette owners can update/delete their palettes
*/

CREATE TABLE IF NOT EXISTS palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colors text[] NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE palettes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view palettes
CREATE POLICY "Palettes are viewable by everyone" 
  ON palettes
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can create palettes
CREATE POLICY "Authenticated users can create palettes" 
  ON palettes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can update their own palettes
CREATE POLICY "Users can update own palettes" 
  ON palettes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own palettes
CREATE POLICY "Users can delete own palettes" 
  ON palettes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS palettes_user_id_idx ON palettes(user_id);
CREATE INDEX IF NOT EXISTS palettes_created_at_idx ON palettes(created_at DESC);