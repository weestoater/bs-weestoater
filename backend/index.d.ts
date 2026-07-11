/**
 * TypeScript declarations for BS WeeStaater Backend
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: Record<string, unknown>;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt?: string;
  icon?: string;
  published_date: string;
  updated_date?: string;
  reading_time: number;
  tags: string[];
  published: boolean;
  featured: boolean;
  author: string;
  order_index: number;
  publish_at?: string; // Optional: schedule publishing for future date/time
  image_url?: string; // Optional hero/feature image URL (Supabase Storage public URL)
  image_alt?: string; // Alt text for the image
  created_at: string;
  updated_at: string;
}

export interface SlimmingWorldProfile {
  id: string;
  user_id: string;
  start_date: string;
  start_weight: number;
  target_weight: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SlimmingWorldEntry {
  id: string;
  profile_id: string;
  entry_date: string;
  weight: number;
  weight_change: number;
  total_lost: number;
  target_weight: number;
  slimmer_of_week: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SlimmingWorldProfileWithEntries extends SlimmingWorldProfile {
  entries: SlimmingWorldEntry[];
}

export interface SlimmingWorldTargetWeight {
  id: string;
  profile_id: string;
  target_weight: number;
  effective_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SlimmingWorldProfileStats {
  id: string;
  user_id: string;
  start_date: string;
  start_weight: number;
  target_weight: number;
  total_entries: number;
  last_weigh_in: string;
  lowest_weight: number;
  max_lost: number;
  total_sotw_awards: number;
}

export interface FootballSeason {
  id: string;
  season_id: string;
  display_name: string;
  start_year: number;
  end_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FootballMatch {
  id: string;
  season_id: string;
  match_date: string;
  opposition: string;
  venue: string;
  goals_scored: number | null;
  goals_conceded: number | null;
  league: string | null;
  video_url: string | null;
  iplayer_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FootballMatchGoal {
  id: string;
  match_id: string;
  player: string;
  minute: string;
  assist: string | null;
  created_at: string;
}

export interface FootballMatchCard {
  id: string;
  match_id: string;
  player: string;
  card_type: string;
  minute: number;
  created_at: string;
}

export interface FootballSeasonStats {
  id: string;
  season_id: string;
  player: string;
  goals: number;
  assists: number;
  created_at: string;
  updated_at: string;
}

export interface FootballMatchDetailed extends FootballMatch {
  goals: FootballMatchGoal[];
  cards: FootballMatchCard[];
}

export interface FootballSeasonComplete extends FootballSeason {
  matches: FootballMatchDetailed[];
  topScorers: FootballSeasonStats[];
}

export interface DatabaseService {
  // Books methods
  getBooks(options?: { includeUnpublished?: boolean }): Promise<Book[]>;
  getBookById(id: string): Promise<Book | null>;
  createBook(bookData: Partial<Book>): Promise<Book>;
  updateBook(id: string, bookData: Partial<Book>): Promise<Book>;
  deleteBook(id: string): Promise<void>;
  bulkInsertBooks(books: Partial<Book>[]): Promise<Book[]>;
  updateBooksOrder(
    orderUpdates: Array<{ id: string; order_index: number }>,
  ): Promise<void>;

  // Articles methods
  getArticles(options?: {
    includeUnpublished?: boolean;
    category?: string;
    featuredOnly?: boolean;
  }): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | null>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  createArticle(articleData: Partial<Article>): Promise<Article>;
  updateArticle(id: string, articleData: Partial<Article>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  bulkInsertArticles(articles: Partial<Article>[]): Promise<Article[]>;
  getArticlesByTags(tags: string[]): Promise<Article[]>;

  // Slimming World methods
  getSlimmingWorldProfiles(options?: {
    includeInactive?: boolean;
  }): Promise<SlimmingWorldProfile[]>;
  getSlimmingWorldProfileByUserId(
    userId: string,
  ): Promise<SlimmingWorldProfile | null>;
  getSlimmingWorldProfileById(id: string): Promise<SlimmingWorldProfile | null>;
  createSlimmingWorldProfile(
    profileData: Partial<SlimmingWorldProfile>,
  ): Promise<SlimmingWorldProfile>;
  updateSlimmingWorldProfile(
    id: string,
    profileData: Partial<SlimmingWorldProfile>,
  ): Promise<SlimmingWorldProfile>;
  deleteSlimmingWorldProfile(id: string): Promise<void>;
  getSlimmingWorldEntries(
    profileId: string,
    options?: {
      limit?: number;
      orderBy?: string;
      ascending?: boolean;
    },
  ): Promise<SlimmingWorldEntry[]>;
  getSlimmingWorldEntryById(id: string): Promise<SlimmingWorldEntry | null>;
  getLatestSlimmingWorldEntry(
    profileId: string,
  ): Promise<SlimmingWorldEntry | null>;
  createSlimmingWorldEntry(
    entryData: Partial<SlimmingWorldEntry>,
  ): Promise<SlimmingWorldEntry>;
  updateSlimmingWorldEntry(
    id: string,
    entryData: Partial<SlimmingWorldEntry>,
  ): Promise<SlimmingWorldEntry>;
  deleteSlimmingWorldEntry(id: string): Promise<void>;
  bulkInsertSlimmingWorldEntries(
    entries: Partial<SlimmingWorldEntry>[],
  ): Promise<SlimmingWorldEntry[]>;
  getSlimmingWorldProfileWithEntries(
    userId: string,
  ): Promise<SlimmingWorldProfileWithEntries | null>;
  getSlimmingWorldProfileStats(
    userId: string,
  ): Promise<SlimmingWorldProfileStats | null>;

  // Slimming World Target Weight methods
  getTargetWeightHistory(
    profileId: string,
    options?: { orderBy?: string; ascending?: boolean },
  ): Promise<SlimmingWorldTargetWeight[]>;
  getCurrentTargetWeight(
    profileId: string,
  ): Promise<SlimmingWorldTargetWeight | null>;
  getTargetWeightForDate(profileId: string, entryDate: string): Promise<number>;
  createTargetWeight(
    targetWeightData: Partial<SlimmingWorldTargetWeight>,
  ): Promise<SlimmingWorldTargetWeight>;
  updateTargetWeight(
    id: string,
    targetWeightData: Partial<SlimmingWorldTargetWeight>,
  ): Promise<SlimmingWorldTargetWeight>;
  deleteTargetWeight(id: string): Promise<void>;

  // Football methods
  getFootballSeasons(options?: {
    includeInactive?: boolean;
  }): Promise<FootballSeason[]>;
  getFootballSeasonById(seasonId: string): Promise<FootballSeason | null>;
  createFootballSeason(
    seasonData: Partial<FootballSeason>,
  ): Promise<FootballSeason>;
  updateFootballSeason(
    seasonId: string,
    seasonData: Partial<FootballSeason>,
  ): Promise<FootballSeason>;
  deleteFootballSeason(seasonId: string): Promise<void>;
  getFootballMatches(
    seasonId: string,
    options?: {
      detailed?: boolean;
    },
  ): Promise<FootballMatch[] | FootballMatchDetailed[]>;
  getFootballMatchById(
    matchId: string,
    options?: {
      includeGoals?: boolean;
      includeCards?: boolean;
    },
  ): Promise<FootballMatch | null>;
  createFootballMatch(
    matchData: Partial<FootballMatch>,
  ): Promise<FootballMatch>;
  updateFootballMatch(
    matchId: string,
    matchData: Partial<FootballMatch>,
  ): Promise<FootballMatch>;
  deleteFootballMatch(matchId: string): Promise<void>;
  getFootballMatchGoals(matchId: string): Promise<FootballMatchGoal[]>;
  createFootballMatchGoal(
    goalData: Partial<FootballMatchGoal>,
  ): Promise<FootballMatchGoal>;
  updateFootballMatchGoal(
    goalId: string,
    goalData: Partial<FootballMatchGoal>,
  ): Promise<FootballMatchGoal>;
  deleteFootballMatchGoal(goalId: string): Promise<void>;
  getFootballMatchCards(matchId: string): Promise<FootballMatchCard[]>;
  createFootballMatchCard(
    cardData: Partial<FootballMatchCard>,
  ): Promise<FootballMatchCard>;
  updateFootballMatchCard(
    cardId: string,
    cardData: Partial<FootballMatchCard>,
  ): Promise<FootballMatchCard>;
  deleteFootballMatchCard(cardId: string): Promise<void>;
  getFootballSeasonStats(seasonId: string): Promise<FootballSeasonStats[]>;
  upsertFootballSeasonStats(
    statsData: Partial<FootballSeasonStats>,
  ): Promise<FootballSeasonStats>;
  deleteFootballSeasonStats(seasonId: string, player: string): Promise<void>;
  bulkInsertFootballData(bulkData: {
    seasons?: Partial<FootballSeason>[];
    matches?: Partial<FootballMatch>[];
    goals?: Partial<FootballMatchGoal>[];
    cards?: Partial<FootballMatchCard>[];
    stats?: Partial<FootballSeasonStats>[];
  }): Promise<{
    seasons?: FootballSeason[];
    matches?: FootballMatch[];
    goals?: FootballMatchGoal[];
    cards?: FootballMatchCard[];
    stats?: FootballSeasonStats[];
  }>;
  getFootballPlayers(seasonId?: string | null): Promise<string[]>;
  getFootballSeasonComplete(
    seasonId: string,
  ): Promise<FootballSeasonComplete | null>;
}

// ============================================================================
// WEECMS TYPES
// ============================================================================

export interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  icon?: string;
  page: string;
  section?: string;
  content_type: "card" | "hero" | "text" | "embed" | "custom";
  order_index: number;
  grid_size: string;
  published: boolean;
  publish_at?: string;
  unpublish_at?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  parent_id?: string;
  icon?: string;
  order_index: number;
  visible: boolean;
  require_auth: boolean;
  allowed_roles?: string[];
  external: boolean;
  new_window: boolean;
  created_at: string;
  updated_at: string;
  children?: NavigationItem[];
}

export interface SiteConfig {
  id: string;
  site_name: string;
  site_tagline?: string;
  site_description?: string;
  logo_url?: string;
  favicon_url?: string;
  email?: string;
  social_links: Record<string, string>;
  default_og_image?: string;
  google_analytics_id?: string;
  google_site_verification?: string;
  enable_search: boolean;
  enable_comments: boolean;
  maintenance_mode: boolean;
  maintenance_message?: string;
  default_theme: "light" | "dark" | "high-contrast" | "gov-uk";
  allowed_themes: string[];
  footer_text?: string;
  footer_links: unknown[];
  updated_at: string;
  updated_by?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content?: string;
  layout: "default" | "full-width" | "sidebar" | "blank";
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  published: boolean;
  publish_at?: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface MediaLibraryItem {
  id: string;
  filename: string;
  original_filename: string;
  file_type: "image" | "video" | "document" | "audio" | "other";
  mime_type: string;
  file_size: number;
  storage_path: string;
  storage_bucket: string;
  public_url: string;
  width?: number;
  height?: number;
  alt_text?: string;
  folder?: string;
  tags?: string[];
  used_in_tables?: string[];
  usage_count: number;
  uploaded_by?: string;
  created_at: string;
}

export interface CVEntry {
  id: string;
  entry_type:
    | "experience"
    | "education"
    | "skill"
    | "certification"
    | "project";
  title: string;
  organization?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  highlights?: string[];
  skills_used?: string[];
  order_index: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  action: "create" | "update" | "delete" | "publish" | "unpublish" | "restore";
  table_name: string;
  record_id: string;
  user_id?: string;
  user_email?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// weeCMS Services
export interface ContentService {
  getContentBlocks(options?: {
    includeUnpublished?: boolean;
    page?: string;
  }): Promise<ContentBlock[]>;
  getContentBlocksForPage(
    page: string,
    options?: { includeUnpublished?: boolean },
  ): Promise<ContentBlock[]>;
  getContentBlockById(id: string): Promise<ContentBlock | null>;
  getContentBlockBySlug(slug: string): Promise<ContentBlock | null>;
  createContentBlock(blockData: Partial<ContentBlock>): Promise<ContentBlock>;
  updateContentBlock(
    id: string,
    updates: Partial<ContentBlock>,
  ): Promise<ContentBlock>;
  deleteContentBlock(id: string): Promise<boolean>;
  reorderContentBlocks(
    page: string,
    orders: Array<{ id: string; order_index: number }>,
  ): Promise<boolean>;
  publishContentBlock(id: string): Promise<ContentBlock>;
  unpublishContentBlock(id: string): Promise<ContentBlock>;
}

export interface NavigationService {
  getNavigationItems(options?: {
    includeHidden?: boolean;
  }): Promise<NavigationItem[]>;
  getTopLevelNavigation(options?: {
    includeHidden?: boolean;
  }): Promise<NavigationItem[]>;
  getChildNavigation(
    parentId: string,
    options?: { includeHidden?: boolean },
  ): Promise<NavigationItem[]>;
  getNavigationTree(options?: {
    includeHidden?: boolean;
  }): Promise<NavigationItem[]>;
  getNavigationItemById(id: string): Promise<NavigationItem | null>;
  createNavigationItem(
    itemData: Partial<NavigationItem>,
  ): Promise<NavigationItem>;
  updateNavigationItem(
    id: string,
    updates: Partial<NavigationItem>,
  ): Promise<NavigationItem>;
  deleteNavigationItem(id: string): Promise<boolean>;
  reorderNavigationItems(
    orders: Array<{ id: string; order_index: number }>,
  ): Promise<boolean>;
  toggleNavigationVisibility(
    id: string,
    visible: boolean,
  ): Promise<NavigationItem>;
}

export interface ConfigService {
  getSiteConfig(): Promise<SiteConfig | null>;
  updateSiteConfig(updates: Partial<SiteConfig>, userId?: string | null): Promise<SiteConfig>;
  updateSiteConfigField(field: string, value: unknown): Promise<SiteConfig>;
  toggleMaintenanceMode(
    enabled: boolean,
    message?: string,
  ): Promise<SiteConfig>;
  updateSocialLinks(socialLinks: Record<string, string>): Promise<SiteConfig>;
  updateFooterConfig(
    footerText: string,
    footerLinks?: unknown[],
  ): Promise<SiteConfig>;
  updateSeoConfig(seoConfig: Partial<SiteConfig>): Promise<SiteConfig>;
  updateThemeConfig(
    defaultTheme: string,
    allowedThemes?: string[],
  ): Promise<SiteConfig>;
  updateFeatureFlags(features: Partial<SiteConfig>): Promise<SiteConfig>;
  initializeSiteConfig(): Promise<SiteConfig>;
}

export interface MediaService {
  getMediaItems(options?: {
    fileType?: string;
    folder?: string;
    tags?: string[];
    limit?: number;
  }): Promise<MediaLibraryItem[]>;
  getMediaItemById(id: string): Promise<MediaLibraryItem | null>;
  getMediaItemsByFolder(folder: string): Promise<MediaLibraryItem[]>;
  getMediaItemsByType(fileType: string): Promise<MediaLibraryItem[]>;
  uploadMedia(uploadData: {
    file: File | Blob;
    bucket?: string;
    folder?: string;
    metadata?: Partial<MediaLibraryItem>;
  }): Promise<MediaLibraryItem>;
  updateMediaItem(
    id: string,
    updates: Partial<MediaLibraryItem>,
  ): Promise<MediaLibraryItem>;
  deleteMediaItem(id: string): Promise<boolean>;
  trackMediaUsage(id: string, tableName: string): Promise<MediaLibraryItem>;
  getFolders(): Promise<string[]>;
  getTags(): Promise<string[]>;
  searchMedia(searchTerm: string): Promise<MediaLibraryItem[]>;
}

// Configuration
export function validateConfig(config: SupabaseConfig): void;
export function loadConfigFromEnv(): SupabaseConfig;
export function createConfig(config?: SupabaseConfig | null): SupabaseConfig;
export function debugConfig(config: SupabaseConfig): void;

// Client factory
export function createSupabaseClient(
  config?: SupabaseConfig | null,
  debug?: boolean,
): SupabaseClient;
export function getSupabaseClient(
  config?: SupabaseConfig | null,
  debug?: boolean,
): SupabaseClient;
export function resetSupabaseClient(): void;
export function createSupabaseClientFromEnv(debug?: boolean): SupabaseClient;

// Database service
export function createDatabaseService(
  supabaseClient: SupabaseClient,
): DatabaseService;
export function createDatabaseServiceFromEnv(
  client?: SupabaseClient | null,
): DatabaseService;

// weeCMS services
export function createContentService(
  supabaseClient: SupabaseClient,
): ContentService;
export function createContentServiceFromEnv(): Promise<ContentService>;

export function createNavigationService(
  supabaseClient: SupabaseClient,
): NavigationService;
export function createNavigationServiceFromEnv(): Promise<NavigationService>;

export function createConfigService(
  supabaseClient: SupabaseClient,
): ConfigService;
export function createConfigServiceFromEnv(): Promise<ConfigService>;

export function createSiteConfigService(
  supabaseClient: SupabaseClient,
): ConfigService;
export function createSiteConfigServiceFromEnv(): Promise<ConfigService>;

export function createMediaService(
  supabaseClient: SupabaseClient,
): MediaService;
export function createMediaServiceFromEnv(): Promise<MediaService>;

// Default export - get Supabase client singleton
declare const getSupabaseClientDefault: typeof getSupabaseClient;
export default getSupabaseClientDefault;
