-- ============================================================================
-- GARMIN ACTIVITIES TABLE
-- ============================================================================
-- This script creates the garmin_activities table for storing Garmin Connect
-- activity data synced from your Garmin watch.
--
-- Run this in your Supabase SQL Editor after the main schema.sql
-- ============================================================================

-- Create the garmin_activities table
CREATE TABLE IF NOT EXISTS garmin_activities (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('running', 'cycling', 'walking', 'swimming', 'other')),
  distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  calories INTEGER,
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  average_pace DECIMAL(10, 2), -- minutes per mile
  elevation INTEGER, -- in feet
  steps INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_garmin_activities_date ON garmin_activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_type ON garmin_activities(type);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_created ON garmin_activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE garmin_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Activities are publicly readable" ON garmin_activities;
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON garmin_activities;
DROP POLICY IF EXISTS "Authenticated users can update activities" ON garmin_activities;
DROP POLICY IF EXISTS "Authenticated users can delete activities" ON garmin_activities;

-- Create RLS policies for garmin_activities
-- Public read access (since it's your personal fitness data to share)
CREATE POLICY "Activities are publicly readable"
  ON garmin_activities FOR SELECT
  USING (TRUE);

-- Allow all write operations for sync scripts and admin
-- Note: For a personal project with your own fitness data, this is acceptable
-- If you need more security, use Supabase service role key for sync operations
CREATE POLICY "Allow all inserts"
  ON garmin_activities FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Allow all updates"
  ON garmin_activities FOR UPDATE
  USING (TRUE);

CREATE POLICY "Allow all deletes"
  ON garmin_activities FOR DELETE
  USING (TRUE);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_garmin_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS garmin_activities_updated_at_trigger ON garmin_activities;
CREATE TRIGGER garmin_activities_updated_at_trigger
  BEFORE UPDATE ON garmin_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_garmin_activities_updated_at();

-- ============================================================================
-- HELPER VIEWS (Optional)
-- ============================================================================

-- Helper Views
-- Drop existing views if they exist
DROP VIEW IF EXISTS garmin_activity_summary;
DROP VIEW IF EXISTS garmin_recent_activities;
DROP VIEW IF EXISTS garmin_monthly_totals;

-- Create views with SECURITY INVOKER to respect RLS policies

-- View for activity summary statistics
CREATE VIEW garmin_activity_summary
WITH (security_invoker = true) AS
SELECT
  type,
  COUNT(*) as activity_count,
  SUM(distance) as total_distance,
  SUM(duration) as total_duration,
  SUM(calories) as total_calories,
  SUM(steps) as total_steps,
  AVG(distance) as avg_distance,
  AVG(duration) as avg_duration,
  AVG(average_heart_rate) as avg_heart_rate
FROM garmin_activities
GROUP BY type;

-- View for recent activities (last 30 days)
CREATE VIEW garmin_recent_activities
WITH (security_invoker = true) AS
SELECT *
FROM garmin_activities
WHERE date >= NOW() - INTERVAL '30 days'
ORDER BY date DESC;

-- View for monthly activity totals
CREATE VIEW garmin_monthly_totals
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', date) as month,
  COUNT(*) as activity_count,
  SUM(distance) as total_distance,
  SUM(duration) as total_duration,
  SUM(calories) as total_calories
FROM garmin_activities
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;

-- ============================================================================
-- NOTES
-- ============================================================================
-- After running this script:
--   1. Run the migration script to import existing JSON data
--   2. Update your sync script to push to Supabase
--   3. Update your frontend to fetch from Supabase
--
-- To view your data:
--   SELECT * FROM garmin_activities ORDER BY date DESC LIMIT 10;
--
-- To view summary stats:
--   SELECT * FROM garmin_activity_summary;
-- ============================================================================
