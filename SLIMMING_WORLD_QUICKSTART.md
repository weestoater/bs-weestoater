# Slimming World Database - Quick Start

Get your Slimming World data into the database in 3 simple steps!

## Prerequisites

- Supabase account and project set up
- Environment variables configured in `.env`:
  ```env
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

**Important:** The `SUPABASE_SERVICE_ROLE_KEY` is required for migrations. You can find it in:

- Supabase Dashboard → Project Settings → API → `service_role` key (secret)
- ⚠️ **Never commit this key to git or expose it publicly!**

## Quick Start Steps

### 1. Create Database Tables (One-time setup)

Open your Supabase SQL Editor and run:

```bash
backend/supabase/slimming-world-schema.sql
```

This creates the `slimming_world_profiles` and `slimming_world_entries` tables.

### 2. Import Your Data

Run the migration script:

```bash
node backend/supabase/migrate-slimming-world.js
```

This imports all data from `src/data/slimmingWorldData.json` into the database.

### 3. View Your Data

Navigate to your app:

```
http://localhost:5173/#/slimmingWorld
```

The page now loads data from the database automatically!

## That's It!

Your Slimming World data is now database-backed. The page will:

- ✅ Load faster (with loading state)
- ✅ Handle errors gracefully
- ✅ Support future enhancements (multi-user, admin panel, etc.)

## Adding New Entries

You can add new weight entries in several ways:

### Via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Select `slimming_world_entries`
3. Click "Insert row"
4. Fill in your data

### Via Script (create your own)

```javascript
import { getSupabaseClient, createDatabaseService } from "./backend/index.js";

const supabase = getSupabaseClient();
const db = createDatabaseService(supabase);

const profile = await db.getSlimmingWorldProfileByUserId("default");

await db.createSlimmingWorldEntry({
  profile_id: profile.id,
  entry_date: "2025-09-23",
  weight: 250.0,
  weight_change: -4.0,
  total_lost: 32.5,
  target_weight: 196,
});
```

## Need More Details?

See the complete guide: [SLIMMING_WORLD_DATABASE_GUIDE.md](./SLIMMING_WORLD_DATABASE_GUIDE.md)

## Troubleshooting

**Error: "Row-level security policy violation"**
→ Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` (find it in Supabase Dashboard → API settings)

**Error: "Table not found"**
→ Run the schema SQL first (Step 1)

**Error: "No profile found"**
→ Run the migration script (Step 2)

**Blank page or errors**
→ Check browser console and verify environment variables
