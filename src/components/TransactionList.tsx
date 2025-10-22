import React, { Suspense } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Transaction } from "../types/transaction";
import Spinner from "./Spinner";

const DesktopTransactionListView = React.lazy(() =>
  import("./DesktopTransactionList").then((m) => ({
    default: m.DesktopTransactionListView,
  }))
);

const MobileTransactionList = React.lazy(() =>
  import("./MobileTransactionList").then((m) => ({
    default: m.MobileTransactionList,
  }))
);

interface TransactionListProps {
  transactions: Transaction[];
  totalTransactions?: number;
  onTransactionClick: (transaction: Transaction) => void;
  onLoadMore?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  totalTransactions,
  onTransactionClick,
}) => {
  const isMobile = useIsMobile();
  return (
    // <Suspense fallback={<Spinner size={24} />}>
    <>
      {isMobile ? (
        <MobileTransactionList
          transactions={transactions}
          totalTransactions={totalTransactions}
          onTransactionClick={onTransactionClick}
        />
      ) : (
        <DesktopTransactionListView
          transactions={transactions}
          totalTransactions={totalTransactions}
          onTransactionClick={onTransactionClick}
        />
      )}
      </>
    // </Suspense>
  );
};
