# Supabase Database Schemas

This folder contains all database schema files and utilities for the BS WeeStaater Supabase backend.

## Schema Files

### Core Content

- **`schema.sql`** - Main schema for books and articles tables

### Slimming World

- **`slimming-world-schema.sql`** - Weight tracking tables and views
  - Tables: `slimming_world_profiles`, `slimming_world_entries`
  - Views: `slimming_world_latest_entries`, `slimming_world_profile_stats`

### Daily Steps

- **`daily-steps-schema.sql`** - Daily step tracking
  - Table: `daily_steps`
  - Views: `daily_steps_summary`, `daily_steps_recent_30`, `daily_steps_weekly_totals`

### Garmin Activities

- **`garmin-activities-schema.sql`** - Garmin Connect activity tracking (current)
- **`garmin-activities-schema-clean.sql`** - Clean version without test data
- **`garmin-activities-add-gps.sql`** - Migration to add GPS data columns
  - Table: `garmin_activities`
  - Views: `garmin_activity_summary`, `garmin_recent_activities`, `garmin_monthly_totals`

### Storage

- **`storage-setup.sql`** - Storage buckets and policies for media files

### Migrations

- **`migration-scheduled-publishing.sql`** - Adds scheduled publishing to articles
- **`migrate-garmin-activities.js`** - Migrates JSON data to database
- **`migrate-slimming-world.js`** - Migrates Slimming World JSON data to database

## Fix Scripts

### **`fix-slimming-world-views.sql`** - IMPORTANT!

Fixes SECURITY DEFINER warnings for **ALL database views** (not just Slimming World).

**When to use:**

- You see "View is defined with the SECURITY DEFINER property" warnings in Supabase Dashboard
- After initially creating any of the schemas above

**What it fixes:**

- ✅ All Slimming World views
- ✅ All Daily Steps views
- ✅ All Garmin Activities views

**How to use:**

1. Copy the entire contents of `fix-slimming-world-views.sql`
2. Paste into Supabase SQL Editor
3. Run the script
4. All warnings should be resolved

## Common Issues

### 1. "View is defined with the SECURITY DEFINER property"

**Problem:** Views created with default settings may use SECURITY DEFINER, which bypasses Row Level Security.

**Solution:** Run `fix-slimming-world-views.sql` in Supabase SQL Editor

### 2. "Row-level security policy violation" during migration

**Problem:** Migration scripts need elevated permissions to bypass RLS.

**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file. Find it in:

- Supabase Dashboard → Project Settings → API → `service_role` key (secret)

### 3. "Table not found" errors

**Problem:** Trying to access tables before schemas are created.

**Solution:** Run the appropriate schema file first:

```bash
# In Supabase SQL Editor
backend/supabase/schema.sql                    # For books/articles
backend/supabase/slimming-world-schema.sql     # For Slimming World
backend/supabase/daily-steps-schema.sql        # For Daily Steps
backend/supabase/garmin-activities-schema.sql  # For Garmin Activities
```

### 4. Duplicate entries or constraint violations

**Problem:** Trying to insert data that already exists.

**Solution:**

- For migrations: The scripts handle this automatically (upsert)
- For manual inserts: Check unique constraints (dates, IDs, etc.)

## Setup Order

For a new Supabase project, run in this order:

1. **Core content** (required):

   ```sql
   backend/supabase/schema.sql
   ```

2. **Optional features** (as needed):

   ```sql
   backend/supabase/slimming-world-schema.sql
   backend/supabase/daily-steps-schema.sql
   backend/supabase/garmin-activities-schema.sql
   ```

3. **Fix views** (important!):

   ```sql
   backend/supabase/fix-slimming-world-views.sql
   ```

4. **Run migrations** (if you have existing data):
   ```bash
   node backend/supabase/migrate-slimming-world.js
   node backend/supabase/migrate-garmin-activities.js
   ```

## Database Service

The JavaScript files provide programmatic access to the database:

- **`client.js`** - Supabase client factory
- **`config.js`** - Configuration management
- **`database.js`** - Main database service (books, articles, slimming world)
- **`dailyStepsDatabase.js`** - Daily steps service
- **`garminActivitiesDatabase.js`** - Garmin activities service

Import from the main backend module:

```javascript
import { getSupabaseClient, createDatabaseService } from "./backend/index.js";

const supabase = getSupabaseClient();
const db = createDatabaseService(supabase);

// Use database service methods
const books = await db.getBooks();
const profile = await db.getSlimmingWorldProfileByUserId("default");
```

## Environment Variables

Required in `.env`:

```env
# Frontend (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend/Scripts (optional, uses VITE_ vars if not set)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Migrations only (REQUIRED for migrations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

⚠️ **Never commit the service role key to git!**

## Security

All tables have Row Level Security (RLS) enabled:

**Public access:**

- ✅ Read published content
- ✅ Read weight tracking data
- ✅ Read activities data

**Authenticated users only:**

- ✅ Create/Update/Delete any content
- ✅ Admin operations

**Service role bypasses all RLS** - use only in secure server environments.

## Maintenance

### Backup Data

```javascript
// Export data programmatically
const data = await db.getSlimmingWorldProfileWithEntries("default");
await fs.writeFile("backup.json", JSON.stringify(data, null, 2));
```

### View Database Stats

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check view definitions
SELECT table_name, view_definition
FROM information_schema.views
WHERE table_schema = 'public';
```

## Need Help?

- 📖 [Slimming World Database Guide](../../docs/SLIMMING_WORLD_DATABASE_GUIDE.md)
- 📖 [Slimming World Quick Start](../../SLIMMING_WORLD_QUICKSTART.md)
- 📖 [Garmin Activities Guide](../../docs/garmin-activities-guide.md)
- 🌐 [Supabase Documentation](https://supabase.com/docs)
