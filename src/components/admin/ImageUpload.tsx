import { useState, useRef } from "react";
import { getSupabaseClient } from "../../../backend/index.js";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  bucket?: string;
  folder?: string;
}

export const ImageUpload = ({
  onUploadComplete,
  currentImage,
  bucket = "images",
  folder = "uploads",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = getSupabaseClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-component">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
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
        </div>
      )}

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={triggerFileInput}
        disabled={uploading}
      >
        {uploading ? (
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
        Supported formats: JPG, PNG, GIF, WebP (max 5MB)
      </small>
    </div>
  );
};
