import { getSupabaseClient } from "../../backend/index.js";
import { optimizeImage } from "./imageOptimization";
import { uploadFileToSupabase } from "./supabaseStorageUtils";
import { IMAGE_UPLOAD_CONFIG } from "../config/imageUploadConfig";

export interface TinyMCEBlobInfo {
  blob: () => Blob;
  filename: () => string;
  base64?: () => string;
}

export const tinymceImageUploadHandler = async (
  blobInfo: TinyMCEBlobInfo,
  progress: (percent: number) => void,
  folder: string = "editor",
): Promise<string> => {
  try {
    const supabase = getSupabaseClient();

    const blob = blobInfo.blob();
    const filename = blobInfo.filename();

    // Convert blob to File for optimization
    const file = new File([blob], filename, { type: blob.type });

    // Show progress
    progress(30);

    // Optimize image to 450px max width
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

    const { publicUrl } = await uploadFileToSupabase(
      supabase,
      IMAGE_UPLOAD_CONFIG.supabase.bucket,
      folder,
      optimizedFile,
      uniqueFilename,
    );

    progress(90);

    progress(100);
    return publicUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
