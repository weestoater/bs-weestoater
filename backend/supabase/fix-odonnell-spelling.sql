-- ============================================================================
-- Fix Stephen O'Donnell spelling (O'Donel -> O'Donnell)
-- ============================================================================
-- Updates all instances of misspelled name across football tables

-- Update goals table (player who scored)
UPDATE football_match_goals
SET player = 'Stephen O''Donnell'
WHERE player ILIKE 'Stephen O''Donel';

-- Update goals table (player who assisted)
UPDATE football_match_goals
SET assist = 'Stephen O''Donnell'
WHERE assist ILIKE 'Stephen O''Donel';

-- Update cards table
UPDATE football_match_cards
SET player = 'Stephen O''Donnell'
WHERE player ILIKE 'Stephen O''Donel';

-- Update season stats table
UPDATE football_season_stats
SET player = 'Stephen O''Donnell'
WHERE player ILIKE 'Stephen O''Donel';

-- Show the updated records to verify
SELECT 'Goals scored' as table_name, COUNT(*) as records_updated
FROM football_match_goals
WHERE player = 'Stephen O''Donnell'
UNION ALL
SELECT 'Goals assisted' as table_name, COUNT(*) as records_updated
FROM football_match_goals
WHERE assist = 'Stephen O''Donnell'
UNION ALL
SELECT 'Cards' as table_name, COUNT(*) as records_updated
FROM football_match_cards
WHERE player = 'Stephen O''Donnell'
UNION ALL
SELECT 'Season stats' as table_name, COUNT(*) as records_updated
FROM football_season_stats
WHERE player = 'Stephen O''Donnell';
