-- ============================================================================
-- FOOTBALL DATABASE SCHEMA
-- ============================================================================
-- Manages Motherwell FC match data, results, goals, and season statistics
-- ============================================================================

-- ============================================================================
-- TABLE: football_seasons
-- ============================================================================
-- Stores information about football seasons
CREATE TABLE IF NOT EXISTS football_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL UNIQUE, -- e.g., "2024-25"
  display_name TEXT NOT NULL, -- e.g., "2024-25"
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_football_seasons_season_id ON football_seasons(season_id);
CREATE INDEX IF NOT EXISTS idx_football_seasons_active ON football_seasons(is_active);

-- ============================================================================
-- TABLE: football_matches
-- ============================================================================
-- Stores individual match data
CREATE TABLE IF NOT EXISTS football_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL REFERENCES football_seasons(season_id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  opposition TEXT NOT NULL,
  venue TEXT NOT NULL CHECK (venue IN ('Home', 'Away')),
  goals_scored INTEGER,
  goals_conceded INTEGER,
  league TEXT, -- Can be null for cup/friendly matches
  video_url TEXT,
  iplayer_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_football_matches_season ON football_matches(season_id);
CREATE INDEX IF NOT EXISTS idx_football_matches_date ON football_matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_football_matches_season_date ON football_matches(season_id, match_date DESC);

-- ============================================================================
-- TABLE: football_match_goals
-- ============================================================================
-- Stores goals scored in matches
CREATE TABLE IF NOT EXISTS football_match_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES football_matches(id) ON DELETE CASCADE,
  player TEXT NOT NULL,
  minute TEXT NOT NULL, -- TEXT to support "90+3", "59 (Pen)", etc.
  assist TEXT, -- Nullable for unassisted goals
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for match lookups
CREATE INDEX IF NOT EXISTS idx_football_match_goals_match ON football_match_goals(match_id);
CREATE INDEX IF NOT EXISTS idx_football_match_goals_player ON football_match_goals(player);

-- ============================================================================
-- TABLE: football_match_cards
-- ============================================================================
-- Stores yellow/red cards shown in matches
CREATE TABLE IF NOT EXISTS football_match_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES football_matches(id) ON DELETE CASCADE,
  player TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('yellow', 'red')),
  minute INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for match lookups
CREATE INDEX IF NOT EXISTS idx_football_match_cards_match ON football_match_cards(match_id);
CREATE INDEX IF NOT EXISTS idx_football_match_cards_player ON football_match_cards(player);

-- ============================================================================
-- TABLE: football_season_stats
-- ============================================================================
-- Stores aggregated season statistics for top scorers
-- This is denormalized for performance
CREATE TABLE IF NOT EXISTS football_season_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL REFERENCES football_seasons(season_id) ON DELETE CASCADE,
  player TEXT NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, player) -- One record per player per season
);

-- Index for season lookups
CREATE INDEX IF NOT EXISTS idx_football_season_stats_season ON football_season_stats(season_id);
CREATE INDEX IF NOT EXISTS idx_football_season_stats_goals ON football_season_stats(goals DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE football_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_match_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_match_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_season_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Enable read access for all users" ON football_seasons FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON football_matches FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON football_match_goals FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON football_match_cards FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON football_season_stats FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON football_seasons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON football_seasons FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON football_seasons FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON football_matches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON football_matches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON football_matches FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON football_match_goals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON football_match_goals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON football_match_goals FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON football_match_cards FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON football_match_cards FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON football_match_cards FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON football_season_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON football_season_stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON football_season_stats FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS football_seasons_updated_at ON football_seasons;
CREATE TRIGGER football_seasons_updated_at
  BEFORE UPDATE ON football_seasons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS football_matches_updated_at ON football_matches;
CREATE TRIGGER football_matches_updated_at
  BEFORE UPDATE ON football_matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS football_season_stats_updated_at ON football_season_stats;
CREATE TRIGGER football_season_stats_updated_at
  BEFORE UPDATE ON football_season_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS: Helper views for common queries
-- ============================================================================

-- View: All matches with goals and cards aggregated (ordered by minute)
-- Uses subqueries to avoid Cartesian product issues
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

-- View: Season statistics with match counts
DROP VIEW IF EXISTS football_season_summary CASCADE;
CREATE VIEW football_season_summary
WITH (security_invoker = true) AS
SELECT 
  s.season_id,
  s.display_name,
  s.start_year,
  s.end_year,
  s.is_active,
  COUNT(m.id) as total_matches,
  SUM(CASE WHEN m.goals_scored > m.goals_conceded THEN 1 ELSE 0 END) as wins,
  SUM(CASE WHEN m.goals_scored = m.goals_conceded THEN 1 ELSE 0 END) as draws,
  SUM(CASE WHEN m.goals_scored < m.goals_conceded THEN 1 ELSE 0 END) as losses,
  SUM(m.goals_scored) as total_goals_scored,
  SUM(m.goals_conceded) as total_goals_conceded
FROM football_seasons s
LEFT JOIN football_matches m ON s.season_id = m.season_id
GROUP BY s.season_id, s.display_name, s.start_year, s.end_year, s.is_active;

-- View: Recent matches (last 10 across all seasons)
DROP VIEW IF EXISTS football_recent_matches CASCADE;
CREATE VIEW football_recent_matches
WITH (security_invoker = true) AS
SELECT *
FROM football_matches_detailed
ORDER BY match_date DESC
LIMIT 10;

-- View: Top scorers across all seasons
DROP VIEW IF EXISTS football_all_time_scorers CASCADE;
CREATE VIEW football_all_time_scorers
WITH (security_invoker = true) AS
SELECT 
  player,
  SUM(goals) as total_goals,
  SUM(assists) as total_assists,
  COUNT(DISTINCT season_id) as seasons_played
FROM football_season_stats
GROUP BY player
ORDER BY total_goals DESC;

-- ============================================================================
-- COMMENTS: Documentation for tables and views
-- ============================================================================

COMMENT ON TABLE football_seasons IS 'Stores football season metadata';
COMMENT ON TABLE football_matches IS 'Stores individual match results and details';
COMMENT ON TABLE football_match_goals IS 'Stores goals scored in each match';
COMMENT ON TABLE football_match_cards IS 'Stores yellow/red cards shown in matches';
COMMENT ON TABLE football_season_stats IS 'Stores aggregated season statistics for players';

COMMENT ON VIEW football_matches_detailed IS 'Matches with goals and cards as JSON arrays (with SECURITY INVOKER)';
COMMENT ON VIEW football_season_summary IS 'Season summary with win/draw/loss records (with SECURITY INVOKER)';
COMMENT ON VIEW football_recent_matches IS 'Last 10 matches across all seasons (with SECURITY INVOKER)';
COMMENT ON VIEW football_all_time_scorers IS 'Top scorers across all seasons (with SECURITY INVOKER)';

-- ============================================================================
-- DONE!
-- ============================================================================
-- Football schema created successfully
-- Next steps:
-- 1. Run migration script to import existing JSON data
-- 2. Update frontend components to fetch from database
-- 3. Create admin interface for managing matches
-- ============================================================================
