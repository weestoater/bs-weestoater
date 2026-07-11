/**
 * weeCMS Navigation Service
 * Manages dynamic navigation structure
 */

import { createCrudService } from "./crudService.js";

/**
 * Creates navigation service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Navigation service methods
 */
export function createNavigationService(supabaseClient) {
  const navigationCrud = createCrudService(supabaseClient, "navigation_items", {
    orderByField: "order_index",
    orderAscending: true,
  });

  // ============================================================================
  // NAVIGATION OPERATIONS
  // ============================================================================

  /**
   * Get all navigation items
   * @param {Object} options - Query options
   * @param {boolean} [options.includeHidden=false] - Include hidden items
   * @returns {Promise<Array>} Array of navigation item objects
   */
  async function getNavigationItems(options = {}) {
    const { includeHidden = false } = options;

    const filters = includeHidden ? {} : { visible: true };
    return navigationCrud.getAll({ filters });
  }

  /**
   * Get top-level navigation items (no parent)
   * @param {Object} options - Query options
   * @param {boolean} [options.includeHidden=false] - Include hidden items
   * @returns {Promise<Array>} Array of top-level navigation items
   */
  async function getTopLevelNavigation(options = {}) {
    const { includeHidden = false } = options;

    let query = supabaseClient
      .from("navigation_items")
      .select("*")
      .is("parent_id", null)
      .order("order_index");

    if (!includeHidden) {
      query = query.eq("visible", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching top-level navigation:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get child navigation items for a parent
   * @param {string} parentId - Parent navigation item ID
   * @param {Object} options - Query options
   * @param {boolean} [options.includeHidden=false] - Include hidden items
   * @returns {Promise<Array>} Array of child navigation items
   */
  async function getChildNavigation(parentId, options = {}) {
    const { includeHidden = false } = options;

    let query = supabaseClient
      .from("navigation_items")
      .select("*")
      .eq("parent_id", parentId)
      .order("order_index");

    if (!includeHidden) {
      query = query.eq("visible", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching child navigation for ${parentId}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Get the full navigation tree
   * @param {Object} options - Query options
   * @param {boolean} [options.includeHidden=false] - Include hidden items
   * @returns {Promise<Array>} Hierarchical navigation structure
   */
  async function getNavigationTree(options = {}) {
    const { includeHidden = false } = options;

    if (!includeHidden) {
      // Use the SQL function for visible items
      const { data, error } = await supabaseClient.rpc("get_navigation_tree");

      if (error) {
        console.error("Error fetching navigation tree:", error);
        throw error;
      }

      return data;
    }

    // For admin view, fetch all and build tree manually
    const allItems = await navigationCrud.getAll({});

    // Build hierarchical structure
    const itemsMap = new Map();
    const rootItems = [];

    // First pass: create map
    allItems.forEach((item) => {
      itemsMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build tree
    allItems.forEach((item) => {
      const node = itemsMap.get(item.id);
      if (item.parent_id) {
        const parent = itemsMap.get(item.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        rootItems.push(node);
      }
    });

    return rootItems;
  }

  /**
   * Get a single navigation item by ID
   * @param {string} id - Navigation item ID
   * @returns {Promise<Object|null>} Navigation item object or null
   */
  async function getNavigationItemById(id) {
    return navigationCrud.getById(id);
  }

  /**
   * Create a new navigation item
   * @param {Object} itemData - Navigation item data
   * @returns {Promise<Object>} The created navigation item
   */
  async function createNavigationItem(itemData) {
    return navigationCrud.create(itemData);
  }

  /**
   * Update a navigation item
   * @param {string} id - Navigation item ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated navigation item
   */
  async function updateNavigationItem(id, updates) {
    return navigationCrud.update(id, updates);
  }

  /**
   * Delete a navigation item (and all children due to CASCADE)
   * @param {string} id - Navigation item ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async function deleteNavigationItem(id) {
    return navigationCrud.delete(id);
  }

  /**
   * Reorder navigation items
   * @param {Array<{id: string, order_index: number}>} orders - New order for items
   * @returns {Promise<boolean>} True if reordered successfully
   */
  async function reorderNavigationItems(orders) {
    try {
      // Update each item's order_index
      const updates = orders.map(({ id, order_index }) =>
        navigationCrud.update(id, { order_index }),
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error("Error reordering navigation items:", error);
      throw error;
    }
  }

  /**
   * Toggle visibility of a navigation item
   * @param {string} id - Navigation item ID
   * @param {boolean} visible - New visibility state
   * @returns {Promise<Object>} The updated navigation item
   */
  async function toggleNavigationVisibility(id, visible) {
    return navigationCrud.update(id, { visible });
  }

  return {
    // Navigation
    getNavigationItems,
    getTopLevelNavigation,
    getChildNavigation,
    getNavigationTree,
    getNavigationItemById,
    createNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    reorderNavigationItems,
    toggleNavigationVisibility,
  };
}

/**
 * Create navigation service from environment variables
 * @returns {Promise<Object>} Navigation service methods
 */
export async function createNavigationServiceFromEnv() {
  const { createSupabaseClientFromEnv } = await import("./client.js");
  const supabaseClient = createSupabaseClientFromEnv();
  return createNavigationService(supabaseClient);
}
