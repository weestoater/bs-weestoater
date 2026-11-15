# Phase 1: Setup - Completion Checklist

**Timeline**: 5 days  
**Status**: 🚀 IN PROGRESS  
**Branch**: `feature/strava-setup`  

---

## ✅ Phase 1 Tasks

### Environment Setup
- [x] Create `.env.example` with Strava variables
- [x] Add Strava credentials to `.env` (NOT committed to git):
  - [x] `VITE_STRAVA_CLIENT_ID=your_client_id_here`
  - [x] `VITE_STRAVA_CLIENT_SECRET=your_client_secret_here`
  - [x] `VITE_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback`

⚠️ **SECURITY**: Real credentials go in `.env` which is in `.gitignore`. Never commit credentials to git.

### Database Schema
- [ ] Create Supabase tables (manual via Supabase Studio)
  - [ ] `strava_app_configs`
  - [ ] `strava_tokens`
  - [ ] `strava_activities`
  - [ ] `strava_personal_records`
  - [ ] `strava_athlete_stats`
- [ ] Create indexes for performance
- [ ] Verify all tables created in Supabase

### Documentation
- [x] Create `docs/STRAVA_SETUP.md` with:
  - [x] Environment variables guide
  - [x] API credentials instructions
  - [x] Database schema SQL
  - [x] Verification steps
  - [x] Troubleshooting guide

### Git & PR
- [x] Commit Phase 1 changes to `feature/strava-setup`
- [x] Push to remote
- [ ] Create Pull Request with:
  - [ ] Link to migration plan
  - [ ] Phase 1 checklist
  - [ ] Testing instructions

---

## 🔧 Manual Supabase Setup

### Step 1: Copy Schema SQL

The database schema SQL is ready in: `/tmp/strava-schema.sql`

Or view here:
```sql
-- Run this in Supabase Studio → SQL Editor
CREATE TABLE IF NOT EXISTS strava_app_configs (...)
CREATE TABLE IF NOT EXISTS strava_tokens (...)
CREATE TABLE IF NOT EXISTS strava_activities (...)
CREATE TABLE IF NOT EXISTS strava_personal_records (...)
CREATE TABLE IF NOT EXISTS strava_athlete_stats (...)
CREATE INDEX idx_strava_activities_user_id ON strava_activities(user_id);
-- ... (see STRAVA_SETUP.md for full SQL)
```

### Step 2: Run in Supabase Studio

1. Open [Supabase Studio](https://app.supabase.com)
2. Select your `bs-weestoater` project
3. Click "SQL Editor"
4. Click "New Query"
5. Paste the SQL from `docs/STRAVA_SETUP.md`
6. Click "Run"

### Step 3: Verify Tables

1. Go to "Table Editor"
2. Verify these tables exist:
   - `strava_app_configs`
   - `strava_tokens`
   - `strava_activities`
   - `strava_personal_records`
   - `strava_athlete_stats`

---

## ✅ Phase 1 Success Criteria

All must be complete:

- [x] Environment variables added to `.env` and `.env.example`
- [x] Strava OAuth credentials configured
- [ ] Supabase tables created (manual step)
- [ ] Documentation complete
- [ ] Git commit pushed
- [ ] PR created and approved

---

## 🚀 Next: Phase 2

When Phase 1 is complete, start Phase 2: Service Layer & Historical Data

```bash
git checkout -b feature/strava-service-layer
# Implement stravaService.ts, migrate historical data
```

See: `docs/CUSTOMIZED_MIGRATION_ROADMAP.md` for Phase 2 details

---

## 📝 Notes

- Supabase schema must be created manually via Supabase Studio (no CLI migration scripts yet)
- All 5 tables are required before Phase 2 begins
- Indexes are critical for performance with 1000+ activities
- Do NOT skip the manual verification step

---

**Created**: November 15, 2026  
**Phase**: 1 of 6  
**Assignee**: You  
**Blocked By**: Nothing  
**Blocks**: Phase 2
