/**
 * BS WeeStaater Backend - Main Entry Point
 * Exports all Supabase modules for easy importing
 */

// Export configuration
export {
  validateConfig,
  loadConfigFromEnv,
  createConfig,
  debugConfig,
} from "./supabase/config.js";

// Export client factory
export {
  createSupabaseClient,
  getSupabaseClient,
  resetSupabaseClient,
  createSupabaseClientFromEnv,
} from "./supabase/client.js";

// Export database service
export {
  createDatabaseService,
  createDatabaseServiceFromEnv,
} from "./supabase/database.js";

// Default export - get Supabase client singleton
export { default } from "./supabase/client.js";
