import { describe, it, expect } from "vitest";
import { formatDateToDDMMM } from "../../utils/dateUtils";

describe("dateUtils", () => {
  describe("formatDateToDDMMM", () => {
    it("formats date string correctly", () => {
      expect(formatDateToDDMMM("25/12/2023")).toBe("25 Dec");
      expect(formatDateToDDMMM("01/01/2024")).toBe("01 Jan");
      expect(formatDateToDDMMM("31/03/2024")).toBe("31 Mar");
    });

    it("handles single digit days and months", () => {
      expect(formatDateToDDMMM("1/1/2024")).toBe("01 Jan");
      expect(formatDateToDDMMM("9/8/2024")).toBe("09 Aug");
    });

    it("handles edge cases", () => {
      expect(formatDateToDDMMM("31/12/2023")).toBe("31 Dec");
      expect(formatDateToDDMMM("29/02/2024")).toBe("29 Feb"); // Leap year
    });
  });
});
