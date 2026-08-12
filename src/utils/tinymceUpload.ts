import { getSupabaseClient } from "../../backend/index.js";

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

    const fileExt = filename.split(".").pop() || "png";
    const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFilename, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }

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
