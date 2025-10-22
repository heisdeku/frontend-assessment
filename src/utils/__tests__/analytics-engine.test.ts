import { describe, it, expect } from "vitest";
import {
  generateRiskAssessment,
  calculateFraudScores,
  generateTimeSeriesAnalysis,
  calculateMarketCorrelation,
  calculateStringSimilarity,
  analyzeSpendingPattern,
} from "../analytics-engine";
import { Transaction } from "../../types/transaction";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    timestamp: new Date("2023-01-15T10:00:00Z"),
    amount: 100,
    currency: "USD",
    type: "debit",
    category: "Groceries",
    merchantName: "Supermarket",
    status: "completed",
    description: "Weekly groceries",
    userId: "user1",
    accountId: "account1",
  },
  {
    id: "2",
    timestamp: new Date("2023-01-15T10:05:00Z"),
    amount: 105,
    currency: "USD",
    type: "debit",
    category: "Groceries",
    merchantName: "Supermarket",
    status: "completed",
    description: "More groceries",
    userId: "user1",
    accountId: "account1",
  },
  {
    id: "3",
    timestamp: new Date("2023-01-16T12:00:00Z"),
    amount: 50,
    currency: "USD",
    type: "credit",
    category: "Salary",
    merchantName: "Employer",
    status: "completed",
    description: "Monthly salary",
    userId: "user1",
    accountId: "account1",
  },
];

describe("analytics-engine", () => {
  describe("calculateStringSimilarity", () => {
    it("should return 1 for identical strings", () => {
      expect(calculateStringSimilarity("hello", "hello")).toBe(1);
    });

    it("should return a value between 0 and 1 for different strings", () => {
      const similarity = calculateStringSimilarity("hello", "world");
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThan(1);
    });
  });

  describe("calculateFraudScores", () => {
    it("should calculate fraud scores for transactions", () => {
      const scoredTransactions = calculateFraudScores(mockTransactions);
      expect(scoredTransactions.length).toBe(3);
      expect(scoredTransactions[0].fraudScore).toBeGreaterThan(0);
    });
  });

  describe("generateTimeSeriesAnalysis", () => {
    it("should generate time series data", () => {
      const timeSeries = generateTimeSeriesAnalysis(mockTransactions);
      expect(timeSeries.dailyData).toHaveProperty(
        new Date("2023-01-15T10:00:00Z").toDateString()
      );
      expect(timeSeries.movingAverages.length).toBeGreaterThan(0);
    });
  });

  describe("calculateMarketCorrelation", () => {
    it("should calculate market correlation between categories", () => {
      const correlationMatrix = calculateMarketCorrelation(mockTransactions);
      expect(correlationMatrix).toHaveProperty("Groceries");
      expect(correlationMatrix.Groceries).toHaveProperty("Salary");
    });
  });

  describe("analyzeSpendingPattern", () => {
    it("should analyze user spending patterns", () => {
      const spendingPattern = analyzeSpendingPattern(mockTransactions);
      expect(spendingPattern.totalAmount).toBe(255);
      expect(spendingPattern.avgAmount).toBe(85);
      expect(spendingPattern.categoryDistribution).toEqual({
        Groceries: 2,
        Salary: 1,
      });
    });
  });

  describe("generateRiskAssessment", () => {
    it("should generate a comprehensive risk assessment", () => {
      const assessment = generateRiskAssessment(mockTransactions);
      expect(assessment).toHaveProperty("fraudScores");
      expect(assessment).toHaveProperty("timeSeriesData");
      expect(assessment).toHaveProperty("marketCorrelation");
      expect(assessment).toHaveProperty("behaviorClusters");
      expect(assessment.processingTime).toBeGreaterThan(0);
    });
  });
});