# 💾 Garmin Activities CMS Integration Guide

This guide explains how to use Supabase as your CMS for Garmin activity data instead of JSON files.

## 🎯 Benefits

✅ **Better Data Management** - Edit activities through SQL or admin interface  
✅ **Real-time Updates** - No need to rebuild/redeploy  
✅ **Scalability** - Handle thousands of activities efficiently  
✅ **Query Flexibility** - Filter, sort, and aggregate data easily  
✅ **Backup & Security** - Automatic backups and RLS policies

## 📋 Prerequisites

- Supabase account and project
- Supabase credentials in `.env` file:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

## 🚀 Setup Steps

### Step 1: Create Database Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `backend/supabase/garmin-activities-schema.sql`
5. Paste and run the SQL script
6. Verify the table was created in **Table Editor**

**What this creates:**

- `garmin_activities` table with all activity fields
- Indexes for fast queries
- Row Level Security (RLS) policies
- Helper views for summaries and statistics
- Automatic timestamp triggers

### Step 2: Migrate Existing Data

If you have existing activities in `src/data/garminActivities.json`:

```bash
cd backend
npm run migrate-garmin
```

This will:

- Load your existing JSON data
- Import all activities into Supabase
- Show migration summary

**Expected Output:**

```
🏃 Garmin Activities Migration to Supabase
==========================================

📂 Loading activities from: src/data/garminActivities.json
✅ Loaded 7 activities from JSON

🔌 Connecting to Supabase...
✅ Connected to Supabase

📥 Upserting 7 activities to Supabase...
✅ Successfully upserted 7 activities

📊 Database Summary:
   Total Activities: 7
   Total Distance: 9.48 miles
   ...

✅ Migration completed successfully!
```

### Step 3: Test the Integration

1. Start your dev server: `npm run dev`
2. Navigate to the Slimming World page
3. Your activities should now load from Supabase!

**Fallback Behavior:**

- If Supabase is not configured, the app falls back to JSON data
- No errors if Supabase is unavailable
- Seamless development experience

### Step 4: Sync New Activities

When syncing new activities from Garmin Connect:

```bash
node scripts/sync-garmin-activities.js
```

The script will ask: **"Sync to Supabase database? (y/N):"**

- Answer **y** to sync to both JSON and Supabase
- Answer **N** to sync only to JSON

**Automatic Mode:**
The script detects Supabase credentials and enables database sync automatically.

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# Garmin Connect
GARMIN_USERNAME=your@email.com
GARMIN_PASSWORD=yourpassword

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyXxXxXx...
```

### Frontend Hook

The frontend uses `useGarminActivities()` hook:

```tsx
import { useGarminActivities } from "../hooks/useGarminActivities";

