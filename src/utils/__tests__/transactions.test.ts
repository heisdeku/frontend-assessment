import { describe, expect, it } from "vitest";
import { Transaction } from "../../types/transaction";
import {
  analyzeTransactionPatterns,
  calculateRiskFactorsCached,
  detectAnomalies,
} from "../transactions";

describe("transactions", () => {
  const mockTransaction: Transaction = {
    id: "1",
    timestamp: new Date(),
    amount: 1000, // Increased amount to trigger anomaly
    currency: "USD",
    type: "debit",
    category: "Electronics",
    merchantName: "Tech Store",
    status: "completed",
    description: "New laptop",
    userId: "user1",
    accountId: "account1",
  };

  const userMap: Record<string, Transaction[]> = {
    user1: [
      { ...mockTransaction, amount: 90 },
      { ...mockTransaction, amount: 110 },
    ],
  };

  const merchantMap: Record<string, Transaction[]> = {
    Supermarket: [
      { ...mockTransaction, amount: 95 },
      { ...mockTransaction, amount: 105 },
    ],
  };

  describe("detectAnomalies", () => {
    it("should detect anomalies in transactions", () => {
      const anomalyScore = detectAnomalies(mockTransaction, userMap);
      expect(anomalyScore).toBeGreaterThan(0);
    });
  });

  describe("analyzeTransactionPatterns", () => {
    it("should analyze transaction patterns", () => {
      const patternScore = analyzeTransactionPatterns(
        mockTransaction,
        merchantMap,
        userMap
      );
      expect(patternScore).toBe(0);
    });
  });

  describe("calculateRiskFactorsCached", () => {
    it("should calculate risk factors for a transaction", () => {
      const riskFactors = calculateRiskFactorsCached(
        mockTransaction,
        merchantMap
      );
      expect(riskFactors).toBeGreaterThan(0);
    });
  });
});
