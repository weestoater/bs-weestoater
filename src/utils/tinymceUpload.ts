import { getSupabaseClient } from "../../backend/index.js";
import { optimizeImage } from "./imageOptimization";

export interface TinyMCEBlobInfo {
  blob: () => Blob;
  filename: () => string;
  base64?: () => string;
}

export const tinymceImageUploadHandler = async (
  blobInfo: TinyMCEBlobInfo,
  progress: (percent: number) => void,
  folder: string = "editor",
  bucket: string = "images",
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
      maxWidth: 450,
      maxHeight: 450,
      maxSizeMB: 5,
      quality: 0.9,
    });

    progress(60);

    const fileExt =
      optimizedFile.type === "image/webp" ? "webp" : filename.split(".").pop() || "png";
    const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFilename, optimizedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }

    progress(90);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    progress(100);
    return publicUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
