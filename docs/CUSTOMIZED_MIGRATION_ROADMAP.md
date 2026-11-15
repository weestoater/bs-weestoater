# Customized Migration Roadmap
## Based on Your Decisions

**Created**: November 15, 2026  
**Scope**: Full Strava integration with all features, historical data migration, phased deployment

---

## 🎯 Your Decisions Summary

| Decision | Your Choice | Impact |
|----------|-------------|--------|
| Athlete Data | Single (just you) | Simpler schema, faster auth |
| Historical Data | Migrate ALL weegym data | +1-2 weeks, but complete history |
| Features | All 7 (equally important) | Longer phase 4, must sequence carefully |
| Segments | Activities only | Cleaner MVP, can add segments Phase 2 |
| Sync | Manual NOW, Auto-sync LATER | MVP in 3-4 weeks, Phase 2 adds webhooks |
| Mobile Design | Mobile-first | Better UX, slightly more CSS work |
| Deployment | Parallel FIRST, Cutover LATER | Zero risk initially, full migration week 4-5 |

---

## 📊 Updated Timeline

### Phase 1: Setup (5 days)
- Database schema (single athlete, ready for historical data)
- Environment variables & OAuth credentials
- Documentation & setup guide
- **Branch**: `feature/strava-setup`

### Phase 2: Service Layer (9 days)
*+2 days for historical data migration scripts*

- TypeScript interfaces & types
- Port stravaService from weegym
- Historical data migration scripts (import weegym Supabase data)
- Utility functions (formatting, calculations, calorie estimation)
- Token refresh logic
- **Branch**: `feature/strava-service-layer`

### Phase 3: Authentication (5 days)
- OAuth connect/callback pages
- Token storage and refresh
- useStravaAuth hook
- Athlete profile sync
- **Branch**: `feature/strava-auth-flow`

### Phase 4: Components & UI - All Features (12 days)
*+2 days for mobile-first complexity*

**4a. Activity Browsing** (3 days)
- StravaActivityCard (mobile-responsive)
- StravaActivityList with filtering
- Search & sort functionality
- Detail view modal/sidebar

**4b. Analytics Dashboard** (3 days)
- Summary stats (distance, time, elevation, calories)
- Time-range selector (week/month/year/all)
- Activity type breakdown chart
- Trend indicators
- Mobile-first layout

**4c. Activity Maps** (2 days)
- Leaflet map integration
- Polyline route visualization
- Elevation profile (optional enhancement)
- Mobile map controls

**4d. Personal Records** (2 days)
- PR list by category
- Date tracking for records
- Record type badges
- Historical PR data display

**4e. Additional Features** (2 days)
- Kudos tracking display
- Comment sync display
- Activity goal tracking (from Strava)
- Social achievements

- **Branch**: `feature/strava-components-all-features`
- **Mobile-first**: All components built with mobile-first CSS (rem units, responsive breakpoints)

### Phase 5: Testing & QA (8 days)

**5a. Unit Tests** (3 days)
- stravaService tests (OAuth, token refresh, API calls)
- Utility function tests (formatting, calculations)
- Data migration scripts tests
- Mock Strava API responses

**5b. Component Tests** (2 days)
- Activity card/list rendering
- Analytics calculations
- Filter & sort logic
- Modal interactions

**5c. E2E & Integration Tests** (2 days)
- Full OAuth flow (connect → callback → token storage)
- Activity sync from Strava API
- Historical data display
- Analytics calculations on real data

**5d. Accessibility & Mobile** (1 day)
- WCAG 2.2 AA compliance across all components
- Mobile device testing (iOS Safari, Android Chrome)
- Touch interactions & responsive breakpoints
- Screen reader testing

- **Branch**: `feature/strava-testing-comprehensive`
- **Target**: >85% test coverage, zero accessibility violations

### Phase 6: Documentation & Phase A Deployment (5 days)

**6a. Documentation** (2 days)
- Developer integration guide
- User guide (how to connect, view activities, interpret analytics)
- Architecture & design decisions
- API reference for stravaService
- Troubleshooting guide

**6b. Phase A Deployment** (3 days)
- Deploy to staging/preview
- Run full QA on Netlify preview
- Document deployment process
- Create rollback plan
- Brief user testing with parallel weegym
- Deploy to production with weegym still running

