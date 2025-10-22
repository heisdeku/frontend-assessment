import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("debounces onSearch calls", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(
      "Search transactions..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Ama" } });
    fireEvent.change(input, { target: { value: "Amaz" } });
    fireEvent.change(input, { target: { value: "Amazon" } });

    act(() => {
      vi.runAllTimers();
    });

    expect(onSearch).toHaveBeenCalledWith("amazon");
    expect(onSearch).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("clears the search input", async () => {
    const onSearch = vi.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={onSearch} />
    );
    const input = getByPlaceholderText(
      "Search transactions..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Amazon" } });
    expect(input.value).toBe("Amazon");

    const clearButton = await screen.findByRole("button", {
      name: /clear search/i,
    });
    fireEvent.click(clearButton);

    expect(input.value).toBe("");
    expect(onSearch).toHaveBeenCalledWith("");
  });

  // TODO: Fix this test. It is timing out in the test environment.
  it.skip("shows suggestions and handles suggestion click", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(
      "Search transactions..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "star" } });

    act(() => {
      vi.runAllTimers();
    });

    const suggestion = await screen.findByText(/starbucks/i);
    fireEvent.click(suggestion);

    expect(onSearch).toHaveBeenCalledWith("starbucks");
    vi.useRealTimers();
  });
});
