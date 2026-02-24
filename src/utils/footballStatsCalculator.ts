import type { Match } from "../interfaces/footballTypes";

export interface SeasonStats {
  totalMatches: number;
  cleanSheets: number;
  wins: number;
  draws: number;
  losses: number;
  winPercentage: string;
  homeWins: number;
  awayWins: number;
  currentCleanSheetStreak: number;
  goalsScored: number;
  goalsConceded: number;
}

/**
 * Calculate comprehensive season statistics from match data
 * @param matches - Array of Match objects
 * @returns SeasonStats object with all calculated statistics
 */
export const calculateSeasonStats = (matches: Match[]): SeasonStats => {
  // Filter only completed matches (with score data)
  const completedMatches = matches.filter(
    (m) => m.scored !== undefined && m.conceded !== undefined,
  );

  // Sort matches by date (oldest first) to ensure correct streak calculation
  const sortedMatches = [...completedMatches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const totalMatches = sortedMatches.length;

  // Return empty stats if no completed matches
  if (totalMatches === 0) {
    return {
      totalMatches: 0,
      cleanSheets: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      winPercentage: "0.0",
      homeWins: 0,
      awayWins: 0,
      currentCleanSheetStreak: 0,
      goalsScored: 0,
      goalsConceded: 0,
    };
  }

  // Calculate basic match results
  const wins = sortedMatches.filter((m) => m.scored! > m.conceded!).length;
  const draws = sortedMatches.filter((m) => m.scored === m.conceded).length;
  const losses = sortedMatches.filter((m) => m.scored! < m.conceded!).length;
  const winPercentage = ((wins / totalMatches) * 100).toFixed(1);

  // Calculate clean sheets (no goals conceded)
  const cleanSheets = sortedMatches.filter((m) => m.conceded === 0).length;

  // Calculate home/away wins (case-insensitive venue comparison)
  const homeWins = sortedMatches.filter(
    (m) => m.venue.toLowerCase() === "home" && m.scored! > m.conceded!,
  ).length;

  const awayWins = sortedMatches.filter(
    (m) => m.venue.toLowerCase() === "away" && m.scored! > m.conceded!,
  ).length;

  // Calculate current clean sheet streak (from most recent backwards)
  let currentCleanSheetStreak = 0;
  for (let i = sortedMatches.length - 1; i >= 0; i--) {
    if (sortedMatches[i].conceded === 0) {
      currentCleanSheetStreak++;
    } else {
      break;
    }
  }

  // Calculate total goals
  const goalsScored = sortedMatches.reduce(
    (sum, m) => sum + (m.scored || 0),
    0,
  );
  const goalsConceded = sortedMatches.reduce(
    (sum, m) => sum + (m.conceded || 0),
    0,
  );

  return {
    totalMatches,
    cleanSheets,
    wins,
    draws,
    losses,
    winPercentage,
    homeWins,
    awayWins,
    currentCleanSheetStreak,
    goalsScored,
    goalsConceded,
  };
};
