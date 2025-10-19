import { describe, it, expect } from "vitest";
import {
  calculateMatchResult,
  formatScore,
  sortGoalScorers,
  getGoalMinutes,
} from "../../utils/footballUtils";
import { GoalScorer, MatchGoal } from "../../interfaces/footballTypes";

describe("footballUtils", () => {
  describe("calculateMatchResult", () => {
    it("returns W when scored more than conceded", () => {
      expect(calculateMatchResult(3, 1)).toBe("W");
      expect(calculateMatchResult(2, 0)).toBe("W");
    });

    it("returns L when scored less than conceded", () => {
      expect(calculateMatchResult(1, 3)).toBe("L");
      expect(calculateMatchResult(0, 2)).toBe("L");
    });

    it("returns D when scored equals conceded", () => {
      expect(calculateMatchResult(1, 1)).toBe("D");
      expect(calculateMatchResult(0, 0)).toBe("D");
      expect(calculateMatchResult(2, 2)).toBe("D");
    });
  });

  describe("formatScore", () => {
    it("formats home scores correctly", () => {
      expect(formatScore(3, 1, "home")).toBe("3 - 1");
      expect(formatScore(0, 2, "home")).toBe("0 - 2");
    });

    it("formats away scores correctly", () => {
      expect(formatScore(3, 1, "away")).toBe("1 - 3");
      expect(formatScore(0, 2, "away")).toBe("2 - 0");
    });

    it("is case insensitive for venue", () => {
      expect(formatScore(3, 1, "HOME")).toBe("3 - 1");
      expect(formatScore(3, 1, "AWAY")).toBe("1 - 3");
    });
  });

  describe("sortGoalScorers", () => {
    const scorers: GoalScorer[] = [
      { player: "Bob", goals: 5, assists: 3 },
      { player: "Alice", goals: 5, assists: 4 },
      { player: "Charlie", goals: 7, assists: 2 },
      { player: "Dave", goals: 5, assists: 3 },
    ];

    it("sorts by goals first", () => {
      const sorted = sortGoalScorers(scorers);
      expect(sorted[0].player).toBe("Charlie");
      expect(sorted[0].goals).toBe(7);
    });

    it("sorts by assists when goals are equal", () => {
      const sorted = sortGoalScorers(scorers);
      expect(sorted[1].player).toBe("Alice");
      expect(sorted[1].assists).toBe(4);
    });

    it("sorts alphabetically when goals and assists are equal", () => {
      const sorted = sortGoalScorers(scorers);
      expect(sorted[2].player).toBe("Bob");
      expect(sorted[3].player).toBe("Dave");
    });

    it("does not modify the original array", () => {
      const original = [...scorers];
      sortGoalScorers(scorers);
      expect(scorers).toEqual(original);
    });
  });

  describe("getGoalMinutes", () => {
    it("formats goal minutes in ascending order", () => {
      const goals: MatchGoal[] = [
        { mins: 45, player: "Bob", assist: "Alice" },
        { mins: 23, player: "Charlie", assist: "Dave" },
        { mins: 89, player: "Alice", assist: undefined },
      ];
      expect(getGoalMinutes(goals)).toBe("23, 45, 89");
    });

    it("handles single goal", () => {
      const goals: MatchGoal[] = [{ mins: 45, player: "Bob", assist: "Alice" }];
      expect(getGoalMinutes(goals)).toBe("45");
    });

    it("handles empty array", () => {
      expect(getGoalMinutes([])).toBe("");
    });
  });
});
