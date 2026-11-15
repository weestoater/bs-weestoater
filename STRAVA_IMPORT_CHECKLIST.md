# Strava Import & Verification Checklist

Complete these steps to finish importing Strava activities into weestoater.

## Phase 1: SQL Import ✅ Ready

### Pre-Import
- [ ] Have Supabase credentials for weestoater project
- [ ] Access to SQL Editor in Supabase dashboard
- [ ] SQL file exists: `scripts/data/strava-articles-import.sql`

### Execute Import
1. [ ] Go to https://app.supabase.com/
2. [ ] Select weestoater project
3. [ ] Navigate to SQL Editor
4. [ ] Click "New Query"
5. [ ] Open `scripts/data/strava-articles-import.sql`
6. [ ] Copy and paste entire SQL into editor
7. [ ] Click "Run"
8. [ ] Verify: "Successfully converted: 133 activities" message appears
9. [ ] No error messages

### Expected Output
```
Query executed successfully (133 rows affected)
```

---

## Phase 2: Frontend Verification ✅ Ready

### Page Load
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:5173/strava
- [ ] Page loads without errors
- [ ] No console errors (check browser DevTools)

### Statistics Display
- [ ] Summary card displays with 4 metrics visible
- [ ] Total Activities shows correct count (~133)
- [ ] Total Distance shows in miles (not NaN)
- [ ] Total Time shows hours:minutes format
- [ ] Total Calories shows a number

### Article Grid
- [ ] 133 article cards display
- [ ] Each card shows:
  - [ ] Activity name/title
  - [ ] Type badge (Walk, Run, Ride, etc.)
  - [ ] Bootstrap Icon matching activity type
  - [ ] Distance in miles + km
  - [ ] Duration in minutes
  - [ ] Elevation in feet + meters (when applicable)

### Units Toggle
- [ ] Units dropdown visible in stats card
- [ ] Default shows "Imperial (mi)"
- [ ] Click "Metric (km)" - Distance re-displays in km
- [ ] Click "Imperial (mi)" - Distance shows in miles again
- [ ] Conversion values are reasonable (1.0mi ≈ 1.6km)

### Activity Type Breakdown
- [ ] Activity types badge section visible
- [ ] Shows count for each type: Walk, Run, Ride, etc.
- [ ] Badge styling matches Bootstrap
- [ ] Count reflects actual articles

### Responsive Design
- [ ] **Desktop (1200px+):** 4 columns in article grid
- [ ] **Tablet (768-1199px):** 2-3 columns
- [ ] **Mobile (<768px):** 1-2 columns
- [ ] Stats card stays readable on mobile
- [ ] No horizontal scroll
- [ ] Units toggle remains accessible

### Navigation
- [ ] Link from appheader works (/strava)
- [ ] Back button from article works (if implemented)
- [ ] Can navigate to /admin/articles and filter by "Strava"

---

## Phase 3: Data Validation ✅ Ready

### Sample Article Verification
Pick 3 random articles and verify:

**Article 1:**
- [ ] Distance conversion is correct (miles ÷ 1.60934 from km)
- [ ] Duration format is HHh MMm or MMm
- [ ] Heart rate shown if available
- [ ] Calories shown if available
- [ ] Date is realistic

**Article 2:**
- [ ] Speed displayed in mph (primary) with km/h (secondary)
- [ ] Elevation shown in feet (primary) with meters (secondary)
- [ ] Icon matches activity type
- [ ] Content HTML renders properly

**Article 3:**
- [ ] Tags field populated correctly (check raw article in admin)
- [ ] Author field shows "Strava Import"
- [ ] Published field is true
- [ ] Featured field is false

### Content Quality
- [ ] HTML content renders without broken formatting
- [ ] No escape sequences visible (like `&lt;` or `&#39;`)
- [ ] Metric values are within reasonable ranges
- [ ] No duplicate articles
- [ ] No missing required fields

---

## Phase 4: Admin Testing ✅ Ready

### Article Manager
- [ ] Visit /admin/articles
- [ ] Filter by category: "Strava"
- [ ] All 133 articles appear
- [ ] Can edit individual articles
- [ ] Can delete test articles if needed
- [ ] Pagination works

### Editor
- [ ] Can create new Strava article (category dropdown shows "Strava")
- [ ] Can edit existing Strava article
- [ ] Tags field accepts ARRAY format or JSON
- [ ] Can save changes

---

## Phase 5: Database Verification ✅ Ready

### Direct Query (in Supabase SQL Editor)
```sql
SELECT COUNT(*) as total, 
       ARRAY_AGG(DISTINCT category) as categories,
       ARRAY_AGG(DISTINCT author) as authors
FROM articles 
WHERE category = 'Strava';
```

Expected:
- [ ] total = 133
- [ ] categories includes "Strava"
- [ ] authors includes "Strava Import"

### Sample Article Query
```sql
SELECT id, title, distance_value, reading_time, tags 
FROM articles 
WHERE category = 'Strava' 
LIMIT 5;
```

Expected:
- [ ] title values look correct
- [ ] reading_time is 2-30
- [ ] tags field is array format

---

## Phase 6: Performance Check ✅ Ready

### Page Load Speed
- [ ] Page loads in < 2 seconds
- [ ] No noticeable lag when toggling units
- [ ] Stats calculate quickly on load
- [ ] No N+1 query issues in console

### Memory Usage
- [ ] All 133 articles load smoothly
- [ ] No memory leaks in DevTools
- [ ] Images lazy-load as you scroll

---

## Phase 7: Browser Compatibility ✅ Ready

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

Expected: Everything displays and functions identically

---

## Phase 8: Accessibility Check ✅ Ready

- [ ] WAVE or axe DevTools shows no critical errors
- [ ] Color contrast meets WCAG AA standard
- [ ] Keyboard navigation works (Tab through controls)
- [ ] Screen reader announces "133 published Strava articles found"
- [ ] Form controls have labels
- [ ] Icons have title attributes

---

## Phase 9: Documentation Review ✅ Ready

- [ ] STRAVA_SETUP_SUMMARY.md is accurate
- [ ] STRAVA_PAGE_LAYOUT.md reflects current implementation
- [ ] STRAVA_EXPORT_IMPORT.md has correct file paths
- [ ] Code comments are clear
- [ ] README mentions Strava section

---

## Phase 10: Production Readiness ✅ Ready

- [ ] All tests passing: `npm test`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No security warnings
- [ ] No sensitive data in SQL or code
- [ ] Credentials not committed

---

## Rollback Plan (If Needed)

If issues found:

### Option 1: Delete Articles
```sql
DELETE FROM articles WHERE category = 'Strava';
```

### Option 2: Re-import (Safe)
```sql
DELETE FROM articles WHERE author = 'Strava Import';
-- Then re-run SQL import script
```

### Option 3: Revert Code
```bash
git revert <commit-hash>
npm run dev
```

---

## Sign-Off

**Date Completed:** _______________

**Reviewed By:** _______________

**Issues Found:** 
- [ ] None
- [ ] Minor (list below)
- [ ] Major (do not deploy)

**Notes:**
_______________________________________________
_______________________________________________

**Ready for Production:** ☐ Yes ☐ No

---

## Next Steps (If All Pass)

1. [ ] Merge `feature/strava-setup` to `main`
2. [ ] Deploy to production
3. [ ] Monitor for errors
4. [ ] Announce Strava section to users

---

**Checklist Version:** 1.0  
**Last Updated:** 2026-11-15  
**Status:** Ready for completion
