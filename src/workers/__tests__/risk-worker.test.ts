import { vi, describe, it, expect, beforeEach } from "vitest";
import { Transaction } from "../../types/transaction";
import { RiskAnalytics } from "../../types/risk";

// Mock the global self object for the worker context
const mockPostMessage = vi.fn();

const selfMock = {
  postMessage: mockPostMessage,
  onmessage: null as ((event: MessageEvent) => void) | null,
};

vi.stubGlobal("self", selfMock);

describe("Risk Worker", () => {
  beforeEach(() => {
    vi.resetModules(); // Reset modules to isolate tests
    mockPostMessage.mockClear();
    selfMock.onmessage = null;
  });

  it("should process transactions and post analytics data", async () => {
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        timestamp: new Date(),
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
        timestamp: new Date(),
        amount: 2000,
        currency: "USD",
        type: "debit",
        category: "Electronics",
        merchantName: "Tech Store",
        status: "completed",
        description: "New laptop",
        userId: "user1",
        accountId: "account1",
      },
    ];

    // Dynamically import the worker script to execute it
    await import("../../workers/risk-worker");

    // Trigger the onmessage handler
    if (self.onmessage) {
      const messageEvent = new MessageEvent("message", {
        data: mockTransactions,
      });
      self.onmessage(messageEvent);
    }

    // Check if postMessage was called
    expect(mockPostMessage).toHaveBeenCalledTimes(1);

    const analyticsData: RiskAnalytics = mockPostMessage.mock.calls[0][0];

    // Validate the structure and content of the analytics data
    expect(analyticsData).toHaveProperty("totalRisk");
    expect(analyticsData).toHaveProperty("highRiskTransactions");
    expect(analyticsData).toHaveProperty("patterns");
    expect(analyticsData).toHaveProperty("anomalies");
    expect(analyticsData).toHaveProperty("generatedAt");

    expect(typeof analyticsData.totalRisk).toBe("number");
    expect(typeof analyticsData.highRiskTransactions).toBe("number");
    expect(typeof analyticsData.generatedAt).toBe("number");

    expect(Object.keys(analyticsData.patterns).length).toBe(
      mockTransactions.length
    );
    expect(Object.keys(analyticsData.anomalies).length).toBe(
      mockTransactions.length
    );
  });
});