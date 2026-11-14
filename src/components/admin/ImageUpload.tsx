import { useState, useRef, useEffect } from "react";
import { getSupabaseClient } from "../../../backend/index.js";
import {
  optimizeImage,
  getImageDimensions,
  formatFileSize,
} from "../../utils/imageOptimization";
import { uploadFileToSupabase } from "../../utils/supabaseStorageUtils";
import { IMAGE_UPLOAD_CONFIG } from "../../config/imageUploadConfig";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  bucket?: string;
  folder?: string;
  maxWidth?: number;
  quality?: number;
}

export const ImageUpload = ({
  onUploadComplete,
  currentImage,
  bucket = IMAGE_UPLOAD_CONFIG.supabase.bucket,
  folder = IMAGE_UPLOAD_CONFIG.folders.editor,
  maxWidth = IMAGE_UPLOAD_CONFIG.maxWidth.editor,
  quality = IMAGE_UPLOAD_CONFIG.quality.editor,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [optimizationInfo, setOptimizationInfo] = useState<{
    original: string;
    optimized: string;
    reduction: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size before optimization (max 50MB source)
    if (file.size > IMAGE_UPLOAD_CONFIG.limits.sourceBytesLimit) {
      setError(IMAGE_UPLOAD_CONFIG.messages.sourceToolargeSize);
      return;
    }

    setError(null);
    setOptimizing(true);

    try {
      const originalSize = file.size;
      await getImageDimensions(file);

      // Optimize the image
      const optimizedFile = await optimizeImage(file, {
        maxWidth,
        maxHeight: maxWidth,
        maxSizeMB: IMAGE_UPLOAD_CONFIG.limits.outputMB,
        quality,
      });

      const optimizedSize = optimizedFile.size;
      const reduction = Math.round(
        ((originalSize - optimizedSize) / originalSize) * 100,
      );

      setOptimizationInfo({
        original: formatFileSize(originalSize),
        optimized: formatFileSize(optimizedSize),
        reduction: `${reduction}%`,
      });

      // Create preview from optimized file
      const previewUrl = URL.createObjectURL(optimizedFile);
      setPreview(previewUrl);

      setOptimizing(false);
      setUploading(true);

      // Upload the optimized file
      await uploadOptimizedFile(optimizedFile);

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (err) {
      console.error("Optimization error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to optimize image",
      );
      setOptimizing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isProcessing = uploading || optimizing;

  return (
    <div className="image-upload-component">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isProcessing}
        style={{ display: "none" }}
      />

      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            className="img-thumbnail"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "cover",
            }}
          />
          {optimizationInfo && (
            <div className="mt-2 p-2 bg-light border rounded">
              <small className="text-muted d-block">
                <strong>Original:</strong> {optimizationInfo.original}
              </small>
              <small className="text-muted d-block">
                <strong>Optimized:</strong> {optimizationInfo.optimized}
              </small>
              <small className="text-success d-block">
                <strong>Size Reduction:</strong> {optimizationInfo.reduction}
              </small>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={triggerFileInput}
        disabled={isProcessing}
      >
        {optimizing ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Optimizing...
          </>
        ) : uploading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Uploading...
          </>
        ) : (
          <>
            <i className="bi bi-upload me-2"></i>
            {preview ? "Change Image" : "Upload Image"}
          </>
        )}
      </button>

      {error && (
        <div className="alert alert-danger mt-2 mb-0" role="alert">
          <small>{error}</small>
        </div>
      )}

      <small className="form-text text-muted d-block mt-2">
        <i className="bi bi-info-circle me-1"></i>
        Large images will be automatically optimized to {maxWidth}px width.
        Supported formats: JPG, PNG, GIF, WebP
      </small>
    </div>
  );
};
