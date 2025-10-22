import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useClickOutside } from "../useClickOutside";

describe("useClickOutside", () => {
  it("calls the callback when a click occurs outside the element", () => {
    const callback = vi.fn();

    const TestComponent = () => {
      const ref = useClickOutside<HTMLDivElement>(callback);
      return <div ref={ref} data-testid="inside" />;
    };

    render(
      <div>
        <TestComponent />
        <div data-testid="outside" />
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call the callback when a click occurs inside the element", () => {
    const callback = vi.fn();

    const TestComponent = () => {
      const ref = useClickOutside<HTMLDivElement>(callback);
      return <div ref={ref} data-testid="inside" />;
    };

    render(<TestComponent />);

    fireEvent.mouseDown(screen.getByTestId("inside"));
    expect(callback).not.toHaveBeenCalled();
  });

  it("removes the event listener on unmount", () => {
    const callback = vi.fn();
    const removeEventListener = vi.spyOn(document, "removeEventListener");

    const TestComponent = () => {
      const ref = useClickOutside<HTMLDivElement>(callback);
      return <div ref={ref} />;
    };

    const { unmount } = render(<TestComponent />);
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );

    removeEventListener.mockRestore();
  });
});
