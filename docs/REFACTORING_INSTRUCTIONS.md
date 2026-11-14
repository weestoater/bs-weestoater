# Refactoring Instructions - Quick Implementation Guide

This document provides step-by-step instructions to fix the DRY violations identified in the code review.

---

## Quick Fix 1: Remove Duplicate `getImageDimensions` (5 min)

### Step 1: Update MediaLibrary.tsx imports
**File:** `src/pages/admin/MediaLibrary.tsx`

Change line ~5:
```typescript
// BEFORE
import { optimizeImage } from "../../utils/imageOptimization";

// AFTER
import { optimizeImage, getImageDimensions } from "../../utils/imageOptimization";
```

### Step 2: Delete duplicate function
**File:** `src/pages/admin/MediaLibrary.tsx`

Delete lines 204-214 (the entire `getImageDimensions` function):
```typescript
// DELETE THIS:
function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
}
```

✅ **Result:** 10 lines removed, single source of truth

---

## Quick Fix 2: Remove Duplicate `formatFileSize` (2 min)

### Step 1: Update MediaLibrary.tsx imports
**File:** `src/pages/admin/MediaLibrary.tsx`

Change line ~5:
```typescript
// BEFORE
import { optimizeImage, getImageDimensions } from "../../utils/imageOptimization";

// AFTER
import { 
  optimizeImage, 
  getImageDimensions, 
  formatFileSize 
} from "../../utils/imageOptimization";
```

### Step 2: Delete duplicate function
**File:** `src/pages/admin/MediaLibrary.tsx`

Delete lines 217-225 (the entire `formatFileSize` function):
```typescript
// DELETE THIS:
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
```

✅ **Result:** 9 lines removed

---

## Quick Fix 3: Extract File Type Utility (10 min)

### Step 1: Create new file
**File:** `src/utils/fileUtils.ts` (NEW FILE)

```typescript
import { MediaLibraryItem } from "../types/weecms";

/**
 * Determines file type based on MIME type
 */
export const getFileType = (
  mimeType: string,
): MediaLibraryItem["file_type"] => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  ) {
    return "document";
  }
  return "other";
};
```

### Step 2: Update MediaLibrary.tsx
**File:** `src/pages/admin/MediaLibrary.tsx`

Add import at top:
```typescript
import { getFileType } from "../../utils/fileUtils";
```

Find and replace inline file type detection (around line 168):
```typescript
// BEFORE (9 lines)
let fileType: MediaLibraryItem["file_type"] = "other";
if (file.type.startsWith("image/")) fileType = "image";
else if (file.type.startsWith("video/")) fileType = "video";
else if (file.type.startsWith("audio/")) fileType = "audio";
else if (
  file.type.includes("pdf") ||
  file.type.includes("document") ||
  file.type.includes("text")
)
  fileType = "document";

// AFTER (1 line)
const fileType = getFileType(file.type);
```

✅ **Result:** 12 lines removed, centralized logic

---

## Priority Fix 4: Create Supabase Storage Utils (20 min)

### Step 1: Create new utility file
**File:** `src/utils/supabaseStorageUtils.ts` (NEW FILE)

```typescript
import { SupabaseClient } from "@supabase/supabase-js";

export interface UploadResult {
  publicUrl: string;
  storagePath: string;
}

/**
 * Uploads a file to Supabase Storage and returns the public URL
 */
export const uploadFileToSupabase = async (
  supabase: SupabaseClient,
  bucket: string,
  folder: string,
  file: File,
  fileName: string,
): Promise<UploadResult> => {
  const storagePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { publicUrl, storagePath };
};
```

### Step 2: Update ImageUpload.tsx
**File:** `src/components/admin/ImageUpload.tsx`

Add import at top:
```typescript
import { uploadFileToSupabase, type UploadResult } from "../../utils/supabaseStorageUtils";
```

Replace the entire `uploadOptimizedFile` function (lines 32-62):
```typescript
// BEFORE (31 lines)
const uploadOptimizedFile = async (
  optimizedFile: File,
): Promise<void> => {
  try {
    const supabase = getSupabaseClient();

    // Generate unique filename with webp extension for better compression
    const fileExt = optimizedFile.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload optimized file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, optimizedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    onUploadComplete(publicUrl);
  } catch (err) {
    console.error("Upload error:", err);
    setError(err instanceof Error ? err.message : "Failed to upload image");
  } finally {
    setUploading(false);
  }
};

// AFTER (10 lines)
const uploadOptimizedFile = async (
  optimizedFile: File,
): Promise<void> => {
  try {
    const supabase = getSupabaseClient();
    const fileExt = optimizedFile.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { publicUrl } = await uploadFileToSupabase(
      supabase,
      bucket,
      folder,
      optimizedFile,
      fileName,
    );

    onUploadComplete(publicUrl);
  } catch (err) {
    console.error("Upload error:", err);
    setError(err instanceof Error ? err.message : "Failed to upload image");
  } finally {
    setUploading(false);
  }
};
```

