-- ============================================================================
-- Fix Goals and Cards Display Order AND Duplicates
-- ============================================================================
-- Updates the football_matches_detailed view to:
-- 1. Order goals and cards by minute (chronological order)
-- 2. Fix Cartesian product issue causing duplicate goals when multiple cards exist
-- 
-- Problem: Using LEFT JOIN on both goals and cards created duplicates
-- Solution: Use subqueries instead of joins to eliminate Cartesian product

-- Drop and recreate the view with proper ordering and no duplicates
DROP VIEW IF EXISTS football_matches_detailed CASCADE;

CREATE VIEW football_matches_detailed
WITH (security_invoker = true) AS
SELECT 
  m.id,
  m.season_id,
  m.match_date,
  m.opposition,
  m.venue,
  m.goals_scored,
  m.goals_conceded,
  m.league,
  m.video_url,
  m.iplayer_url,
  m.notes,
  m.created_at,
  m.updated_at,
  -- Goals subquery ordered by minute (chronological)
  COALESCE((
    SELECT json_agg(jsonb_build_object(
      'id', g.id,
      'player', g.player,
      'minute', g.minute,
      'assist', g.assist
    ) ORDER BY g.minute)
    FROM football_match_goals g
    WHERE g.match_id = m.id
  ), '[]'::json) as goals,
  -- Cards subquery ordered by minute (chronological)
  COALESCE((
    SELECT json_agg(jsonb_build_object(
      'id', c.id,
      'player', c.player,
      'card_type', c.card_type,
      'minute', c.minute
    ) ORDER BY c.minute)
    FROM football_match_cards c
    WHERE c.match_id = m.id
  ), '[]'::json) as cards
FROM football_matches m;

-- Recreate dependent views
DROP VIEW IF EXISTS football_recent_matches CASCADE;
CREATE VIEW football_recent_matches
WITH (security_invoker = true) AS
SELECT *
FROM football_matches_detailed
ORDER BY match_date DESC
LIMIT 10;

COMMENT ON VIEW football_matches_detailed IS 'All matches with goals and cards aggregated in chronological order, without duplicates';
