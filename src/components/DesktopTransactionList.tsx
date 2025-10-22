import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format as formatDateFn } from "date-fns";
import React, { useMemo, useRef, useState } from "react";
import { Transaction } from "../types/transaction";
import { formatCurrencyByCode } from "../utils/helpers";
import { TransactionListItem } from "./TransactionListItem";

interface TransactionListProps {
  transactions: Transaction[];
  totalTransactions?: number;
  onTransactionClick: (transaction: Transaction) => void;
  onLoadMore?: () => void;
}

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("id", {
    id: "id",
    header: () => "Transaction ID",
    cell: (info) => {
      return (
        <span className="col-id" title={info.getValue()}>
          {info.getValue()}
        </span>
      );
    },
    size: 200,
  }),
  columnHelper.accessor("merchantName", {
    id: "merchantName",
    header: () => "Merchant Name",
    cell: (info) => {
      return info.getValue();
    },
    minSize: 210,
  }),
  columnHelper.accessor("category", {
    id: "category",
    header: () => "Type",
    cell: (info) => {
      const categoryLabel = info.getValue();
      return (
        <span className="col-type" aria-label={`Type ${categoryLabel}`}>
          {categoryLabel}
        </span>
      );
    },
  }),
  columnHelper.accessor("timestamp", {
    id: "date",
    header: () => "Date",
    cell: (info) => {
      const dateLabel = formatDateFn(info.getValue(), "dd MMMM yyyy, HH:mm:ss");
      return (
        <span className="col-date" aria-label={`Date ${dateLabel}`}>
          {dateLabel}
        </span>
      );
    },
  }),
  columnHelper.accessor("amount", {
    id: "amount",
    header: () => "Amount",
    cell: (info) => {
      const row = info.row.original;
      const prefix = row.type === "debit" ? "- " : "+ ";
      return `${prefix}${formatCurrencyByCode(
        Math.abs(info.getValue()),
        row.currency
      )}`;
    },
  }),

  columnHelper.accessor((row) => row.description, {
    id: "description",
    header: () => "Description",
    cell: (info) => {
      const row = info.row.original;
      const value = row.description && row.description.trim();
      const descriptionValue = (value && value.trim()) || "";
      const descriptionClass = value
        ? "merchant-name-normal"
        : "merchant-name-upper";
      return (
        <span className={`col-description ${descriptionClass}`} title={value}>
          {descriptionValue}
        </span>
      );
    },
    // minSize: 300,
  }),
  columnHelper.accessor("location", {
    id: "location",
    header: () => "Location",
    cell: (info) => {
      return <span>{info.getValue() || "-"}</span>;
    },
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: () => "Status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <span
          aria-label={`Status ${status}`}
          className={`col-status status-pill status-${status}`}
        >
          <span className="status-dot" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  }),
];

export const DesktopTransactionListView: React.FC<TransactionListProps> = ({
  transactions,
  totalTransactions,
  onTransactionClick,
}) => {
  const totalAmountLabel = useMemo(() => {
    const currency = transactions[0]?.currency ?? "USD";
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return formatCurrencyByCode(total, currency);
  }, [transactions]);

  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  const parentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  if (transactions.length === 0) {
    return (
      <div className="no-transactions-found">
        <h2>No transactions found</h2>
      </div>
    );
  }

  return (
    <div
      className="transactions-table-wrapper"
      role="region"
      aria-label="Transaction list"
    >
      <div className="transaction-list-header">
        <h2 id="transaction-list-title">
          Transactions ({transactions.length}
          {totalTransactions && totalTransactions !== transactions.length && (
            <span> of {totalTransactions}</span>
          )}
          )
        </h2>
        <span className="total-amount" aria-live="polite">
          Total: {totalAmountLabel}
        </span>
      </div>

      <div
        ref={parentRef}
        className="virtual-table-body"
        aria-label="Transactions list table"
        tabIndex={0}
      >
        <table
          className="transactions-table"
          role="table"
          aria-labelledby="transaction-list-title"
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      minWidth: header.getSize(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            aria-label="Transactions list table body"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Transaction>;

              return (
                <TransactionListItem
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  index={virtualRow.index}
                  key={row.id}
                  row={row}
                  onClick={() => onTransactionClick(row.original)}
                  className={virtualRow.index % 2 ? "row-even" : "row-odd"}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
