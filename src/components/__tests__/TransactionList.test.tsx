import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Transaction } from "../../types/transaction";
import { TransactionList } from "../TransactionList";

vi.mock("../../hooks/useIsMobile");
vi.mock("../DesktopTransactionList", () => ({
  DesktopTransactionListView: ({
    transactions,
    onTransactionClick,
  }: {
    transactions: Transaction[];
    onTransactionClick: (transaction: Transaction) => void;
  }) => (
    <div data-testid="desktop-list">
      {transactions.length === 0 && <div>No transactions found</div>}
      {transactions.map((t) => (
        <div key={t.id} onClick={() => onTransactionClick(t)}>
          {t.merchantName}
        </div>
      ))}
    </div>
  ),
}));
vi.mock("../MobileTransactionList", () => ({
  MobileTransactionList: ({
    transactions,
    onTransactionClick,
  }: {
    transactions: Transaction[];
    onTransactionClick: (transaction: Transaction) => void;
  }) => (
    <div data-testid="mobile-list">
      {transactions.length === 0 && <div>No transactions found</div>}
      {transactions.map((t) => (
        <div key={t.id} onClick={() => onTransactionClick(t)}>
          {t.merchantName}
        </div>
      ))}
    </div>
  ),
}));

const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 100,
    type: "debit",
    currency: "USD",
    merchantName: "Test Merchant 1",
    description: "Test Description 1",
    timestamp: new Date(),
    status: "completed",
    category: "Shopping",
    userId: "user-1",
    accountId: "account-1",
  },
  {
    id: "2",
    amount: 200,
    type: "credit",
    currency: "USD",
    merchantName: "Test Merchant 2",
    description: "Test Description 2",
    timestamp: new Date(),
    status: "pending",
    category: "Groceries",
    userId: "user-2",
    accountId: "account-2",
  },
];

describe("TransactionList", () => {
  it("renders mobile view when isMobile is true", async () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <TransactionList
          transactions={mockTransactions}
          onTransactionClick={() => {}}
        />
      </React.Suspense>
    );
    expect(await screen.findByTestId("mobile-list")).toBeInTheDocument();
  });

  it("renders desktop view when isMobile is false", async () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <TransactionList
          transactions={mockTransactions}
          onTransactionClick={() => {}}
        />
      </React.Suspense>
    );
    expect(await screen.findByTestId("desktop-list")).toBeInTheDocument();
  });

  it("calls onTransactionClick when a transaction is clicked", async () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
    const onTransactionClick = vi.fn();
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <TransactionList
          transactions={mockTransactions}
          onTransactionClick={onTransactionClick}
        />
      </React.Suspense>
    );

    const transactionRow = await screen.findByText("Test Merchant 1");
    fireEvent.click(transactionRow);

    expect(onTransactionClick).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it("displays a message when there are no transactions", async () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <TransactionList transactions={[]} onTransactionClick={() => {}} />
      </React.Suspense>
    );
    expect(
      await screen.findByText(/no transactions found/i)
    ).toBeInTheDocument();
  });
});
