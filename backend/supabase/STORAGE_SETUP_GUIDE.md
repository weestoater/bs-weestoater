# weeCMS Storage Setup Guide

## Overview

This guide walks you through setting up Supabase Storage for the weeCMS Media Library. The storage bucket will handle all media uploads (images, videos, documents) with proper security policies.

---

## Step 1: Verify Existing Storage Bucket

### Via Supabase Dashboard:

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/huqmjtxwlybjtmouwgaz

2. **Navigate to Storage**:
   - Click **Storage** in the left sidebar

3. **Verify the "images" bucket exists**:
   - ✅ You should see a bucket named `images`
   - This is your existing bucket - we'll use this!

4. **Check bucket settings** (click the gear icon next to "images"):
   - **Public bucket**: ✅ Should be CHECKED
   - **File size limit**: Recommended 10485760 (10MB)
   - If not set, update these settings

5. **No need to create a new bucket** - we're using the existing one!

---

## Step 2: Apply Storage Policies (SQL Editor)

Now apply the RLS (Row Level Security) policies that control who can read/write files.

### Via Supabase Dashboard:

1. **Go to SQL Editor**:
   - Click **SQL Editor** in the left sidebar

2. **Create new query**:
   - Click **"New query"**

3. **Copy and paste** the contents of `backend/supabase/weecms-storage-setup.sql`

4. **Run the query**:
   - Click **"Run"** or press `Ctrl+Enter`

5. **Verify success**:
   - You should see a success message
   - Check the Messages tab for the completion notice

---

## Step 3: Test Upload (Optional)

Test that the storage bucket is working correctly:

### Via Supabase Dashboard:

1. **Go to Storage > public bucket**

2. **Try uploading a test image**:
   - Click **"Upload file"**
   - Select any image
   - Click **"Upload"**

3. **Verify**:
   - File should appear in the bucket
   - Click on the file to get its public URL
   - Open the URL in a browser - it should be publicly accessible

4. **Clean up**:
   - Delete the test file if desired

---

## Storage Policies Summary

The following policies are applied:

### 🔓 Public Read Access

- **Anyone** can view/download files from the `images` bucket
- No authentication required for viewing
- Perfect for public website media

### 🔒 Admin-Only Write Access

- **Only authenticated users** can upload files
- **Only authenticated users** can update files
- **Only authenticated users** can delete files
- Protects against unauthorized uploads

---

## Recommended Folder Structure

Organize your media using these folders:

```
/images/
  ├── content-blocks/  # Content block images
  ├── articles/        # Article images
  ├── covers/          # Book covers, banners
  ├── avatars/         # User profile pictures
  ├── documents/       # PDFs, Word docs
  └── videos/          # Video files
```

**Note**: The `mediaService.js` automatically organizes uploads by folder when you specify the `folder` parameter.

---

## CORS Configuration (Usually Not Needed)

If you encounter CORS issues when uploading from your frontend:

1. **Go to**: Project Settings > API
2. **Scroll to**: CORS Configuration
3. **Add your domain**: `https://your-domain.com`
4. For development, add: `http://localhost:5173`

**Most cases don't need this** - Supabase handles CORS automatically for authenticated requests.

---

## File Size Limits

### Default Recommendation: 10MB

Adjust based on your needs:

- **Images**: 5MB is usually sufficient
- **Videos**: 50MB+ for short clips
- **Documents**: 10MB for PDFs

To change the limit:

1. Go to **Storage** > **public** bucket
2. Click **Settings** (gear icon)
3. Update **File size limit**
4. Click **Save**

---

## Allowed MIME Types (Optional)

To restrict file types that can be uploaded:

1. Go to **Storage** > **public** bucket settings
2. Set **Allowed MIME types**:
   ```
   image/*          # All images
   video/*          # All videos
   application/pdf  # PDFs only
   ```

**Leave empty** to allow all file types (recommended for flexibility).

---

## Troubleshooting

### Upload fails with 403 Forbidden

**Cause**: User not authenticated or policies not applied

**Fix**:

1. Verify user is logged in (check `auth.role()`)
2. Re-run the storage policies SQL
3. Check bucket is named exactly `images`

### Files not publicly accessible

**Cause**: Bucket is private

**Fix**:

1. Go to **Storage** > **images** bucket settings
2. Enable **"Public bucket"** option
3. Click **Save**

### Upload fails with 413 Payload Too Large

**Cause**: File exceeds size limit

**Fix**:

1. Increase file size limit in bucket settings
2. Or optimize/compress the file before uploading

---

## Integration with Frontend

Once storage is set up, your frontend can upload files using the `mediaService`:

```javascript
import { createMediaServiceFromEnv } from "../backend";

const mediaService = await createMediaServiceFromEnv();

// Upload a file
const result = await mediaService.uploadMedia({
  file: fileFromInput,
  bucket: "images", // Uses 'images' bucket by default
  folder: "content-blocks", // Optional subfolder
  metadata: {
    alt_text: "Description of image",
    tags: ["hero", "featured"],
  },
});

console.log("File uploaded:", result.public_url);
```

---

## Next Steps

After completing storage setup:

✅ **Phase 1 Complete!** All infrastructure is now in place:

- Database tables created
- Service layer implemented
- Storage configured

🚀 **Move to Phase 2**: Build admin interfaces for content management

See `docs/WEECMS_IMPLEMENTATION_PLAN.md` for Phase 2 details.