### Step 3: Update MediaLibrary.tsx
**File:** `src/pages/admin/MediaLibrary.tsx`

Add import at top:
```typescript
import { uploadFileToSupabase } from "../../utils/supabaseStorageUtils";
```

In the `uploadFile` function, replace the upload section (around lines 155-167):
```typescript
// BEFORE (25+ lines)
// Generate unique filename
const timestamp = Date.now();
const sanitizedName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
const filename = `${timestamp}_${sanitizedName}`;
const folder = filterFolder !== "all" ? filterFolder : "uploads";
const storagePath = `${folder}/${filename}`;

// Upload to storage
const { error: uploadError } = await supabase.storage
  .from("images")
  .upload(storagePath, uploadFile, {
    cacheControl: "3600",
    upsert: false,
  });

if (uploadError) throw uploadError;

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage.from("images").getPublicUrl(storagePath);

// AFTER (8 lines)
const timestamp = Date.now();
const sanitizedName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
const filename = `${timestamp}_${sanitizedName}`;
const folderName = filterFolder !== "all" ? filterFolder : "uploads";

const { publicUrl } = await uploadFileToSupabase(
  supabase,
  "images",
  folderName,
  uploadFile,
  filename,
);
```

### Step 4: Update tinymceUpload.ts
**File:** `src/utils/tinymceUpload.ts`

Add import at top:
```typescript
import { uploadFileToSupabase } from "./supabaseStorageUtils";
```

Replace the upload section (around lines 32-47):
```typescript
// BEFORE (18 lines)
const fileExt =
  optimizedFile.type === "image/webp" ? "webp" : filename.split(".").pop() || "png";
const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

const { data, error } = await supabase.storage
  .from(bucket)
  .upload(uniqueFilename, optimizedFile, {
    cacheControl: "3600",
    upsert: false,
  });

if (error) {
  console.error("Upload error:", error);
  throw new Error(error.message);
}

progress(90);

const {
  data: { publicUrl },
} = supabase.storage.from(bucket).getPublicUrl(data.path);

// AFTER (9 lines)
const fileExt =
  optimizedFile.type === "image/webp" ? "webp" : filename.split(".").pop() || "png";
const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

const { publicUrl } = await uploadFileToSupabase(
  supabase,
  bucket,
  folder,
  optimizedFile,
  uniqueFilename,
);

progress(90);
```

✅ **Result:** 35-40 lines removed across 3 files, single source of truth

---

## Configuration Cleanup: Create Image Upload Config (30 min)

### Step 1: Create configuration file
**File:** `src/config/imageUploadConfig.ts` (NEW FILE)

```typescript
/**
 * Centralized configuration for image upload behavior
 * Modify these values to change upload limits and optimization settings globally
 */

export const IMAGE_UPLOAD_CONFIG = {
  // Quality settings (0.0 - 1.0)
  quality: {
    default: 0.9,
    editor: 0.9,        // Article/book editors, TinyMCE
    mediaLibrary: 0.9,  // Media library
  },

  // Maximum dimensions by context (in pixels)
  maxWidth: {
    editor: 450,        // Articles, books, TinyMCE
    mediaLibrary: 1200, // Media library (larger for better quality)
  },

  // File size limits
  limits: {
    sourceMB: 50,                      // Max source image size
    outputMB: 5,                       // Max optimized size
    sourceBytesLimit: 50 * 1024 * 1024,
    outputBytesLimit: 5 * 1024 * 1024,
  },

  // Supabase storage settings
  supabase: {
    bucket: "images",
    cacheControl: "3600",  // 1 hour
    upsert: false,
  },

  // Default folders
  folders: {
    editor: "editor",
    mediaLibrary: "uploads",
    default: "uploads",
  },

  // Error messages
  messages: {
    sourceToolargeSize: "Source image size must be less than 50MB",
    outputTooLargeSize: "Optimized image size exceeded 5MB limit",
    invalidFileType: "Please select an image file",
    optimizationFailed: "Image optimization failed",
    uploadFailed: "Failed to upload image",
  },
} as const;

// Type helpers
export type ImageUploadContext = "editor" | "mediaLibrary";

export const getQuality = (context: ImageUploadContext): number =>
  IMAGE_UPLOAD_CONFIG.quality[context] ?? IMAGE_UPLOAD_CONFIG.quality.default;

export const getMaxWidth = (context: ImageUploadContext): number =>
  IMAGE_UPLOAD_CONFIG.maxWidth[context] ?? IMAGE_UPLOAD_CONFIG.maxWidth.editor;

export const getFolder = (context: ImageUploadContext): string =>
  IMAGE_UPLOAD_CONFIG.folders[context] ?? IMAGE_UPLOAD_CONFIG.folders.default;
```

### Step 2: Update ImageUpload.tsx to use config
**File:** `src/components/admin/ImageUpload.tsx`

Add import:
```typescript
import { IMAGE_UPLOAD_CONFIG, getQuality, getMaxWidth } from "../../config/imageUploadConfig";
```

