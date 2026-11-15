# Strava Export Guide

This guide explains how to export Strava activities from weegym and import them into weestoater as articles.

## Overview

The export script (`scripts/export-strava-from-weegym.js`) connects to weegym's Supabase database, fetches all Strava activities, and generates SQL INSERT statements formatted for weestoater's `articles` table.

Each activity becomes a **Strava article** with:
- **Title**: The activity name (e.g., "Morning Run", "Weekend Bike Ride")
- **Category**: `Strava`
- **Content**: Formatted HTML with activity stats (distance, duration, elevation, heart rate, etc.)
- **Excerpt**: Quick summary (e.g., "12.5km in 45min +150m")
- **Icon**: Activity-specific icon (bike, runner, swimmer, etc.)
- **Reading Time**: Auto-calculated from distance/duration
- **Published Date**: The activity start date
- **Tags**: Activity type (Run, Ride, Walk, etc.)

## Prerequisites

- weegym Supabase URL and anonymous key (from weegym `.env`)
- weestoater Supabase URL and service role key (for Supabase SQL editor)
- Strava activities already synced in weegym's `strava_activities` table

## Step 1: Populate weegym with Strava Activities

If weegym's `strava_activities` table is empty:

1. Go to weegym admin dashboard
2. Connect your Strava account (OAuth flow)
3. Activities sync automatically from your Strava profile

Alternatively, test-import activities via the weegym Strava sync script.

## Step 2: Generate Export SQL

A pre-converted SQL file is available at `scripts/data/strava-articles-import.sql` with 133 Strava activities ready to import.

### To generate fresh exports:

```bash
cd /Users/ian/git/bs-weestoater
node scripts/export-strava-from-weegym.js > strava-articles.sql
```

This creates a file with INSERT statements for all activities. Example output:

```sql
-- Export: Strava Activities (weegym) → Articles (weestoater)
-- Generated: 2026-11-15T14:03:05.885854
-- Total records: 133

INSERT INTO articles (
  id, title, slug, category, content, excerpt, icon,
  published_date, reading_time, tags, published, featured, author, order_index
) VALUES (
  'strava-2026-11-15-morning-run',
  'Morning Run',
  'strava-2026-11-15-morning-run',
  'Strava',
  '<h3>Morning Run</h3><p><strong>Date:</strong> 2026-11-15 06:30:00</p><p><strong>Type:</strong> Run</p><p><strong>Distance:</strong> 5.20 km</p><p><strong>Duration:</strong> 28 minutes</p><p><strong>Average Speed:</strong> 11.14 km/h</p></p><p><strong>Elevation Gain:</strong> 45m</p><p><strong>Average Heart Rate:</strong> 165 bpm</p><p><strong>Max Heart Rate:</strong> 178 bpm</p><p><strong>Calories:</strong> 456</p>',
  '5.2km in 28min +45m',
  'bi-person-running',
  '2026-11-15',
  3,
  '["Run"]',
  true,
  false,
  'Strava Import',
  0
) ON CONFLICT(id) DO NOTHING;
```

## Step 3: Import into weestoater

Copy the SQL and paste into weestoater's Supabase SQL Editor:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your weestoater project
3. Open **SQL Editor**
4. Click **New Query**
5. Paste the contents of `scripts/data/strava-articles-import.sql`
6. Click **Run**

All 133 activities are now imported as articles and available on the `/strava` page.

## Alternative: Manual Bulk Insert

If you prefer not to use the script, you can export from weegym's Supabase SQL Editor:

```sql
SELECT * FROM strava_activities ORDER BY start_date DESC LIMIT 100;
```

Then manually craft INSERT statements for weestoater, or contact support for bulk import assistance.

## Notes

- Existing articles are skipped (using `ON CONFLICT(id) DO NOTHING`)
- Only published activities are imported
- All articles are marked as "published"
- Author is set to "Strava Import"
- No featured articles are created (set to false)
- Reading time is estimated from distance and duration

## Troubleshooting

**"No Strava activities found"**
- Verify weegym has Strava activities synced
- Check weegym `.env` has valid Supabase credentials
- Verify RLS policies allow anonymous read access to `strava_activities`

**SQL Import Fails**
- Check for duplicate IDs (same activity exported twice)
- Verify article schema matches (all required columns present)
- Check data types match table schema

**Articles not showing on `/strava`**
- Verify category is exactly `"Strava"` (case-sensitive)
- Confirm `published = true`
- Check publish_at is NULL or in the past

## See Also

- [Strava Integration in weegym](https://github.com/weestoater/weegym/docs/strava_integration_plan.md)
- [weestoater Articles Management](/admin/articles)
- [Strava Page](/strava)
