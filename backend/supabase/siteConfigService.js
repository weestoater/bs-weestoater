/**
 * weeCMS Site Configuration Service
 * Manages global site settings (singleton pattern)
 */

/**
 * Creates site config service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Site config service methods
 */
export function createSiteConfigService(supabaseClient) {
  const TABLE = "site_config";

  /**
   * Get site configuration (there should only be one row)
   * @returns {Promise<Object>} Site configuration object
   */
  async function getSiteConfig() {
    const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching site config:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update site configuration
   * @param {Object} updates - Fields to update
   * @param {string} [userId] - User ID performing the update
   * @returns {Promise<Object>} Updated configuration
   */
  async function updateSiteConfig(updates, userId = null) {
    // Get the existing config to get its ID
    const existing = await getSiteConfig();

    const dataToUpdate = {
      ...updates,
      updated_by: userId,
    };

    const { data, error } = await supabaseClient
      .from(TABLE)
      .update(dataToUpdate)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating site config:", error);
      throw error;
    }

    return data;
  }

  /**
   * Initialize site configuration if it doesn't exist
   * @param {Object} initialConfig - Initial configuration values
   * @returns {Promise<Object>} Created or existing configuration
   */
  async function initializeSiteConfig(initialConfig) {
    try {
      // Try to get existing config
      return await getSiteConfig();
    } catch (error) {
      // If doesn't exist, create it
      const { data, error: createError } = await supabaseClient
        .from(TABLE)
        .insert(initialConfig)
        .select()
        .single();

      if (createError) {
        console.error("Error initializing site config:", createError);
        throw createError;
      }

      return data;
    }
  }

  /**
   * Update a specific field in site configuration
   * @param {string} field - Field name to update
   * @param {any} value - New value
   * @param {string} [userId] - User ID performing the update
   * @returns {Promise<Object>} Updated configuration
   */
  async function updateConfigField(field, value, userId = null) {
    return updateSiteConfig({ [field]: value }, userId);
  }

  /**
   * Toggle a boolean field
   * @param {string} field - Field name to toggle
   * @param {string} [userId] - User ID performing the update
   * @returns {Promise<Object>} Updated configuration
   */
  async function toggleConfigField(field, userId = null) {
    const config = await getSiteConfig();
    return updateSiteConfig({ [field]: !config[field] }, userId);
  }

  /**
   * Update social links
   * @param {Object} socialLinks - Social media links object
   * @param {string} [userId] - User ID performing the update
   * @returns {Promise<Object>} Updated configuration
   */
  async function updateSocialLinks(socialLinks, userId = null) {
    return updateSiteConfig({ social_links: socialLinks }, userId);
  }

  /**
   * Update footer links
   * @param {Array} footerLinks - Footer links array
   * @param {string} [userId] - User ID performing the update
   * @returns {Promise<Object>} Updated configuration
   */
  async function updateFooterLinks(footerLinks, userId = null) {
    return updateSiteConfig({ footer_links: footerLinks }, userId);
  }

  return {
    getSiteConfig,
    updateSiteConfig,
    initializeSiteConfig,
    updateConfigField,
    toggleConfigField,
    updateSocialLinks,
    updateFooterLinks,
  };
}

/**
 * Create site config service from environment variables
 * @returns {Promise<Object>} Site config service methods
 */
export async function createSiteConfigServiceFromEnv() {
  const { createSupabaseClient } = await import("./client.js");
  const client = createSupabaseClient();
  return createSiteConfigService(client);
}
