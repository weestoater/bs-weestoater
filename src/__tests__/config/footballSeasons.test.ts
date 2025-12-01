import { describe, it, expect } from "vitest";
import {
  getSeasonById,
  isValidSeasonId,
  getAllSeasons,
  getCurrentSeason,
  getPreviousSeasons,
} from "../../config/footballSeasons";

describe("footballSeasons", () => {
  describe("getSeasonById", () => {
    it("returns season config for valid season ID", () => {
      const season = getSeasonById("2020-21");
      expect(season).toBeDefined();
      expect(season?.id).toBe("2020-21");
      expect(season?.fullName).toBe("2020-2021");
    });

    it("returns undefined for invalid season ID", () => {
      const season = getSeasonById("invalid-season");
      expect(season).toBeUndefined();
    });

    it("returns season with all required properties", () => {
      const season = getSeasonById("2020-21");
      expect(season).toHaveProperty("id");
      expect(season).toHaveProperty("fullName");
      expect(season).toHaveProperty("displayName");
      expect(season).toHaveProperty("startYear");
      expect(season).toHaveProperty("endYear");
    });
  });

  describe("isValidSeasonId", () => {
    it("returns true for valid season ID", () => {
      expect(isValidSeasonId("2020-21")).toBe(true);
    });

    it("returns false for invalid season ID", () => {
      expect(isValidSeasonId("invalid-season")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isValidSeasonId("")).toBe(false);
    });
  });

  describe("getCurrentSeason", () => {
    it("returns the current season", () => {
      const current = getCurrentSeason();
      expect(current).toBeDefined();
      expect(current.id).toBe("2025-26");
    });
  });

  describe("getPreviousSeasons", () => {
    it("returns array of previous seasons", () => {
      const previous = getPreviousSeasons();
      expect(Array.isArray(previous)).toBe(true);
      expect(previous.length).toBeGreaterThan(0);
    });

    it("does not include current season", () => {
      const previous = getPreviousSeasons();
      const current = getCurrentSeason();
      const hasCurrentSeason = previous.some(
        (season) => season.id === current.id
      );
      expect(hasCurrentSeason).toBe(false);
    });

    it("returns seasons sorted by year descending", () => {
      const previous = getPreviousSeasons();
      for (let i = 0; i < previous.length - 1; i++) {
        expect(previous[i].startYear).toBeGreaterThan(
          previous[i + 1].startYear
        );
      }
    });
  });
});