- **Branch**: `feature/strava-docs-phase-a`
- **Status**: Weegym + bs-weestoater Strava both available to users

---

## 🔄 Phase A → Phase B Transition (Week 5+)

### Phase B: Auto-Sync & Full Migration (2-3 weeks)

**Phase B.1: Auto-Sync Implementation** (5-7 days)
- Set up Strava webhooks OR polling service
- Implement real-time activity sync
- Add sync status indicators in UI
- Testing auto-sync flow
- **Branch**: `feature/strava-auto-sync`

**Phase B.2: Full Cutover to bs-weestoater** (3-5 days)
- Disable weegym Strava section (or sunset plan)
- Migrate any remaining user preferences
- Final data validation
- Communication to users
- Monitor production closely
- **Branch**: `feature/strava-full-cutover`

---

## 📁 Project Structure

```
src/
├── interfaces/
│   └── strava.ts                    # All type definitions
├── services/
│   └── stravaService.ts             # Core service (ported + enhanced)
├── utils/
│   ├── stravaUtils.ts               # Format functions, calculations
│   └── dataImport/
│       └── migrateWeegymData.ts      # Historical data import scripts
├── hooks/
│   ├── useStravaAuth.ts             # Auth state & token management
│   └── useStravaActivities.ts       # Activity data & filtering
├── components/
│   ├── StravaActivityCard.tsx        # Activity summary (mobile-first)
│   ├── StravaActivityList.tsx        # Activity list with filters
│   ├── StravaActivityDetail.tsx      # Full activity details
│   ├── StravaActivityMap.tsx         # Map with route
│   ├── StravaStatsSummary.tsx        # Key metrics display
│   ├── StravaTypeChart.tsx           # Activity breakdown chart
│   ├── StravaGoalsDisplay.tsx        # Goals & achievements
│   ├── StravaPersonalRecords.tsx     # PR list & tracking
│   └── StravaSyncStatus.tsx          # Sync indicator (Phase B)
├── pages/
│   ├── StravaConnect.tsx             # OAuth authorization page
│   ├── StravaCallback.tsx            # OAuth callback handler
│   ├── StravaActivities.tsx          # Activity browser (main feature)
│   ├── StravaAnalytics.tsx           # Dashboard with all stats
│   ├── StravaRecords.tsx             # Personal records page
│   └── StravaGoals.tsx               # Goals & achievements page (optional)
├── __tests__/
│   └── strava/
│       ├── stravaService.test.ts
│       ├── stravaUtils.test.ts
│       ├── migrateWeegymData.test.ts
│       ├── components/*.test.tsx
│       └── e2e/
│           ├── auth-flow.spec.ts
│           └── data-sync.spec.ts
└── scss/
    └── strava/
        ├── _activity-card.scss       # Mobile-first styles
        ├── _analytics.scss
        ├── _maps.scss
        └── _responsive.scss          # Breakpoint variables

docs/
├── STRAVA_INTEGRATION_GUIDE.md       # Developer docs
├── STRAVA_USER_GUIDE.md              # User documentation
├── STRAVA_SETUP.md                   # Setup instructions
├── STRAVA_MOBILE_DESIGN.md           # Mobile-first approach doc
└── PHASE_B_AUTO_SYNC_PLAN.md         # Auto-sync implementation

scripts/
└── import-weegym-strava-data.js      # Historical data import script
```

---

## 🗄️ Database Schema (Final)

