# Strava Data Migration Scripts

Scripts for testing Strava credentials and migrating historical data from weegym to bs-weestoater.

## Prerequisites

- Node.js installed
- Both `.env` files configured (weegym and bs-weestoater)
- Supabase projects set up and tables created

## Scripts

### 1. test-strava-credentials.js

Verifies that your Strava OAuth credentials are valid.

**Usage:**
```bash
cd /Users/ian/git/bs-weestoater
NODE_OPTIONS="--require dotenv/config" node scripts/test-strava-credentials.js
```

**What it tests:**
- ✓ Environment variables are present
- ✓ Strava OAuth endpoint is accessible
- ✓ Strava API is reachable
- ✓ Supabase connection is working

**Output:**
```
🎉 Credentials appear to be valid!

Next steps:
1. Visit the OAuth URL (from Test 2) in your browser
2. Authorize the app to access your Strava data
3. You'll be redirected to: http://localhost:3000/strava/callback
```

---

### 2. migrate-strava-data.js

Migrates Strava data from weegym's Supabase to bs-weestoater's Supabase.

**Usage:**

**Dry-run (preview without making changes):**
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/migrate-strava-data.js --dry-run
```

**Count records only (don't import):**
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/migrate-strava-data.js --count-only
```

**Perform actual migration:**
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/migrate-strava-data.js
```

**What it does:**
1. Tests connections to both Supabase projects
2. Counts records in weegym (activities, personal records, connections)
3. Imports all records to bs-weestoater
4. Reports how many records were migrated

**Example output:**
```
✅ Migration Summary:

📊 Activities: 1,247 migrated
📊 Personal Records: 64 migrated
📊 Connections: 1 migrated
✓ Total: 1,312 records migrated successfully
```

---

## Workflow

### Step 1: Verify Credentials
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/test-strava-credentials.js
```

Expected output: `🎉 Credentials appear to be valid!`

### Step 2: Check Current Data
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/migrate-strava-data.js --count-only
```

This tells you how many records exist in weegym and are ready to migrate.

### Step 3: Preview Migration
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/migrate-strava-data.js --dry-run
```

Shows what would be migrated without actually doing it.

### Step 4: Perform Migration
```bash
NODE_OPTIONS="--require dotenv/config" node scripts/migrate-strava-data.js
```

Performs the actual data migration.

---

## Troubleshooting

### "Missing Strava credentials"
- Ensure `.env` file exists in bs-weestoater root
- Verify it contains: `VITE_STRAVA_CLIENT_ID`, `VITE_STRAVA_CLIENT_SECRET`, `VITE_STRAVA_REDIRECT_URI`
- Make sure `.env` is listed in `.gitignore`

### "Could not connect to Supabase"
- Verify Supabase credentials in `.env`
- Ensure Strava tables exist in both projects:
  - `strava_activities`
  - `strava_personal_records`
  - `strava_connections`
- Check that you have read/write permissions

### "Strava API connection failed"
- Verify you have internet connectivity
- Check Strava API status: https://status.strava.com/
- Confirm credentials are correct and not expired

### "No data to migrate"
- This is normal! Weegym might not have any Strava data yet
- You can authorize in the app to fetch fresh activities

---

## Next Steps

After successful credential verification and migration setup:

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Visit Strava settings:**
   Navigate to http://localhost:3000/strava/connect

3. **Authorize with Strava:**
   Click to connect and authorize access to your activities

4. **New activities will sync:**
   Activities will automatically appear in bs-weestoater

---

## References

- Strava API: https://developers.strava.com/
- Supabase CLI: https://supabase.com/docs/reference/cli
- Environment variables: `.env.example` in project root
