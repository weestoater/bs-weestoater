import { describe, it, expect } from "vitest";
import {
  calculateReadingTime,
  formatReadingTime,
} from "../../utils/readingTime";

describe("readingTime utils", () => {
  describe("calculateReadingTime", () => {
    it("calculates reading time for simple text", () => {
      const text = "word ".repeat(200); // 200 words
      const result = calculateReadingTime(text);
      expect(result).toBe(1);
    });

    it("calculates reading time for longer text", () => {
      const text = "word ".repeat(600); // 600 words
      const result = calculateReadingTime(text);
      expect(result).toBe(3);
    });

    it("rounds up partial minutes", () => {
      const text = "word ".repeat(250); // 250 words = 1.25 min
      const result = calculateReadingTime(text);
      expect(result).toBe(2);
    });

    it("strips HTML tags before counting", () => {
      const text = "<p>word word word</p><div>word word</div>";
      const result = calculateReadingTime(text);
      expect(result).toBeGreaterThan(0);
    });

    it("handles empty string", () => {
      const result = calculateReadingTime("");
      expect(result).toBe(0);
    });

    it("uses custom words per minute", () => {
      const text = "word ".repeat(400); // 400 words
      const result = calculateReadingTime(text, 400);
      expect(result).toBe(1);
    });

    it("handles text with multiple spaces", () => {
      const text = "word    word    word"; // Multiple spaces
      const result = calculateReadingTime(text);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe("formatReadingTime", () => {
    it("formats single minute", () => {
      const result = formatReadingTime(1);
      expect(result).toBe("1 min read");
    });

    it("formats multiple minutes", () => {
      const result = formatReadingTime(5);
      expect(result).toBe("5 min read");
    });

    it("formats zero minutes as less than 1", () => {
      const result = formatReadingTime(0);
      expect(result).toBe("< 1 min read");
    });

    it("handles large numbers", () => {
      const result = formatReadingTime(42);
      expect(result).toBe("42 min read");
    });
  });
});
