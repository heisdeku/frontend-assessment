import { flexRender, Row } from "@tanstack/react-table";
import React from "react";
import { Transaction } from "../types/transaction";

// 1. Extend the props interface to include a 'ref'
interface TransactionListItemProps {
  index: number;
  row: Row<Transaction>;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const TransactionListItem = React.forwardRef<
  HTMLTableRowElement,
  TransactionListItemProps
>(({ index, row, onClick, style, className }, ref) => {
  return (
    <tr
      ref={ref}
      data-index={index}
      className={`transactions-row ${className ? className : ""}`}
      onClick={onClick}
      aria-rowindex={index + 1}
      tabIndex={0}
      style={style}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            style={{
              width: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
});

TransactionListItem.displayName = "TransactionListItem";
