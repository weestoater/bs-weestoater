/**
 * TypeScript declarations for BS WeeStaater Backend
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: Record<string, any>;
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

// Default export - get Supabase client singleton
declare const getSupabaseClientDefault: typeof getSupabaseClient;
export default getSupabaseClientDefault;
