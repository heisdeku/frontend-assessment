import React from "react";
import { FilterOptions } from "../types/transaction";

interface DashboardFilterControlsProps {
  filters: FilterOptions;
  categories: string[];
  onChange: (newFilters: FilterOptions) => void;
}

export const DashboardFilterControls: React.FC<
  DashboardFilterControlsProps
> = ({ filters, categories, onChange }) => {
  return (
    <div className="filter-controls">
      <select
        name="type"
        value={filters.type || "all"}
        onChange={(e) =>
          onChange({
            ...filters,
            type: e.target.value as "debit" | "credit" | "all",
          })
        }
      >
        <option value="all">All Types</option>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>

      <select
        name="status"
        value={filters.status || "all"}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value as
              | "pending"
              | "completed"
              | "failed"
              | "all",
          })
        }
      >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      <select
        name="category"
        value={filters.category || ""}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};
