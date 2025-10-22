import { Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { TransactionSummary } from "../types/transaction";
import Spinner from "./Spinner";

interface DashboardStatsProps {
  summary: TransactionSummary | null;
  filteredCount: number;
  totalCount: number;
  isAnalyzing: boolean;
  highRiskCount?: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  summary,
  filteredCount,
  totalCount,
  isAnalyzing,
  highRiskCount,
}) => {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">
          <DollarSign size={24} />
        </div>
        <div className="stat-content">
          <p className="stat-value">
            ${summary ? summary.totalAmount.toLocaleString() : "0"}
          </p>
          <div className="stat-label">Total Amount</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <p className="stat-value">
            ${summary ? summary.totalCredits.toLocaleString() : "0"}
          </p>
          <div className="stat-label">Total Credits</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <TrendingDown size={24} />
        </div>
        <div className="stat-content">
          <p className="stat-value">
            ${summary ? summary.totalDebits.toLocaleString() : "0"}
          </p>
          <div className="stat-label">Total Debits</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <Clock size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-flex">
            <p className="stat-value">
              {filteredCount.toLocaleString()}
              {filteredCount !== totalCount && (
                <span className="stat-total">
                  {" "}
                  of {totalCount.toLocaleString()}
                </span>
              )}
            </p>
            {isAnalyzing && (
              <span className="stat-analyzing__container">
                <Spinner size={12} />
                <span>Analyzing</span>
              </span>
            )}
          </div>
          <div className="stat-label">
            Transactions
            {typeof highRiskCount === "number" && (
              <span> - Risk: {highRiskCount}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
