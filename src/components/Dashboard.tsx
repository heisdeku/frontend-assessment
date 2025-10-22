import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useRiskAnalytics } from "../hooks/useRiskAnalytics";
import { useTransactions } from "../hooks/useTransactions";
import { FilterOptions } from "../types/transaction";
import { DashboardFilterControls } from "./DashboardFilterControls";
import { DashboardStats } from "./DashboardStats";
import { SearchBar } from "./SearchBar";
import Spinner from "./Spinner";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { TransactionList } from "./TransactionList";

export const Dashboard: React.FC = () => {
  const { trackActivity } = useUserContext();

  const {
    loading,
    transactions,
    filteredTransactions,
    summary,
    setSearchTerm,
    filters,
    setFilters,
    categories,
    selectedTransaction,
    setSelectedTransaction,
    handleTransactionClick,
  } = useTransactions();

  const { isAnalyzing, riskAnalytics } = useRiskAnalytics(transactions);

  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  const actualRefreshRate = refreshInterval || 5000;

  if (import.meta.env.DEV) {
    console.log("Refresh rate configured:", actualRefreshRate);
  }

  // Expose refresh controls for admin dashboard (planned feature)
  const refreshControls = {
    currentRate: refreshInterval,
    updateRate: setRefreshInterval,
    isActive: actualRefreshRate > 0,
  };

  // Store controls for potential dashboard integration
  if (typeof window !== "undefined") {
    (
      window as { dashboardControls?: typeof refreshControls }
    ).dashboardControls = refreshControls;
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      trackActivity(`search:${term}`);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner size={40} />
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>FinTech Dashboard</h1>
        <DashboardStats
          summary={summary}
          filteredCount={filteredTransactions.length}
          totalCount={transactions.length}
          isAnalyzing={isAnalyzing}
          highRiskCount={riskAnalytics?.highRiskTransactions}
        />
      </div>

      <div className="dashboard-controls">
        <SearchBar onSearch={handleSearch} />
        <DashboardFilterControls
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
        />
      </div>

      <TransactionList
        transactions={filteredTransactions}
        totalTransactions={transactions.length}
        onTransactionClick={handleTransactionClick}
      />

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};
