-- Create the garmin_activities table
CREATE TABLE IF NOT EXISTS garmin_activities (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('running', 'cycling', 'walking', 'swimming', 'other')),
  distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  calories INTEGER,
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  average_pace DECIMAL(10, 2),
  elevation INTEGER,
  steps INTEGER,
  notes TEXT,
  gps_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_garmin_activities_date ON garmin_activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_type ON garmin_activities(type);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_created ON garmin_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_gps ON garmin_activities USING GIN (gps_data);

-- Enable Row Level Security
ALTER TABLE garmin_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Activities are publicly readable" ON garmin_activities;
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON garmin_activities;
DROP POLICY IF EXISTS "Authenticated users can update activities" ON garmin_activities;
DROP POLICY IF EXISTS "Authenticated users can delete activities" ON garmin_activities;
DROP POLICY IF EXISTS "Allow all inserts" ON garmin_activities;
DROP POLICY IF EXISTS "Allow all updates" ON garmin_activities;
DROP POLICY IF EXISTS "Allow all deletes" ON garmin_activities;

-- Create RLS policies
CREATE POLICY "Activities are publicly readable"
  ON garmin_activities FOR SELECT
  USING (TRUE);

CREATE POLICY "Allow all inserts"
  ON garmin_activities FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Allow all updates"
  ON garmin_activities FOR UPDATE
  USING (TRUE);

CREATE POLICY "Allow all deletes"
  ON garmin_activities FOR DELETE
  USING (TRUE);

-- Create function for updated_at
CREATE OR REPLACE FUNCTION update_garmin_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS garmin_activities_updated_at_trigger ON garmin_activities;
CREATE TRIGGER garmin_activities_updated_at_trigger
  BEFORE UPDATE ON garmin_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_garmin_activities_updated_at();

-- Create helper views
-- Drop existing views if they exist
DROP VIEW IF EXISTS garmin_activity_summary;
DROP VIEW IF EXISTS garmin_recent_activities;
DROP VIEW IF EXISTS garmin_monthly_totals;

-- Create views with SECURITY INVOKER to respect RLS policies
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

CREATE VIEW garmin_recent_activities
WITH (security_invoker = true) AS
SELECT *
FROM garmin_activities
WHERE date >= NOW() - INTERVAL '30 days'
ORDER BY date DESC;

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
