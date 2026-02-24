-- ============================================================================
-- SLIMMING WORLD DATABASE SCHEMA
-- ============================================================================
-- This script creates tables for Slimming World weight tracking data
-- Run this in your Supabase SQL Editor to set up the tables
--
-- Tables:
--   1. slimming_world_profiles - Stores profile info (start date, weights, targets)
--   2. slimming_world_entries - Stores individual weigh-in records
--
-- All tables implement Row Level Security (RLS)
-- ============================================================================

-- ============================================================================
-- 1. SLIMMING WORLD PROFILES TABLE
-- ============================================================================

-- Create the slimming_world_profiles table
CREATE TABLE IF NOT EXISTS slimming_world_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  start_weight DECIMAL(6,2) NOT NULL, -- Weight in lbs (e.g., 282.50)
  target_weight DECIMAL(6,2) NOT NULL, -- Target weight in lbs
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sw_profiles_user_id ON slimming_world_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sw_profiles_active ON slimming_world_profiles(is_active);

-- Enable Row Level Security
ALTER TABLE slimming_world_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Slimming World profiles are publicly readable" ON slimming_world_profiles;
DROP POLICY IF EXISTS "Only admins can insert profiles" ON slimming_world_profiles;
DROP POLICY IF EXISTS "Only admins can update profiles" ON slimming_world_profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON slimming_world_profiles;

-- Create RLS policies for profiles
-- Public read access for active profiles
CREATE POLICY "Slimming World profiles are publicly readable"
  ON slimming_world_profiles FOR SELECT
  USING (is_active = TRUE);

-- Admin write access (restrict to authenticated users)
-- Note: Service role bypasses RLS, so migrations work without these policies
-- Modify these policies based on your authentication setup
CREATE POLICY "Only admins can insert profiles"
  ON slimming_world_profiles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update profiles"
  ON slimming_world_profiles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete profiles"
  ON slimming_world_profiles FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 2. SLIMMING WORLD ENTRIES TABLE
-- ============================================================================

-- Create the slimming_world_entries table
CREATE TABLE IF NOT EXISTS slimming_world_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES slimming_world_profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  weight DECIMAL(6,2) NOT NULL, -- Current weight in lbs
  weight_change DECIMAL(6,2) DEFAULT 0, -- Change from previous entry (can be negative)
  total_lost DECIMAL(6,2) DEFAULT 0, -- Total weight lost from start
  target_weight DECIMAL(6,2) NOT NULL, -- Target weight at this point
  slimmer_of_week INTEGER DEFAULT NULL, -- Achievement marker (100 if awarded)
  notes TEXT DEFAULT NULL, -- Optional notes for the weigh-in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, entry_date) -- Prevent duplicate entries for same date
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sw_entries_profile ON slimming_world_entries(profile_id);
CREATE INDEX IF NOT EXISTS idx_sw_entries_date ON slimming_world_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_sw_entries_profile_date ON slimming_world_entries(profile_id, entry_date DESC);

-- Enable Row Level Security
ALTER TABLE slimming_world_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Slimming World entries are publicly readable" ON slimming_world_entries;
DROP POLICY IF EXISTS "Only admins can insert entries" ON slimming_world_entries;
DROP POLICY IF EXISTS "Only admins can update entries" ON slimming_world_entries;
DROP POLICY IF EXISTS "Only admins can delete entries" ON slimming_world_entries;

-- Create RLS policies for entries
-- Public read access
CREATE POLICY "Slimming World entries are publicly readable"
  ON slimming_world_entries FOR SELECT
  USING (TRUE);

-- Admin write access (restrict to authenticated users)
-- Note: Service role bypasses RLS, so migrations work without these policies
-- Modify these policies based on your authentication setup
CREATE POLICY "Only admins can insert entries"
  ON slimming_world_entries FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update entries"
  ON slimming_world_entries FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete entries"
  ON slimming_world_entries FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp for profiles
CREATE OR REPLACE FUNCTION update_sw_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS sw_profiles_updated_at_trigger ON slimming_world_profiles;
CREATE TRIGGER sw_profiles_updated_at_trigger
  BEFORE UPDATE ON slimming_world_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_sw_profiles_updated_at();

-- Function to automatically update updated_at timestamp for entries
CREATE OR REPLACE FUNCTION update_sw_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for entries updated_at
DROP TRIGGER IF EXISTS sw_entries_updated_at_trigger ON slimming_world_entries;
CREATE TRIGGER sw_entries_updated_at_trigger
  BEFORE UPDATE ON slimming_world_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_sw_entries_updated_at();

-- ============================================================================
-- HELPER VIEWS (Optional)
-- ============================================================================

-- View to get latest entry for each profile
CREATE OR REPLACE VIEW slimming_world_latest_entries AS
SELECT DISTINCT ON (profile_id)
  e.profile_id,
  e.entry_date,
  e.weight,
  e.weight_change,
  e.total_lost,
  p.start_weight,
  p.target_weight,
  (p.start_weight - e.weight) as total_lost_calculated,
  (p.target_weight - e.weight) as remaining_to_target
FROM slimming_world_entries e
JOIN slimming_world_profiles p ON e.profile_id = p.id
ORDER BY profile_id, entry_date DESC;

-- View to get profile summary with statistics
CREATE OR REPLACE VIEW slimming_world_profile_stats AS
SELECT 
  p.id,
  p.user_id,
  p.start_date,
  p.start_weight,
  p.target_weight,
  COUNT(e.id) as total_entries,
  MAX(e.entry_date) as last_weigh_in,
  MIN(e.weight) as lowest_weight,
  MAX(e.total_lost) as max_lost,
  SUM(CASE WHEN e.slimmer_of_week IS NOT NULL THEN 1 ELSE 0 END) as total_sotw_awards
FROM slimming_world_profiles p
LEFT JOIN slimming_world_entries e ON p.id = e.profile_id
GROUP BY p.id, p.user_id, p.start_date, p.start_weight, p.target_weight;

-- ============================================================================
-- COMMENTS (For documentation)
-- ============================================================================

COMMENT ON TABLE slimming_world_profiles IS 'Stores user profiles for Slimming World tracking';
COMMENT ON TABLE slimming_world_entries IS 'Stores individual weigh-in entries for Slimming World';
COMMENT ON COLUMN slimming_world_entries.slimmer_of_week IS 'Value of 100 indicates Slimmer of the Week award';
COMMENT ON VIEW slimming_world_latest_entries IS 'Returns the most recent entry for each profile';
COMMENT ON VIEW slimming_world_profile_stats IS 'Summary statistics for each profile';
