import imageCompression from "browser-image-compression";

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeMB?: number;
  quality?: number;
}

/**
 * Optimizes an image by resizing and compressing it
 * Default: 450px width, 90% quality, max 5MB
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {},
): Promise<File> => {
  const { maxWidth = 450, maxSizeMB = 5, quality = 0.9 } = options;

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    alwaysKeepResolution: false,
    initialQuality: quality,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error("Image optimization failed:", error);
    throw error;
  }
};

/**
 * Resizes an image to fit within specified dimensions while maintaining aspect ratio
 * Returns a canvas-based blob
 */
export const resizeImageCanvas = (
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas conversion to blob failed"));
          }
        }, file.type || "image/jpeg", 0.9);
      };

      img.onerror = () => reject(new Error("Failed to load image"));

      const result = event.target?.result;
      if (typeof result === "string") {
        img.src = result;
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Gets image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<{
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => reject(new Error("Failed to load image"));

      const result = event.target?.result;
      if (typeof result === "string") {
        img.src = result;
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Formats file size for display (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
