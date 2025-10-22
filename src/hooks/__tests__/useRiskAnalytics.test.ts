import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useRiskAnalytics } from "../useRiskAnalytics";

vi.mock("../useRiskAnalytics", () => ({
  useRiskAnalytics: vi.fn(() => ({ isAnalyzing: false, riskAnalytics: null })),
}));

describe("useRiskAnalytics", () => {
  it("should return the mocked value", () => {
    const { result } = renderHook(() => useRiskAnalytics([]));

    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.riskAnalytics).toBeNull();
    expect(useRiskAnalytics).toHaveBeenCalled();
  });
});
