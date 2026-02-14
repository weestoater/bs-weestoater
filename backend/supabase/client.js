/**
 * Supabase Client Factory for BS WeeStaater
 * Creates and manages Supabase client instances
 */

import { createClient } from "@supabase/supabase-js";
import { createConfig, debugConfig } from "./config.js";

/**
 * Global client instance (singleton pattern)
 */
let supabaseInstance = null;

/**
 * Creates a new Supabase client instance
 * @param {Object} config - Configuration object
 * @param {string} config.url - Supabase project URL
 * @param {string} config.anonKey - Supabase anonymous key
 * @param {Object} [config.options] - Additional Supabase client options
 * @param {boolean} [debug=false] - Enable debug logging
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createSupabaseClient(config, debug = false) {
  const validatedConfig = createConfig(config);

  if (debug) {
    debugConfig(validatedConfig);
  }

  const client = createClient(
    validatedConfig.url,
    validatedConfig.anonKey,
    validatedConfig.options || {},
  );

  return client;
}

/**
 * Gets or creates a singleton Supabase client instance
 * This is the recommended way to use Supabase in most applications
 * @param {Object} [config] - Configuration object (only used on first call)
 * @param {boolean} [debug=false] - Enable debug logging
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function getSupabaseClient(config = null, debug = false) {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(config, debug);
  }
  return supabaseInstance;
}

/**
 * Resets the singleton instance (useful for testing or switching projects)
 */
export function resetSupabaseClient() {
  supabaseInstance = null;
}

/**
 * Creates a Supabase client from environment variables
 * @param {boolean} [debug=false] - Enable debug logging
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createSupabaseClientFromEnv(debug = false) {
  return createSupabaseClient(null, debug);
}

/**
 * Export the singleton instance getter as default
 * Usage: import supabase from './backend/supabase/client.js'
 */
export default getSupabaseClient;
