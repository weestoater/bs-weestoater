# Image Optimization Guide

## Overview

This guide explains the automatic image optimization system that reduces image file sizes and dimensions when uploaded to your site.

## Features

✅ **Automatic Client-Side Optimization**
- Reduces image dimensions to 450px width (configurable)
- Compresses images to 90% quality (configurable)
- Limits file size to 2MB after optimization
- Preserves aspect ratio during resizing

✅ **Real-Time Feedback**
- Shows original file size before optimization
- Displays optimized file size after compression
- Calculates and shows percentage reduction
- Provides preview of optimized image

✅ **Seamless Integration**
- Works with existing Supabase storage
- Supports JPEG, PNG, GIF, and WebP formats
- Handles files up to 20MB (source size limit)
- Non-intrusive; existing workflows unchanged

## How It Works

### Upload Flow

1. User selects an image file (max 20MB)
2. **Validation Phase**: File type and size checks
3. **Optimization Phase**: Image is resized and compressed in the browser
4. **Preview Phase**: Optimized image is displayed with size reduction stats
5. **Upload Phase**: Optimized file is uploaded to Supabase
6. **Cleanup**: Resources are released; public URL is returned

### Size Reduction Example

| Original | After Optimization | Reduction |
|----------|------------------|-----------|
| 8.5 MB   | 2.1 MB           | 75%       |
| 5.2 MB   | 1.8 MB           | 65%       |
| 3.0 MB   | 0.9 MB           | 70%       |

## Usage

### Basic Usage (ImageUpload Component)

```tsx
import { ImageUpload } from "@/components/admin/ImageUpload";

export function MyComponent() {
  const handleUploadComplete = (url: string) => {
    console.log("Image uploaded:", url);
    // Save URL to database, etc.
  };

  return (
    <ImageUpload 
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### Advanced Configuration

```tsx
<ImageUpload 
  onUploadComplete={handleUploadComplete}
  maxWidth={600}              // Custom target width (default: 450)
  quality={0.85}              // Lower quality (default: 0.9)
  bucket="custom-bucket"      // Custom Supabase bucket
  folder="custom-folder"      // Custom folder path
  currentImage={existingUrl}  // Show existing image in preview
/>
```

### Using Image Optimization Utilities Directly

```tsx
import { optimizeImage, formatFileSize } from "@/utils/imageOptimization";

// Optimize a file
const file = event.target.files[0];
const optimized = await optimizeImage(file, {
  maxWidth: 800,
  maxSizeMB: 3,
  quality: 0.85
});

// Get image dimensions
const { width, height } = await getImageDimensions(file);
console.log(`Original size: ${width}x${height}px`);

// Format file size for display
const sizeStr = formatFileSize(optimized.size);
console.log(`Optimized size: ${sizeStr}`);
```

## Configuration Options

### ImageUpload Component Props

```typescript
interface ImageUploadProps {
  // Callback when upload completes with public URL
  onUploadComplete: (url: string) => void;
  
  // Current image URL to display as preview (optional)
  currentImage?: string;
  
  // Supabase storage bucket name (default: "images")
  bucket?: string;
  
  // Folder path within bucket (default: "uploads")
  folder?: string;
  
  // Maximum width after optimization in pixels (default: 450)
  maxWidth?: number;
  
  // JPEG quality (0-1, default: 0.9)
  quality?: number;
}
```

### Optimization Options

```typescript
interface ImageOptimizationOptions {
  maxWidth?: number;       // Max width (default: 450)
  maxHeight?: number;      // Max height (default: 450)
  maxSizeMB?: number;      // Max file size (default: 2)
  quality?: number;        // JPEG quality (default: 0.9)
}
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Mobile)

The library uses:
- FileReader API
- Canvas API
- Blob API
- Web Workers (for background compression)

## Performance

**Optimization typically completes in:**
- 1-3 seconds for 5MB images
- 2-5 seconds for 10MB images
- Up to 10 seconds for 20MB images

Processing happens on the user's device (client-side), so no server resources are consumed during optimization.

## TinyMCE Integration

Images uploaded through TinyMCE editor are automatically optimized:

```tsx
// Automatically optimizes to 450px width, 90% quality
<TinyMCEEditor onImageUpload={tinymceImageUploadHandler} />
```

The handler:
1. Receives image blob from TinyMCE
2. Optimizes it to 450px width
3. Uploads optimized version to Supabase
4. Returns public URL to TinyMCE for embedding

