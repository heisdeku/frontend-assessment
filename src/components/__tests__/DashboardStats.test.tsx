import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionSummary } from "../../types/transaction";
import { DashboardStats } from "../DashboardStats";

const mockSummary: TransactionSummary = {
  totalAmount: 10000,
  totalCredits: 7000,
  totalDebits: 3000,
  totalTransactions: 100,
  avgTransactionAmount: 100,
  categoryCounts: { food: 50, travel: 50 },
};

describe("DashboardStats", () => {
  it("renders correctly with summary data", () => {
    render(
      <DashboardStats
        summary={mockSummary}
        filteredCount={50}
        totalCount={100}
        isAnalyzing={false}
      />
    );

    expect(screen.getByText("$10,000")).toBeInTheDocument();
    expect(screen.getByText("$7,000")).toBeInTheDocument();
    expect(screen.getByText("$3,000")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText(/of 100/)).toBeInTheDocument();
  });

  it('displays "0" when summary is null', () => {
    render(
      <DashboardStats
        summary={null}
        filteredCount={0}
        totalCount={0}
        isAnalyzing={false}
      />
    );

    expect(screen.getAllByText("$0").length).toBe(3);
  });

  it('shows "Analyzing" spinner when isAnalyzing is true', () => {
    render(
      <DashboardStats
        summary={mockSummary}
        filteredCount={100}
        totalCount={100}
        isAnalyzing={true}
      />
    );

    expect(screen.getByText("Analyzing")).toBeInTheDocument();
  });

  it("displays filtered and total counts correctly", () => {
    render(
      <DashboardStats
        summary={mockSummary}
        filteredCount={25}
        totalCount={100}
        isAnalyzing={false}
      />
    );

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText(/of 100/)).toBeInTheDocument();
  });

  it("shows high-risk count when provided", () => {
    render(
      <DashboardStats
        summary={mockSummary}
        filteredCount={100}
        totalCount={100}
        isAnalyzing={false}
        highRiskCount={5}
      />
    );

    expect(screen.getByText(/- Risk: 5/)).toBeInTheDocument();
  });
});
