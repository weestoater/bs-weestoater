# Strava Integration Setup Guide

Complete setup instructions for Strava OAuth and database configuration.

---

## 1. Environment Variables

### Development Setup

Add to `.env` (⚠️ DO NOT COMMIT THIS FILE):

```bash
# Strava OAuth Configuration
# Get these from https://www.strava.com/settings/api (see section 2)
VITE_STRAVA_CLIENT_ID=your_client_id_here
VITE_STRAVA_CLIENT_SECRET=your_client_secret_here
VITE_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback
```

⚠️ **SECURITY**: These credentials should NEVER be committed to git. They go in `.env` which is in `.gitignore`.

### Production Setup

Update redirect URI in `.env` for production:

```bash
VITE_STRAVA_REDIRECT_URI=https://your-production-domain.com/strava/callback
```

Then update the same URL in [Strava API Settings](https://www.strava.com/settings/api):
1. Go to https://www.strava.com/settings/api
2. Edit your application
3. Set "Authorization Callback Domain" to your production domain
4. Save changes

---

## 2. Strava API Credentials

### Getting Your Credentials

If you don't have Strava API credentials yet:

1. Go to [Strava Settings → API](https://www.strava.com/settings/api)
2. Click "Create an Application"
3. Fill in the form:
   - **Application Name**: bs-weestoater
   - **Category**: Fitness
   - **City**: (your location)
   - **Country**: (your country)
   - **Website**: https://github.com/weestoater/bs-weestoater
   - **Application Description**: Personal fitness data aggregator
4. Accept terms and create
5. Copy your:
   - **Client ID** → `VITE_STRAVA_CLIENT_ID`
   - **Client Secret** → `VITE_STRAVA_CLIENT_SECRET`

### Authorize Your App

1. Strava OAuth will trigger on first use
2. You'll be redirected to authorize the app
3. Grant permissions:
   - Read athlete data (public)
   - Read activity data
   - Access activities (public & private)

---

## 3. Database Schema

### Create Strava Tables in Supabase

Connect to your Supabase project and run this SQL in the SQL Editor:

```sql
-- Strava App Configuration
CREATE TABLE IF NOT EXISTS strava_app_configs (
  id BIGSERIAL PRIMARY KEY,
  app_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Strava Tokens
CREATE TABLE IF NOT EXISTS strava_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  athlete_id BIGINT NOT NULL UNIQUE,
  scope TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Strava Activities
CREATE TABLE IF NOT EXISTS strava_activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strava_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Time & Location
  start_date TIMESTAMP NOT NULL,
  start_date_local TIMESTAMP,
  timezone TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  
  -- Performance Metrics (meters, seconds, etc)
  distance DECIMAL,
  moving_time INTEGER,
  elapsed_time INTEGER,
  total_elevation_gain DECIMAL,
  average_speed DECIMAL,
  max_speed DECIMAL,
  average_cadence DECIMAL,
  average_watts DECIMAL,
  max_watts DECIMAL,
  average_heartrate DECIMAL,
  max_heartrate DECIMAL,
  calories DECIMAL,
  
  -- Activity Type
  type TEXT,
  sport_type TEXT,
  workout_type INTEGER,
  
  -- Engagement
  kudos_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  achievement_count INTEGER DEFAULT 0,
  photo_count INTEGER DEFAULT 0,
  
  -- Flags
  trainer BOOLEAN DEFAULT FALSE,
  commute BOOLEAN DEFAULT FALSE,
  manual BOOLEAN DEFAULT FALSE,
  private BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  
  -- Map Data
  polyline TEXT,
  map_id TEXT,
  summary_polyline TEXT,
  
  -- Migration Tracking
  migrated_from_weegym BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, strava_id)
);

-- Personal Records
CREATE TABLE IF NOT EXISTS strava_personal_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id BIGINT NOT NULL REFERENCES strava_activities(id) ON DELETE CASCADE,
  segment_id BIGINT,
  pr_type TEXT,
  record_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Athlete Stats
CREATE TABLE IF NOT EXISTS strava_athlete_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_activities INTEGER DEFAULT 0,
  total_distance DECIMAL DEFAULT 0,
  total_moving_time INTEGER DEFAULT 0,
  total_elevation_gain DECIMAL DEFAULT 0,
  last_synced TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Performance Indexes
CREATE INDEX idx_strava_activities_user_id ON strava_activities(user_id);
CREATE INDEX idx_strava_activities_date ON strava_activities(user_id, start_date DESC);
CREATE INDEX idx_strava_activities_type ON strava_activities(user_id, type);
CREATE INDEX idx_strava_activities_migrated ON strava_activities(migrated_from_weegym);
CREATE INDEX idx_strava_tokens_user ON strava_tokens(user_id);
CREATE INDEX idx_strava_prs_user ON strava_personal_records(user_id);
```

### Verify Tables Created

In Supabase Studio:
1. Go to your project
2. Click "Table Editor"
3. Verify these tables exist:
   - `strava_app_configs`
   - `strava_tokens`
   - `strava_activities`
   - `strava_personal_records`
   - `strava_athlete_stats`

---

## 4. Configuration Verification

### Verify Environment Variables

```bash
# Check that Strava env vars are set
grep STRAVA .env

# Output should show (with YOUR actual values):
# VITE_STRAVA_CLIENT_ID=your_client_id
# VITE_STRAVA_CLIENT_SECRET=your_client_secret
# VITE_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback

# ⚠️ NEVER paste actual credentials into code or documentation!
```

### Verify Database Connection

Test with the Supabase CLI:
```bash
supabase status
```

Or in browser:
1. Go to Supabase Studio
2. Click SQL Editor
3. Run: `SELECT * FROM strava_activities LIMIT 1;`
4. Should return empty result (no data yet - that's expected)

---

## 5. Next Steps

Once setup is complete:

1. ✅ Environment variables configured
2. ✅ Database schema created
3. ✅ `.env.example` updated

**Phase 2** will implement:
- TypeScript service layer
- OAuth flow
- Activity sync from Strava API
- Historical data import from weegym

---

## 🆘 Troubleshooting

### Issue: "Cannot find module @supabase/supabase-js"

```bash
npm install @supabase/supabase-js
```

### Issue: Strava API returns 401 Unauthorized

- Verify `VITE_STRAVA_CLIENT_ID` and `VITE_STRAVA_CLIENT_SECRET` are correct
- Check they're from the same Strava app
- Verify `VITE_STRAVA_REDIRECT_URI` matches Strava app settings exactly

### Issue: Database tables don't exist

- Verify Supabase URL and keys are correct
- Run SQL in Supabase Studio's SQL Editor (not from CLI)
- Check table permissions (should be readable by authenticated users)

### Issue: "Redirect URI mismatch"

- The URI in your code must exactly match Strava app settings
- Include protocol: `http://` or `https://`
- Include port if development: `http://localhost:3000`
- No trailing slashes

---

## 📚 Resources

- **Strava API Docs**: https://developers.strava.com/docs/
- **Strava API Settings**: https://www.strava.com/settings/api
- **Supabase Docs**: https://supabase.com/docs/
- **OAuth 2.0 Flow**: https://oauth.net/2/

---

**Status**: Phase 1 setup complete ✅  
**Next**: Phase 2 - Service Layer & Historical Data Import
