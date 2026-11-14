import { MediaLibraryItem } from "../types/weecms";

/**
 * Determines file type based on MIME type
 */
export const getFileType = (
  mimeType: string,
): MediaLibraryItem["file_type"] => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  ) {
    return "document";
  }
  return "other";
};
