/*
  # Create tickets and messages tables

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `priority` (text)
      - `status` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

    - `messages`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, foreign key to tickets)
      - `content` (text)
      - `created_at` (timestamp)
      - `is_admin` (boolean)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own tickets and associated messages
      - Create new tickets and messages
    - Add policies for admin users to:
      - Read all tickets and messages
      - Update ticket status
      - Create admin messages
*/

-- Create tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for tickets
CREATE POLICY "Users can view their own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ));

-- Policies for messages
CREATE POLICY "Users can view messages for their tickets"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (tickets.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
      ))
    )
  );

CREATE POLICY "Users can create messages for their tickets"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND tickets.user_id = auth.uid()
    )
    OR
    (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );