# Refactoring Checklist

Use this document to track your progress through the refactoring phases.

---

## PHASE 1: Critical Path (37 minutes)

### ✅ Fix 1: Remove Duplicate `getImageDimensions`
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Update MediaLibrary.tsx imports (add `getImageDimensions`)
- [ ] Delete duplicate function (lines 204-214 in MediaLibrary.tsx)
- [ ] Verify no imports breaking
- [ ] Run tests: `npm run test`
- [ ] **Est. Time:** 5 min

### ✅ Fix 2: Remove Duplicate `formatFileSize`
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Update MediaLibrary.tsx imports (add `formatFileSize`)
- [ ] Delete duplicate function (lines 217-225 in MediaLibrary.tsx)
- [ ] Run tests: `npm run test`
- [ ] **Est. Time:** 2 min

### ✅ Fix 3: Extract `getFileType` Utility
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Create `src/utils/fileUtils.ts`
- [ ] Add `getFileType` function
- [ ] Update MediaLibrary.tsx imports
- [ ] Replace inline file type logic (lines ~168)
- [ ] Run tests: `npm run test`
- [ ] **Est. Time:** 10 min

### ✅ Fix 4: Create `supabaseStorageUtils.ts`
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Create `src/utils/supabaseStorageUtils.ts`
- [ ] Add `uploadFileToSupabase` function
- [ ] Update ImageUpload.tsx imports and use new utility
- [ ] Update MediaLibrary.tsx imports and use new utility
- [ ] Update tinymceUpload.ts imports and use new utility
- [ ] Run tests: `npm run test`
- [ ] Run linting: `npm run lint`
- [ ] **Est. Time:** 20 min

### ✅ Phase 1 Complete
- [ ] All tests passing
- [ ] No lint errors
- [ ] Build succeeds: `npm run build`
- [ ] Verified in browser (if applicable)

**Total Time Spent:** _____ minutes

---

## PHASE 2: Configuration Cleanup (30 minutes)

### ✅ Fix 5: Create `imageUploadConfig.ts`
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Create `src/config/imageUploadConfig.ts`
- [ ] Add all configuration constants
- [ ] Add type helpers (getQuality, getMaxWidth, getFolder)
- [ ] **Est. Time:** 10 min

### ✅ Fix 6: Update ImageUpload.tsx to Use Config
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Add import of IMAGE_UPLOAD_CONFIG
- [ ] Replace default prop values with config
- [ ] Replace hardcoded error messages with config
- [ ] Replace validation limits with config
- [ ] Run tests: `npm run test`
- [ ] **Est. Time:** 5 min

### ✅ Fix 7: Update MediaLibrary.tsx to Use Config
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Add import of IMAGE_UPLOAD_CONFIG
- [ ] Replace all hardcoded values with config
- [ ] Replace file size limits with config constants
- [ ] Replace error messages with config
- [ ] Run tests: `npm run test`
- [ ] **Est. Time:** 5 min

### ✅ Fix 8: Update tinymceUpload.ts to Use Config
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Add import of IMAGE_UPLOAD_CONFIG
- [ ] Replace hardcoded optimization params with config
- [ ] Replace upload settings with config
- [ ] **Est. Time:** 5 min

### ✅ Fix 9: Update imageOptimization.ts (Optional)
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Consider importing defaults from config (optional improvement)
- [ ] **Est. Time:** 5 min (skip if already working)

### ✅ Phase 2 Complete
- [ ] All tests passing
- [ ] No lint errors
- [ ] Build succeeds: `npm run build`
- [ ] All configuration centralized in one file

**Total Time Spent:** _____ minutes

---

## PHASE 3: Polish & Optimization (40 minutes)

### ✅ Fix 6: Add Object URL Cleanup
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

**File:** `src/components/admin/ImageUpload.tsx`

- [ ] Add useEffect cleanup hook
- [ ] Revoke blob URLs on unmount
- [ ] Test memory cleanup (DevTools → Memory tab)
- [ ] **Est. Time:** 10 min

