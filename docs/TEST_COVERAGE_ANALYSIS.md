# Test Coverage Analysis & Improvement Plan

**Date:** February 24, 2026  
**Current Status:** 260/272 tests passing (95.6% pass rate)  
**Goal:** Achieve 90%+ code coverage

---

## 📊 Current Test Status

### Test Results Summary

- **Total Tests:** 272
- **Passing:** 260 (95.6%)
- **Failing:** 12 (4.4%)
- **Test Files:** 47 total (45 passing, 2 failing)

### Failing Tests

1. **`src/__tests__/pages/slimmingWorld.test.tsx`** - 9 failures
   - Tests expect `.total-lost-banner` element that no longer exists
   - Page now loads data from Supabase database instead of JSON import
   - Tests need to be updated to mock database calls properly

2. **`src/__tests__/pages/football.test.tsx`** - 3 failures
   - Tests expect JSON imports but page now uses database
   - Need to mock `getSupabaseClient()` and `createDatabaseService()`

---

## 🗂️ Unused Files - Safe to Remove

### 1. O'Donnell Debugging Scripts (7 files)

These were temporary utility scripts created for fixing a spelling issue:

- `backend/supabase/comprehensive-odonnell-search.js`
- `backend/supabase/debug-odonnell.js`
- `backend/supabase/fix-odonnell-card.js`
- `backend/supabase/fix-odonnell-final.js`
- `backend/supabase/fix-odonnell-spelling.js`
- `backend/supabase/fix-odonnell-spelling.sql`
- `backend/supabase/search-odonnell.js`
- `backend/supabase/show-odonnell-cards.js`
- `backend/supabase/test-get-players.js`

**Recommendation:** Keep `fix-odonnell-spelling.sql` for documentation, delete the rest.

### 2. Football JSON Data Files (12 files)

Since football data now comes from Supabase database:

- `src/data/2020-21-matches.json` ❌ UNUSED
- `src/data/2020-21-goals.json` ❌ UNUSED
- `src/data/2021-22-matches.json` ❌ UNUSED
- `src/data/2021-22-goals.json` ❌ UNUSED
- `src/data/2022-23-matches.json` ❌ UNUSED
- `src/data/2022-23-goals.json` ❌ UNUSED
- `src/data/2023-24-matches.json` ❌ UNUSED
- `src/data/2023-24-goals.json` ❌ UNUSED
- `src/data/2024-25-matches.json` ❌ UNUSED
- `src/data/2024-25-goals.json` ❌ UNUSED
- `src/data/2025-26-matches.json` ❌ UNUSED
- `src/data/2025-26-goals.json` ❌ UNUSED

**Recommendation:** Archive these files (move to `archive/data/`) as they may be useful for re-migration or rollback.

### 3. Slimming World JSON Data

- `src/data/slimmingWorldData.json` ✅ KEEP (used as test mock, could be fallback)

### 4. Garmin Activities JSON

- `src/data/garminActivities.json` ✅ KEEP (actively used as fallback in `GarminActivities.tsx`)

---

## 🎯 Missing Test Coverage

### High Priority - New Football Database Code (0% coverage)

The following files have **NO TESTS**:

1. **Admin Components**
   - `src/pages/admin/FootballManager.tsx` (~983 lines, 0% coverage)
     - Match CRUD operations
     - Goals management
     - Cards management
     - Player typeahead functionality

2. **Backend Database Layer** (excluded from vitest coverage)
   - `backend/supabase/database.js` - Football functions:
     - `getFootballPlayers(seasonId?)`
     - `getFootballSeasons()`
     - `getFootballMatches(seasonId, options)`
     - `createFootballMatch(matchData)`
     - `updateFootballMatch(matchId, matchData)`
     - `deleteFootballMatch(matchId)`
     - `getFootballMatchGoals(matchId)`
     - `createFootballMatchGoal(goalData)`
     - `updateFootballMatchGoal(goalId, goalData)`
     - `deleteFootballMatchGoal(goalId)`
     - `getFootballMatchCards(matchId)`
     - `createFootballMatchCard(cardData)`
     - `updateFootballMatchCard(cardId, cardData)`
     - `deleteFootballMatchCard(cardId)`
     - `getFootballSeasonStats(seasonId)`
     - `getFootballSeasonComplete(seasonId)`

3. **Updated Pages**
   - `src/pages/Football.tsx` - Now uses database (test needs update)
   - `src/pages/SeasonPage.tsx` - Excluded from coverage but uses database

### Medium Priority - Existing Code Gaps

Files currently covered but potentially under-tested:

- `src/components/football/goalScorerDetails.tsx` (excluded)
- `src/hooks/useAuth.ts` (authentication logic)
- `src/hooks/useGarminActivities.ts`
- `src/hooks/useDailySteps.ts`

---

## 📋 Action Plan to Reach 90%+ Coverage

### Phase 1: Fix Failing Tests ✅ PRIORITY 1

