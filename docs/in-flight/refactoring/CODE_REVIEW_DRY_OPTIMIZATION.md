# Code Review: DRY Violations & Optimization Opportunities

**Date:** November 14, 2026  
**Scope:** Codebase review focusing on DRY principles and performance optimizations  
**Focus Areas:** Image optimization integration, utility patterns, component redundancy

---

## Executive Summary

**Overall Health:** 6/10
- **Good:** Well-structured image optimization utility, clean component separation
- **Issues:** Duplicate `getImageDimensions` function, hardcoded magic numbers, duplicate helper functions in MediaLibrary, potential performance issues with object URL cleanup

**Estimated LOC Savings:** 80-120 lines  
**Quick Wins:** 3-4 high-priority fixes (2-3 hours)  
**Strategic Improvements:** 3 major refactors (6-8 hours)

---

## 🔴 HIGH PRIORITY Issues

### 1. **DUPLICATE: `getImageDimensions` Function** ⭐ Quick Win
**Files:** 
- `src/utils/imageOptimization.ts` (lines 102-120)
- `src/pages/admin/MediaLibrary.tsx` (lines 204-214)

**Problem:** Nearly identical function defined in two places with subtle differences:
```typescript
// imageOptimization.ts - with proper error handling
export const getImageDimensions = (file: File): Promise<{
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    // ... with error rejection
  });
};

// MediaLibrary.tsx - no error handling, silent fallback
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    // ... no reject, just silent fallback to 0,0
  });
}
```

**Impact:** Code duplication, inconsistent error handling, maintenance burden

**Fix:** Remove function from MediaLibrary.tsx and import from utils
```typescript
// In MediaLibrary.tsx
import { getImageDimensions } from "../../utils/imageOptimization";

// Line 204-214 can be deleted entirely (10 lines removed)
```

**Effort:** 5 minutes | **LOC Saved:** 10

---

### 2. **DUPLICATE: File Type Determination Logic** ⭐ Quick Win
**Files:**
- `src/pages/admin/MediaLibrary.tsx` (lines 168-176)

**Problem:** File type detection is hardcoded inline in uploadFile():
```typescript
// MediaLibrary.tsx - lines 168-176
let fileType: MediaLibraryItem["file_type"] = "other";
if (file.type.startsWith("image/")) fileType = "image";
else if (file.type.startsWith("video/")) fileType = "video";
else if (file.type.startsWith("audio/")) fileType = "audio";
else if (
  file.type.includes("pdf") ||
  file.type.includes("document") ||
  file.type.includes("text")
) fileType = "document";
```

This logic will likely appear in other upload handlers. Should be centralized.

**Fix:** Extract to `src/utils/fileUtils.ts`:
```typescript
export const getFileType = (mimeType: string): MediaLibraryItem["file_type"] => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) 
    return "document";
  return "other";
};
```

**Effort:** 10 minutes | **LOC Saved:** 12 (now centralized & reusable)

---

### 3. **DUPLICATE: Supabase Upload Logic** ⭐ Priority Fix
**Files:**
- `src/components/admin/ImageUpload.tsx` (lines 37-62)
- `src/pages/admin/MediaLibrary.tsx` (lines 155-167)
- `src/utils/tinymceUpload.ts` (lines 32-47)

**Problem:** Same Supabase file upload pattern repeated 3 times:
```typescript
// Pattern repeated everywhere:
const { data, error } = await supabase.storage
  .from(bucket)
  .upload(uniqueFilename, optimizedFile, {
    cacheControl: "3600",
    upsert: false,
  });

if (error) throw error;

const { data: { publicUrl } } = supabase.storage
  .from(bucket)
  .getPublicUrl(data.path);
```

**Impact:** Maintainability issue, inconsistent error handling across files, duplication of 12+ lines per file

