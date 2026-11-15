# Strava Integration Migration Plan
## From weegym → bs-weestoater

---

## Executive Summary

Migrating Strava tracking and display from **weegym** to **bs-weestoater** involves:
- **Service Layer**: Adapting `stravaService.js` to TypeScript and integrating with bs-weestoater's architecture
- **Components**: Porting UI components and pages (StravaAnalytics, StravaActivities, StravaConnect, etc.)
- **Database**: Leveraging existing Supabase integration (already present in both projects)
- **Authentication**: Integrating with current Strava OAuth flow
- **Data Models**: Aligning with bs-weestoater's existing interface/type patterns

**Estimated Effort**: 3-4 weeks (depending on feature parity and testing depth)

---

## Branching Strategy Recommendation

### Strategy: **Trunk-Based Development with Feature Branches**

Why this approach:
- ✅ Your repo uses simple `main` branch with occasional feature branches (seen in git history)
- ✅ Works well with CI/CD pipelines (you have GitHub Actions automation setup)
- ✅ Scales for a solo/small team scenario
- ✅ Keeps deployment cadence frequent

### Branch Naming Convention

```
feature/strava-<component>          # Feature work
  feature/strava-service-layer
  feature/strava-components
  feature/strava-auth-flow
  feature/strava-database-schema

bugfix/strava-<issue>               # Bug fixes during migration
  bugfix/strava-token-refresh
  
chore/strava-<task>                 # Refactoring, cleanup
  chore/strava-typescript-conversion
```

### Branch Management Rules

1. **Base Development Branch**: `main` (maintain production-ready state)
2. **Feature Branch Lifetime**: Keep to <2 weeks of active work
3. **PR Requirements**: 
   - All tests passing
   - TypeScript strict mode compliance
   - WCAG 2.2 AA compliance (per your accessibility memory)
4. **Merge Strategy**: Squash or rebase to keep history clean

---

## Phase-Based Migration Process

### Phase 1: Preparation & Setup (1 week)

**Branch**: `feature/strava-setup`

#### 1.1 Database Schema Alignment
- [ ] Review weegym's Strava tables in Supabase
- [ ] Create/update corresponding tables in bs-weestoater Supabase
- [ ] Ensure compatibility with existing bs-weestoater user/profile structure

```sql
-- Required tables (adapt if different):
- strava_app_configs (OAuth credentials)
- strava_tokens (user OAuth tokens)
- strava_activities (activity data)
- strava_personal_records (PR tracking)
- strava_athlete_stats (aggregated stats)
```

#### 1.2 Environment Setup
- [ ] Add Strava env variables to `.env` (already in weegym)
- [ ] Create `.env.example` with Strava fields
- [ ] Document in SETUP_GUIDE or similar

#### 1.3 Dependency Audit
- [ ] Verify bs-weestoater has necessary packages:
  - `@supabase/supabase-js` ✅ (already installed)
  - `polyline-encoded` ✅ (already installed)
  - Any others from weegym (check `package.json`)

---

### Phase 2: Service Layer & Types (1 week)

**Branches**: 
- `feature/strava-service-layer`
- `feature/strava-types`

#### 2.1 Create TypeScript Interfaces
Create `/src/interfaces/strava.ts`:

```typescript
export interface StravaActivity {
  id: number;
  athlete_id: number;
  name: string;
  description?: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type?: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count?: number;
  photo_count: number;
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  workout_type?: number;
  gear_id?: string;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  average_watts?: number;
  max_watts?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  perceived_exertion?: number;
  prefer_perceived_exertion: boolean;
  created_at: string;
  updated_at: string;
}

export interface StravaToken {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete_id: number;
  scope: string[];
}

export interface StravaAppConfig {
  app_name: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  is_active: boolean;
}
```

#### 2.2 Convert stravaService to TypeScript
Create `/src/services/stravaService.ts`:
- Refactor weegym's `stravaService.js` to TypeScript
- Break into logical modules if >2000 LOC
- Keep function signatures compatible with current UI code
- Add comprehensive JSDoc for public APIs
- Maintain error handling patterns

