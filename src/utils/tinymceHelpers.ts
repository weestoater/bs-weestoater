import { getSupabaseClient } from "../../backend/index.js";

/**
 * TinyMCE image upload handler for Supabase Storage
 * @param blobInfo - The blob containing the image data
 * @param progress - Progress callback function
 * @param folder - Optional folder name in the bucket (default: 'editor')
 * @param bucket - Optional bucket name (default: 'images')
 * @returns Promise resolving to the public URL of the uploaded image
 */
export const tinymceImageUploadHandler = async (
  blobInfo: any,
  progress: (percent: number) => void,
  folder: string = "editor",
  bucket: string = "images",
): Promise<string> => {
  try {
    const supabase = getSupabaseClient();

    // Get the blob as a file
    const blob = blobInfo.blob();
    const filename = blobInfo.filename();

    // Generate unique filename
    const fileExt = filename.split(".").pop() || "png";
    const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
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

    // Get public URL
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

/**
 * Create TinyMCE init config with image upload support
 * @param folder - Folder name for uploads
 * @returns TinyMCE init configuration object
 */
export const createTinyMCEConfig = (folder: string = "editor") => ({
  height: 500,
  menubar: false,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | link image | code | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  images_upload_handler: (blobInfo: any, progress: (percent: number) => void) =>
    tinymceImageUploadHandler(blobInfo, progress, folder),
  automatic_uploads: true,
  file_picker_types: "image",
  image_title: true,
  image_description: true,
  image_dimensions: true,
  image_class_list: [
    { title: "Responsive", value: "img-fluid" },
    { title: "Thumbnail", value: "img-thumbnail" },
    { title: "Rounded", value: "rounded" },
  ],
});
