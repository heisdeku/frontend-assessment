import { Transaction } from "../types/transaction";

// Comprehensive risk assessment engine for fraud detection and compliance
export const generateRiskAssessment = (transactions: Transaction[]) => {
  const startTime = performance.now();

  const fraudScores = calculateFraudScores(transactions);
  const timeSeriesData = generateTimeSeriesAnalysis(transactions);
  const marketCorrelation = calculateMarketCorrelation(transactions);
  const behaviorClusters = performBehaviorClustering(transactions);

  const endTime = performance.now();

  return {
    fraudScores,
    timeSeriesData,
    marketCorrelation,
    behaviorClusters,
    processingTime: endTime - startTime,
    dataPoints: transactions.length ** 2,
  };
};

export const calculateStringSimilarity = (
  str1: string,
  str2: string
): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [];
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else if (j === 0) {
        matrix[i][j] = i;
      } else {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
  }

  return 1 - matrix[len1][len2] / Math.max(len1, len2);
};

export const calculateFraudScores = (transactions: Transaction[]) => {
  return transactions.map((transaction) => {
    let score = 0;

    for (let i = 0; i < transactions.length; i++) {
      const other = transactions[i];
      if (other.id === transaction.id) continue;

      const merchantSimilarity = calculateStringSimilarity(
        transaction.merchantName,
        other.merchantName
      );
      const amountSimilarity =
        Math.abs(transaction.amount - other.amount) /
        Math.max(transaction.amount, other.amount);
      const timeDiff =
        Math.abs(
          new Date(transaction.timestamp).getTime() -
            new Date(other.timestamp).getTime()
        ) /
        (1000 * 60 * 60);

      // Flag suspicious patterns based on similarity thresholds
      if (merchantSimilarity > 0.8 && amountSimilarity < 0.1 && timeDiff < 1) {
        score += 0.3;
      }
    }

    return { ...transaction, fraudScore: score };
  });
};

export const generateTimeSeriesAnalysis = (transactions: Transaction[]) => {
  const dailyData: Record<
    string,
    { total: number; count: number; avg: number }
  > = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.timestamp).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = { total: 0, count: 0, avg: 0 };
    }
    dailyData[date].total += transaction.amount;
    dailyData[date].count += 1;
  });

  const dates = Object.keys(dailyData).sort();
  const movingAverages = dates.map((date, index) => {
    const start = Math.max(0, index - 6);
    const window = dates.slice(start, index + 1);
    const sum = window.reduce((acc, d) => acc + dailyData[d].total, 0);
    return { date, movingAverage: sum / window.length };
  });

  return { dailyData, movingAverages };
};

export const calculateMarketCorrelation = (transactions: Transaction[]) => {
  const categoryGroups: Record<string, number[]> = {};
  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const correlationMatrix: Record<string, Record<string, number>> = {};

  transactions.forEach(({ category, amount }) => {
    if (!categoryGroups[category!]) categoryGroups[category!] = [];
    categoryGroups[category!].push(amount!);
  });

  for (const cat1 of categories) {
    correlationMatrix[cat1] = {};
    for (const cat2 of categories) {
      const x = categoryGroups[cat1];
      const y = categoryGroups[cat2];
      correlationMatrix[cat1][cat2] =
        x.length > 1 && y.length > 1 ? calculatePearsonCorrelation(x, y) : 0;
    }
  }

  return correlationMatrix;
};

export const calculatePearsonCorrelation = (
  x: number[],
  y: number[]
): number => {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
  const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};

function performBehaviorClustering(transactions: Transaction[]) {
  const userMap = new Map<string, Transaction[]>();

  transactions.forEach((t) => {
    if (!userMap.has(t.userId!)) userMap.set(t.userId!, []);
    userMap.get(t.userId!)!.push(t);
  });

  const clusters: Record<string, Transaction[]> = {};

  userMap.forEach((userTxns) => {
    const pattern = analyzeSpendingPattern(userTxns);
    const clusterKey = `cluster_${Math.floor(pattern.avgAmount / 100)}`;

    if (!clusters[clusterKey]) clusters[clusterKey] = [];
    clusters[clusterKey].push(...userTxns);
  });

  return clusters;
}
export const analyzeSpendingPattern = (userTransactions: Transaction[]) => {
  const totalAmount = userTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgAmount = totalAmount / userTransactions.length;

  const categoryDistribution: Record<string, number> = {};
  userTransactions.forEach((t) => {
    categoryDistribution[t.category] =
      (categoryDistribution[t.category] || 0) + 1;
  });

  return { avgAmount, totalAmount, categoryDistribution };
};