Key functions to port:
- `loadStravaConfig()` - Load OAuth config
- `getAuthorizationUrl()` - Generate OAuth URL
- `exchangeToken()` - OAuth token exchange
- `refreshToken()` - Token refresh
- `getActivities()` - Fetch activities from Strava
- `syncActivities()` - Sync to local database
- `calculateStats()` - Aggregate statistics
- `checkForPersonalRecords()` - PR detection

#### 2.3 Utility Functions
Create `/src/utils/stravaUtils.ts`:
- `formatDistance(meters)` → km/miles
- `formatDuration(seconds)` → readable time
- `estimateCalories(activity)` → calorie calculation
- `parsePolyline(encoded)` → map coordinates
- `formatPace(distance, time)` → min/km or min/mile

---

### Phase 3: Authentication & OAuth Flow (5 days)

**Branch**: `feature/strava-auth-flow`

#### 3.1 Strava Connect Page
Create `/src/pages/StravaConnect.tsx`:
- Display Strava authorization prompt
- Handle OAuth callback (`/strava-callback`)
- Store tokens securely in Supabase
- Show connection status/athlete info

#### 3.2 Callback Handler
Create `/src/pages/StravaCallback.tsx`:
- Exchange OAuth code for tokens
- Handle errors gracefully
- Redirect to activities page on success
- Save athlete profile

#### 3.3 Token Management Middleware
Create `/src/hooks/useStravaAuth.ts`:
```typescript
export function useStravaAuth() {
  const [isConnected, setIsConnected] = useState(false);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAndRefreshToken(); // Auto-refresh if needed
  }, []);

  return { isConnected, athlete, loading, connect, disconnect };
}
```

#### 3.4 Navigation Integration
Update `/src/routes.tsx` to add:
```typescript
{
  path: "strava",
  lazy: async () => ({
    Component: (await import("./pages/StravaConnect")).default,
  }),
  children: [
    { path: "activities", ... },
    { path: "analytics", ... },
    { path: "callback", ... },
  ]
}
```

---

### Phase 4: Components & UI (1.5 weeks)

**Branch**: `feature/strava-components`

#### 4.1 Activity Display Components
- [ ] `/src/components/StravaActivityCard.tsx`
  - Display single activity summary
  - Show map preview
  - Performance stats badges
- [ ] `/src/components/StravaActivityList.tsx`
  - List with sorting/filtering
  - Pagination support
  - Loading states

#### 4.2 Analytics Components
- [ ] `/src/components/StravaActivityMap.tsx`
  - Leaflet map integration (already available)
  - Polyline overlay of route
  - Elevation profile
- [ ] `/src/components/StravaStatsSummary.tsx`
  - Key metrics: distance, time, elevation
  - Trend indicators
  - Period comparison
- [ ] `/src/components/StravaTypeChart.tsx`
  - Activity type breakdown (ag-charts available)
  - Time series chart
- [ ] `/src/components/StravaPersonalRecords.tsx`
  - Show all-time personal records
  - Segment details
  - Record date tracking

#### 4.3 Pages
- [ ] `/src/pages/StravaActivities.tsx`
  - Main activity browser
  - Search/filter UI
  - Detail view modal/sidebar
- [ ] `/src/pages/StravaAnalytics.tsx`
  - Dashboard with stats
  - Charts and visualizations
  - Time range selectors
- [ ] `/src/pages/StravaRecords.tsx`
  - Personal records listing
  - Record types and categories
  - Historical tracking

#### 4.4 Styling Integration
- Follow your SCSS patterns (in `/src/scss/`)
- Use rem units (per your CSS memory)
- Ensure WCAG AA compliance
- Dark mode support (if implemented)

---

### Phase 5: Testing & Integration (1 week)

**Branch**: `feature/strava-testing`

#### 5.1 Unit Tests
- `/src/services/__tests__/stravaService.test.ts`
  - Mock Strava API responses
  - Test token refresh logic
  - Error handling scenarios
- `/src/utils/__tests__/stravaUtils.test.ts`
  - Distance/duration formatting
  - Calorie calculations
  - Polyline parsing

#### 5.2 Component Tests
- Test auth flow components
- Test activity display with various data
- Modal/sidebar interactions
- Filter and sort logic

