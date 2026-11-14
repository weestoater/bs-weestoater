# Test Image Upload NOW ✅

## Quick Start (2 minutes)

### 1. Start the dev server
```bash
npm run dev
```
It will say:
```
➜  Local:   http://localhost:3000/
```

### 2. Go to Media Library
**Open this in your browser:**
```
http://localhost:3000/admin/media-library
```

### 3. Upload a Test Image
- **Drag & drop** a large image (15-50MB recommended) OR
- Click **"Select Files"** button
- Wait for **"Optimizing..."** message
- See the size reduction stats:
  ```
  Original: 25 MB
  Optimized: 6.2 MB
  Size Reduction: 75%
  ```

### 4. Done! ✅
Image is uploaded and optimized. Check Supabase Storage to verify.

---

## What You Should See

### Upload in Progress
```
Button shows: "Uploading..."
Status bar: Processing
Time: 5-15 seconds (depending on file size)
```

### After Upload Success
```
✓ Image preview appears
✓ Green success message: "Successfully uploaded 1 file(s)"
✓ Image appears in Media Library grid
```

### File Sizes
```
Before optimization: ~25 MB
After optimization:  ~6 MB
Reduction:          ~75%
```

---

## Test Files to Try

### Test 1: Large Photo (RECOMMENDED)
- Size: 15-20 MB
- Expected reduction: 75%
- Expected time: 8-12 seconds

### Test 2: Very High Resolution
- Size: 30-50 MB
- Expected reduction: 80%
- Expected time: 10-15 seconds

### Test 3: Already Optimized Image
- Size: < 2 MB
- Expected reduction: 20-30%
- Expected time: 1-2 seconds

---

## Where to Find It

| Page | URL | Purpose |
|------|-----|---------|
| Media Library | `/admin/media-library` | **Main upload location** |
| Article Editor | `/admin/articles/new` | Featured image upload |
| Book Editor | `/admin/books/new` | Book cover upload |
| Article Content | `/admin/articles/new` + scroll to TinyMCE | Inline image upload |

---

## Success Indicators ✅

- [ ] "Optimizing..." appears when uploading
- [ ] File size reduction is shown (should be 60-80%)
- [ ] Upload completes within 15 seconds
- [ ] Image preview appears
- [ ] Green success message appears
- [ ] Image shows in Media Library grid

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't upload 15+ MB | Try smaller file first (5MB) |
| Optimization takes > 20 sec | Try different browser (Chrome preferred) |
| No success message | Check console: F12 → Console tab |
| Image doesn't appear | Refresh page: F5 or Cmd+R |

---

## Files Changed

- ✅ `/src/components/admin/ImageUpload.tsx` - Enhanced with optimization
- ✅ `/src/pages/admin/MediaLibrary.tsx` - Now supports 50MB, automatic optimization
- ✅ `/src/utils/tinymceUpload.ts` - TinyMCE images optimized
- ✅ `/src/utils/imageOptimization.ts` - NEW utility for compression
- ✅ Tests updated and passing

---

## Next Steps

1. ✅ Test uploading locally (you are here)
2. ⬜ Verify quality is acceptable
3. ⬜ Deploy to production
4. ⬜ Monitor uploads in Supabase dashboard

---

## Questions?

Check:
- `/docs/IMAGE_OPTIMIZATION_GUIDE.md` - Full documentation
- `/LOCAL_IMAGE_UPLOAD_TESTING.md` - Detailed testing guide
- Browser console (F12) - Error messages

**Ready? Go upload an image! 📸**