function MyComponent() {
  const { activities, loading, error, refetch } = useGarminActivities({
    limit: 50,
    fallbackData: jsonData, // Optional: fallback if Supabase unavailable
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ActivityList activities={activities} />;
}
```

## 📊 Database Schema

### Table: `garmin_activities`

| Column               | Type        | Description                                                |
| -------------------- | ----------- | ---------------------------------------------------------- |
| `id`                 | TEXT        | Primary key, unique activity ID                            |
| `date`               | TIMESTAMPTZ | Activity date and time                                     |
| `type`               | TEXT        | Activity type (running, cycling, walking, swimming, other) |
| `distance`           | DECIMAL     | Distance in miles                                          |
| `duration`           | INTEGER     | Duration in seconds                                        |
| `calories`           | INTEGER     | Calories burned (optional)                                 |
| `average_heart_rate` | INTEGER     | Average HR (optional)                                      |
| `max_heart_rate`     | INTEGER     | Max HR (optional)                                          |
| `average_pace`       | DECIMAL     | Pace in minutes per mile (optional)                        |
| `elevation`          | INTEGER     | Elevation gain in feet (optional)                          |
| `steps`              | INTEGER     | Step count (optional)                                      |
| `notes`              | TEXT        | Activity notes (optional)                                  |
| `created_at`         | TIMESTAMPTZ | Record creation time                                       |
| `updated_at`         | TIMESTAMPTZ | Last update time (auto-updated)                            |

### Views

#### `garmin_activity_summary`

Summary statistics by activity type:

```sql
SELECT * FROM garmin_activity_summary;
```

#### `garmin_recent_activities`

Activities from the last 30 days:

```sql
SELECT * FROM garmin_recent_activities;
```

#### `garmin_monthly_totals`

Monthly aggregated totals:

```sql
SELECT * FROM garmin_monthly_totals;
```

## 🔒 Security

### Row Level Security (RLS)

**Read Access:**

- ✅ Public read access (anyone can view activities)
- Perfect for sharing your fitness journey

**Write Access:**

- 🔐 Only authenticated users can insert/update/delete
- Protects your data from unauthorized changes

### Modify RLS Policies

To restrict read access (make activities private):

```sql
-- Drop existing read policy
DROP POLICY IF EXISTS "Activities are publicly readable" ON garmin_activities;

-- Create authenticated-only read policy
CREATE POLICY "Only authenticated users can read activities"
  ON garmin_activities FOR SELECT
  USING (auth.role() = 'authenticated');
```

## 📝 Usage Examples

### Query Activities

**Recent activities:**

```sql
SELECT * FROM garmin_activities
ORDER BY date DESC
LIMIT 10;
```

**Activities by type:**

```sql
SELECT * FROM garmin_activities
WHERE type = 'running'
ORDER BY date DESC;
```

**Activities with high heart rate:**

```sql
SELECT * FROM garmin_activities
WHERE average_heart_rate > 140
ORDER BY average_heart_rate DESC;
```

**Monthly distance totals:**

```sql
SELECT
  DATE_TRUNC('month', date) as month,
  SUM(distance) as total_distance,
  COUNT(*) as activity_count
FROM garmin_activities
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;
```

### JavaScript API

```typescript
import { createSupabaseClient } from "./backend/supabase/client";
import { createGarminActivitiesService } from "./backend/supabase/garminActivitiesDatabase";

const supabase = createSupabaseClient({ url, anonKey });
const garminService = createGarminActivitiesService(supabase);

// Get all activities
const activities = await garminService.getActivities({ limit: 50 });

// Get activities by type
const runs = await garminService.getActivities({
  type: "running",
  limit: 20,
});

// Get activities in date range
const recent = await garminService.getActivities({
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-02-01"),
});

// Get statistics
const stats = await garminService.getTotalStatistics();
console.log(`Total distance: ${stats.totalDistance} miles`);

// Create new activity
await garminService.createActivity({
  id: "unique-id",
  date: new Date().toISOString(),
  type: "running",
  distance: 5.2,
  duration: 1800,
  calories: 450,
});

// Update activity
await garminService.updateActivity("activity-id", {
  notes: "Great run!",
  calories: 475,
});

// Delete activity
await garminService.deleteActivity("activity-id");
```

## 🎨 Admin Interface

### Option 1: Supabase Table Editor

1. Go to Supabase Dashboard → **Table Editor**
2. Select `garmin_activities` table
3. View, edit, add, or delete activities
4. Changes reflect immediately on your website

### Option 2: Custom Admin Panel (Future)

Create a custom admin interface in your app:

- Add, edit, delete activities
- Bulk import from CSV
- Activity statistics dashboard
- Integration with Garmin API

## 🐛 Troubleshooting

### Activities Not Showing

**Problem:** Website shows no activities

**Solutions:**

1. Check Supabase credentials in `.env`
2. Verify table exists: Run schema SQL
3. Check browser console for errors
4. Verify RLS policies allow public read
5. Check fallback JSON data is present

### Migration Errors

**Problem:** Migration script fails

**Solutions:**

1. Ensure table is created (run schema SQL first)
2. Check Supabase credentials
3. Verify JSON file exists and is valid
4. Check network connection
5. Review error message details

### Sync Not Saving to Database

**Problem:** Sync completes but data not in Supabase

**Solutions:**

1. Verify you answered "y" to Supabase sync prompt
2. Check Supabase credentials in `.env`
3. Verify RLS policies allow authenticated write
4. Review sync script output for errors
5. Check Supabase dashboard logs

### Hook Not Loading Data

**Problem:** `useGarminActivities` returns empty array

**Solutions:**

1. Check if Supabase is configured in `.env`
2. Verify table has data (check Supabase dashboard)
3. Check browser console for errors
4. Test with fallback data
5. Try refetching: `refetch()`

## 🔄 Migration Workflow

### From JSON to Supabase

1. **Backup** your JSON file
2. **Run schema** SQL in Supabase
3. **Migrate data** using migration script
4. **Test** the frontend loads correctly
5. **Sync new data** to Supabase
6. **(Optional)** Remove JSON file after confirming

### Keeping Both

You can keep both JSON and Supabase:

- JSON as backup/fallback
- Supabase as primary source
- Sync script updates both

Benefits:

- ✅ Redundancy
- ✅ Local development without internet
- ✅ Easy rollback

## 📈 Next Steps

### Enhance Your CMS

1. **Add More Fields**
   - Weather conditions
   - Training zones
   - Equipment used
   - Route maps

2. **Create Analytics**
   - Weekly/monthly trends
   - Personal records
   - Training insights
   - Goal tracking

3. **Build Admin Interface**
   - Activity editor
   - Bulk operations
   - CSV import/export
   - Activity calendar

4. **Integrate with Other Data**
   - Correlate with weight loss
   - Link to nutrition data
   - Training plans
   - Race results

### Automate Syncing

Set up automated syncing:

- GitHub Actions workflow
- Cron job
- Serverless function
- Continuous sync service

See [Garmin Auto-Sync Guide](./GARMIN_AUTO_SYNC_GUIDE.md) for details.

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Garmin Auto-Sync Guide](./GARMIN_AUTO_SYNC_GUIDE.md)
- [Garmin Activities Guide](./garmin-activities-guide.md)
- [Backend README](../backend/README.md)

## 🎉 Success!

You now have a full CMS for your Garmin activities!

**What you can do:**

- ✅ Sync activities from Garmin Connect
- ✅ Store in Supabase database
- ✅ Display on your website
- ✅ Edit through SQL or admin panel
- ✅ Query and analyze your data

Happy tracking! 🏃‍♂️💪
