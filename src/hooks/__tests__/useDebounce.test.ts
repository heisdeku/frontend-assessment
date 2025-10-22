import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useDebounce } from "../useDebounce";

vi.useFakeTimers();

describe("useDebouncer", () => {
  it("should debounce the function call", () => {
    const mockEffect = vi.fn();
    const { result } = renderHook(() => useDebounce(mockEffect, 500));

    act(() => {
      result.current("test");
      result.current("test");
      result.current("test");
    });

    expect(mockEffect).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockEffect).toHaveBeenCalledWith("test");
  });
});
