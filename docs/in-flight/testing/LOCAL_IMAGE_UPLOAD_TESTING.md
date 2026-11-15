# Local Image Upload Testing Guide

## Prerequisites

✅ Dev server running (`npm run dev`)  
✅ Supabase project configured (check `.env` file)  
✅ Supabase storage bucket created (`images` bucket by default)

## Starting the Dev Server

```bash
npm run dev
```

The server will start at:
- **Local**: `http://localhost:3000`
- **Network**: `http://192.168.0.101:3000` (replace with your actual IP)

## Testing Image Uploads

### Option 1: Upload via Admin Interface (Recommended)

1. **Navigate to the admin panel**
   - Go to `http://localhost:3000/admin` (or your admin route)
   - You should see admin tools/settings pages

2. **Find the Image Upload Component**
   - Look for the "Upload Image" button
   - This could be in:
     - `Media Library` page
     - `Article Editor` (for featured images)
     - `Book Editor` (for book covers)
     - `Settings Manager`

3. **Test the Upload**
   - Click "Upload Image"
   - Select a large image file (5MB+) to see the optimization in action
   - You should see:
     - "Optimizing..." status
     - Original file size before optimization
     - Optimized file size after compression
     - Percentage size reduction
     - Preview of optimized image

### Option 2: Direct Component Testing (Advanced)

Create a test page to specifically test the ImageUpload component:

**File**: `src/pages/ImageUploadTest.tsx`

```tsx
import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export function ImageUploadTest() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleUploadComplete = (url: string) => {
    console.log("Image uploaded successfully:", url);
    setUploadedUrls(prev => [...prev, url]);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h1>Image Upload Test</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Standard Upload (450px)</h5>
              <ImageUpload 
                onUploadComplete={handleUploadComplete}
                folder="test-uploads"
              />
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Large Width (800px)</h5>
              <ImageUpload 
                onUploadComplete={handleUploadComplete}
                maxWidth={800}
                folder="test-uploads"
              />
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Thumbnail Size (300px)</h5>
              <ImageUpload 
                onUploadComplete={handleUploadComplete}
                maxWidth={300}
                folder="test-uploads"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h3>Uploaded Images</h3>
          {uploadedUrls.length === 0 ? (
            <p className="text-muted">No images uploaded yet</p>
          ) : (
            <div>
              {uploadedUrls.map((url, i) => (
                <div key={i} className="mb-3">
                  <p className="small">
                    <strong>Upload {i + 1}:</strong><br />
                    <code>{url}</code>
                  </p>
                  <img 
                    src={url} 
                    alt={`Uploaded ${i + 1}`}
                    style={{ maxWidth: "100%", border: "1px solid #ddd" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

Then add the route to `src/routes.tsx`:

```tsx
import { ImageUploadTest } from "./pages/ImageUploadTest";

export const routes = [
  // ... existing routes
  { path: "/upload-test", element: <ImageUploadTest /> },
];
```

Visit: `http://localhost:3000/upload-test`

## What to Observe

### Success Indicators ✅

1. **Optimization Phase**
   - Button shows "Optimizing..." text
   - Process completes in 2-10 seconds (depending on file size)

2. **Results Display**
   - Shows original file size (e.g., "8.5 MB")
   - Shows optimized file size (e.g., "2.1 MB")
   - Shows size reduction percentage (e.g., "75%")
   - Preview image appears

3. **Upload Phase**
   - Button shows "Uploading..." text
   - Upload completes (usually 1-5 seconds)

4. **Completion**
   - `onUploadComplete` callback fires with public URL
   - Image URL shows in console
   - Preview displays final optimized image

### Testing Different Scenarios

**Test 1: Large Image (8-10MB)**
```
Before: 8.5 MB
After: 2.1 MB
Reduction: 75%
✓ Significant compression
```

**Test 2: Medium Image (3-5MB)**
```
Before: 5.2 MB
After: 1.8 MB
Reduction: 65%
✓ Good compression
```

**Test 3: Small Image (< 1MB)**
```
Before: 0.8 MB
After: 0.5 MB
Reduction: 37%
✓ Already optimized, minimal savings
```

**Test 4: Wide Image (4000px width)**
```
Before: 6.3 MB (4000x3000)
After: 1.8 MB (450x338)
Reduction: 71%
✓ Resizing makes big difference
```

## Browser Developer Tools

### Console Logging

The ImageUpload component logs to browser console:

```bash
# Open browser DevTools: F12 or Cmd+Option+I
# Go to Console tab
```

You'll see:
```
Image optimization failed: TypeError...    (if error)
Upload error: ...                           (if upload fails)
```

