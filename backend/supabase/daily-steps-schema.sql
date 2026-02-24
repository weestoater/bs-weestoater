-- Create the daily_steps table
CREATE TABLE IF NOT EXISTS daily_steps (
  date DATE PRIMARY KEY,
  steps INTEGER NOT NULL DEFAULT 0,
  goal INTEGER,
  distance DECIMAL(10, 2),
  calories INTEGER,
  floors INTEGER,
  active_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_steps_date ON daily_steps(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_steps_created ON daily_steps(created_at DESC);

-- Enable Row Level Security
ALTER TABLE daily_steps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Steps are publicly readable" ON daily_steps;
DROP POLICY IF EXISTS "Allow all inserts on steps" ON daily_steps;
DROP POLICY IF EXISTS "Allow all updates on steps" ON daily_steps;
DROP POLICY IF EXISTS "Allow all deletes on steps" ON daily_steps;

-- Create RLS policies
CREATE POLICY "Steps are publicly readable"
  ON daily_steps FOR SELECT
  USING (TRUE);

CREATE POLICY "Allow all inserts on steps"
  ON daily_steps FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Allow all updates on steps"
  ON daily_steps FOR UPDATE
  USING (TRUE);

CREATE POLICY "Allow all deletes on steps"
  ON daily_steps FOR DELETE
  USING (TRUE);

-- Create function for updated_at
CREATE OR REPLACE FUNCTION update_daily_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS daily_steps_updated_at_trigger ON daily_steps;
CREATE TRIGGER daily_steps_updated_at_trigger
  BEFORE UPDATE ON daily_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_steps_updated_at();

-- Create helper views
-- Drop existing views if they exist
DROP VIEW IF EXISTS daily_steps_summary;
DROP VIEW IF EXISTS daily_steps_recent_30;
DROP VIEW IF EXISTS daily_steps_weekly_totals;

-- Create views with SECURITY INVOKER to respect RLS policies
CREATE VIEW daily_steps_summary
WITH (security_invoker = true) AS
SELECT
  COUNT(*) as total_days,
  SUM(steps) as total_steps,
  ROUND(AVG(steps)) as avg_steps,
  MAX(steps) as max_steps,
  MIN(steps) as min_steps,
  COUNT(CASE WHEN goal IS NOT NULL AND steps >= goal THEN 1 END) as days_goal_met,
  SUM(distance) as total_distance,
  SUM(calories) as total_calories
FROM daily_steps;

CREATE VIEW daily_steps_recent_30
WITH (security_invoker = true) AS
SELECT *
FROM daily_steps
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;

CREATE VIEW daily_steps_weekly_totals
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('week', date) as week,
  COUNT(*) as days_tracked,
  SUM(steps) as total_steps,
  ROUND(AVG(steps)) as avg_steps
FROM daily_steps
GROUP BY DATE_TRUNC('week', date)
ORDER BY week DESC;