Update component props default:
```typescript
// BEFORE
export const ImageUpload = ({
  onUploadComplete,
  currentImage,
  bucket = "images",
  folder = "uploads",
  maxWidth = 450,
  quality = 0.9,
}: ImageUploadProps) => {

// AFTER
export const ImageUpload = ({
  onUploadComplete,
  currentImage,
  bucket = IMAGE_UPLOAD_CONFIG.supabase.bucket,
  folder = IMAGE_UPLOAD_CONFIG.folders.editor,
  maxWidth = IMAGE_UPLOAD_CONFIG.maxWidth.editor,
  quality = IMAGE_UPLOAD_CONFIG.quality.editor,
}: ImageUploadProps) => {
```

Update validation error message:
```typescript
// BEFORE
if (file.size > 50 * 1024 * 1024) {
  setError("Source image size must be less than 50MB");
  return;
}

// AFTER
if (file.size > IMAGE_UPLOAD_CONFIG.limits.sourceBytesLimit) {
  setError(IMAGE_UPLOAD_CONFIG.messages.sourceToolargeSize);
  return;
}
```

### Step 3: Update MediaLibrary.tsx to use config
**File:** `src/pages/admin/MediaLibrary.tsx`

Add import:
```typescript
import { IMAGE_UPLOAD_CONFIG } from "../../config/imageUploadConfig";
```

Update upload function:
```typescript
// BEFORE
if (file.size > 50 * 1024 * 1024) {
  throw new Error("Image size must be less than 50MB");
}

uploadFile = await optimizeImage(file, {
  maxWidth: 1200,
  maxHeight: 1200,
  maxSizeMB: 5,
  quality: 0.9,
});

// AFTER
if (file.size > IMAGE_UPLOAD_CONFIG.limits.sourceBytesLimit) {
  throw new Error(IMAGE_UPLOAD_CONFIG.messages.sourceToolargeSize);
}

uploadFile = await optimizeImage(file, {
  maxWidth: IMAGE_UPLOAD_CONFIG.maxWidth.mediaLibrary,
  maxHeight: IMAGE_UPLOAD_CONFIG.maxWidth.mediaLibrary,
  maxSizeMB: IMAGE_UPLOAD_CONFIG.limits.outputMB,
  quality: IMAGE_UPLOAD_CONFIG.quality.mediaLibrary,
});
```

### Step 4: Update tinymceUpload.ts to use config
**File:** `src/utils/tinymceUpload.ts`

Add import:
```typescript
import { IMAGE_UPLOAD_CONFIG } from "../config/imageUploadConfig";
```

Update upload handler:
```typescript
// BEFORE
const optimizedFile = await optimizeImage(file, {
  maxWidth: 450,
  maxHeight: 450,
  maxSizeMB: 5,
  quality: 0.9,
});

progress(60);

const fileExt =
  optimizedFile.type === "image/webp" ? "webp" : filename.split(".").pop() || "png";
const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

const { data, error } = await supabase.storage
  .from(bucket)

// AFTER
const optimizedFile = await optimizeImage(file, {
  maxWidth: IMAGE_UPLOAD_CONFIG.maxWidth.editor,
  maxHeight: IMAGE_UPLOAD_CONFIG.maxWidth.editor,
  maxSizeMB: IMAGE_UPLOAD_CONFIG.limits.outputMB,
  quality: IMAGE_UPLOAD_CONFIG.quality.editor,
});

progress(60);

const fileExt =
  optimizedFile.type === "image/webp" ? "webp" : filename.split(".").pop() || "png";
const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

const { data, error } = await supabase.storage
  .from(IMAGE_UPLOAD_CONFIG.supabase.bucket)
```

✅ **Result:** All magic numbers centralized, easy to modify globally

---

## Testing Checklist

After making changes, verify:

- [ ] All tests still pass: `npm run test`
- [ ] No lint errors: `npm run lint`
- [ ] Project builds: `npm run build`
- [ ] Image uploads work in Media Library
- [ ] Article editor image upload works
- [ ] TinyMCE image paste/upload works
- [ ] File size limits are respected
- [ ] Optimization feedback is displayed
- [ ] No browser console errors

---

## Validation Commands

```bash
# Run tests
npm run test

# Check linting
npm run lint -- --fix

# Build project
npm run build

# Type check
npx tsc --noEmit
```

---

## Cleanup (Optional)

After fixes are verified, you can delete:
- `iife.js` - Development test file, not needed in production

```bash
rm iife.js
```

---

## Summary

**Total Time:** ~1 hour  
**Files Modified:** 4  
**Files Created:** 3 new utility files  
**Lines Removed:** ~80  
**Lines Added:** ~150 (mostly documentation)  
**Net Result:** More maintainable, centralized, DRY codebase

**Benefits:**
✅ Single source of truth for upload configuration  
✅ Reduced code duplication  
✅ Easier to modify behavior globally  
✅ Better error handling consistency  
✅ Improved maintainability  