### Network Tab

Watch the upload happen in real-time:

1. Open DevTools → Network tab
2. Select an image
3. Watch the request:
   - **Method**: `POST`
   - **URL**: `https://your-supabase-url/storage/v1/object/...`
   - **File size**: Optimized size (much smaller!)
   - **Duration**: Usually < 5 seconds

### Application/Storage Tab

View uploaded images in Supabase storage:

1. Open DevTools → Application tab
2. This doesn't show Supabase storage directly
3. Instead, visit Supabase dashboard:
   - Go to `https://app.supabase.com`
   - Find your project
   - Go to Storage → images bucket
   - See your test uploads in `test-uploads/` folder

## Verifying Supabase Connection

Before uploading, verify your Supabase is configured:

```bash
# Check environment variables
cat .env

# Should have:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If missing, you'll get an error like:
```
Failed to upload image: Invalid Supabase configuration
```

## Troubleshooting

### Issue: "Failed to optimize image"

**Possible causes:**
- Browser doesn't support Canvas API
- Image format not supported
- Memory limit exceeded

**Solutions:**
- Use Chrome, Firefox, or Safari (not IE)
- Try a JPG or PNG file
- Use a smaller source image

### Issue: "Source image size must be less than 20MB"

**Possible causes:**
- File is genuinely > 20MB

**Solutions:**
- Compress locally before uploading
- Use online image compressor first

### Issue: Upload succeeds but no public URL returned

**Possible causes:**
- Supabase storage permissions issue
- Bucket doesn't exist

**Solutions:**
- Check Supabase dashboard → Storage
- Verify "images" bucket exists
- Check bucket is public (not private)

### Issue: Optimization is very slow (> 10 seconds)

**Possible causes:**
- Large file (15+ MB)
- Old/slow device
- Browser busy with other tasks

**Solutions:**
- Use a smaller source
- Try a faster browser
- Close other tabs/apps
- Restart browser

## Performance Testing

### Measure Optimization Speed

```javascript
// Paste in browser console while uploading
const start = performance.now();
// ... select image and watch console ...
const end = performance.now();
console.log(`Optimization took ${end - start}ms`);
```

Expected times:
- 1-3MB: 1-3 seconds
- 3-8MB: 3-7 seconds
- 8-15MB: 7-10 seconds
- 15MB+: 10+ seconds (or timeout)

### Measure Upload Speed

```javascript
// Network tab in DevTools shows transfer time
// Factor: Upload speed = File size / Transfer time

// Example:
// File size: 2MB
// Transfer time: 5 seconds
// Speed: 400 KB/s (typical for local network)
```

## Testing Across Devices

### Desktop
```bash
npm run dev
# Visit http://localhost:3000
```

### Mobile/Tablet
```bash
# From desktop, get your IP
ifconfig | grep inet

# On mobile, visit:
http://YOUR_IP:3000
```

This tests real network conditions and mobile browser performance.

## Integration Testing

After successful local testing, verify it works with:

1. **TinyMCE Editor** (if used)
   - Upload image in editor
   - Verify optimization happens
   - Check image displays correctly

2. **Article/Book Editors**
   - Upload featured image
   - Check optimization
   - Save and reload

3. **Media Library** (if exists)
   - Upload batch of images
   - Check all are optimized
   - Verify they appear in gallery

## Tips for Best Results

1. **Use variety of test images**
   - High-resolution photos (8MP+)
   - Screenshots (2-3MP)
   - Graphics/logos (PNG with transparency)

2. **Test on different browsers**
   - Desktop: Chrome, Firefox, Safari
   - Mobile: Safari (iOS), Chrome Mobile (Android)

3. **Monitor console logs**
   - Watch for warnings/errors
   - Check performance metrics
   - Verify Supabase calls succeed

4. **Check file sizes**
   - Compare before/after in DevTools
   - Verify reduction percentage
   - Calculate storage savings

## Next Steps

Once you've verified local uploads work:

1. **Deploy to staging** (if available)
   - Test against real Supabase in cloud
   - Verify network latency doesn't cause issues

2. **Test with real content**
   - Upload actual images for your site
   - Verify quality is acceptable
   - Check rendering in articles/galleries

3. **Monitor in production** (optional)
   - Track average file sizes
   - Monitor upload success rate
   - Adjust `maxWidth` or `quality` if needed

## Support

If uploads don't work:

1. Check browser console (F12) for error messages
2. Check Supabase dashboard for storage issues
3. Verify `.env` file has correct credentials
4. Try a different image format/size
5. Restart dev server: `npm run dev`

Happy uploading! 📸