1. **Update `slimmingWorld.test.tsx`**
   - Mock Supabase client and database service
   - Update expectations to match database-driven UI
   - Remove tests for removed `.total-lost-banner` element

2. **Update `football.test.tsx`**
   - Mock `getSupabaseClient()` and `createDatabaseService()`
   - Mock `getFootballSeasonComplete()` response
   - Update component to handle loading states

### Phase 2: Add Football Database Tests ✅ PRIORITY 2

#### Backend Tests (Node.js/Vitest)

Create `backend/supabase/__tests__/database.football.test.js`:

```javascript
// Test all 25+ football database functions
// Use actual Supabase test instance or mocks
// Test CRUD operations, error handling, edge cases
```

#### Frontend Component Tests

Create `src/__tests__/pages/admin/FootballManager.test.tsx`:

```typescript
// Test match form submission
// Test goals modal CRUD
// Test cards modal CRUD
// Test player typeahead
// Test season switching
// Test error states
// Test loading states
```

### Phase 3: Integration Tests ✅ PRIORITY 3

Create `src/__tests__/integration/football-flow.test.tsx`:

```typescript
// Test complete flow: create match → add goals → add cards → view
// Test database interaction mocking
// Test data transformation
```

### Phase 4: Clean Up ✅ PRIORITY 4

1. Remove unused O'Donnell debugging scripts (keep .sql for reference)
2. Archive unused JSON football data files
3. Update test snapshots
4. Run full coverage report

---

## 🚀 Quick Wins for Coverage Boost

### Easy Additions (< 30 minutes each):

1. **Add tests for utility functions:**
   - Test `getFootballPlayers()` with/without seasonId filter
   - Test date conversion utilities
   - Test data transformation functions

2. **Add tests for database error handling:**
   - Test network errors
   - Test not found scenarios
   - Test validation errors

3. **Add tests for TypeScript interfaces:**
   - Ensure type definitions match database schema
   - Test optional fields

---

## 📁 Files to Create

### New Test Files Needed:

```
backend/supabase/__tests__/
  ├── database.football.test.js          (NEW)
  └── database.integration.test.js       (NEW)

src/__tests__/
  ├── pages/
  │   ├── admin/
  │   │   └── FootballManager.test.tsx   (NEW)
  │   ├── football.test.tsx              (UPDATE)
  │   └── slimmingWorld.test.tsx         (UPDATE)
  ├── hooks/
  │   └── useFootballData.test.ts        (NEW if hook created)
  └── integration/
      └── football-flow.test.tsx         (NEW)
```

---

## 📊 Coverage Goals by Area

| Area                  | Current | Target         | Priority |
| --------------------- | ------- | -------------- | -------- |
| Frontend Components   | ~85%    | 90%+           | High     |
| Pages                 | ~80%    | 90%+           | High     |
| Utils/Helpers         | ~90%    | 95%+           | Medium   |
| Hooks                 | ~70%    | 85%+           | Medium   |
| Backend (if included) | 0%      | 80%+           | High     |
| Integration Tests     | 0%      | Basic coverage | Low      |

---

## 🔧 Configuration Updates Needed

### Update `vite.config.ts` coverage exclusions:

Consider removing these from exclusions if we add tests:

- `src/pages/SeasonPage.tsx` (currently excluded)
- `src/components/football/goalScorerDetails.tsx` (currently excluded)

---

## 💡 Recommendations

### Immediate Actions:

1. ✅ **Remove unused O'Donnell scripts** (except .sql)
2. ✅ **Archive football JSON files** to `archive/data/`
3. ⚠️ **Fix failing tests** in slimmingWorld and football
4. 📝 **Create tests for FootballManager.tsx**
5. 📝 **Add backend database tests**

### Long-term Strategy:

- Implement TDD for new features
- Add integration tests for critical user flows
- Set up pre-commit hooks to prevent coverage drops
- Add coverage badges to README
- Schedule quarterly coverage reviews

---

## 📈 Estimated Time to 90%+

- Fix failing tests: **2-3 hours**
- Football database tests: **4-6 hours**
- FootballManager component tests: **3-4 hours**
- Clean up unused files: **30 minutes**
- **Total: 10-14 hours of focused work**

---

## ✅ Next Steps

1. Run: `git rm backend/supabase/*odonnell*.js backend/supabase/test-get-players.js`
2. Run: `git mv src/data/202*-*.json archive/data/`
3. Fix: Update `slimmingWorld.test.tsx` with proper database mocks
4. Fix: Update `football.test.tsx` with proper database mocks
5. Create: `FootballManager.test.tsx` with comprehensive component tests
6. Create: `database.football.test.js` with all CRUD operation tests
7. Run: `yarn test:coverage` and analyze report
8. Iterate until 90%+ achieved

---

**Status:** Ready for implementation  
**Blockers:** None  
**Dependencies:** None - can start immediately
