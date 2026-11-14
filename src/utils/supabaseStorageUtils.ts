import { SupabaseClient } from "@supabase/supabase-js";

export interface UploadResult {
  publicUrl: string;
  storagePath: string;
}

/**
 * Uploads a file to Supabase Storage and returns the public URL
 */
export const uploadFileToSupabase = async (
  supabase: SupabaseClient,
  bucket: string,
  folder: string,
  file: File,
  fileName: string,
): Promise<UploadResult> => {
  const storagePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
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

  return { publicUrl, storagePath };
};
