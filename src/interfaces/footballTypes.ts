// ============================================
// Player Stats & Scoring
// ============================================

export interface GoalScorer {
  player: string;
  goals: number;
  assists: number;
}

export interface MatchGoal {
  player: string;
  mins: number | string; // Can be number or string like "90+3" or "59 (Pen)"
  assist?: string;
}

// ============================================
// Match Cards
// ============================================

export interface MatchCard {
  player: string;
  type: "yellow" | "red" | string; // Allow any string for flexibility
  minute: number;
}

export interface CardType {
  player: string;
  card: "yellow" | "red";
  mins: string;
}

// ============================================
// Match Data
// ============================================

export interface Match {
  date: string; // ISO format: YYYY-MM-DD
  opposition: string;
  venue: string;
  scored: number;
  conceded: number;
  league?: string | null; // Allow null for flexibility
  video?: string | null; // Allow null
  iplayer?: string | null; // Allow null
  goals?: MatchGoal[] | null; // Allow null
  cards?: MatchCard[] | null; // Allow null
  notes?: string;
}

// ============================================
// Season Data Structure (NEW - Flattened)
// ============================================

export interface SeasonMatchData {
  season: string; // e.g., "2024-25"
  matches: Match[];
}

export interface SeasonGoalsData {
  season: string; // e.g., "2024-25"
  topScorers: GoalScorer[];
}

// ============================================
// Legacy Interfaces (Deprecated - for backwards compatibility)
// ============================================

/** @deprecated Use SeasonMatchData instead */
export interface Season {
  startDate: string;
  details: Match[];
}

/** @deprecated Use SeasonGoalsData instead */
export interface GoalStats {
  season: string;
  details: GoalScorer[];
}

// ============================================
// Component Props
// ============================================

export interface FootballSeasonProps {
  season?: string[];
  matches?: SeasonMatchData | Season[]; // Support both new and old structure
  goals?: SeasonGoalsData | GoalStats[]; // Support both new and old structure
}
