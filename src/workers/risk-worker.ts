/// <reference lib="webworker" />

import type { Transaction } from "../types/transaction";
import {
  analyzeTransactionPatterns,
  calculateRiskFactorsCached,
  detectAnomalies,
} from "../utils/analytics-engine";
import { groupBy } from "../utils/helpers";

self.onmessage = (event: MessageEvent<Transaction[]>) => {
  const transactions = event.data;
  const merchantMap = groupBy(transactions, (t) => t.merchantName);
  const userMap = groupBy(transactions, (t) => t.userId);

  const analyticsData = {
    totalRisk: 0,
    highRiskTransactions: 0,
    patterns: {} as Record<string, number>,
    anomalies: {} as Record<string, number>,
    generatedAt: Date.now(),
  };

  for (const transaction of transactions) {
    const risk = calculateRiskFactorsCached(transaction, merchantMap);
    const pattern = analyzeTransactionPatterns(
      transaction,
      merchantMap,
      userMap
    );
    const anomaly = detectAnomalies(transaction, userMap);

    const totalScore = risk + pattern + anomaly;

    analyticsData.totalRisk += totalScore;
    if (risk > 0.7) analyticsData.highRiskTransactions++;

    analyticsData.patterns[transaction.id] = pattern;
    analyticsData.anomalies[transaction.id] = anomaly;
  }

  self.postMessage(analyticsData);
};
