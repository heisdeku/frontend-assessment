import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterOptions } from "../../types/transaction";
import { DashboardFilterControls } from "../DashboardFilterControls";

const mockFilters: FilterOptions = {
  type: "all",
  status: "all",
  category: "",
};

const mockCategories = ["food", "travel", "shopping"];

describe("DashboardFilterControls", () => {
  it("renders with initial filter values", () => {
    render(
      <DashboardFilterControls
        filters={mockFilters}
        categories={mockCategories}
        onChange={() => {}}
      />
    );

    expect(screen.getByDisplayValue("All Types")).toBeInTheDocument();
    expect(screen.getByDisplayValue("All Status")).toBeInTheDocument();
    expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument();
  });

  it('calls onChange with the correct new filter value when "type" is changed', () => {
    const onChange = vi.fn();
    render(
      <DashboardFilterControls
        filters={mockFilters}
        categories={mockCategories}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByDisplayValue("All Types"), {
      target: { value: "debit" },
    });

    expect(onChange).toHaveBeenCalledWith({ ...mockFilters, type: "debit" });
  });

  it('calls onChange with the correct new filter value when "status" is changed', () => {
    const onChange = vi.fn();
    render(
      <DashboardFilterControls
        filters={mockFilters}
        categories={mockCategories}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByDisplayValue("All Status"), {
      target: { value: "completed" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...mockFilters,
      status: "completed",
    });
  });

  it('calls onChange with the correct new filter value when "category" is changed', () => {
    const onChange = vi.fn();
    render(
      <DashboardFilterControls
        filters={mockFilters}
        categories={mockCategories}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByDisplayValue("All Categories"), {
      target: { value: "food" },
    });

    expect(onChange).toHaveBeenCalledWith({ ...mockFilters, category: "food" });
  });

  it("correctly renders the list of categories", () => {
    render(
      <DashboardFilterControls
        filters={mockFilters}
        categories={mockCategories}
        onChange={() => {}}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
});
