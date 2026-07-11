/**
 * weeCMS Configuration Service
 * Manages global site configuration (singleton table)
 */

/**
 * Creates config service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Config service methods
 */
export function createConfigService(supabaseClient) {
  // ============================================================================
  // SITE CONFIG OPERATIONS
  // ============================================================================

  /**
   * Get site configuration
   * @returns {Promise<Object|null>} Site config object or null
   */
  async function getSiteConfig() {
    const { data, error } = await supabaseClient
      .from("site_config")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // If no config exists yet, return null
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching site config:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update site configuration
   * @param {Object} updates - Configuration updates
   * @returns {Promise<Object>} The updated config
   */
  async function updateSiteConfig(updates) {
    // First, get the existing config to get its ID
    const existingConfig = await getSiteConfig();

    if (!existingConfig) {
      // No config exists, create one
      const { data, error } = await supabaseClient
        .from("site_config")
        .insert([updates])
        .select()
        .single();

      if (error) {
        console.error("Error creating site config:", error);
        throw error;
      }

      return data;
    }

    // Update existing config
    const { data, error } = await supabaseClient
      .from("site_config")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", existingConfig.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating site config:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update a specific site config field
   * @param {string} field - Field name to update
   * @param {any} value - New value
   * @returns {Promise<Object>} The updated config
   */
  async function updateSiteConfigField(field, value) {
    return updateSiteConfig({ [field]: value });
  }

  /**
   * Toggle maintenance mode
   * @param {boolean} enabled - Enable or disable maintenance mode
   * @param {string} [message] - Optional maintenance message
   * @returns {Promise<Object>} The updated config
   */
  async function toggleMaintenanceMode(enabled, message = null) {
    const updates = { maintenance_mode: enabled };
    if (message !== null) {
      updates.maintenance_message = message;
    }
    return updateSiteConfig(updates);
  }

  /**
   * Update social media links
   * @param {Object} socialLinks - Social media links object
   * @returns {Promise<Object>} The updated config
   */
  async function updateSocialLinks(socialLinks) {
    return updateSiteConfig({ social_links: socialLinks });
  }

  /**
   * Update footer configuration
   * @param {string} footerText - Footer text
   * @param {Array} [footerLinks] - Optional footer links array
   * @returns {Promise<Object>} The updated config
   */
  async function updateFooterConfig(footerText, footerLinks = null) {
    const updates = { footer_text: footerText };
    if (footerLinks !== null) {
      updates.footer_links = footerLinks;
    }
    return updateSiteConfig(updates);
  }

  /**
   * Update SEO configuration
   * @param {Object} seoConfig - SEO configuration
   * @param {string} [seoConfig.default_og_image] - Default Open Graph image
   * @param {string} [seoConfig.google_analytics_id] - Google Analytics ID
   * @param {string} [seoConfig.google_site_verification] - Google site verification code
   * @returns {Promise<Object>} The updated config
   */
  async function updateSeoConfig(seoConfig) {
    return updateSiteConfig(seoConfig);
  }

  /**
   * Update theme configuration
   * @param {string} defaultTheme - Default theme name
   * @param {Array<string>} [allowedThemes] - Optional allowed themes array
   * @returns {Promise<Object>} The updated config
   */
  async function updateThemeConfig(defaultTheme, allowedThemes = null) {
    const updates = { default_theme: defaultTheme };
    if (allowedThemes !== null) {
      updates.allowed_themes = allowedThemes;
    }
    return updateSiteConfig(updates);
  }

  /**
   * Update feature flags
   * @param {Object} features - Feature flags object
   * @param {boolean} [features.enable_search] - Enable search
   * @param {boolean} [features.enable_comments] - Enable comments
   * @returns {Promise<Object>} The updated config
   */
  async function updateFeatureFlags(features) {
    return updateSiteConfig(features);
  }

  /**
   * Initialize site config with default values if not exists
   * @returns {Promise<Object>} The site config
   */
  async function initializeSiteConfig() {
    const existingConfig = await getSiteConfig();
    if (existingConfig) {
      return existingConfig;
    }

    // Create default config
    const defaultConfig = {
      site_name: "weestoater",
      site_tagline: "Front-end Development & Accessibility",
      site_description:
        "Portfolio of Ian Burrett - Web Developer specializing in React, TypeScript, and accessible web design",
      default_theme: "light",
      footer_text:
        "© 2026 Ian Burrett. Built with React, TypeScript, and Supabase.",
    };

    return updateSiteConfig(defaultConfig);
  }

  return {
    // Site Config
    getSiteConfig,
    updateSiteConfig,
    updateSiteConfigField,
    toggleMaintenanceMode,
    updateSocialLinks,
    updateFooterConfig,
    updateSeoConfig,
    updateThemeConfig,
    updateFeatureFlags,
    initializeSiteConfig,
  };
}

/**
 * Create config service from environment variables
 * @returns {Promise<Object>} Config service methods
 */
export async function createConfigServiceFromEnv() {
  const { createSupabaseClientFromEnv } = await import("./client.js");
  const supabaseClient = createSupabaseClientFromEnv();
  return createConfigService(supabaseClient);
}
