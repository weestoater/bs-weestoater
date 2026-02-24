# Football Database - Complete Technical Guide

This guide provides comprehensive technical documentation for the football database structure, from schema design to admin interface implementation.

## Table of Contents

1. [Database Schema](#database-schema)
2. [Service Layer](#service-layer)
3. [Migration Script](#migration-script)
4. [Frontend Integration](#frontend-integration)
5. [Admin Interface](#admin-interface)
6. [API Reference](#api-reference)
7. [Security & RLS](#security--rls)
8. [Performance Optimization](#performance-optimization)
9. [Troubleshooting](#troubleshooting)

---

## Database Schema

### Overview

The football database uses a relational structure with 5 main tables and 4 helper views for common queries.

### Table: `football_seasons`

Stores metadata about football seasons.

```sql
CREATE TABLE football_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL UNIQUE,  -- e.g., "2024-25"
  display_name TEXT NOT NULL,      -- e.g., "2024-25"
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**

- `idx_football_seasons_season_id` on `season_id`
- `idx_football_seasons_active` on `is_active`

### Table: `football_matches`

Stores individual match data.

```sql
CREATE TABLE football_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL REFERENCES football_seasons(season_id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  opposition TEXT NOT NULL,
  venue TEXT NOT NULL CHECK (venue IN ('Home', 'Away')),
  goals_scored INTEGER,
  goals_conceded INTEGER,
  league TEXT,
  video_url TEXT,
  iplayer_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**

- `idx_football_matches_season` on `season_id`
- `idx_football_matches_date` on `match_date DESC`
- `idx_football_matches_season_date` on `(season_id, match_date DESC)`

**Constraints:**

- Venue must be "Home" or "Away"
- CASCADE delete when season is deleted

### Table: `football_match_goals`

Stores goals scored in matches.

```sql
CREATE TABLE football_match_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES football_matches(id) ON DELETE CASCADE,
  player TEXT NOT NULL,
  minute TEXT NOT NULL,  -- TEXT to support "90+3", "59 (Pen)", etc.
  assist TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**

- `idx_football_match_goals_match` on `match_id`
- `idx_football_match_goals_player` on `player`

**Why minute is TEXT:**

- Supports extra time: "90+3"
- Supports annotations: "59 (Pen)", "67 (OG)"
- More flexible for real-world data

### Table: `football_match_cards`

Stores yellow/red cards shown in matches.

```sql
CREATE TABLE football_match_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES football_matches(id) ON DELETE CASCADE,
  player TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('yellow', 'red')),
  minute INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**

- `idx_football_match_cards_match` on `match_id`
- `idx_football_match_cards_player` on `player`

### Table: `football_season_stats`

Stores aggregated season statistics (denormalized for performance).

```sql
CREATE TABLE football_season_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id TEXT NOT NULL REFERENCES football_seasons(season_id) ON DELETE CASCADE,
  player TEXT NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, player)
);
```

**Indexes:**

- `idx_football_season_stats_season` on `season_id`
- `idx_football_season_stats_goals` on `goals DESC`

**Purpose:**

- Pre-aggregated statistics for fast queries
- Updated via migration or admin interface
- UNIQUE constraint prevents duplicate player records per season

### Views

#### `football_matches_detailed`

```sql
CREATE VIEW football_matches_detailed
WITH (security_invoker = true) AS
SELECT
  m.*,
  COALESCE(json_agg(DISTINCT jsonb_build_object(
    'id', g.id, 'player', g.player,
    'minute', g.minute, 'assist', g.assist
  )) FILTER (WHERE g.id IS NOT NULL), '[]'::json) as goals,
  COALESCE(json_agg(DISTINCT jsonb_build_object(
    'id', c.id, 'player', c.player,
    'card_type', c.card_type, 'minute', c.minute
  )) FILTER (WHERE c.id IS NOT NULL), '[]'::json) as cards
FROM football_matches m
LEFT JOIN football_match_goals g ON m.id = g.match_id
LEFT JOIN football_match_cards c ON m.id = c.match_id
GROUP BY m.id, ...;
```

**Purpose:** Single query to fetch matches with nested goals/cards as JSON arrays.

#### `football_season_summary`

```sql
CREATE VIEW football_season_summary
WITH (security_invoker = true) AS
SELECT
  s.season_id, s.display_name,
  COUNT(m.id) as total_matches,
  SUM(CASE WHEN m.goals_scored > m.goals_conceded THEN 1 ELSE 0 END) as wins,
  SUM(CASE WHEN m.goals_scored = m.goals_conceded THEN 1 ELSE 0 END) as draws,
  SUM(CASE WHEN m.goals_scored < m.goals_conceded THEN 1 ELSE 0 END) as losses,
  SUM(m.goals_scored) as total_goals_scored,
  SUM(m.goals_conceded) as total_goals_conceded
FROM football_seasons s
LEFT JOIN football_matches m ON s.season_id = m.season_id
GROUP BY s.season_id, s.display_name, ...;
```

**Purpose:** Quick season overview with W/D/L records.

#### `football_recent_matches`

```sql
CREATE VIEW football_recent_matches
WITH (security_invoker = true) AS
SELECT * FROM football_matches_detailed
ORDER BY match_date DESC LIMIT 10;
```

**Purpose:** Homepage/dashboard showing latest matches.

#### `football_all_time_scorers`

```sql
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
```

**Purpose:** Historical top scorers across all seasons.

---

## Service Layer

The database service provides a clean API for all CRUD operations.

**Location:** `backend/supabase/database.js`

### Core Functions

#### Season Management

```javascript
// Get all seasons (newest first)
async function getFootballSeasons(options = {})
// options: { includeInactive: boolean }

// Get single season by ID
async function getFootballSeasonById(seasonId)

// Create new season
async function createFootballSeason(seasonData)

// Update season
async function updateFootballSeason(seasonId, seasonData)

// Delete season (CASCADE deletes matches)
async function deleteFootballSeason(seasonId)
```

#### Match Management

```javascript
// Get all matches for a season
async function getFootballMatches(seasonId, options = {})
// options: { detailed: boolean } - Include goals/cards

// Get single match by ID
async function getFootballMatchById(matchId, options = {})
// options: { includeGoals: boolean, includeCards: boolean }

// Create new match
async function createFootballMatch(matchData)

// Update match
async function updateFootballMatch(matchId, matchData)

// Delete match (CASCADE deletes goals/cards)
async function deleteFootballMatch(matchId)
```

#### Goals Management

```javascript
// Get all goals for a match
async function getFootballMatchGoals(matchId)

// Create goal
async function createFootballMatchGoal(goalData)

// Update goal
async function updateFootballMatchGoal(goalId, goalData)

// Delete goal
async function deleteFootballMatchGoal(goalId)
```

#### Cards Management

```javascript
// Get all cards for a match
async function getFootballMatchCards(matchId)

// Create card
async function createFootballMatchCard(cardData)

// Update card
async function updateFootballMatchCard(cardId, cardData)

// Delete card
async function deleteFootballMatchCard(cardId)
```

#### Season Stats

```javascript
// Get top scorers for a season
async function getFootballSeasonStats(seasonId)

// Upsert player stats (create or update)
async function upsertFootballSeasonStats(statsData)

// Delete player stats
async function deleteFootballSeasonStats(seasonId, player)
```

#### Bulk Operations

```javascript
// Bulk insert for migrations
async function bulkInsertFootballData(bulkData)
// bulkData: { seasons, matches, goals, cards, stats }

// Get complete season (matches + stats)
async function getFootballSeasonComplete(seasonId)
```

### Usage Example

```javascript
import { getSupabaseClient } from "./backend/index.js";
import { createDatabaseService } from "./backend/supabase/database.js";

const supabase = getSupabaseClient();
const db = createDatabaseService(supabase);

// Fetch complete season data
const seasonData = await db.getFootballSeasonComplete("2024-25");

console.log(seasonData.matches.length); // Number of matches
console.log(seasonData.topScorers); // Top scorers array
```

---

## Migration Script

**Location:** `backend/supabase/migrate-football.js`

### How It Works

1. **Load Season Configurations**
   - 6 seasons from 2020-21 to 2025-26
   - Active season flag

2. **Create Seasons First**
   - Bulk insert with upsert (handle re-runs)

3. **Process Each Season**
   - Load JSON files (`{season}-matches.json`, `{season}-goals.json`)
   - Insert matches
   - Map inserted matches by date+opposition
   - Insert goals/cards using match IDs
   - Insert season statistics

4. **Error Handling**
   - Validates service role key
   - Continues on individual season failures
   - Detailed logging

### Key Features

- **Idempotent:** Can be run multiple times safely (seasons use upsert)
- **Service Role:** Bypasses RLS policies during migration
- **Data Mapping:** Handles JSON structure differences gracefully
- **Comprehensive Logging:** Shows progress for each season

### Running the Migration

```bash
# Set up environment
export SUPABASE_SERVICE_ROLE_KEY=your-key

# Run migration
node backend/supabase/migrate-football.js
```

**Expected time:** 30-60 seconds for 6 seasons (~200 matches)

---

## Frontend Integration

### Updated Pages

#### Football.tsx (Current Season)

**Location:** `src/pages/Football.tsx`

**Changes:**

- Removed static JSON imports
- Added database fetch with `useEffect`
- Loading state with skeleton loader
- Error handling
- Data transformation to match component interface

```typescript
const seasonData = await db.getFootballSeasonComplete("2025-26");

// Transform to match expected format
const matches = seasonData.matches.map((match) => ({
  date: match.match_date,
  opposition: match.opposition,
  // ... transform other fields
  goals: match.goals.map((g) => ({ player: g.player, mins: g.minute })),
  cards: match.cards.map((c) => ({ player: c.player, type: c.card_type })),
}));
```

#### SeasonPage.tsx (Historical Seasons)

**Location:** `src/pages/SeasonPage.tsx`

**Changes:**

- Replaced dynamic JSON imports with database fetch
- Same transformation logic as Football.tsx
- Maintains URL routing (`/season/:seasonId`)

### Component Compatibility

The `FootballSeasonResults` component accepts data in the format:

```typescript
interface SeasonMatchData {
  season: string;
  matches: Match[];
}

interface SeasonGoalsData {
  season: string;
  topScorers: GoalScorer[];
}
```

Frontend transformation ensures database results match this interface.

---

## Admin Interface

**Location:** `src/pages/admin/FootballManager.tsx`

### Features

1. **Season Selector**
   - Dropdown showing all seasons
   - Active season highlighted
   - Auto-loads matches on change

2. **Match Management**
   - Add/Edit form with validation
   - Delete with confirmation
   - All match fields (date, opposition, venue, scores, videos, notes)

3. **Goals Management Modal**
   - Inline add form
   - List of all goals for a match
   - Delete individual goals
   - Supports minute formats ("90+3", "45 (Pen)")

4. **Cards Management Modal**
   - Inline add form
   - Yellow/Red card selector
   - Minute input (number)
   - Delete individual cards

5. **Responsive Design**
   - Bootstrap 5 styling
   - Table view for matches
   - Modal dialogs for goals/cards
   - Mobile-friendly buttons

### User Flow

```
Admin Dashboard
  ↓
Click "Manage Matches"
  ↓
Select Season
  ↓
[Add Match] or [Edit Match]
  ↓
[Manage Goals] → Add/Delete Goals
  ↓
[Manage Cards] → Add/Delete Cards
```

### Validation

- **Match Date:** Required, date input
- **Opposition:** Required, text
- **Venue:** Required, Home/Away select
- **Scores:** Optional, numeric (for future/ongoing matches)
- **Goals/Cards:** Only when match exists

### Accessibility

- All buttons have aria-labels
- Keyboard navigation supported
- Screen reader compatible
- High contrast colors

---

## API Reference

### Data Types (TypeScript)

```typescript
interface FootballSeason {
  id: string;
  season_id: string;
  display_name: string;
  start_year: number;
  end_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FootballMatch {
  id: string;
  season_id: string;
  match_date: string;
  opposition: string;
  venue: string;
  goals_scored: number | null;
  goals_conceded: number | null;
  league: string | null;
  video_url: string | null;
  iplayer_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface FootballMatchGoal {
  id: string;
  match_id: string;
  player: string;
  minute: string;
  assist: string | null;
  created_at: string;
}

interface FootballMatchCard {
  id: string;
  match_id: string;
  player: string;
  card_type: string;
  minute: number;
  created_at: string;
}

interface FootballSeasonStats {
  id: string;
  season_id: string;
  player: string;
  goals: number;
  assists: number;
  created_at: string;
  updated_at: string;
}
```

### Response Formats

All API functions return Promises that resolve to:

- Single object: `Promise<Type | null>`
- Array: `Promise<Type[]>`
- Void: `Promise<void>`

Errors throw exceptions (use try/catch).

---

## Security & RLS

### Row Level Security (RLS)

All tables have RLS enabled with these policies:

**Public Read Access:**

```sql
CREATE POLICY "Enable read access for all users"
ON football_matches FOR SELECT USING (true);
```

**Authenticated Write Access:**

```sql
CREATE POLICY "Enable insert for authenticated users"
ON football_matches FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

### Service Role

Migration script requires service role key to bypass RLS:

```javascript
const supabase = createSupabaseClient({
  url: SUPABASE_URL,
  anonKey: SERVICE_ROLE_KEY, // Bypasses RLS
});
```

⚠️ **Never expose service role key in frontend code!**

### View Security

All views use `WITH (security_invoker = true)` to respect RLS policies:

```sql
CREATE VIEW football_matches_detailed
WITH (security_invoker = true) AS ...
```

This ensures views don't bypass RLS when accessed by users.

---

## Performance Optimization

### Indexes

Strategic indexes improve query performance:

1. **Season Lookups:** `idx_football_matches_season`
2. **Date Sorting:** `idx_football_matches_date DESC`
3. **Combined Queries:** `idx_football_matches_season_date`
4. **Player Stats:** `idx_football_match_goals_player`

### Denormalization

`football_season_stats` is denormalized for fast top scorer queries:

- Pre-calculated totals
- Avoids complex aggregations on large datasets
- Updated during migration or via admin interface

### Pagination (Future Enhancement)

For large datasets, consider adding pagination:

```javascript
// Example pagination
async function getFootballMatches(seasonId, options = {}) {
  const { limit = 50, offset = 0 } = options;

  return supabaseClient
    .from("football_matches")
    .select("*")
    .eq("season_id", seasonId)
    .order("match_date", { ascending: false })
    .range(offset, offset + limit - 1);
}
```

### Caching (Future Enhancement)

Consider React Query or SWR for client-side caching:

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["football", seasonId],
  queryFn: () => db.getFootballSeasonComplete(seasonId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## Troubleshooting

### Issue: Migration fails with RLS error

**Symptom:**

```
Error: new row violates row-level security policy
```

**Solution:**

1. Set `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`
2. Find it in: Supabase Dashboard → Project Settings → API → `service_role` key
3. Restart migration script

### Issue: No data showing in frontend

**Symptom:** Empty matches list, or "No matches found"

**Possible Causes:**

1. Migration hasn't run
2. Wrong season ID
3. RLS blocking reads

**Solutions:**

1. Run migration: `node backend/supabase/migrate-football.js`
2. Check season IDs in database match frontend config
3. Verify RLS policies allow public SELECT

### Issue: Views have security warnings

**Symptom:** Supabase Dashboard shows "View is defined with the SECURITY DEFINER property"

**Solution:**

1. Open Supabase SQL Editor
2. Run `backend/supabase/fix-slimming-world-views.sql`
3. This fixes ALL views (football, slimming world, daily steps, garmin)

### Issue: Admin interface won't save

**Symptom:** Form submission fails silently or shows error

**Possible Causes:**

1. Not authenticated
2. RLS blocking writes
3. Validation errors

**Solutions:**

1. Ensure logged in via `/admin/login`
2. Check RLS policies allow authenticated INSERT/UPDATE
3. Check browser console for error messages
4. Verify all required fields are filled

### Issue: Frontend shows TypeScript errors

**Symptom:** Import errors or type mismatches

**Solution:**

1. Ensure TypeScript definitions are up to date in `backend/index.d.ts`
2. Restart TypeScript server in VS Code
3. Run `npm run build` to verify types

---

## Future Enhancements

### Planned Features

1. **Player Management**
   - Dedicated `football_players` table
   - Foreign keys from goals/cards
   - Player profiles and stats

2. **Advanced Statistics**
   - Possession percentage
   - Shots on target
   - Pass completion
   - Historical form

3. **Match Reports**
   - Rich text editor for detailed match commentary
   - Image uploads
   - Video embedding

4. **Data Visualization**
   - Charts for goals over time
   - League position tracker
   - Player performance graphs

5. **API Endpoints**
   - REST API for external consumption
   - GraphQL support
   - Webhooks for match updates

### Contributing

When extending the football database:

1. Update schema file (`football-schema.sql`)
2. Add service functions to `database.js`
3. Update TypeScript types in `index.d.ts`
4. Document changes in this guide
5. Update migration script if needed

---

## Resources

- **Schema File:** [backend/supabase/football-schema.sql](../backend/supabase/football-schema.sql)
- **Migration Script:** [backend/supabase/migrate-football.js](../backend/supabase/migrate-football.js)
- **Service Layer:** [backend/supabase/database.js](../backend/supabase/database.js)
- **Admin Interface:** [src/pages/admin/FootballManager.tsx](../src/pages/admin/FootballManager.tsx)
- **Quick Start:** [FOOTBALL_QUICKSTART.md](../FOOTBALL_QUICKSTART.md)
- **Backend README:** [backend/supabase/README.md](../backend/supabase/README.md)

---

**End of Technical Guide** 🏴󠁧󠁢󠁳󠁣󠁴󠁿⚽
