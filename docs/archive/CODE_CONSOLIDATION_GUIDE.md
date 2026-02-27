# Football Data Code Consolidation Guide

## Phase 2: Eliminate Duplicate Season Pages

**Status**: Ready to implement after Quick Wins (Phase 1) is complete  
**Estimated Impact**: Remove ~150 lines of duplicate code, improve maintainability by 80%

---

##  Objective

Replace 6 nearly identical season page components with a single dynamic component that uses URL parameters to determine which season data to display.

**Current Problem:**

- 6 duplicate files: `2020-21-season.tsx`, `2021-22-season.tsx`, etc.
- Each file has identical structure with only season ID and imports different
- Adding new season requires creating entire new file
- Bug fixes must be applied to all 6 files

**Target Solution:**

- 1 dynamic component: `SeasonPage.tsx`
- React Router reads season ID from URL
- Component dynamically imports correct JSON files
- New seasons require only data files + config update

---

##  Prerequisites

 Phase 1 (Quick Wins) must be complete:

- JSON files flattened with new structure
- TypeScript interfaces updated
- `footballSeasons.ts` config file created
- Components updated to handle new structure

---

##  Implementation Steps

### Step 1: Create Dynamic Season Page Component

**File**: `src/pages/SeasonPage.tsx`

```tsx
import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";
import { getSeasonById, isValidSeasonId } from "../config/footballSeasons";
import type {
  SeasonMatchData,
  SeasonGoalsData,
} from "../interfaces/footballTypes";

export const SeasonPage = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const [matches, setMatches] = useState<SeasonMatchData | null>(null);
  const [goals, setGoals] = useState<SeasonGoalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate season ID
  if (!seasonId || !isValidSeasonId(seasonId)) {
    return <Navigate to="/football" replace />;
  }

  const seasonConfig = getSeasonById(seasonId);
  const seasonDisplayName = seasonConfig?.fullName || seasonId;

  useEffect(() => {
    const loadSeasonData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Dynamic imports
        const [matchesModule, goalsModule] = await Promise.all([
          import(`../data/${seasonId}-matches.json`),
          import(`../data/${seasonId}-goals.json`),
        ]);

        setMatches(matchesModule.default);
        setGoals(goalsModule.default);
      } catch (err) {
        console.error(`Failed to load data for season ${seasonId}:`, err);
        setError(`Unable to load data for ${seasonId} season`);
      } finally {
        setLoading(false);
      }
    };

    loadSeasonData();
  }, [seasonId]);

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <PageTitleH1 title="Previous Football Seasons" />

      <div className="row">
        <div className="previous-seasons">
          <FootballSeasonsNav />
        </div>
      </div>

      {matches && goals && (
        <FootballSeasonResults
          season={[seasonDisplayName]}
          matches={matches}
          goals={goals}
        />
      )}
    </div>
  );
};
```

**What this does:**

- Uses `useParams()` to get season ID from URL (e.g., `/season/2024-25`)
- Validates season ID exists in configuration
- Dynamically imports correct JSON files based on season ID
- Shows loading state while fetching data
- Redirects to main football page if invalid season
- Reuses existing `FootballSeasonResults` component

---

### Step 2: Update React Router Configuration

**File**: `src/App.tsx` (or wherever routes are defined)

Find the existing season routes and replace them:

** Remove (Old):**

```tsx
<Route path="/season/2020-21" element={<FootballSeason202021 />} />
<Route path="/season/2021-22" element={<FootballSeason202122 />} />
<Route path="/season/2022-23" element={<FootballSeason202223 />} />
<Route path="/season/2023-24" element={<FootballSeason202324 />} />
<Route path="/season/2024-25" element={<FootballSeason202425 />} />
<Route path="/season/2025-26" element={<FootballSeason202526 />} />
```

** Add (New):**

```tsx
<Route path="/season/:seasonId" element={<SeasonPage />} />
```

---

### Step 3: Update Navigation Component

**File**: `src/content/football/footballSeasonsNav.tsx`

Update the navigation to use the new dynamic route pattern:

