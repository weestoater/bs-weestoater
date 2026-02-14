/**
 * Supabase Configuration Module for BS WeeStaater
 * Validates and manages Supabase connection configuration
 */

/**
 * Configuration interface for Supabase client
 * @typedef {Object} SupabaseConfig
 * @property {string} url - Supabase project URL
 * @property {string} anonKey - Supabase anonymous key
 * @property {Object} [options] - Additional Supabase client options
 */

/**
 * Validates Supabase configuration
 * @param {SupabaseConfig} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(config) {
  if (!config) {
    throw new Error("Supabase configuration is required");
  }

  if (!config.url || typeof config.url !== "string") {
    throw new Error("Supabase URL is required and must be a string");
  }

  if (!config.anonKey || typeof config.anonKey !== "string") {
    throw new Error("Supabase anon key is required and must be a string");
  }

  // Validate URL format
  try {
    new URL(config.url);
  } catch (e) {
    throw new Error(`Invalid Supabase URL format: ${config.url}`);
  }

  // Check if URL is a Supabase URL
  if (!config.url.includes("supabase")) {
    console.warn(
      "Warning: URL does not appear to be a Supabase URL. Expected format: https://[project-id].supabase.co",
    );
  }

  // Validate anon key format (basic JWT check)
  if (!config.anonKey.startsWith("eyJ")) {
    console.warn(
      "Warning: Anon key does not appear to be a valid JWT token. Expected format starts with 'eyJ'",
    );
  }
}

/**
 * Loads configuration from environment variables
 * Compatible with Vite, Next.js, and standard Node.js
 * @returns {SupabaseConfig}
 */
export function loadConfigFromEnv() {
  // Try Vite-style env vars first (import.meta.env)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    };
  }

  // Try Node.js-style env vars (process.env)
  if (typeof process !== "undefined" && process.env) {
    return {
      url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      anonKey:
        process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    };
  }

  throw new Error(
    "Unable to load environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
  );
}

/**
 * Creates a validated configuration object
 * @param {SupabaseConfig | null} config - Optional config object. If not provided, loads from environment
 * @returns {SupabaseConfig}
 */
export function createConfig(config = null) {
  const finalConfig = config || loadConfigFromEnv();
  validateConfig(finalConfig);
  return finalConfig;
}

/**
 * Debug utility to check configuration status
 * @param {SupabaseConfig} config
 */
export function debugConfig(config) {
  console.log("🔧 Supabase Configuration Check:");
  console.log("  URL:", config.url ? "✓ Set" : "✗ Missing");
  console.log("  Anon Key:", config.anonKey ? "✓ Set" : "✗ Missing");
  console.log(
    "  URL Format:",
    config.url?.includes("supabase") ? "✓ Valid" : "⚠ Unusual",
  );
  console.log(
    "  Key Format:",
    config.anonKey?.startsWith("eyJ") ? "✓ Valid JWT" : "⚠ Not a JWT",
  );
}