```sql
-- Single athlete design (simpler schema)

CREATE TABLE strava_app_configs (
  id BIGSERIAL PRIMARY KEY,
  app_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE strava_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  athlete_id BIGINT NOT NULL UNIQUE,  -- Single athlete per user
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  scope TEXT[],
  last_synced TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE strava_activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strava_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Location & time
  start_date TIMESTAMP NOT NULL,
  start_date_local TIMESTAMP,
  timezone TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  
  -- Performance metrics
  distance DECIMAL NOT NULL,           -- meters
  moving_time INTEGER NOT NULL,        -- seconds
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
  
  -- Activity metadata
  type TEXT NOT NULL,                  -- Run, Ride, Swim, etc.
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
  
  -- Map data
  polyline TEXT,
  map_id TEXT,
  summary_polyline TEXT,
  
  -- Import metadata
  migrated_from_weegym BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, strava_id),
  INDEX idx_user_date (user_id, start_date DESC)
);

CREATE TABLE strava_personal_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id BIGINT NOT NULL REFERENCES strava_activities(id) ON DELETE CASCADE,
  
  -- PR category
  category TEXT NOT NULL,              -- 'distance_1km', 'elevation_100m', etc.
  pr_type TEXT,
  
  -- Record details
  record_value DECIMAL,
  record_unit TEXT,
  record_date TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, category, pr_type)
);

CREATE TABLE strava_athlete_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All-time stats
  all_time_activities INTEGER DEFAULT 0,
  all_time_distance DECIMAL DEFAULT 0,
  all_time_moving_time INTEGER DEFAULT 0,
  all_time_elevation DECIMAL DEFAULT 0,
  
  -- Year-to-date stats (reset annually)
  ytd_activities INTEGER DEFAULT 0,
  ytd_distance DECIMAL DEFAULT 0,
  ytd_moving_time INTEGER DEFAULT 0,
  ytd_elevation DECIMAL DEFAULT 0,
  
  -- Metrics
  last_synced TIMESTAMP,
  total_calories DECIMAL DEFAULT 0,
  avg_calories_per_activity DECIMAL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX idx_strava_activities_user_date ON strava_activities(user_id, start_date DESC);
CREATE INDEX idx_strava_activities_type ON strava_activities(user_id, type);
CREATE INDEX idx_strava_activities_migrated ON strava_activities(migrated_from_weegym);
CREATE INDEX idx_strava_tokens_user ON strava_tokens(user_id);
CREATE INDEX idx_strava_prs_user_category ON strava_personal_records(user_id, category);
```

---

## 🔄 Historical Data Migration Process

### Before Phase 2 Starts

**Step 1: Prepare weegym data**
```bash
# In weegym Supabase
SELECT * FROM strava_activities WHERE user_id = '<your-user-id>'
ORDER BY start_date DESC;

# Export to JSON
supabase db dump --local > weegym_strava_backup.json
```

**Step 2: Create migration script** (Phase 2, Day 7-9)
```typescript
// src/utils/dataImport/migrateWeegymData.ts
export async function importWeegymStravaData(
  weegymActivities: StravaActivity[],
  targetUserId: string
): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  // Validate & transform data
  // Check for duplicates
  // Insert into bs-weestoater Supabase
  // Recalculate stats
  // Mark as migrated_from_weegym = true
}
```

**Step 3: Run migration** (Phase 6, before Phase A deployment)
- Dry run with sample data
- Validate all activities imported
- Verify stats calculations
- Backup original data

**Step 4: Verify**
- Check activity counts match
- Validate date ranges
- Spot-check specific activities
- Verify photos/polylines preserved

---

## 📱 Mobile-First Design Principles

All components will follow these rules:

1. **Start with mobile viewport** (320px)
2. **Use rem units** (1rem = 16px)
3. **Flexible layouts** (CSS Grid, Flexbox)
4. **Touch-friendly targets** (min 44px tap area)
5. **Progressive enhancement** (works without JS)
6. **Responsive breakpoints**:
   - Mobile: 320px - 767px
   - Tablet: 768px - 1023px
   - Desktop: 1024px+

**Example component structure:**
```typescript
// StravaActivityCard.tsx - mobile-first

// Mobile (320px): Card full-width, stacked layout
// Tablet (768px): Card in 2-column grid
// Desktop (1024px): Card in 3-column grid, additional details
```

---

## 🎯 Feature Sequencing (All 7, Prioritized)

### Phase 4 (12 days) - Priority Order

1. **Activity Browsing** (3 days) - MVP foundation
   - List all activities
   - Filter by type/date
   - Search by name
   - Day 1-2: Components, Day 3: Integration

2. **Analytics Dashboard** (3 days) - Core stats
   - Total distance, time, elevation
   - Time-range filtering
   - Type breakdown chart
   - Day 4-5: Components, Day 6: Integration + charts

3. **Activity Maps** (2 days) - Route visualization
   - Map rendering
   - Polyline route
   - Day 7-8: Components + react-leaflet

4. **Personal Records** (2 days) - Achievement tracking
   - PR list & categories
   - Record dates
   - Day 9-10: Components + logic

