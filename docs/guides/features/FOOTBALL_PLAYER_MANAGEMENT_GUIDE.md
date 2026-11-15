# Football Player Management Migration Guide

## Overview

This guide explains how to set up the new football player management system.

## Database Migration

### Step 1: Run the SQL Migration

Run the SQL migration file to create the `football_players` table:

```bash
# Connect to your Supabase project and run:
psql postgresql://[your-connection-string]
\i backend/supabase/add-football-players-table.sql
```

**Or via Supabase Dashboard:**

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the contents of `backend/supabase/add-football-players-table.sql`
4. Click "Run"

### What the Migration Does:

- ✅ Creates the `football_players` table
- ✅ Sets up proper indexes for performance
- ✅ Configures Row Level Security (RLS) policies
- ✅ Imports existing players from match goals and cards
- ✅ Adds auto-update timestamp triggers

## Using the Player Management System

### Access the Player Manager:

1. Log in to the admin panel (`/admin`)
2. Navigate to **Football Manager**
3. Select the season you want to manage
4. Click **"Manage Players"**

### Adding New Players:

1. In the Player Management modal, fill in:
   - **Player Name** (required)
   - **Squad Number** (optional)
   - **Position** (Goalkeeper, Defender, Midfielder, Forward)
   - **Notes** (e.g., "On loan from X", "Signed from Y")
   - **Status** (Active/Inactive toggle)
2. Click **"Add Player"**

### Editing Players:

1. Click the pencil icon next to a player
2. Modify the details
3. Click **"Update Player"**

### Managing Player Status:

- **Mark as Inactive**: Click the warning icon (⚠️) to mark sold/loaned players as inactive
- **Mark as Active**: Click the check icon (✓) to reactivate a player
- **Delete**: Click the trash icon to permanently remove a player

### Benefits:

✅ **Pre-populated dropdown**: When adding goals/assists/cards, player names auto-complete from the active squad  
✅ **Squad tracking**: Keep track of who's currently in the squad vs. who left  
✅ **Organization**: Squad numbers and positions for better organization  
✅ **Notes**: Track transfers, loans, and other important information

## Features

### Player List Filtering:

- Only **active players** appear in the autocomplete dropdown when adding match events
- All players (active + inactive) visible in the player management interface

### Data Integration:

- The migration automatically imports existing players from:
  - Players who scored goals
  - Players who provided assists
  - Players who received cards
- You can then add squad numbers, positions, and mark inactive players

### Season-Specific:

- Each season has its own player list
- Players must be added per season
- Useful for tracking squad changes year-over-year

## Troubleshooting

### Players not appearing in dropdown:

- Check that players are marked as **Active**
- Ensure the player is associated with the selected season
- Try refreshing the player list

### Migration fails:

- Ensure you're connected to the correct database
- Check that the `football_matches`, `football_match_goals`, and `football_match_cards` tables exist
- Verify you have proper permissions

### Duplicate player errors:

- The system prevents duplicate player names within the same season
- If you get a conflict error, the player already exists for that season

## Future Enhancements

Planned features:

- Player statistics dashboard
- Import squad from external sources
- Player photos/images
- Career stats across multiple seasons
- Transfer history tracking
