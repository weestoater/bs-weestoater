// ============================================
// Football Seasons Configuration
// ============================================
// DEPRECATED: This static configuration is kept for backward compatibility
// and testing purposes only. The application now uses dynamic season data
// from the Supabase database (football_seasons table).
//
// To manage seasons, use the Admin Football Manager interface:
// /admin/football > Manage Seasons
//
// Active seasons are determined by the is_active flag in the database.
// ============================================

export interface SeasonConfig {
  id: string; // e.g., "2024-25"
  displayName: string; // e.g., "2024-25"
  fullName: string; // e.g., "2024-2025"
  startYear: number;
  endYear: number;
  isActive: boolean; // Current season flag
}

// Legacy static configuration - now managed in database
export const FOOTBALL_SEASONS: SeasonConfig[] = [
  {
    id: "2025-26",
    displayName: "2025-26",
    fullName: "2025-2026",
    startYear: 2025,
    endYear: 2026,
    isActive: true,
  },
  {
    id: "2024-25",
    displayName: "2024-25",
    fullName: "2024-2025",
    startYear: 2024,
    endYear: 2025,
    isActive: false,
  },
  {
    id: "2023-24",
    displayName: "2023-24",
    fullName: "2023-2024",
    startYear: 2023,
    endYear: 2024,
    isActive: false,
  },
  {
    id: "2022-23",
    displayName: "2022-23",
    fullName: "2022-2023",
    startYear: 2022,
    endYear: 2023,
    isActive: false,
  },
  {
    id: "2021-22",
    displayName: "2021-22",
    fullName: "2021-2022",
    startYear: 2021,
    endYear: 2022,
    isActive: false,
  },
  {
    id: "2020-21",
    displayName: "2020-21",
    fullName: "2020-2021",
    startYear: 2020,
    endYear: 2021,
    isActive: false,
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get season configuration by ID
 * @param seasonId - Season identifier (e.g., "2024-25")
 * @returns Season configuration or undefined
 */
export function getSeasonById(seasonId: string): SeasonConfig | undefined {
  return FOOTBALL_SEASONS.find((s) => s.id === seasonId);
}

/**
 * Get the current active season
 * @returns Current season configuration or undefined
 */
export function getCurrentSeason(): SeasonConfig | undefined {
  return FOOTBALL_SEASONS.find((s) => s.isActive);
}

/**
 * Get all season IDs as array
 * @returns Array of season IDs
 */
export function getAllSeasonIds(): string[] {
  return FOOTBALL_SEASONS.map((s) => s.id);
}

/**
 * Get previous seasons (excluding current)
 * @returns Array of previous season configurations
 */
export function getPreviousSeasons(): SeasonConfig[] {
  return FOOTBALL_SEASONS.filter((s) => !s.isActive);
}

/**
 * Generate data file paths for a season
 * @param seasonId - Season identifier
 * @returns Object with matches and goals file paths
 */
export function getSeasonDataPaths(seasonId: string) {
  return {
    matches: `/src/data/${seasonId}-matches.json`,
    goals: `/src/data/${seasonId}-goals.json`,
  };
}

/**
 * Validate if a season ID exists
 * @param seasonId - Season identifier to check
 * @returns Boolean indicating if season exists
 */
export function isValidSeasonId(seasonId: string): boolean {
  return FOOTBALL_SEASONS.some((s) => s.id === seasonId);
}
