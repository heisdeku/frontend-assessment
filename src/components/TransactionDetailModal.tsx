import React, { useEffect, useRef } from "react";
import { Transaction } from "../types/transaction";
import { formatDate } from "../utils/helpers";

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-label={`Transaction details for ${transaction.id}`}
      className="transaction-detail-modal"
    >
      <div className="modal-content">
        <h3>Transaction Details</h3>
        <div className="transaction-details">
          <p>
            <strong>TXN ID:</strong> {transaction.id}
          </p>
          <p>
            <strong>Merchant Name:</strong> {transaction.merchantName}
          </p>
          <p>
            <strong>Amount:</strong> ${transaction.amount}
          </p>
          <p>
            <strong>Type:</strong> {transaction.category}
          </p>
          <p>
            <strong>Status:</strong> {transaction.status}
          </p>
          <p>
            <strong>Location:</strong> {transaction.location ?? "-"}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(transaction.timestamp)}
          </p>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
