import { Transaction } from "../types/transaction";

export const detectAnomalies = (
  transaction: Transaction,
  userMap: Record<string, Transaction[]>
) => {
  const userTransactions = userMap[transaction.userId] || [];
  const avgAmount =
    userTransactions.reduce((sum, t) => sum + t.amount, 0) /
    (userTransactions.length || 1);

  const amountDeviation = Math.abs(transaction.amount - avgAmount) / avgAmount;
  const locationAnomaly =
    transaction.location &&
    !userTransactions
      .slice(-10)
      .some((t) => t.location === transaction.location)
      ? 0.4
      : 0;

  return Math.min(amountDeviation * 0.3 + locationAnomaly, 1);
};

export const analyzeTransactionPatterns = (
  transaction: Transaction,
  merchantMap: Record<string, Transaction[]>,
  userMap: Record<string, Transaction[]>
) => {
  const merchantTxs = merchantMap[transaction.merchantName] || [];
  const similarTransactions = merchantTxs.filter(
    (t) => Math.abs(t.amount - transaction.amount) < 10
  );

  const velocityCheck = (userMap[transaction.userId] || []).filter(
    (t) =>
      Math.abs(
        new Date(t.timestamp).getTime() -
          new Date(transaction.timestamp).getTime()
      ) < 3600000
  );

  let score = 0;
  if (similarTransactions.length > 3) score += 0.3;
  if (velocityCheck.length > 5) score += 0.5;

  return score;
};

export const calculateRiskFactorsCached = (
  transaction: Transaction,
  merchantMap: Record<string, Transaction[]>
) => {
  const merchantHistory = merchantMap[transaction.merchantName] || [];

  const merchantRisk = merchantHistory.length < 5 ? 0.8 : 0.2;
  const amountRisk = transaction.amount > 1000 ? 0.6 : 0.1;
  const timeRisk = new Date(transaction.timestamp).getHours() < 6 ? 0.4 : 0.1;

  return merchantRisk + amountRisk + timeRisk;
};