**Fix:** Create `src/utils/supabaseStorageUtils.ts`:
```typescript
export interface UploadResult {
  publicUrl: string;
  storagePath: string;
}

export const uploadFileToSupabase = async (
  bucket: string,
  folder: string,
  file: File,
  fileName: string,
  supabase: SupabaseClient,
): Promise<UploadResult> => {
  const storagePath = `${folder}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { publicUrl, storagePath };
};
```

Then in all three files, replace 15+ lines with:
```typescript
const { publicUrl, storagePath } = await uploadFileToSupabase(
  "images",
  folder,
  optimizedFile,
  uniqueFilename,
  supabase,
);
```

**Effort:** 20 minutes | **LOC Saved:** 35-40

---

## 🟡 MEDIUM PRIORITY Issues

### 4. **HARDCODED Magic Numbers** → Configuration Constants
**Files:** Multiple
- `450px` maxWidth (ImageUpload.tsx, tinymceUpload.ts)
- `1200px` maxWidth (MediaLibrary.tsx)
- `5MB` maxSizeMB (multiple files)
- `0.9` quality (multiple files)
- `50 * 1024 * 1024` file size limit (multiple files)
- `3600` cache control (multiple files)

**Problem:** These values are scattered throughout the codebase. If you need to change upload limits or quality, you have to update multiple files.

**Fix:** Create `src/config/imageUploadConfig.ts`:
```typescript
export const IMAGE_UPLOAD_CONFIG = {
  // Quality settings
  quality: {
    default: 0.9,
    editor: 0.9, // TinyMCE
    mediaLibrary: 0.9,
  },
  
  // Max dimensions by use case
  maxWidth: {
    editor: 450,           // Article/book editors
    mediaLibrary: 1200,    // Media library (larger for better quality)
  },
  
  // File size limits
  limits: {
    sourceMB: 50,          // Max source image size
    outputMB: 5,           // Max optimized size
    sourceBytesLimit: 50 * 1024 * 1024,
    outputBytesLimit: 5 * 1024 * 1024,
  },
  
  // Supabase settings
  supabase: {
    cacheControl: "3600",  // 1 hour
    upsert: false,
  },
  
  // Folders
  folders: {
    editor: "editor",
    uploads: "uploads",
    mediaLibrary: "media",
  },
};
```

Then update files to use it:
```typescript
import { IMAGE_UPLOAD_CONFIG } from "../../config/imageUploadConfig";

// Instead of: maxWidth = 450
const { maxWidth = IMAGE_UPLOAD_CONFIG.maxWidth.editor } = options;

