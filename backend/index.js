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

// Export Garmin activities service
export { createGarminActivitiesService } from "./supabase/garminActivitiesDatabase.js";

// Export weeCMS services
export {
  createContentService,
  createContentServiceFromEnv,
} from "./supabase/contentService.js";

export {
  createNavigationService,
  createNavigationServiceFromEnv,
} from "./supabase/navigationService.js";

export {
  createSiteConfigService,
  createSiteConfigServiceFromEnv,
} from "./supabase/siteConfigService.js";

export {
  createConfigService,
  createConfigServiceFromEnv,
} from "./supabase/configService.js";

export {
  createMediaService,
  createMediaServiceFromEnv,
} from "./supabase/mediaService.js";

// Default export - get Supabase client singleton
export { default } from "./supabase/client.js";