#### 5.3 E2E Tests
Add to `/e2e-tests/`:
- Strava connection flow
- Activity sync and display
- Analytics page rendering
- Data refresh

#### 5.4 Accessibility Testing
- Use your existing a11y test suite (seen in project)
- Ensure all components are WCAG 2.2 AA
- Test with keyboard navigation
- Verify screen reader compatibility

#### 5.5 Performance Testing
- Profile component render times
- Lazy load large activity lists
- Cache strategy for activities
- Bundle size impact

---

### Phase 6: Documentation & Deployment (3-4 days)

**Branch**: `feature/strava-docs`

#### 6.1 Developer Documentation
Create `/docs/STRAVA_INTEGRATION_GUIDE.md`:
- Setup and configuration
- API reference for services
- Component usage examples
- Testing guidelines
- Common troubleshooting

#### 6.2 User Documentation
Create `/docs/STRAVA_USER_GUIDE.md`:
- How to connect Strava
- Viewing activities
- Understanding analytics
- FAQ

#### 6.3 Update Existing Docs
- [ ] Update `/docs/README.md` (main docs index)
- [ ] Update main project README
- [ ] Update SETUP_GUIDE if applicable

#### 6.4 Environment & Deployment
- [ ] Update `.env.example` with Strava fields
- [ ] Document Supabase schema requirements
- [ ] Add migration scripts if needed
- [ ] Update CI/CD if needed

---

## Git Workflow Example

### Creating and Managing Feature Branches

```bash
# Start from main, ensure clean state
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/strava-service-layer

# Make commits (small, focused)
git add src/services/stravaService.ts src/interfaces/strava.ts
git commit -m "feat: port Strava service to TypeScript"

# Push to remote
git push -u origin feature/strava-service-layer

# Create PR on GitHub for review
# → Link to this plan
# → Reference any related issues

# After review, merge
# → Use squash + merge for feature branches
# → OR rebase if keeping individual commits is important

# Clean up
git checkout main
git pull origin main
git branch -d feature/strava-service-layer
```

### Handling Multiple Concurrent Branches

If working on multiple features simultaneously:

```bash
# Keep feature branches short-lived (<1 week)
# Rebase frequently to avoid merge conflicts

git fetch origin
git rebase origin/main

# If conflicts occur, resolve locally
git add <resolved-files>
git rebase --continue
```

---

## Dependencies & Compatibility

### Already Available in bs-weestoater
- ✅ `@supabase/supabase-js` - Database & auth
- ✅ `react-leaflet` + `leaflet` - Maps
- ✅ `ag-charts-react` + `ag-grid-react` - Data visualization
- ✅ `polyline-encoded` - Route encoding
- ✅ Bootstrap/reactstrap - UI components

### Might Need to Add
```json
// Check if weegym uses any special packages:
"axios": "^1.x",          // (if not already used)
"date-fns": "^2.x",       // Date formatting (optional)
"zustand": "^4.x"         // State management (if needed)
```

---

## Data Migration Strategy

### Option A: Copy-Only (Recommended for now)
1. Keep weegym as source of truth initially
2. Gradually sync new activities into bs-weestoater
3. Migrate historical activities later when needed
4. No disruption to current weegym usage

### Option B: Full Migration (When ready)
1. Export all historical Strava data from weegym
2. Import into bs-weestoater Supabase
3. Switch UI to bs-weestoater
4. Archive weegym

### Option C: Dual-Write (During transition)
1. Implement writes to both databases temporarily
2. Verify data sync
3. Gradually shift to bs-weestoater-only
4. Clean up weegym data

---

## Risk Mitigation

### Key Risks
1. **OAuth Token Issues**: Tokens expiring during migration
   - Mitigation: Strong token refresh logic with fallback
   
2. **Data Loss**: Activities not syncing properly
   - Mitigation: Backup database, test thoroughly, log all operations
   
3. **Breaking Changes**: Updates to Strava API v3
   - Mitigation: Pin API version, monitor Strava changelog
   
4. **Performance**: Large activity datasets causing slowness
   - Mitigation: Implement pagination, caching, lazy loading
   
5. **User Experience**: Existing weegym users lose Strava data temporarily
   - Mitigation: Plan cutover carefully, keep weegym running in parallel initially

