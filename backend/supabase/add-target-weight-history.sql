-- ============================================================================
-- SLIMMING WORLD TARGET WEIGHT HISTORY
-- ============================================================================
-- This script adds historical target weight tracking to support changing
-- target weights over time without affecting previous entries.
--
-- The target_weight_history table tracks when target weights are changed.
-- Each entry has an effective_date which determines when that target weight
-- becomes active. When creating or displaying weigh-in entries, the system
-- looks up which target weight was active on that entry's date.
-- ============================================================================

-- ============================================================================
-- TARGET WEIGHT HISTORY TABLE
-- ============================================================================

-- Create the target weight history table
CREATE TABLE IF NOT EXISTS slimming_world_target_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES slimming_world_profiles(id) ON DELETE CASCADE,
  target_weight DECIMAL(6,2) NOT NULL, -- Target weight in lbs
  effective_date DATE NOT NULL, -- Date from which this target applies
  notes TEXT DEFAULT NULL, -- Optional reason for changing target
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sw_target_weights_profile ON slimming_world_target_weights(profile_id);
CREATE INDEX IF NOT EXISTS idx_sw_target_weights_date ON slimming_world_target_weights(profile_id, effective_date DESC);

-- Enable Row Level Security
ALTER TABLE slimming_world_target_weights ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Slimming World target weights are publicly readable" ON slimming_world_target_weights;
DROP POLICY IF EXISTS "Only admins can insert target weights" ON slimming_world_target_weights;
DROP POLICY IF EXISTS "Only admins can update target weights" ON slimming_world_target_weights;
DROP POLICY IF EXISTS "Only admins can delete target weights" ON slimming_world_target_weights;

-- Create RLS policies
CREATE POLICY "Slimming World target weights are publicly readable"
  ON slimming_world_target_weights FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert target weights"
  ON slimming_world_target_weights FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update target weights"
  ON slimming_world_target_weights FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete target weights"
  ON slimming_world_target_weights FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- HELPER FUNCTION: Get Target Weight for a Specific Date
-- ============================================================================

-- This function returns the target weight that was active on a given date
-- It finds the most recent target weight with effective_date <= entry_date
CREATE OR REPLACE FUNCTION get_target_weight_for_date(
  p_profile_id UUID,
  p_entry_date DATE
) RETURNS DECIMAL(6,2) AS $$
DECLARE
  v_target_weight DECIMAL(6,2);
BEGIN
  -- Find the most recent target weight effective on or before the entry date
  SELECT target_weight INTO v_target_weight
  FROM slimming_world_target_weights
  WHERE profile_id = p_profile_id
    AND effective_date <= p_entry_date
  ORDER BY effective_date DESC
  LIMIT 1;
  
  -- If no target weight found in history, fall back to profile's target_weight
  IF v_target_weight IS NULL THEN
    SELECT target_weight INTO v_target_weight
    FROM slimming_world_profiles
    WHERE id = p_profile_id;
  END IF;
  
  RETURN v_target_weight;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION: Initialize Target Weight History from Existing Profiles
-- ============================================================================

-- For each existing profile, create an initial target weight entry
-- using the profile's start_date as the effective_date
INSERT INTO slimming_world_target_weights (profile_id, target_weight, effective_date, notes)
SELECT 
  id,
  target_weight,
  start_date,
  'Initial target weight (migrated from profile)'
FROM slimming_world_profiles
WHERE NOT EXISTS (
  -- Only insert if there's no history yet for this profile
  SELECT 1 FROM slimming_world_target_weights
  WHERE profile_id = slimming_world_profiles.id
);

-- ============================================================================
-- UPDATED VIEW: Profile Stats with Current Target Weight
-- ============================================================================

-- Drop and recreate the profile stats view to include current target weight
DROP VIEW IF EXISTS slimming_world_profile_stats;

CREATE VIEW slimming_world_profile_stats AS
SELECT 
  p.id,
  p.user_id,
  p.start_date,
  p.start_weight,
  p.target_weight AS original_target_weight,
  p.is_active,
  -- Get the most recent target weight (current target)
  (
    SELECT target_weight
    FROM slimming_world_target_weights
    WHERE profile_id = p.id
    ORDER BY effective_date DESC
    LIMIT 1
  ) AS current_target_weight,
  -- Entry statistics
  COUNT(e.id) AS total_entries,
  MAX(e.entry_date) AS last_entry_date,
  (
    SELECT weight
    FROM slimming_world_entries
    WHERE profile_id = p.id
    ORDER BY entry_date DESC
    LIMIT 1
  ) AS current_weight,
  (
    SELECT total_lost
    FROM slimming_world_entries
    WHERE profile_id = p.id
    ORDER BY entry_date DESC
    LIMIT 1
  ) AS total_lost,
  -- Calculate remaining to target using current target weight
  (
    SELECT weight
    FROM slimming_world_entries
    WHERE profile_id = p.id
    ORDER BY entry_date DESC
    LIMIT 1
  ) - (
    SELECT target_weight
    FROM slimming_world_target_weights
    WHERE profile_id = p.id
    ORDER BY effective_date DESC
    LIMIT 1
  ) AS remaining_to_target
FROM slimming_world_profiles p
LEFT JOIN slimming_world_entries e ON e.profile_id = p.id
GROUP BY p.id, p.user_id, p.start_date, p.start_weight, p.target_weight, p.is_active;

-- ============================================================================
-- TRIGGER: Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_slimming_world_target_weights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_slimming_world_target_weights_updated_at ON slimming_world_target_weights;

CREATE TRIGGER trigger_update_slimming_world_target_weights_updated_at
  BEFORE UPDATE ON slimming_world_target_weights
  FOR EACH ROW
  EXECUTE FUNCTION update_slimming_world_target_weights_updated_at();

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Target weight history table created successfully';
  RAISE NOTICE '✅ Existing profiles migrated to target weight history';
  RAISE NOTICE '✅ Helper function get_target_weight_for_date() created';
  RAISE NOTICE '✅ Profile stats view updated with current_target_weight';
  RAISE NOTICE '';
  RAISE NOTICE '📝 You can now:';
  RAISE NOTICE '   - Add new target weights with effective dates';
  RAISE NOTICE '   - View target weight history per profile';
  RAISE NOTICE '   - Entries will use the correct target weight based on their date';
END $$;
