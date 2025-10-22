import { Transaction } from "./transaction";

export type ScoredTransaction = Transaction & { fraudScore: number };

export interface RiskAnalytics {
  totalRisk: number;
  highRiskTransactions: number;
  patterns: Record<string, number>;
  anomalies: Record<string, number>;
  generatedAt: number;
}
