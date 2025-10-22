import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TransactionListItem } from "../TransactionListItem";
import { Row, Cell, CellContext } from "@tanstack/react-table";
import { Transaction } from "../../types/transaction";

// Mock data for a transaction
const mockTransaction: Transaction = {
  id: "1",
  amount: 100,
  currency: "USD",
  timestamp: new Date("2024-01-01T12:00:00Z"),
  type: "debit",
  category: "food",
  description: "Coffee",
  merchantName: "starbucks",
  status: "completed",
  userId: "user-1",
  accountId: "account-1",
  reference: "coffee",
};

// Mock for the row and cell from @tanstack/react-table
const mockCell = {
  id: "cell-1",
  column: {
    id: "column-1",
    getSize: () => 150,
    columnDef: {
      cell: (context: CellContext<Transaction, unknown>) => context.getValue(),
    },
  },
  getContext: () => ({
    getValue: () => "Cell Content",
  }),
} as unknown as Cell<Transaction, unknown>;

const mockRow = {
  id: "row-1",
  original: mockTransaction,
  index: 0,
  depth: 0,
  getVisibleCells: () => [mockCell],
  originalSubRows: [],
  subRows: [],
  getParentRow: () => undefined,
  getParentRows: () => [],
  getCanExpand: () => false,
  getIsExpanded: () => false,
  toggleExpanded: () => {},
  getToggleExpandedHandler: () => () => {},
  getIsSelected: () => false,
  getIsAllSubRowsSelected: () => false,
  toggleSelected: () => {},
  getToggleSelectedHandler: () => () => {},
} as unknown as Row<Transaction>;

describe("TransactionListItem", () => {
  it("renders the component with correct data and handles click", () => {
    const onClick = vi.fn();
    render(
      <table>
        <tbody>
          <TransactionListItem index={0} row={mockRow} onClick={onClick} />
        </tbody>
      </table>
    );

    // Check if the cell content is rendered
    expect(screen.getByText("Cell Content")).toBeInTheDocument();

    // Check if the row has the correct aria-rowindex
    const rowElement = screen.getByRole("row");
    expect(rowElement).toHaveAttribute("aria-rowindex", "1");

    // Simulate a click and check if the handler is called
    fireEvent.click(rowElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies className and style props", () => {
    const onClick = vi.fn();
    const style = { backgroundColor: "red" };
    render(
      <table>
        <tbody>
          <TransactionListItem
            index={0}
            row={mockRow}
            onClick={onClick}
            className="custom-class"
            style={style}
          />
        </tbody>
      </table>
    );

    const rowElement = screen.getByRole("row");
    expect(rowElement).toHaveClass("custom-class");
    expect(rowElement).toHaveStyle("background-color: rgb(255, 0, 0)");
  });
});