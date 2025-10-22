import { describe, it, expect } from "vitest";
import {
  calculateRelevanceScore,
  generateSuggestions,
  analyzeSearchPatterns,
} from "../search";

describe("search", () => {
  describe("calculateRelevanceScore", () => {
    it("should return a higher score for a better match", () => {
      const score1 = calculateRelevanceScore("apple", "app");
      const score2 = calculateRelevanceScore("banana", "app");
      expect(score1).toBeGreaterThan(score2);
    });
  });

  describe("generateSuggestions", () => {
    it("should generate relevant search suggestions", () => {
      const suggestions = generateSuggestions("star");
      expect(suggestions).toContain("starbucks");
    });
  });

  describe("analyzeSearchPatterns", () => {
    it("should analyze search patterns", () => {
      const analysis = analyzeSearchPatterns("test");

      expect(analysis.segments).toBe(10);
      expect(analysis.unique).toBe(9);
      expect(analysis.score).toBe(36);
    });
  });
});