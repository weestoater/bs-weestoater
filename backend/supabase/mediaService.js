/**
 * weeCMS Media Library Service
 * Manages media uploads and storage
 */

import { createCrudService } from "./crudService.js";

/**
 * Creates media service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Media service methods
 */
export function createMediaService(supabaseClient) {
  const mediaCrud = createCrudService(supabaseClient, "media_library", {
    orderByField: "created_at",
    orderAscending: false,
  });

  // ============================================================================
  // MEDIA LIBRARY OPERATIONS
  // ============================================================================

  /**
   * Get all media items
   * @param {Object} options - Query options
   * @param {string} [options.fileType] - Filter by file type
   * @param {string} [options.folder] - Filter by folder
   * @param {Array<string>} [options.tags] - Filter by tags
   * @param {number} [options.limit] - Limit number of results
   * @returns {Promise<Array>} Array of media item objects
   */
  async function getMediaItems(options = {}) {
    const { fileType, folder, tags, limit } = options;

    let query = supabaseClient
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (fileType) {
      query = query.eq("file_type", fileType);
    }

    if (folder) {
      query = query.eq("folder", folder);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching media items:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single media item by ID
   * @param {string} id - Media item ID
   * @returns {Promise<Object|null>} Media item object or null
   */
  async function getMediaItemById(id) {
    return mediaCrud.getById(id);
  }

  /**
   * Get media items by folder
   * @param {string} folder - Folder name
   * @returns {Promise<Array>} Array of media items
   */
  async function getMediaItemsByFolder(folder) {
    return mediaCrud.getAllByField("folder", folder);
  }

  /**
   * Get media items by file type
   * @param {string} fileType - File type ('image', 'video', 'document', etc.)
   * @returns {Promise<Array>} Array of media items
   */
  async function getMediaItemsByType(fileType) {
    return mediaCrud.getAllByField("file_type", fileType);
  }

  /**
   * Upload a file to Supabase Storage and create media record
   * @param {Object} uploadData - Upload data
   * @param {File|Blob} uploadData.file - File to upload
   * @param {string} uploadData.bucket - Storage bucket name
   * @param {string} uploadData.folder - Folder path in storage
   * @param {Object} [uploadData.metadata] - Additional metadata
   * @returns {Promise<Object>} The created media item
   */
  async function uploadMedia(uploadData) {
    const { file, bucket = "images", folder = "", metadata = {} } = uploadData;

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${timestamp}_${sanitizedName}`;
      const storagePath = folder ? `${folder}/${filename}` : filename;

      // Upload to Supabase Storage
      const { data: uploadResult, error: uploadError } =
        await supabaseClient.storage.from(bucket).upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading file to storage:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from(bucket).getPublicUrl(storagePath);

      // Determine file type
      let fileType = "other";
      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";
      else if (file.type.startsWith("audio/")) fileType = "audio";
      else if (
        file.type.includes("pdf") ||
        file.type.includes("document") ||
        file.type.includes("text")
      )
        fileType = "document";

      // Create media library record
      const mediaData = {
        filename,
        original_filename: file.name,
        file_type: fileType,
        mime_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        storage_bucket: bucket,
        public_url: publicUrl,
        folder: folder || null,
        ...metadata,
      };

      return await mediaCrud.create(mediaData);
    } catch (error) {
      console.error("Error in uploadMedia:", error);
      throw error;
    }
  }

  /**
   * Update media item metadata
   * @param {string} id - Media item ID
   * @param {Object} updates - Metadata updates
   * @returns {Promise<Object>} The updated media item
   */
  async function updateMediaItem(id, updates) {
    return mediaCrud.update(id, updates);
  }

  /**
   * Delete a media item and its file from storage
   * @param {string} id - Media item ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async function deleteMediaItem(id) {
    try {
      // Get media item to find storage path
      const mediaItem = await mediaCrud.getById(id);

      if (!mediaItem) {
        throw new Error("Media item not found");
      }

      // Delete from storage
      const { error: storageError } = await supabaseClient.storage
        .from(mediaItem.storage_bucket)
        .remove([mediaItem.storage_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue to delete database record even if storage delete fails
      }

      // Delete database record
      return await mediaCrud.delete(id);
    } catch (error) {
      console.error("Error in deleteMediaItem:", error);
      throw error;
    }
  }

  /**
   * Track usage of a media item
   * @param {string} id - Media item ID
   * @param {string} tableName - Name of table using this media
   * @returns {Promise<Object>} The updated media item
   */
  async function trackMediaUsage(id, tableName) {
    const mediaItem = await mediaCrud.getById(id);

    if (!mediaItem) {
      throw new Error("Media item not found");
    }

    const usedInTables = mediaItem.used_in_tables || [];
    if (!usedInTables.includes(tableName)) {
      usedInTables.push(tableName);
    }

    return mediaCrud.update(id, {
      used_in_tables: usedInTables,
      usage_count: (mediaItem.usage_count || 0) + 1,
    });
  }

  /**
   * Get all folders (unique folder names)
   * @returns {Promise<Array<string>>} Array of folder names
   */
  async function getFolders() {
    const { data, error } = await supabaseClient
      .from("media_library")
      .select("folder")
      .not("folder", "is", null);

    if (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }

    // Get unique folder names
    const folders = [...new Set(data.map((item) => item.folder))];
    return folders.sort();
  }

  /**
   * Get all tags (unique tags across all media)
   * @returns {Promise<Array<string>>} Array of tag names
   */
  async function getTags() {
    const { data, error } = await supabaseClient
      .from("media_library")
      .select("tags");

    if (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }

    // Flatten and get unique tags
    const allTags = data.flatMap((item) => item.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }

  /**
   * Search media items
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching media items
   */
  async function searchMedia(searchTerm) {
    const { data, error } = await supabaseClient
      .from("media_library")
      .select("*")
      .or(
        `original_filename.ilike.%${searchTerm}%,alt_text.ilike.%${searchTerm}%`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching media:", error);
      throw error;
    }

    return data;
  }

  return {
    // Media Library
    getMediaItems,
    getMediaItemById,
    getMediaItemsByFolder,
    getMediaItemsByType,
    uploadMedia,
    updateMediaItem,
    deleteMediaItem,
    trackMediaUsage,
    getFolders,
    getTags,
    searchMedia,
  };
}

/**
 * Create media service from environment variables
 * @returns {Promise<Object>} Media service methods
 */
export async function createMediaServiceFromEnv() {
  const { createSupabaseClientFromEnv } = await import("./client.js");
  const supabaseClient = createSupabaseClientFromEnv();
  return createMediaService(supabaseClient);
}
