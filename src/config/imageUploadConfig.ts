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
