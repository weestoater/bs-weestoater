-- ============================================================================
-- FOOTBALL PLAYERS TABLE
-- ============================================================================
-- Adds dedicated player management for football squads
-- ============================================================================

-- ============================================================================
-- TABLE: football_players
-- ============================================================================
-- Stores squad players for each season
CREATE TABLE IF NOT EXISTS football_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL REFERENCES football_seasons(season_id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  squad_number INTEGER,
  position TEXT, -- e.g., "Goalkeeper", "Defender", "Midfielder", "Forward"
  is_active BOOLEAN DEFAULT true, -- false for sold/loaned players
  notes TEXT, -- Optional notes (e.g., "On loan", "Sold to X")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, player_name) -- One record per player per season
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_football_players_season ON football_players(season_id);
CREATE INDEX IF NOT EXISTS idx_football_players_active ON football_players(is_active);
CREATE INDEX IF NOT EXISTS idx_football_players_name ON football_players(player_name);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE football_players ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Enable read access for all users" ON football_players FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON football_players FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON football_players FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON football_players FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

DROP TRIGGER IF EXISTS football_players_updated_at ON football_players;
CREATE TRIGGER football_players_updated_at
  BEFORE UPDATE ON football_players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION: Import existing players from goals and cards
-- ============================================================================
-- This populates the new table with historical data

-- Insert unique players from goals (scorers and assisters)
INSERT INTO football_players (season_id, player_name, is_active)
SELECT DISTINCT 
  fm.season_id,
  fmg.player,
  true -- Mark as active by default
FROM football_match_goals fmg
JOIN football_matches fm ON fmg.match_id = fm.id
ON CONFLICT (season_id, player_name) DO NOTHING;

-- Insert unique players from assists
INSERT INTO football_players (season_id, player_name, is_active)
SELECT DISTINCT 
  fm.season_id,
  fmg.assist,
  true
FROM football_match_goals fmg
JOIN football_matches fm ON fmg.match_id = fm.id
WHERE fmg.assist IS NOT NULL
ON CONFLICT (season_id, player_name) DO NOTHING;

-- Insert unique players from cards
INSERT INTO football_players (season_id, player_name, is_active)
SELECT DISTINCT 
  fm.season_id,
  fmc.player,
  true
FROM football_match_cards fmc
JOIN football_matches fm ON fmc.match_id = fm.id
ON CONFLICT (season_id, player_name) DO NOTHING;

-- ============================================================================
-- NOTES
-- ============================================================================
-- After running this migration:
-- 1. Review the imported players in the admin panel
-- 2. Add squad numbers and positions manually
-- 3. Mark sold/loaned players as inactive
-- 4. Add any missing squad members
-- ============================================================================
