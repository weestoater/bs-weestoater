/**
 * weeCMS Content Blocks Service
 * Manages dynamic content blocks for pages
 */

import { createCrudService } from "./crudService.js";

/**
 * Creates content service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Content service methods
 */
export function createContentService(supabaseClient) {
  const contentBlocksCrud = createCrudService(
    supabaseClient,
    "content_blocks",
    {
      orderByField: "order_index",
      orderAscending: true,
    },
  );

  // ============================================================================
  // CONTENT BLOCKS OPERATIONS
  // ============================================================================

  /**
   * Get all content blocks
   * @param {Object} options - Query options
   * @param {boolean} [options.includeUnpublished=false] - Include unpublished blocks
   * @param {string} [options.page] - Filter by page
   * @returns {Promise<Array>} Array of content block objects
   */
  async function getContentBlocks(options = {}) {
    const { includeUnpublished = false, page } = options;

    let query = supabaseClient
      .from("content_blocks")
      .select("*")
      .order("page")
      .order("order_index");

    // Filter by page if specified
    if (page) {
      query = query.eq("page", page);
    }

    // Filter published blocks
    if (!includeUnpublished) {
      query = query
        .eq("published", true)
        .or("publish_at.is.null,publish_at.lte.now()")
        .or("unpublish_at.is.null,unpublish_at.gt.now()");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching content blocks:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get content blocks for a specific page
   * @param {string} page - Page identifier (e.g., 'home', 'about')
   * @param {Object} options - Query options
   * @param {boolean} [options.includeUnpublished=false] - Include unpublished blocks
   * @returns {Promise<Array>} Array of content block objects
   */
  async function getContentBlocksForPage(page, options = {}) {
    const { includeUnpublished = false } = options;

    if (includeUnpublished) {
      // Admin view - get all blocks
      return contentBlocksCrud.getAllByField("page", page);
    }

    // Use the SQL function for published content
    const { data, error } = await supabaseClient.rpc(
      "get_content_blocks_for_page",
      {
        page_slug: page,
      },
    );

    if (error) {
      console.error(`Error fetching content blocks for page ${page}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single content block by ID
   * @param {string} id - Content block ID
   * @returns {Promise<Object|null>} Content block object or null
   */
  async function getContentBlockById(id) {
    return contentBlocksCrud.getById(id);
  }

  /**
   * Get a single content block by slug
   * @param {string} slug - Content block slug
   * @returns {Promise<Object|null>} Content block object or null
   */
  async function getContentBlockBySlug(slug) {
    return contentBlocksCrud.getByField("slug", slug);
  }

  /**
   * Create a new content block
   * @param {Object} blockData - Content block data
   * @returns {Promise<Object>} The created content block
   */
  async function createContentBlock(blockData) {
    return contentBlocksCrud.create(blockData);
  }

  /**
   * Update a content block
   * @param {string} id - Content block ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated content block
   */
  async function updateContentBlock(id, updates) {
    return contentBlocksCrud.update(id, updates);
  }

  /**
   * Delete a content block
   * @param {string} id - Content block ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async function deleteContentBlock(id) {
    return contentBlocksCrud.delete(id);
  }

  /**
   * Reorder content blocks on a page
   * @param {string} page - Page identifier
   * @param {Array<{id: string, order_index: number}>} orders - New order for blocks
   * @returns {Promise<boolean>} True if reordered successfully
   */
  async function reorderContentBlocks(page, orders) {
    try {
      // Update each block's order_index
      const updates = orders.map(({ id, order_index }) =>
        contentBlocksCrud.update(id, { order_index }),
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error("Error reordering content blocks:", error);
      throw error;
    }
  }

  /**
   * Publish a content block immediately
   * @param {string} id - Content block ID
   * @returns {Promise<Object>} The updated content block
   */
  async function publishContentBlock(id) {
    return contentBlocksCrud.update(id, {
      published: true,
      publish_at: null,
    });
  }

  /**
   * Unpublish a content block
   * @param {string} id - Content block ID
   * @returns {Promise<Object>} The updated content block
   */
  async function unpublishContentBlock(id) {
    return contentBlocksCrud.update(id, {
      published: false,
    });
  }

  return {
    // Content Blocks
    getContentBlocks,
    getContentBlocksForPage,
    getContentBlockById,
    getContentBlockBySlug,
    createContentBlock,
    updateContentBlock,
    deleteContentBlock,
    reorderContentBlocks,
    publishContentBlock,
    unpublishContentBlock,
  };
}

/**
 * Create content service from environment variables
 * @returns {Promise<Object>} Content service methods
 */
export async function createContentServiceFromEnv() {
  const { createSupabaseClientFromEnv } = await import("./client.js");
  const supabaseClient = createSupabaseClientFromEnv();
  return createContentService(supabaseClient);
}
