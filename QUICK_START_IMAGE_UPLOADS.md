# Quick Start: Testing Image Uploads Locally

## TL;DR

```bash
# Dev server is already running at http://localhost:3000

# Navigate to one of these pages to test:
# - http://localhost:3000/admin/media-library    (Media Library)
# - http://localhost:3000/admin/articles/new     (Article Editor)
# - http://localhost:3000/admin/books/new        (Book Editor)
```

## What Happens When You Upload

1. **Select a large image** (5MB+)
2. **Browser optimizes it:**
   - Resizes to 450px width (or custom size)
   - Reduces quality to 90% (configurable)
   - Compresses down to ~2MB or less
   - Shows optimization progress

3. **You see stats:**
   ```
   Original: 8.5 MB
   Optimized: 2.1 MB
   Size Reduction: 75%
   ```

4. **Preview appears** showing optimized image
5. **Upload completes** to Supabase storage
6. **Public URL is returned** for use on site

## Locations to Test Uploads

### Option 1: Media Library (Recommended)
```
http://localhost:3000/admin/media-library
```
- Purpose: General image uploads
- Features: Upload, browse, delete images
- Best for: Testing optimization in isolation

### Option 2: Article Editor
```
http://localhost:3000/admin/articles/new
```
- Purpose: Upload article featured images
- Features: Inline upload during article creation
- Best for: Testing integration with editors

### Option 3: Book Editor
```
http://localhost:3000/admin/books/new
```
- Purpose: Upload book cover images
- Features: Cover image upload
- Best for: Testing specific image types

### Option 4: Article Content (TinyMCE)
```
http://localhost:3000/admin/articles/new
```
- Scroll to content editor
- Click "Insert Image" in TinyMCE toolbar
- Purpose: Upload images to article body
- Features: Full TinyMCE integration
- Best for: Testing editor image insertion

## What to Expect

### During Optimization
```
Button text: "Optimizing..."
Duration: 2-10 seconds (depends on file size)
Console: No errors should appear
```

### After Optimization
```
✓ Preview image appears
✓ Original size displays (e.g., "8.5 MB")
✓ Optimized size displays (e.g., "2.1 MB")
✓ Reduction percentage displays (e.g., "75%")
```

### During Upload
```
Button text: "Uploading..."
Duration: 1-5 seconds (depends on network)
Network tab: POST request to Supabase storage
```

### After Upload
```
✓ Success callback fires
✓ Public URL appears in callback
✓ Image saved in Supabase storage
✓ Can be viewed/downloaded directly
```

## Test Cases

### Test 1: Large Photo (8-10MB JPEG)
- Filename: vacation.jpg
- Original size: 8.5 MB
- Expected result: ~2-2.5 MB (70% reduction)
- Time: ~7-8 seconds total

### Test 2: Screenshot (PNG 5MB)
- Filename: screenshot.png
- Original size: 5 MB
- Expected result: ~1.5 MB (70% reduction)
- Time: ~5-6 seconds total

### Test 3: Small Image (< 1MB)
- Filename: icon.jpg
- Original size: 0.8 MB
- Expected result: ~0.5 MB (37% reduction)
- Time: ~1-2 seconds total

### Test 4: Very Large Photo (15MB+)
- Filename: highres.jpg
- Original size: 15 MB
- Expected result: ~3 MB (80% reduction)
- Time: ~10+ seconds total

## Verify It's Working

### In Browser
1. Open DevTools: `F12` (Windows) or `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. Look for upload status messages
4. No red errors should appear

### In Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Storage** → **images** bucket
4. Look for `uploads/` folder
5. See uploaded images with timestamps

### Check Upload Size
1. Open DevTools → **Network** tab
2. Select an image and upload
3. Find the POST request to Supabase
4. Check **Size** column shows reduced size
5. Compare to original file size

## Troubleshooting

**Issue: No image upload button visible**
- Solution: Check page is loading correctly
- Try refreshing: `Cmd+R` (Mac) or `Ctrl+R` (Windows)
- Check browser console for errors

**Issue: "Please select an image file" error**
- Solution: Your file isn't a recognized image
- Try: JPG, PNG, GIF, or WebP format
- Check file actually contains image data

**Issue: "Source image size must be less than 20MB"**
- Solution: File is larger than 20MB limit
- Try: Compress locally first
- Use: Online image compressor

**Issue: Optimization takes > 15 seconds**
- Solution: File is very large (15MB+)
- Try: Smaller source image
- Check: Device has enough memory

**Issue: Upload succeeds but image doesn't appear**
- Solution: Check Supabase storage permissions
- Navigate to: Supabase dashboard → Storage → images
- Verify: Bucket has "public" access enabled

## Performance Tips

- **Use WiFi** for faster uploads (not mobile data)
- **Close other apps** to free up memory
- **Try different browsers** (Chrome usually fastest)
- **Refresh page** between uploads to clear memory

## Next Steps

✅ **After verifying uploads work:**

1. Use it in your article/book editors
2. Upload real content images
3. Verify quality meets your standards
4. Check storage usage decreased
5. Monitor upload success rates

## Need Help?

- Check console: `F12` → Console tab
- Read detailed guide: `/docs/IMAGE_OPTIMIZATION_GUIDE.md`
- Read testing guide: `/LOCAL_IMAGE_UPLOAD_TESTING.md`
- Look at component: `/src/components/admin/ImageUpload.tsx`

## Key Files

- 📸 Component: `src/components/admin/ImageUpload.tsx`
- ⚙️ Utilities: `src/utils/imageOptimization.ts`
- 📝 Editor handler: `src/utils/tinymceUpload.ts`
- 🧪 Tests: `src/__tests__/components/admin/ImageUpload.test.tsx`
- 📚 Full guide: `docs/IMAGE_OPTIMIZATION_GUIDE.md`
- 🧑‍💻 Testing guide: `LOCAL_IMAGE_UPLOAD_TESTING.md`

Happy uploading! 📸✨
