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
import React, { useRef, useState } from "react";
import { Transaction } from "../types/transaction";
import { formatCurrencyByCode } from "../utils/helpers";

interface MobileTransactionListProps {
  transactions: Transaction[];
  totalTransactions?: number;
  onTransactionClick: (transaction: Transaction) => void;
}

const columnHelper = createColumnHelper<Transaction>();

const mobileColumns = [
  columnHelper.display({
    id: "meta",
    header: () => "",
    cell: (info) => {
      const t = info.row.original;
      const title = t.description || t.merchantName || "";
      return (
        <div className="mobile-meta" aria-label={title}>
          <div className="mobile-text" title={title}>
            <div className="mobile-title">{title}</div>
            <div className="mobile-id col-id">{t.id}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "amountDate",
    header: () => "",
    cell: (info) => {
      const t = info.row.original;
      const prefix = t.type === "debit" ? "- " : "+ ";
      const amountLabel = `${prefix}${formatCurrencyByCode(
        Math.abs(t.amount),
        t.currency
      )}`;
      const dateLabel = formatDateFn(t.timestamp, "dd MMM, yyyy");
      return (
        <div
          className="mobile-amount-date"
          aria-label={`Amount ${amountLabel} on ${dateLabel}`}
        >
          <div className={`mobile-amount ${t.type}`}>{amountLabel}</div>
          <div className="mobile-date">{dateLabel}</div>
        </div>
      );
    },
    size: 160,
  }),
];

export const MobileTransactionList: React.FC<MobileTransactionListProps> = ({
  transactions,
  totalTransactions,
  onTransactionClick,
}) => {
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);

  const table = useReactTable({
    data: transactions,
    columns: mobileColumns,
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
    estimateSize: () => 76,
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
          )}{" "}
          )
        </h2>
      </div>

      <div
        ref={parentRef}
        className="virtual-table-body"
        aria-label="Transactions list body"
        tabIndex={0}
      >
        <table
          className="mobile-transactions-table"
          role="table"
          aria-labelledby="transaction-list-title"
        >
          <thead style={{ display: "none" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ display: "flex", width: header.getSize() }}
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
          <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Transaction>;
              const t = row.original;
              return (
                <tr
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  data-index={virtualRow.index}
                  className={`transactions-row mobile-row ${
                    virtualRow.index % 2 ? "row-even" : "row-odd"
                  }`}
                  onClick={() => onTransactionClick(t)}
                  aria-rowindex={virtualRow.index + 1}
                  tabIndex={0}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