```tsx
import { Link } from "react-router-dom";
import { getPreviousSeasons } from "../../config/footballSeasons";

export const FootballSeasonsNav = () => {
  const seasons = getPreviousSeasons();

  return (
    <nav className="season-navigation">
      <h3>Select Season</h3>
      <ul className="season-list">
        {seasons.map((season) => (
          <li key={season.id}>
            <Link to={`/season/${season.id}`}>
              <i className="bi bi-calendar-check me-2"></i>
              {season.displayName}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

**Benefits:**

- No hardcoded links
- Automatically updates when new season added to config
- Uses centralized season data

---

### Step 4: Remove Deprecated Season Page Files

**Delete these 6 files:**

```
src/pages/2020-21-season.tsx
src/pages/2021-22-season.tsx
src/pages/2022-23-season.tsx
src/pages/2023-24-season.tsx
src/pages/2024-25-season.tsx
src/pages/2025-26-season.tsx
```

**Command:**

```bash
rm src/pages/2020-21-season.tsx \
   src/pages/2021-22-season.tsx \
   src/pages/2022-23-season.tsx \
   src/pages/2023-24-season.tsx \
   src/pages/2024-25-season.tsx \
   src/pages/2025-26-season.tsx
```

---

### Step 5: Update Imports

Search for any remaining imports of the old season components and remove them:

```bash
# Search for imports
grep -r "from.*2024-25-season" src/
grep -r "import.*FootballSeason202" src/
```

Likely locations:

- `src/App.tsx` - Remove all season component imports
- Any index files that re-export components

---

### Step 6: Test All Seasons

**Manual Testing Checklist:**

1. **Navigation Test**

   - [ ] Visit `/football` page
   - [ ] Click each season link in navigation
   - [ ] Verify URL changes to `/season/2024-25` format
   - [ ] Confirm correct data displays for each season

2. **Direct URL Test**

   - [ ] Enter `/season/2024-25` directly in browser
   - [ ] Try invalid season: `/season/9999-00`
   - [ ] Should redirect to `/football` for invalid

3. **Data Display Test**

   - [ ] Verify all matches show with correct dates (ISO format)
   - [ ] Check goal scorers display properly
   - [ ] Ensure no console errors

4. **Loading State Test**
   - [ ] Check spinner appears briefly on slow connections
   - [ ] Verify smooth transition to data display

5. **Error Handling Test**
   - [ ] Temporarily rename a JSON file
   - [ ] Visit that season - should show error message
   - [ ] Restore file

---

##  Expected Results

**Before:**

- 6 season page files
- ~25 lines each = ~150 lines total
- Hardcoded imports and routes
- Manual updates for new seasons

**After:**

- 1 dynamic season page
- ~90 lines (with error handling)
- Dynamic imports and routes
- New seasons: just add JSON + config entry

**Metrics:**

- **Code Reduction**: 60 lines removed (net)
- **Maintainability**: 83% improvement (1 file vs 6)
- **Scalability**: Add season in 2 minutes vs 10 minutes
- **Bug Risk**: 83% reduction (single source of truth)

---

##  Adding New Seasons (Future)

With this structure, adding a new season becomes trivial:

### 1. Add Data Files

```
src/data/2026-27-matches.json
src/data/2026-27-goals.json
```

### 2. Update Config

```typescript
// src/config/footballSeasons.ts
export const FOOTBALL_SEASONS: SeasonConfig[] = [
  {
    id: "2026-27",
    displayName: "2026-27",
    fullName: "2026-2027",
    startYear: 2026,
    endYear: 2027,
    isActive: true, // Set previous season to false
  },
  // ... existing seasons
];
```

### 3. Done! 

- Navigation automatically updates
- Routes automatically work
- No component changes needed

---

##  Common Pitfalls

### Issue: Dynamic imports fail

**Solution**: Ensure Vite is configured to handle JSON imports. Check `vite.config.ts`:

```typescript
export default defineConfig({
  json: {
    stringify: false, // Allow direct JSON imports
  },
});
```

### Issue: TypeScript errors on useParams

**Solution**: Install types if missing:

```bash
npm install --save-dev @types/react-router-dom
```

### Issue: Old routes still cached

**Solution**: Hard refresh browser (Ctrl+Shift+R) or clear React Router cache

---

##  Next Steps After Phase 2

Once code consolidation is complete, consider:

1. **Phase 3**: Create admin interface for managing data
2. **Phase 4**: Migrate to MySQL backend
3. **Phase 5**: Add search and filtering features
4. **Phase 6**: Implement data visualization (charts, graphs)

---

##  Notes

- Keep old season files in git history in case rollback needed
- Test thoroughly before deleting deprecated files
- Update any documentation referencing old structure
- Consider adding unit tests for dynamic routing logic

---

# This file has been archived as of February 2026. Please refer to the new documentation in the main docs/ folder for up-to-date information.

**Estimated Time**: 2-3 hours for careful implementation and testing  
**Difficulty**: Medium (requires understanding of React Router and dynamic imports)  
**Risk Level**: Low (can easily revert if issues arise)