## Error Handling

### Common Errors

**"Please select an image file"**
- Cause: Selected file is not a valid image
- Solution: Choose a JPG, PNG, GIF, or WebP file

**"Source image size must be less than 20MB"**
- Cause: Original file exceeds 20MB limit
- Solution: Use a smaller source image or reduce quality before uploading

**"Failed to optimize image"**
- Cause: Browser couldn't process the image
- Solution: Try a different format or browser

**"Failed to upload image"**
- Cause: Supabase storage error
- Solution: Check storage bucket permissions and quota

## Troubleshooting

### Images not compressing much

This can happen with:
- Already compressed formats (WebP, HEIC)
- Small dimensions (already under 450px)
- Low-resolution images

**Solution:** Original images were already optimized or small

### Browser stops responding during optimization

This can happen with very large files (15MB+) on older devices.

**Solution:** 
- Use a faster device
- Compress source before uploading
- Reduce `maxWidth` for faster processing

### Quality looks degraded

Default quality is 90%, which is usually imperceptible.

**Solution:**
- Increase `quality` prop to 0.95 for higher quality
- Trade-off: slightly larger file size

## Best Practices

1. **Source Images**: Use original/uncompressed images
   - Allows better compression and resizing
   - Avoids quality degradation

2. **Dimensions**: Upload images at least 800px wide
   - Resizing to 450px maintains quality
   - Upscaling (smaller to larger) causes artifacts

3. **Format**: JPEG for photos, PNG for graphics
   - JPEG: Better compression for natural images
   - PNG: Better for graphics, text, transparency

4. **Quality Settings**: Use defaults (90%) in most cases
   - Higher quality increases file size significantly
   - Lower quality (75-80%) works for thumbnails

5. **Monitoring**: Track optimization results
   - Monitor average size reduction
   - Adjust settings if results are suboptimal

## Customization

### Change Default Optimization Size

```tsx
// For article thumbnails (smaller)
<ImageUpload maxWidth={300} onUploadComplete={handleUpload} />

// For gallery images (larger)
<ImageUpload maxWidth={1200} onUploadComplete={handleUpload} />
```

### Implement Custom Processing

Create a wrapper around `optimizeImage`:

```tsx
export async function optimizeForThumbnail(file: File) {
  return optimizeImage(file, {
    maxWidth: 300,
    maxHeight: 300,
    maxSizeMB: 0.5,    // Smaller size for thumbnails
    quality: 0.8,      // Lower quality acceptable
  });
}
```

## Dependencies

- **browser-image-compression**: Client-side image optimization
  - Version: ^1.4.0
  - License: MIT
  - No server-side dependencies needed

## Testing

Run tests for the image optimization components:

```bash
npm test -- ImageUpload.test.tsx
```

Tests cover:
- File validation (type, size)
- Optimization process
- Preview display
- Error handling
- Configuration options

## Performance Impact

### Network

- **Bandwidth**: ~70% reduction in upload size
- **Uplink time**: Faster uploads for mobile users
- **Server storage**: Significant savings with many images

### Device

- **CPU**: Moderate usage during optimization
- **Memory**: ~200-300MB peak during processing
- **Battery**: Minimal impact (seconds of processing)

## Limitations

1. **Maximum source size**: 20MB
   - Larger files may timeout or crash browser
   - Solution: Pre-compress before uploading

2. **Minimum dimensions**: 
   - Can't create high-quality images larger than source
   - Solution: Upload higher-resolution originals

3. **Browser compatibility**:
   - Requires modern browser with Canvas support
   - Older browsers may not support optimization

4. **Format-specific**:
   - JPEG quality degrades with compression
   - PNG compression has limits
   - WebP may not be supported on all browsers

## Future Improvements

Potential enhancements:
- [ ] Crop/rotation UI before upload
- [ ] Multi-size generation (thumbnail + full)
- [ ] AVIF format support
- [ ] Server-side optimization backup
- [ ] Batch upload progress

## Related Files

- [ImageUpload Component](/src/components/admin/ImageUpload.tsx)
- [Image Optimization Utils](/src/utils/imageOptimization.ts)
- [TinyMCE Upload Handler](/src/utils/tinymceUpload.ts)
- [Component Tests](/src/__tests__/components/admin/ImageUpload.test.tsx)
