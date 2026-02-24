# Slimming World Database Integration Guide

## Overview

This guide explains how to set up and use the Slimming World database integration with Supabase. The integration provides a robust database-backed solution for tracking weight loss progress, replacing the previous JSON file approach.

## Architecture

### Database Tables

1. **`slimming_world_profiles`** - Stores user profile information
   - User ID, start date, start weight, target weight
   - Active status tracking
   - Automatic timestamp management

2. **`slimming_world_entries`** - Stores individual weigh-in records
   - Links to profile via foreign key
   - Entry date, weight, changes, targets
   - Slimmer of the Week (SOTW) awards
   - Optional notes field

### Database Views

1. **`slimming_world_latest_entries`** - Quick access to most recent entry per profile
2. **`slimming_world_profile_stats`** - Aggregate statistics per profile

## Setup Instructions

### Step 1: Run the Database Schema

Execute the schema SQL in your Supabase SQL Editor:

```bash
# File location
backend/supabase/slimming-world-schema.sql
```

This will create:

- Both database tables
- Indexes for performance
- Row Level Security (RLS) policies
- Helper views for statistics
- Auto-update triggers for timestamps

### Step 2: Configure Environment Variables

Ensure your `.env` file has the Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important for Migrations:**

- The `SUPABASE_SERVICE_ROLE_KEY` is **required** for running migrations
- This key bypasses Row Level Security (RLS) policies
- Find it in: Supabase Dashboard → Project Settings → API → `service_role` key (secret)
- ⚠️ **Keep this key secret! Never commit it to git or expose it publicly!**
- This key has full database access and should only be used in secure server environments

### Step 3: Run the Migration Script

Import your existing JSON data into the database:

```bash
node backend/supabase/migrate-slimming-world.js
```

The migration script will:

- ✅ Load data from `src/data/slimmingWorldData.json`
- ✅ Connect to Supabase
- ✅ Create/update profile record
- ✅ Import all weight entries
- ✅ Verify data integrity
- ✅ Display summary statistics

**Migration Output Example:**

```
⚖️  Slimming World Data Migration to Supabase
=============================================

📂 Loading data from: src/data/slimmingWorldData.json
✅ Loaded profile with 45 entries

🔌 Connecting to Supabase...
✅ Connected to Supabase

📝 Creating Slimming World profile...
✅ Created profile: abc-123-uuid

📥 Inserting 45 entries to Supabase...
✅ Successfully inserted 45 entries

📊 Latest Entry:
   Date: 2025-09-09
   Weight: 254 lbs
   Total Lost: 28.5 lbs
```

### Step 4: Verify the Frontend

The SlimmingWorld page has been updated to fetch from the database automatically. Navigate to:

```
/#/slimmingWorld
```

You should see:

- Loading spinner while data fetches
- Weight summary card with current stats
- Interactive weight loss chart
- Complete weight history grid

## Database Service API

### Profile Operations

```javascript
import { getSupabaseClient, createDatabaseService } from "./backend/index.js";

const supabase = getSupabaseClient();
const db = createDatabaseService(supabase);

// Get all profiles
const profiles = await db.getSlimmingWorldProfiles();

// Get specific profile by user ID
const profile = await db.getSlimmingWorldProfileByUserId("default");

// Create new profile
const newProfile = await db.createSlimmingWorldProfile({
  user_id: "user123",
  start_date: "2025-06-10",
  start_weight: 282.5,
  target_weight: 196,
});

// Update profile
await db.updateSlimmingWorldProfile(profileId, {
  target_weight: 190,
});

// Delete profile (cascades to entries)
await db.deleteSlimmingWorldProfile(profileId);
```

### Entry Operations

```javascript
// Get all entries for a profile
const entries = await db.getSlimmingWorldEntries(profileId, {
  orderBy: "entry_date",
  ascending: true,
  limit: 50,
});

// Get latest entry
const latest = await db.getLatestSlimmingWorldEntry(profileId);

// Create new entry
const entry = await db.createSlimmingWorldEntry({
  profile_id: profileId,
  entry_date: "2025-09-16",
  weight: 252.0,
  weight_change: -2.0,
  total_lost: 30.5,
  target_weight: 196,
  slimmer_of_week: 100, // or null
  notes: "Great week!",
});

// Bulk insert entries
const entries = await db.bulkInsertSlimmingWorldEntries([...entryArray]);

// Update entry
await db.updateSlimmingWorldEntry(entryId, {
  weight: 252.5,
  notes: "Updated measurement",
});

// Delete entry
await db.deleteSlimmingWorldEntry(entryId);
```

### Combined Operations

```javascript
// Get profile with all entries in one call
const fullProfile = await db.getSlimmingWorldProfileWithEntries("default");
// Returns: { id, user_id, start_date, start_weight, target_weight, entries: [...] }

// Get profile statistics
const stats = await db.getSlimmingWorldProfileStats("default");
// Returns: { total_entries, last_weigh_in, lowest_weight, max_lost, total_sotw_awards }
```

## Frontend Integration

The `SlimmingWorld.tsx` component automatically:

1. Fetches profile and entries on mount
2. Transforms database format to display format
3. Converts dates from YYYY-MM-DD to DD/MM/YYYY
4. Handles loading and error states
5. Displays data using existing components

### Data Transformation

The component transforms database data:

