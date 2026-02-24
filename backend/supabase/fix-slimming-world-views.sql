-- ============================================================================
-- FIX ALL DATABASE VIEWS - SECURITY INVOKER
-- ============================================================================
-- This script fixes the SECURITY DEFINER warning for ALL database views
-- Run this in your Supabase SQL Editor if you see warnings like:
-- "View is defined with the SECURITY DEFINER property"
--
-- This recreates all views with SECURITY INVOKER to respect RLS policies
-- ============================================================================

-- ============================================================================
-- SLIMMING WORLD VIEWS
-- ============================================================================

DROP VIEW IF EXISTS slimming_world_latest_entries CASCADE;
DROP VIEW IF EXISTS slimming_world_profile_stats CASCADE;

-- View to get latest entry for each profile
CREATE VIEW slimming_world_latest_entries
WITH (security_invoker = true) AS
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
CREATE VIEW slimming_world_profile_stats
WITH (security_invoker = true) AS
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
-- DAILY STEPS VIEWS
-- ============================================================================

DROP VIEW IF EXISTS daily_steps_summary CASCADE;
DROP VIEW IF EXISTS daily_steps_recent_30 CASCADE;
DROP VIEW IF EXISTS daily_steps_weekly_totals CASCADE;

-- Summary statistics view
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

-- Recent 30 days view
CREATE VIEW daily_steps_recent_30
WITH (security_invoker = true) AS
SELECT *
FROM daily_steps
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;

-- Weekly totals view
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

-- ============================================================================
-- GARMIN ACTIVITIES VIEWS
-- ============================================================================

DROP VIEW IF EXISTS garmin_activity_summary CASCADE;
DROP VIEW IF EXISTS garmin_recent_activities CASCADE;
DROP VIEW IF EXISTS garmin_monthly_totals CASCADE;

-- Activity summary statistics view
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

-- Recent activities (last 30 days) view
CREATE VIEW garmin_recent_activities
WITH (security_invoker = true) AS
SELECT *
FROM garmin_activities
WHERE date >= NOW() - INTERVAL '30 days'
ORDER BY date DESC;

-- Monthly activity totals view
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
-- ADD COMMENTS
-- ============================================================================

-- Slimming World
COMMENT ON VIEW slimming_world_latest_entries IS 'Returns the most recent entry for each profile (with SECURITY INVOKER)';
COMMENT ON VIEW slimming_world_profile_stats IS 'Summary statistics for each profile (with SECURITY INVOKER)';

-- Daily Steps
COMMENT ON VIEW daily_steps_summary IS 'Summary statistics for daily steps (with SECURITY INVOKER)';
COMMENT ON VIEW daily_steps_recent_30 IS 'Daily steps for the last 30 days (with SECURITY INVOKER)';
COMMENT ON VIEW daily_steps_weekly_totals IS 'Weekly step totals (with SECURITY INVOKER)';

-- Garmin Activities
COMMENT ON VIEW garmin_activity_summary IS 'Summary statistics by activity type (with SECURITY INVOKER)';
COMMENT ON VIEW garmin_recent_activities IS 'Activities from the last 30 days (with SECURITY INVOKER)';
COMMENT ON VIEW garmin_monthly_totals IS 'Monthly activity totals (with SECURITY INVOKER)';

-- ============================================================================
-- DONE!
-- ============================================================================
-- All views have been recreated with SECURITY INVOKER
-- The warnings should now be resolved in your Supabase dashboard
-- ============================================================================
