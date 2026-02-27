# Football Database - Quick Start Guide

This guide helps you migrate Motherwell FC match data from JSON files to your Supabase database and start managing it through the admin interface.

## Prerequisites

- Node.js installed
- Supabase project set up
- Environment variables configured in `backend/.env`:

  ```env
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ```

  ⚠️ **The service role key is REQUIRED for migration!**

  Find it in: **Supabase Dashboard → Project Settings → API → `service_role` key (secret)**

## Step 1: Create Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the contents of `backend/supabase/football-schema.sql`
4. Paste into the SQL Editor
5. Click **Run**

This creates:

- ✅ 5 tables (seasons, matches, goals, cards, stats)
- ✅ 4 helper views (detailed matches, season summary, recent matches, all-time scorers)
- ✅ RLS policies (public read, authenticated write)
- ✅ Indexes for performance

## Step 2: Run Migration Script

The migration script will import all your existing JSON data (6 seasons, hundreds of matches) into the database:

```bash
node backend/supabase/migrate-football.js
```

**Expected output:**

```
🏴 Football Data Migration Starting...
==================================================

📅 Step 1: Creating seasons...
✅ Created 6 seasons

📊 Step 2: Migrating match data...

📅 Migrating season: 2025-26
  📊 Found 38 matches
  💾 Inserting 38 matches...
  ✅ Inserted 38 matches
  💾 Inserting 83 goals...
  ✅ Inserted 83 goals
  💾 Inserting 47 cards...
  ✅ Inserted 47 cards
  💾 Inserting 25 season stats...
  ✅ Inserted 25 season stats
  ✅ Season 2025-26 migration complete!

[... repeats for all 6 seasons ...]

==================================================

🎉 Migration completed successfully!
```

## Step 3: Fix View Security Warnings (Optional but Recommended)

If you see warnings in Supabase Dashboard about views:

1. Open **SQL Editor** in Supabase
2. Copy contents of `backend/supabase/fix-slimming-world-views.sql`  
   _(This file now fixes ALL database views, not just Slimming World)_
3. Paste and **Run**
4. Warnings resolved! ✅

## Step 4: Use the Admin Interface

1. Start your dev server:

   ```bash
   npm run dev
   ```

2. Navigate to `/#/admin/login`
3. Sign in with your Supabase credentials
4. Click **"Manage Matches"** on the admin dashboard
5. You can now:
   - ✅ Add new matches
   - ✅ Edit existing matches
   - ✅ Manage goals for each match
   - ✅ Manage cards for each match
   - ✅ Delete matches
   - ✅ Switch between seasons

## Database Structure

### Tables

**football_seasons**

- season_id (e.g., "2024-25")
- display_name, start_year, end_year
- is_active (current season flag)

**football_matches**

- season_id (FK)
- match_date, opposition, venue
- goals_scored, goals_conceded
- league, video_url, iplayer_url, notes

**football_match_goals**

- match_id (FK)
- player, minute, assist

**football_match_cards**

- match_id (FK)
- player, card_type, minute

**football_season_stats**

- season_id (FK)
- player, goals, assists

### Helper Views

- `football_matches_detailed` - Matches with goals/cards as JSON
- `football_season_summary` - Win/draw/loss records per season
- `football_recent_matches` - Last 10 matches
- `football_all_time_scorers` - Top scorers across all seasons

## Frontend Changes

The frontend has been updated to fetch from the database:

- **[src/pages/Football.tsx](src/pages/Football.tsx)** - Current season page
- **[src/pages/SeasonPage.tsx](src/pages/SeasonPage.tsx)** - Historical seasons page

Both now use `getFootballSeasonComplete()` from the database service to fetch match data with goals and cards included.

## API Usage Examples

```javascript
import { getSupabaseClient } from "../backend/index.js";
import { createDatabaseService } from "../backend/supabase/database.js";

const supabase = getSupabaseClient();
const db = createDatabaseService(supabase);

// Get all seasons
const seasons = await db.getFootballSeasons();

// Get complete season data (matches + stats)
const seasonData = await db.getFootballSeasonComplete("2024-25");

// Get matches for a season (with goals/cards)
const matches = await db.getFootballMatches("2024-25", { detailed: true });

// Get season statistics (top scorers)
const stats = await db.getFootballSeasonStats("2024-25");

// Create a new match
const newMatch = await db.createFootballMatch({
  season_id: "2024-25",
  match_date: "2024-08-03",
  opposition: "Ross County",
  venue: "Home",
  goals_scored: 3,
  goals_conceded: 1,
  league: "SPFL Premiership",
  notes: "Great performance!",
});

// Add goals to a match
await db.createFootballMatchGoal({
  match_id: newMatch.id,
  player: "Lennon Miller",
  minute: "45",
  assist: "Tom Sparrow",
});

// Add cards
await db.createFootballMatchCard({
  match_id: newMatch.id,
  player: "Stephen O'Donnell",
  card_type: "yellow",
  minute: 67,
});
```

## Troubleshooting

### Migration fails with RLS error

**Problem:** "new row violates row-level security policy"

**Solution:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `backend/.env`

### No data showing in admin interface

**Problem:** Tables are empty

**Solution:** Run the migration script: `node backend/supabase/migrate-football.js`

### Views have security warnings

**Problem:** "View is defined with the SECURITY DEFINER property"

**Solution:** Run `backend/supabase/fix-slimming-world-views.sql` in Supabase SQL Editor

### Frontend shows loading forever

**Problem:** Database connection or permissions issue

**Solution:**

1. Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
2. Verify RLS policies are enabled (public SELECT access)
3. Check browser console for errors

## Next Steps

✅ All match data is now in the database  
✅ Admin interface is ready to use  
✅ Frontend displays data from database

**Recommended:**

- Back up your database regularly
- Keep the JSON files as a backup
- Use the admin interface to add new match results
- Update season stats after significant matches

## Need More Help?

- 📖 [Backend Supabase README](backend/supabase/README.md)
- 🌐 [Supabase Documentation](https://supabase.com/docs)
- 📧 Check the project GitHub issues

---

**That's it!** You now have a fully functional football database with admin management. 🏴⚽