5. **Social Features** (1.5 days) - Engagement
   - Kudos display
   - Comments sync
   - Achievement badges
   - Day 11: Components

6. **Goals** (0.5 days) - Strava integration
   - Display Strava goals
   - Progress tracking
   - Day 11-12: If time permits

---

## ✅ Phase A Success Criteria (Week 1-4)

**Before launching Phase A:**

- [ ] ✅ 1000+ weegym activities imported successfully
- [ ] ✅ All 7 features implemented & working
- [ ] ✅ Mobile-first design verified on 3+ devices
- [ ] ✅ >85% test coverage
- [ ] ✅ Zero accessibility violations (WCAG 2.2 AA)
- [ ] ✅ Page load <2s with all activities
- [ ] ✅ OAuth flow tested end-to-end
- [ ] ✅ Historical data displays correctly
- [ ] ✅ All documentation complete
- [ ] ✅ Staging environment green on Netlify

**Launch Phase A:**
- Deploy to production with weegym still running
- Enable for your account first (internal testing)
- Monitor for any issues
- Verify all data synced correctly

---

## 🚀 Phase B Rollout (Week 5+)

### Phase B.1: Auto-Sync (After Phase A is stable, 1 week)
- Implement webhook listeners OR polling service
- Real-time activity sync notification
- Sync status indicator in UI
- Testing on staging

### Phase B.2: Full Cutover (Week 6-7)
- Disable weegym Strava section
- Migrate any remaining user preferences
- Final validation
- Monitor production
- Consider sunset date for weegym (optional)

---

## 🌳 Branch Sequence (Updated)

```
main
├─ feature/strava-setup ─────────┐ (5 days)
│                                 ↓
├─ feature/strava-service-layer ─┐ (9 days with migration)
│                                 ↓
├─ feature/strava-auth-flow ─────┐ (5 days)
│                                 ↓ (parallel)
├─ feature/strava-components ────┐ (12 days, all 7 features)
│                                 ↓
├─ feature/strava-testing ───────┐ (8 days)
│                                 ↓
├─ feature/strava-docs-phase-a ──┐ (5 days)
│                                 ↓
│                        ✨ PHASE A DEPLOYED
│
├─ feature/strava-auto-sync ─────┐ (5-7 days) [Week 5+]
│                                 ↓
└─ feature/strava-full-cutover ──┐ (3-5 days) [Week 6-7]
                                   ↓
                        ✨ PHASE B COMPLETE
```

---

## 📈 Updated Timeline

| Phase | Duration | Critical Path | Start After |
|-------|----------|---|---|
| 1. Setup | 5 days | Yes | Immediately |
| 2. Service+Migration | 9 days | Yes | Phase 1 |
| 3. Auth | 5 days | Yes | Phase 2 |
| 4. All 7 Features | 12 days | Yes | Phase 2 |
| 5. Testing | 8 days | Yes | Phase 4 |
| 6. Docs + A Deploy | 5 days | Yes | Phase 5 |
| **Phase A Live** | — | — | End Week 4 |
| B.1 Auto-Sync | 5-7 days | No | Phase A stable |
| B.2 Full Cutover | 3-5 days | No | B.1 tested |
| **Phase B Complete** | — | — | Week 6-7 |

**Total**: ~4 weeks for Phase A (features complete), then 1-2 weeks for Phase B (auto-sync + cutover)

---

## 🎯 What Makes This Plan Work

1. **Historical data included** - Users won't lose their Strava history
2. **All features in scope** - Analytics, maps, PRs, social all available
3. **Mobile-first** - Great UX on phones where activities matter most
4. **Phased deployment** - Safe initial launch with weegym running
5. **Auto-sync added later** - MVP ships fast, advanced features follow
6. **Full cutover optional** - Can keep both running indefinitely if preferred

---

## 🚦 Ready to Start?

1. **Review this customized roadmap** ✓
2. **Create feature/strava-setup branch**
   ```bash
   cd /Users/ian/git/bs-weestoater
   git checkout -b feature/strava-setup
   git push -u origin feature/strava-setup
   ```
3. **Follow MIGRATION_QUICK_START.md** for Phase 1

**Next Step**: Start Phase 1 setup! 🚀
