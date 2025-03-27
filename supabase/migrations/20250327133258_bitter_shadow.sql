/*
  # Create likes table and relationships

  1. New Tables
    - `likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `palette_id` (uuid, references palettes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on likes table
    - Add policies for:
      - Authenticated users can create likes
      - Users can read their own likes
      - Users can delete their own likes
      - No updates allowed (likes are create/delete only)

  3. Relationships
    - Foreign key from likes.palette_id to palettes.id
    - Foreign key from likes.user_id to auth.users.id
    - Both with CASCADE on delete
*/

CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  palette_id uuid REFERENCES palettes(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, palette_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own likes"
  ON likes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes(user_id);
CREATE INDEX IF NOT EXISTS likes_palette_id_idx ON likes(palette_id);
CREATE INDEX IF NOT EXISTS likes_created_at_idx ON likes(created_at DESC);