### ✅ Fix 7: Add useMemo for Filter (Optional)
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

**File:** `src/pages/admin/MediaLibrary.tsx`

- [ ] Wrap filteredItems in useMemo
- [ ] Add proper dependency array [mediaItems, searchTerm]
- [ ] Test filtering still works
- [ ] **Est. Time:** 15 min

### ✅ Fix 8: Add useCallback Optimizations (Optional)
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

**File:** `src/pages/admin/MediaLibrary.tsx`

- [ ] Wrap handleDrag in useCallback
- [ ] Wrap handleDrop in useCallback
- [ ] Wrap copyToClipboard in useCallback
- [ ] **Est. Time:** 15 min

### ✅ Fix 9: Add React Mount Safety
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

**File:** `src/components/admin/ImageUpload.tsx`

- [ ] Add isMountedRef.current checks
- [ ] Prevent state updates on unmounted component
- [ ] **Est. Time:** 10 min

### ✅ Fix 10: Delete Development Files
**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Done

- [ ] Delete `iife.js` (development test file)
- [ ] Run: `rm iife.js`
- [ ] **Est. Time:** 1 min

### ✅ Phase 3 Complete
- [ ] All tests passing
- [ ] No lint errors: `npm run lint --fix`
- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes: `npx tsc --noEmit`
- [ ] Performance improvements verified

**Total Time Spent:** _____ minutes

---

## FINAL VERIFICATION

### Code Quality
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No lint errors: `npm run lint`
- [ ] All tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`

### Browser Testing
- [ ] Media Library upload works
- [ ] Article editor image upload works
- [ ] Book editor image upload works
- [ ] TinyMCE image insert works
- [ ] File size limits enforced
- [ ] Optimization feedback displayed
- [ ] No console errors/warnings

### Performance
- [ ] No memory leaks (DevTools Memory tab)
- [ ] Uploads complete without errors
- [ ] UI responsive during uploads
- [ ] No unnecessary re-renders

### Documentation
- [ ] Code comments updated (if needed)
- [ ] Configuration documented
- [ ] README updated (if applicable)

---

## GIT WORKFLOW

### Before Starting
```bash
git checkout -b refactor/dry-violations
```

### After Each Phase
```bash
git add .
git commit -m "Refactor: Phase X - $(description)"
```

### Final Submission
```bash
git push origin refactor/dry-violations
# Create Pull Request on GitHub
```

### Merge When Ready
```bash
# After code review approval
git checkout main
git merge refactor/dry-violations
git push origin main
```

---

## NOTES & ISSUES

Keep track of any issues or blockers encountered:

```
Phase 1 Notes:
- Issue: _______________
- Resolution: _______________

Phase 2 Notes:
- Issue: _______________
- Resolution: _______________

Phase 3 Notes:
- Issue: _______________
- Resolution: _______________

General Notes:
- _______________
```

---

## TIME TRACKING

| Phase | Estimated | Actual | Status |
|-------|-----------|--------|--------|
| Phase 1 (Critical) | 37 min | _____ | ⬜ |
| Phase 2 (Config) | 30 min | _____ | ⬜ |
| Phase 3 (Polish) | 40 min | _____ | ⬜ |
| **Total** | **107 min** | **_____** | ⬜ |

---

## SUCCESS CRITERIA

When complete, you should have:

✅ **66-76 LOC removed** (Phase 1-2)  
✅ **3 new utility files created** (fileUtils.ts, supabaseStorageUtils.ts, imageUploadConfig.ts)  
✅ **0 DRY violations** for image upload functionality  
✅ **All tests passing** without modification  
✅ **100% backward compatible** - no behavior changes  
✅ **Improved maintainability** - single source of truth for configuration  
✅ **Better performance** - memoization and optimizations applied  

---

**Created:** November 14, 2026  
**Target Completion:** Within 2-3 days  
**Difficulty Level:** 🟢 LOW-MEDIUM (straightforward refactoring)

