# Strava Migration: Quick Start Guide

## 🚀 Before You Begin

**Prerequisites:**
- [ ] Strava API credentials (client ID, secret, redirect URI)
- [ ] Access to both weegym and bs-weestoater repos
- [ ] Supabase credentials for bs-weestoater
- [ ] Reviewed the full migration plan (STRAVA_MIGRATION_PLAN.md)
- [ ] Discussed branch strategy (BRANCHING_STRATEGY.md)

---

## 📋 Quick Overview

**What you're doing**: Moving Strava activity tracking from weegym to bs-weestoater

**Why**: Consolidate all fitness data in one central app (bs-weestoater)

**Complexity**: Medium (3-4 weeks, straightforward requirements)

**Architecture**: Service-based (TypeScript service layer + React components)

---

## 🛠️ Phase 1: Setup (Start Here!)

### Step 1: Create Setup Branch
```bash
cd /Users/ian/git/bs-weestoater
git checkout main
git pull origin main
git checkout -b feature/strava-setup
git push -u origin feature/strava-setup
```

### Step 2: Investigate weegym Strava Implementation

**What to examine in weegym:**
```bash
# Core service
cat /Users/ian/git/weegym/src/services/stravaService.js | head -200

# UI pages
ls -la /Users/ian/git/weegym/src/pages/ | grep -i strava

# Components
ls -la /Users/ian/git/weegym/src/components/ | grep -i strava

# Database schema (if Supabase)
# Check weegym's README or SETUP docs for table structure

# Environment variables
cat /Users/ian/git/weegym/.env | grep -i strava
```

### Step 3: Prepare bs-weestoater Environment

**Add to `.env` in bs-weestoater:**
```bash
# Strava OAuth Configuration
VITE_STRAVA_CLIENT_ID=<your_client_id>
VITE_STRAVA_CLIENT_SECRET=<your_client_secret>
VITE_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback
# Set to production URL for Netlify deployment
# VITE_STRAVA_REDIRECT_URI=https://your-domain.com/strava/callback
```

**Update `.env.example`:**
```
VITE_STRAVA_CLIENT_ID=your_strava_client_id_here
VITE_STRAVA_CLIENT_SECRET=your_strava_client_secret_here
VITE_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback
```

### Step 4: Database Schema Setup

**Copy weegym's Strava tables to bs-weestoater Supabase:**

Using Supabase Studio or SQL:
```sql
-- Strava app configuration (store OAuth credentials)
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

-- User Strava tokens
CREATE TABLE IF NOT EXISTS strava_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  athlete_id BIGINT NOT NULL,
  scope TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Strava activities
CREATE TABLE IF NOT EXISTS strava_activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strava_activity_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  distance DECIMAL,
  moving_time INTEGER,
  elapsed_time INTEGER,
  total_elevation_gain DECIMAL,
  type TEXT,
  sport_type TEXT,
  start_date TIMESTAMP,
  start_date_local TIMESTAMP,
  timezone TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  achievement_count INTEGER DEFAULT 0,
  kudos_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  photo_count INTEGER DEFAULT 0,
  trainer BOOLEAN DEFAULT FALSE,
  commute BOOLEAN DEFAULT FALSE,
  manual BOOLEAN DEFAULT FALSE,
  private BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  average_speed DECIMAL,
  max_speed DECIMAL,
  average_cadence DECIMAL,
  average_watts DECIMAL,
  max_watts DECIMAL,
  average_heartrate DECIMAL,
  max_heartrate DECIMAL,
  calories DECIMAL,
  polyline TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, strava_activity_id)
);

-- Personal records
CREATE TABLE IF NOT EXISTS strava_personal_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id BIGINT NOT NULL REFERENCES strava_activities(id) ON DELETE CASCADE,
  segment_id BIGINT,
  pr_type TEXT,
  record_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Athlete stats
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

-- Add indexes for better performance
CREATE INDEX idx_strava_activities_user_id ON strava_activities(user_id);
CREATE INDEX idx_strava_activities_start_date ON strava_activities(start_date DESC);
CREATE INDEX idx_strava_tokens_user_id ON strava_tokens(user_id);
CREATE INDEX idx_strava_personal_records_user_id ON strava_personal_records(user_id);
```

### Step 5: Create Initial Documentation

**Create `/docs/STRAVA_SETUP.md`:**
```markdown
# Strava Setup Guide

## Environment Variables Required

VITE_STRAVA_CLIENT_ID=<your_client_id>
VITE_STRAVA_CLIENT_SECRET=<your_client_secret>
VITE_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback

## Getting Strava API Credentials

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Copy Client ID, Client Secret
4. Set redirect URI to `http://localhost:3000/strava/callback`

