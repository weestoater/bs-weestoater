import { describe, it, expect } from "vitest";
import { calculateSeasonStats } from "../../utils/footballStatsCalculator";
import type { Match } from "../../interfaces/footballTypes";

describe("footballStatsCalculator", () => {
  describe("calculateSeasonStats", () => {
    const mockMatches: Match[] = [
      {
        date: "2025-08-01",
        opposition: "Team A",
        venue: "Home",
        scored: 2,
        conceded: 0,
        league: "SPFL",
      },
      {
        date: "2025-08-08",
        opposition: "Team B",
        venue: "Away",
        scored: 1,
        conceded: 1,
        league: "SPFL",
      },
      {
        date: "2025-08-15",
        opposition: "Team C",
        venue: "Home",
        scored: 3,
        conceded: 1,
        league: "SPFL",
      },
      {
        date: "2025-08-22",
        opposition: "Team D",
        venue: "Away",
        scored: 2,
        conceded: 0,
        league: "SPFL",
      },
      {
        date: "2025-08-29",
        opposition: "Team E",
        venue: "Home",
        scored: 1,
        conceded: 0,
        league: "SPFL",
      },
      {
        date: "2025-09-05",
        opposition: "Team F",
        venue: "Away",
        scored: 0,
        conceded: 2,
        league: "SPFL",
      },
    ];

    it("calculates basic match statistics correctly", () => {
      const stats = calculateSeasonStats(mockMatches);

      expect(stats.totalMatches).toBe(6);
      expect(stats.wins).toBe(4); // Teams A, C, D, E
      expect(stats.draws).toBe(1); // Team B
      expect(stats.losses).toBe(1); // Team F
      expect(stats.winPercentage).toBe("66.7");
    });

    it("calculates clean sheets correctly", () => {
      const stats = calculateSeasonStats(mockMatches);

      expect(stats.cleanSheets).toBe(3); // Teams A, D, E
    });

    it("calculates home and away wins correctly", () => {
      const stats = calculateSeasonStats(mockMatches);

      expect(stats.homeWins).toBe(3); // Teams A, C, E (all at home)
      expect(stats.awayWins).toBe(1); // Team D (away)
    });

    it("calculates current clean sheet streak correctly", () => {
      const stats = calculateSeasonStats(mockMatches);

      // Last match (Team F) conceded 2, so streak is 0
      expect(stats.currentCleanSheetStreak).toBe(0);
    });

    it("calculates clean sheet streak correctly when current", () => {
      const matchesWithStreak: Match[] = [
        {
          date: "2025-08-01",
          opposition: "Team A",
          venue: "Home",
          scored: 2,
          conceded: 1,
          league: "SPFL",
        },
        {
          date: "2025-08-08",
          opposition: "Team B",
          venue: "Home",
          scored: 1,
          conceded: 0,
          league: "SPFL",
        },
        {
          date: "2025-08-15",
          opposition: "Team C",
          venue: "Home",
          scored: 2,
          conceded: 0,
          league: "SPFL",
        },
        {
          date: "2025-08-22",
          opposition: "Team D",
          venue: "Home",
          scored: 1,
          conceded: 0,
          league: "SPFL",
        },
      ];

      const stats = calculateSeasonStats(matchesWithStreak);

      expect(stats.currentCleanSheetStreak).toBe(3); // Last 3 matches
    });

    it("calculates goals scored and conceded totals", () => {
      const stats = calculateSeasonStats(mockMatches);

      expect(stats.goalsScored).toBe(9); // 2+1+3+2+1+0
      expect(stats.goalsConceded).toBe(4); // 0+1+1+0+0+2
    });

    it("returns empty stats for empty match array", () => {
      const stats = calculateSeasonStats([]);

      expect(stats.totalMatches).toBe(0);
      expect(stats.wins).toBe(0);
      expect(stats.draws).toBe(0);
      expect(stats.losses).toBe(0);
      expect(stats.winPercentage).toBe("0.0");
      expect(stats.cleanSheets).toBe(0);
      expect(stats.homeWins).toBe(0);
      expect(stats.awayWins).toBe(0);
      expect(stats.currentCleanSheetStreak).toBe(0);
      expect(stats.goalsScored).toBe(0);
      expect(stats.goalsConceded).toBe(0);
    });

    it("handles matches without scores (incomplete matches)", () => {
      const incompletesMatches: Match[] = [
        {
          date: "2025-08-01",
          opposition: "Team A",
          venue: "Home",
          league: "SPFL",
        },
        {
          date: "2025-08-08",
          opposition: "Team B",
          venue: "Away",
          scored: 2,
          conceded: 1,
          league: "SPFL",
        },
      ];

      const stats = calculateSeasonStats(incompletesMatches);

      // Should only count the completed match
      expect(stats.totalMatches).toBe(1);
      expect(stats.wins).toBe(1);
    });

    it("handles case-insensitive venue matching", () => {
      const mixedCaseMatches: Match[] = [
        {
          date: "2025-08-01",
          opposition: "Team A",
          venue: "home",
          scored: 2,
          conceded: 0,
          league: "SPFL",
        },
        {
          date: "2025-08-08",
          opposition: "Team B",
          venue: "HOME",
          scored: 3,
          conceded: 1,
          league: "SPFL",
        },
        {
          date: "2025-08-15",
          opposition: "Team C",
          venue: "away",
          scored: 1,
          conceded: 0,
          league: "SPFL",
        },
        {
          date: "2025-08-22",
          opposition: "Team D",
          venue: "AWAY",
          scored: 2,
          conceded: 1,
          league: "SPFL",
        },
      ];

      const stats = calculateSeasonStats(mixedCaseMatches);

      expect(stats.homeWins).toBe(2);
      expect(stats.awayWins).toBe(2);
    });

    it("sorts matches by date for streak calculation", () => {
      const unsortedMatches: Match[] = [
        {
          date: "2025-08-15",
          opposition: "Team C",
          venue: "Home",
          scored: 1,
          conceded: 0,
          league: "SPFL",
        },
        {
          date: "2025-08-01",
          opposition: "Team A",
          venue: "Home",
          scored: 2,
          conceded: 1,
          league: "SPFL",
        },
        {
          date: "2025-08-22",
          opposition: "Team D",
          venue: "Home",
          scored: 2,
          conceded: 0,
          league: "SPFL",
        },
        {
          date: "2025-08-08",
          opposition: "Team B",
          venue: "Home",
          scored: 3,
          conceded: 0,
          league: "SPFL",
        },
      ];

      const stats = calculateSeasonStats(unsortedMatches);

      // After sorting by date: Team A (conceded 1), Team B (0), Team C (0), Team D (0)
      // Streak should be 3 (last 3 matches)
      expect(stats.currentCleanSheetStreak).toBe(3);
    });
  });
});