### Testing Checklist
- [ ] Strava OAuth flow works end-to-end
- [ ] Token refresh handles expiration
- [ ] Activities sync correctly from Strava API
- [ ] Historical activities display properly
- [ ] Analytics calculations are accurate
- [ ] All UI elements are accessible (a11y)
- [ ] Performance acceptable with 1000+ activities
- [ ] Error handling for network failures
- [ ] Mobile responsive design

---

## Timeline Estimate

| Phase | Duration | Critical Path |
|-------|----------|---|
| 1. Setup | 5 days | Blocking all others |
| 2. Service Layer | 7 days | Blocking phase 3-5 |
| 3. Auth Flow | 5 days | Blocking phase 4 |
| 4. Components | 10 days | Parallel with phase 3 |
| 5. Testing | 7 days | Parallel with phase 4 |
| 6. Docs & Deploy | 4 days | Final before merge |
| **Total** | **~3-4 weeks** | |

### Parallelization
- Phases 2 & 3 can overlap (separate concerns)
- Phases 3 & 4 can overlap
- Testing can begin as components are ready

---

## Success Criteria

✅ **Feature Parity**
- All Strava features from weegym working in bs-weestoater
- Same data displayed accurately
- Same user workflows functional

✅ **Code Quality**
- Full TypeScript strict mode
- >80% test coverage for services
- Zero accessibility violations (WCAG 2.2 AA)
- ESLint passing with zero warnings

✅ **Performance**
- Page load <2s (with 1000+ activities)
- Component render <100ms
- No memory leaks
- Bundle size impact <50KB

✅ **Documentation**
- Developer guide complete
- User guide complete
- All APIs documented with examples
- Troubleshooting guide

✅ **Deployment**
- Zero downtime for existing features
- Rollback plan in place
- Monitoring/alerts configured
- All CI/CD tests passing

---

## Post-Migration

### Week 1-2 After Merge
- Monitor for issues in production
- Gather user feedback
- Fix any edge cases
- Optimize performance based on real data

### Month 1
- Decide on weegym Strava feature deprecation timeline
- Plan for optional: migrating historical weegym data
- Plan for optional: enhanced features (segments, challenges, etc.)

### Optional Enhancements
- Social features (segment leaderboards)
- Automated challenges
- Webhook notifications for new activities
- Integration with other activity sources (Garmin, etc.)
- Advanced analytics (ML-based insights)

---

## Quick Reference: Key Files to Create/Modify

### New Files
```
src/
  ├── interfaces/strava.ts
  ├── services/stravaService.ts
  ├── utils/stravaUtils.ts
  ├── hooks/useStravaAuth.ts
  ├── hooks/useStravaActivities.ts
  ├── components/
  │   ├── StravaActivityCard.tsx
  │   ├── StravaActivityList.tsx
  │   ├── StravaActivityMap.tsx
  │   ├── StravaStatsSummary.tsx
  │   └── ... (more components)
  ├── pages/
  │   ├── StravaConnect.tsx
  │   ├── StravaCallback.tsx
  │   ├── StravaActivities.tsx
  │   ├── StravaAnalytics.tsx
  │   └── StravaRecords.tsx
  └── __tests__/
      └── strava.test.ts

docs/
  ├── STRAVA_INTEGRATION_GUIDE.md
  └── STRAVA_USER_GUIDE.md
```

### Modified Files
```
src/routes.tsx          - Add Strava routes
src/App.tsx             - Add Strava navigation items
.env.example            - Add Strava env vars
package.json            - Add dependencies if needed (usually none)
```

---

## Questions to Clarify Before Starting

1. **Athlete Data**: Should we show just your activities or support multiple athletes?
2. **Historical Data**: How many years of activities to migrate initially?
3. **Features**: Which weegym Strava features are must-have vs. nice-to-have?
4. **Segments**: Include Strava segment data, or just activities?
5. **Mobile**: Should this be fully responsive mobile-first?
6. **Real-time**: Should new activities appear automatically or require manual sync?
7. **Archival**: Keep weegym running in parallel or full cutover?

---

**Next Steps**:
1. Review this plan
2. Answer clarification questions
3. Begin Phase 1 (Preparation & Setup)
4. Create first feature branch for peer review
