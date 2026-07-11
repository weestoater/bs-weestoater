import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../backend/index.js";
import type { SiteConfig } from "../types/weecms";

const { createSiteConfigService } = await import("../../backend/index.js");

// Cache for site config (reduces database calls)
let cachedConfig: SiteConfig | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to access site configuration
 * Uses caching to reduce database calls
 * @returns {Object} { config, loading, error, refreshConfig }
 */
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(cachedConfig);
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async (forceRefresh = false) => {
    // Use cache if it's fresh and not forcing refresh
    const now = Date.now();
    if (
      cachedConfig &&
      !forceRefresh &&
      now - cacheTimestamp < CACHE_DURATION
    ) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = getSupabaseClient();
      const siteConfigService = createSiteConfigService(client);
      const data = await siteConfigService.getSiteConfig();

      // Update cache
      cachedConfig = data;
      cacheTimestamp = now;

      setConfig(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load site configuration";
      setError(errorMessage);
      console.error("Error loading site config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  /**
   * Manually refresh config from database
   * Useful after updates in admin
   */
  const refreshConfig = () => {
    loadConfig(true);
  };

  /**
   * Clear cache (useful for testing or after logout)
   */
  const clearCache = () => {
    cachedConfig = null;
    cacheTimestamp = 0;
  };

  return {
    config,
    loading,
    error,
    refreshConfig,
    clearCache,
  };
}

/**
 * Helper to get default values when config isn't loaded
 */
export const defaultSiteConfig: Partial<SiteConfig> = {
  site_name: "weestoater",
  site_tagline: "Front-end Development & Accessibility",
  default_theme: "light",
  maintenance_mode: false,
  enable_search: false,
  enable_comments: false,
};
