import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Transaction } from "../../types/transaction";
import {
  calculateSummary,
  calculateTransactionRisk,
  generateTransactionData,
  getGlobalAnalytics,
  startDataRefresh,
  stopDataRefresh,
} from "../generators";

describe("Analytics and Data Generation", () => {
  let transactions: Transaction[] = [];

  beforeAll(() => {
    transactions = generateTransactionData(50);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should calculate the summary correctly", () => {
    const summary = calculateSummary(transactions);
    expect(summary.totalTransactions).toBe(50);
    expect(summary.totalAmount).toBeGreaterThan(0);
    expect(summary.totalCredits).toBeGreaterThan(0);
    expect(summary.totalDebits).toBeGreaterThan(0);
    expect(summary.avgTransactionAmount).toBeGreaterThan(0);
  });

  it("should calculate transaction risk", () => {
    const risk = calculateTransactionRisk(1);
    expect(risk).toBeGreaterThanOrEqual(0);
  });

  it("should get global analytics", () => {
    const analytics = getGlobalAnalytics();
    expect(analytics.totalCachedTransactions).toBeGreaterThan(0);
    expect(analytics.snapshotCount).toBeGreaterThanOrEqual(0);
    expect(analytics.oldestTransaction).toBeInstanceOf(Date);
    expect(analytics.newestTransaction).toBeInstanceOf(Date);
  });

  it("should start and stop data refresh", async () => {
    const callback = vi.fn();
    startDataRefresh(callback, 100);

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(callback).toHaveBeenCalledTimes(1);

    stopDataRefresh();

    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
