import { useEffect, useMemo, useState } from "react";
import {
  FilterOptions,
  Transaction,
  TransactionSummary,
} from "../types/transaction";
import {
  calculateSummary,
  filterTransactions,
  generateTransactionData,
  searchTransactions,
  startDataRefresh,
  stopDataRefresh,
} from "../utils/generators";

export const useTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    status: "all",
    category: "",
    searchTerm: "",
  });

  const filteredTransactions: Transaction[] = useMemo(() => {
    let data = transactions;
    if (searchTerm && searchTerm.length > 0) {
      data = searchTransactions(data, searchTerm);
    }
    data = filterTransactions(data, filters);
    return data;
  }, [transactions, searchTerm, filters]);

  const summary: TransactionSummary | null = useMemo(() => {
    return filteredTransactions.length > 0
      ? calculateSummary(filteredTransactions)
      : null;
  }, [filteredTransactions]);

  const categories: string[] = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const handleTransactionClick = (transaction: Transaction) => {
    const updatedSelected = new Set(selectedTransactions);
    if (updatedSelected.has(transaction.id)) {
      updatedSelected.delete(transaction.id);
    } else {
      updatedSelected.add(transaction.id);
    }
    setSelectedTransactions(updatedSelected);
    setSelectedTransaction(transaction);
    
  };

  useEffect(() => {
    setSelectedTransactions(new Set());
    if (transactions.length > 0) {
      localStorage.setItem(
        "lastTransactionCount",
        transactions.length.toString()
      );
    }
  }, [transactions.length]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const initialData = generateTransactionData(10000);
      setTransactions(initialData);
      setLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    startDataRefresh(() => {
      const newData = generateTransactionData(200);
      setTransactions((currentTransactions) => {
        return currentTransactions.concat(newData);
      });
    });

    return () => stopDataRefresh();
  }, []);

  return {
    loading,
    transactions,
    filteredTransactions,
    summary,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    categories,
    selectedTransaction,
    setSelectedTransaction,
    handleTransactionClick,
  };
};