## Database Tables

See SQL schema in this guide...
```

### Step 6: Commit and Create PR

```bash
git add .env.example docs/STRAVA_SETUP.md
git commit -m "chore(strava): setup environment and database schema for migration

- Add Strava OAuth environment variables
- Define Supabase schema for Strava data
- Document setup process"

git push origin feature/strava-setup

# Create PR on GitHub
# Title: Setup - Strava migration infrastructure
# Description: Links to migration plan, Phase 1 checklist
```

---

## ⏭️ Next Phases (After Phase 1 Merges)

### Phase 2: Service Layer
```bash
git checkout -b feature/strava-service-layer
# Create src/interfaces/strava.ts
# Create src/services/stravaService.ts (port from weegym)
# Create src/utils/stravaUtils.ts
```

### Phase 3: Authentication
```bash
git checkout -b feature/strava-auth-flow
# Create StravaConnect, StravaCallback pages
# Implement OAuth flow
# Create useStravaAuth hook
```

### Phase 4: Components & UI
```bash
git checkout -b feature/strava-components
# Create activity display components
# Create analytics pages
# Update routing
```

### Phase 5: Testing
```bash
git checkout -b feature/strava-testing
# Write unit tests for service
# Write component tests
# Write E2E tests
# Verify a11y compliance
```

### Phase 6: Documentation
```bash
git checkout -b feature/strava-docs
# Write user guide
# Write developer guide
# Final deployment checklist
```

---

## 📊 Architecture Overview

```
bs-weestoater/
├── src/
│   ├── interfaces/strava.ts          ← Type definitions
│   ├── services/stravaService.ts     ← API & data logic
│   ├── utils/stravaUtils.ts          ← Helpers
│   ├── hooks/
│   │   ├── useStravaAuth.ts          ← Auth state
│   │   └── useStravaActivities.ts    ← Activity data
│   ├── components/
│   │   ├── StravaActivityCard.tsx
│   │   ├── StravaActivityList.tsx
│   │   ├── StravaActivityMap.tsx
│   │   ├── StravaStatsSummary.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── StravaConnect.tsx         ← OAuth prompt
│   │   ├── StravaCallback.tsx        ← OAuth callback
│   │   ├── StravaActivities.tsx      ← Main browse view
│   │   ├── StravaAnalytics.tsx       ← Dashboard
│   │   └── StravaRecords.tsx         ← PRs
│   └── __tests__/strava/...          ← Tests
├── docs/
│   ├── STRAVA_INTEGRATION_GUIDE.md   ← For developers
│   ├── STRAVA_USER_GUIDE.md          ← For users
│   └── STRAVA_SETUP.md               ← Setup instructions
```

---

## ✅ Verification Checklist

After each phase, verify:

- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run build` completes successfully
- [ ] `npm run test` passes with >80% coverage
- [ ] `npm run test:e2e` passes for new features
- [ ] No TypeScript errors in strict mode
- [ ] A11y compliance check passes
- [ ] Git history is clean (no merge commits)

---

## 🆘 Troubleshooting

### Strava API Issues
- Check credentials in `.env`
- Verify redirect URI matches Strava app settings
- Monitor Strava API status page
- Use Strava API docs: https://developers.strava.com/

### Database Issues
- Ensure Supabase project is active
- Check table permissions (public read/write for initial testing)
- Use Supabase Studio to inspect data
- Check migration status

### TypeScript/Build Issues
- Clear `node_modules` and `dist`: `rm -rf node_modules dist`
- Reinstall: `npm install`
- Check TypeScript: `npx tsc --noEmit`

### Authentication Issues
- Verify tokens are stored correctly in Supabase
- Check token expiration and refresh logic
- Monitor OAuth callback URL
- Test with `curl` to Strava API directly

---

## 🎯 Success Looks Like

✅ User connects their Strava account via OAuth  
✅ Activities display in bs-weestoater  
✅ Analytics show correct statistics  
✅ New activities sync automatically  
✅ Personal records tracked  
✅ Activity maps display correctly  
✅ All tests pass  
✅ A11y compliance verified  
✅ Documentation complete  
✅ Deployment successful  

---

## 📞 Key Resources

- **Full Migration Plan**: STRAVA_MIGRATION_PLAN.md
- **Branching Strategy**: BRANCHING_STRATEGY.md
- **Strava API Docs**: https://developers.strava.com/
- **Supabase Docs**: https://supabase.com/docs
- **weegym Reference**: /Users/ian/git/weegym (for implementation examples)

---

**Next Step**: Create `feature/strava-setup` branch and complete Phase 1 setup tasks
