import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, Mock } from "vitest";
import { useTransactions } from "../useTransactions";
import * as generators from "../../utils/generators";
import { Transaction } from "../../types/transaction";

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
    amount: 50,
    currency: "USD",
    type: "credit",
    category: "Salary",
    merchantName: "Employer",
    status: "completed",
    description: "Monthly salary",
    userId: "user1",
    accountId: "account1",
  },
];

vi.mock("../../utils/generators", async () => {
  const actual = await vi.importActual<typeof generators>(
    "../../utils/generators"
  );
  return {
    ...actual,
    generateTransactionData: vi.fn(() => mockTransactions),
    startDataRefresh: vi.fn(),
    stopDataRefresh: vi.fn(),
  };
});

describe("useTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (generators.generateTransactionData as Mock).mockReturnValue([
      ...mockTransactions,
    ]);
  });

  it("should initialize and load transactions", async () => {
    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.transactions.length).toBe(2);
    });
  });

  it("should filter transactions by search term", async () => {
    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.transactions.length).toBe(2);
    });

    act(() => {
      result.current.setSearchTerm("Supermarket");
    });

    expect(result.current.filteredTransactions.length).toBe(1);
    expect(result.current.filteredTransactions[0].merchantName).toBe(
      "Supermarket"
    );
  });

  it("should filter transactions by type", async () => {
    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.transactions.length).toBe(2);
    });

    act(() => {
      result.current.setFilters({ type: "debit" });
    });

    expect(result.current.filteredTransactions.length).toBe(1);
    expect(result.current.filteredTransactions[0].type).toBe("debit");
  });

  it("should calculate summary correctly", async () => {
    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.summary).not.toBeNull();
      expect(result.current.summary?.totalTransactions).toBe(2);
      expect(result.current.summary?.totalAmount).toBe(150);
    });
  });

  it("should handle transaction click correctly", () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.handleTransactionClick(mockTransactions[0]);
    });

    expect(result.current.selectedTransaction).toEqual(mockTransactions[0]);

    act(() => {
      result.current.handleTransactionClick(mockTransactions[0]);
    });
  });

  it("should start and stop data refresh on mount and unmount", () => {
    const { unmount } = renderHook(() => useTransactions());

    expect(generators.startDataRefresh).toHaveBeenCalled();

    unmount();

    expect(generators.stopDataRefresh).toHaveBeenCalled();
  });
});