```typescript
// Database format
{
  entry_date: "2025-09-09",
  weight: 254.0,
  weight_change: -3.5,
  total_lost: 28.5,
  target_weight: 196,
  slimmer_of_week: 100
}

// Display format
{
  date: "09/09/2025",
  weight: 254,
  change: -3.5,
  lost: 28.5,
  target: 196,
  sotw: 100
}
```

## Adding New Weight Entries

### Option 1: Via Database Service (Recommended)

```javascript
import { getSupabaseClient, createDatabaseService } from "./backend/index.js";

const supabase = getSupabaseClient();
const db = createDatabaseService(supabase);

// Get the profile
const profile = await db.getSlimmingWorldProfileByUserId("default");

// Add new entry
await db.createSlimmingWorldEntry({
  profile_id: profile.id,
  entry_date: "2025-09-23", // YYYY-MM-DD format
  weight: 250.0,
  weight_change: -4.0,
  total_lost: 32.5,
  target_weight: 196,
  slimmer_of_week: null, // or 100 if SOTW
  notes: "Excellent progress this week!",
});
```

### Option 2: Direct Supabase Insert

```javascript
const { data, error } = await supabase.from("slimming_world_entries").insert([
  {
    profile_id: "your-profile-uuid",
    entry_date: "2025-09-23",
    weight: 250.0,
    weight_change: -4.0,
    total_lost: 32.5,
    target_weight: 196,
  },
]);
```

### Option 3: Via Supabase Dashboard

1. Navigate to Supabase Dashboard
2. Go to Table Editor
3. Select `slimming_world_entries`
4. Click "Insert row"
5. Fill in the values

## Security

### Row Level Security (RLS)

All tables have RLS enabled:

**Public Access:**

- ✅ Read active profiles
- ✅ Read all entries

**Authenticated Users Only:**

- ✅ Create/Update/Delete profiles
- ✅ Create/Update/Delete entries

### Customizing Security

To restrict to admin users, modify the policies in the schema:

```sql
-- Example: Restrict to admin role
CREATE POLICY "Only admins can insert profiles"
  ON slimming_world_profiles FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );
```

## Data Validation

### Profile Constraints

- `user_id` must be unique per profile
- `start_weight` and `target_weight` must be positive decimals
- `start_date` must be a valid date

### Entry Constraints

- `profile_id` must reference existing profile
- Cannot have duplicate entries for same profile and date
- `entry_date` must be a valid date
- `weight` must be a positive decimal

## Troubleshooting

### Migration Issues

**Problem:** "Row-level security policy violation" error

```bash
❌ Migration failed: new row violates row-level security policy
```

**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file. This key bypasses RLS and is required for migrations. Find it in Supabase Dashboard → Project Settings → API → service_role key.
**Problem:** "Table not found" error

```bash
❌ Error: slimming_world_profiles table not found!
```

**Solution:** Run the schema SQL first in Supabase SQL Editor

**Problem:** "Profile already exists"

```bash
⚠️  Profile already exists. Updating...
```

**Solution:** This is normal - the script updates existing profiles

### Frontend Issues

**Problem:** Loading spinner never stops
**Solution:** Check browser console for errors. Verify:

- Supabase credentials in `.env`
- Migration completed successfully
- Network connectivity

**Problem:** "No Slimming World profile found"
**Solution:** Ensure migration ran successfully and profile exists

### Database Issues

**Problem:** Slow queries
**Solution:** Indexes are created automatically. For custom queries, check query plans

**Problem:** RLS blocking access
**Solution:** Verify policies allow the operation. Use Supabase Dashboard to test

## Maintenance

### Backup Data

```javascript
// Export all data
const profile = await db.getSlimmingWorldProfileWithEntries("default");
await fs.writeFile(
  "backup-slimming-world.json",
  JSON.stringify(profile, null, 2),
);
```

### Archive Old Profiles

```javascript
// Deactivate instead of delete to preserve history
await db.updateSlimmingWorldProfile(profileId, {
  is_active: false,
});
```

## Future Enhancements

Potential improvements:

- 📊 Additional views for trend analysis
- 🎯 Milestone tracking table
- 📸 Progress photo storage integration
- 📈 Weekly/monthly summary calculations
- 👥 Multi-user support with authentication
- 📝 Meal planning integration
- 🏃 Activity correlation with weight changes

## Files Created/Modified

### New Files

- ✅ `backend/supabase/slimming-world-schema.sql` - Database schema
- ✅ `backend/supabase/migrate-slimming-world.js` - Migration script
- ✅ `docs/SLIMMING_WORLD_DATABASE_GUIDE.md` - This guide

### Modified Files

- ✅ `backend/supabase/database.js` - Added Slimming World service functions
- ✅ `src/pages/SlimmingWorld.tsx` - Updated to fetch from database

### Existing Files (Unchanged)

- ℹ️ `src/data/slimmingWorldData.json` - Original data (can be archived)
- ℹ️ `src/components/sw/*` - All components work unchanged
- ℹ️ `src/interfaces/swTypes.ts` - Type definitions unchanged

## Summary

The Slimming World database integration provides:

✅ **Robust Data Storage** - PostgreSQL-backed with ACID guarantees
✅ **Easy Data Management** - Comprehensive API for all operations
✅ **Scalability** - Ready for multi-user scenarios
✅ **Security** - Row Level Security policies
✅ **Performance** - Optimized indexes and views
✅ **Type Safety** - Full TypeScript support
✅ **Backward Compatible** - Existing components work unchanged

Start by running the schema, then the migration, and your Slimming World page will be database-powered!