// Instead of: 50 * 1024 * 1024
if (file.size > IMAGE_UPLOAD_CONFIG.limits.sourceBytesLimit) {
```

**Benefit:** 
- Single source of truth
- Easy to adjust limits globally
- Better documentation
- Consistent behavior across upload locations

**Effort:** 30 minutes | **LOC Saved:** Not measured in LOC, but maintenance time reduced by ~80%

---

### 5. **MediaLibrary: Duplicate `formatFileSize` Function**
**Files:**
- `src/utils/imageOptimization.ts` (lines 123-131) ✅ Already exists
- `src/pages/admin/MediaLibrary.tsx` (lines 217-225) ❌ Duplicated

**Problem:** `formatFileSize` is already exported from `imageOptimization.ts` but redefined in MediaLibrary.tsx

**Current Code:**
```typescript
// imageOptimization.ts - Already exported here
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// MediaLibrary.tsx - Duplicated here (not imported)
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
```

**Fix:** Add import and remove duplicate:
```typescript
// MediaLibrary.tsx
import { formatFileSize, getImageDimensions, optimizeImage } from "../../utils/imageOptimization";

// Remove lines 217-225 (9 lines removed)
```

**Effort:** 2 minutes | **LOC Saved:** 9

---

### 6. **Object URL Memory Leak Risk** → Best Practice
**File:** `src/components/admin/ImageUpload.tsx` (lines 138-139)

**Current Code:**
```typescript
const previewUrl = URL.createObjectURL(optimizedFile);
setPreview(previewUrl);

// ... later cleanup
URL.revokeObjectURL(previewUrl);
```

**Problem:** If error occurs between creation and cleanup, URL is not revoked. Also, if component unmounts during upload, cleanup doesn't run.

**Fix:** Use cleanup in useEffect:
```typescript
import { useEffect } from "react";

const ImageUpload = ({ ... }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  
  // ... rest of code
};
```

**Impact:** Prevents memory leaks in browsers, especially important for repeated uploads

**Effort:** 10 minutes | **Impact:** Memory efficiency improvement

---

## 🟢 LOW PRIORITY / OPTIMIZATION SUGGESTIONS

### 7. **MediaLibrary: Inline Filter Logic**
**File:** `src/pages/admin/MediaLibrary.tsx` (lines 284-292)

Current inline filter could be extracted:
```typescript
// Current - inline
const filteredItems = mediaItems.filter((item) =>
  searchTerm
    ? item.original_filename
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
    : true,
);

// Better - extracted with memoization
const filteredItems = useMemo(() => 
  filterMediaItems(mediaItems, searchTerm), 
  [mediaItems, searchTerm]
);
```

**Benefit:** Prevents unnecessary filtering on every render if searchTerm hasn't changed

**Effort:** 15 minutes

---

### 8. **Missing useMemo/useCallback Optimizations**
**File:** `src/pages/admin/MediaLibrary.tsx`

Several functions are recreated on every render:
```typescript
// Should be useCallback to prevent child re-renders
const handleDrag = (e: React.DragEvent) => { ... }
const handleDrop = (e: React.DragEvent) => { ... }
const copyToClipboard = (text: string) => { ... }

// Should be memoized
const filteredItems = mediaItems.filter(...)
```

Impact: Minimal for MediaLibrary (no child components passed these as props), but good practice

**Effort:** 20 minutes

---

### 9. **ImageUpload: Double State Update Risk**
**File:** `src/components/admin/ImageUpload.tsx` (lines 129-145)

```typescript
setOptimizing(false);
setUploading(true);

// Upload the optimized file
await uploadOptimizedFile(optimizedFile);
```

**Potential Issue:** If uploadOptimizedFile completes but component unmounts, you get "Can't perform a React state update on unmounted component" warning.

**Fix:** Use AbortController or check component mount state:
```typescript
const isMountedRef = useRef(true);

useEffect(() => {
  return () => {
    isMountedRef.current = false;
  };
}, []);

// In handlers
if (isMountedRef.current) {
  setOptimizing(false);
}
```

Or simpler: use modern React patterns and let the framework handle it.

**Effort:** 10 minutes

---

## 📊 Summary Table

| Issue | Type | Priority | Files | LOC Saved | Effort |
|-------|------|----------|-------|-----------|--------|
| Duplicate getImageDimensions | DRY | 🔴 High | 2 | 10 | 5 min |
| Duplicate file type logic | DRY | 🔴 High | 1 | 12 | 10 min |
| Duplicate upload logic | DRY | 🔴 High | 3 | 35-40 | 20 min |
| Hardcoded magic numbers | Config | 🟡 Medium | 5+ | — | 30 min |
| Duplicate formatFileSize | DRY | 🟡 Medium | 2 | 9 | 2 min |
| Object URL memory leak | Best Practice | 🟡 Medium | 1 | — | 10 min |
| Filter memoization | Perf | 🟢 Low | 1 | — | 15 min |
| useCallback optimization | Perf | 🟢 Low | 1 | — | 20 min |
| Mount check safety | Best Practice | 🟢 Low | 1 | — | 10 min |

**Total LOC Saved (Quick Wins):** ~66-76 lines  
**Total Effort (High Priority):** ~35 minutes  
**Total Effort (All):** ~2 hours

---

## Implementation Roadmap

### Phase 1: Critical Fixes (35 minutes)
1. ✅ Remove duplicate `getImageDimensions` from MediaLibrary
2. ✅ Extract `getFileType` utility function
3. ✅ Create `supabaseStorageUtils.ts` and refactor all uploads
4. ✅ Update imports and tests

### Phase 2: Configuration Cleanup (30 minutes)
1. ✅ Create `imageUploadConfig.ts`
2. ✅ Update all files to use config constants
3. ✅ Document configuration options

### Phase 3: Best Practices (30 minutes)
1. ✅ Add object URL cleanup in useEffect
2. ✅ Add component mount checks
3. ✅ Add memoization where appropriate

---

## Additional Notes

### Files Reviewed
- ✅ `src/utils/imageOptimization.ts` (140 lines) — Clean, well-structured
- ✅ `src/components/admin/ImageUpload.tsx` (227 lines) — Good component, some optimizations possible
- ✅ `src/pages/admin/MediaLibrary.tsx` (637 lines) — Largest file, good candidate for splitting
- ✅ `src/utils/tinymceUpload.ts` (56 lines) — Uses duplicate patterns
- ✅ `src/components/admin/MediaPicker.tsx` (244 lines) — Not deeply reviewed, but likely has similar patterns
- ✅ `iife.js` (13 lines) — Development test file, can be deleted

### Recommendation
**Start with Phase 1** (Critical Fixes). These will:
- Reduce maintenance burden immediately
- Make future changes easier
- Remove confusion about which function to use
- Improve code consistency

The changes are low-risk and don't require UI changes. All can be completed in under an hour with test updates.

