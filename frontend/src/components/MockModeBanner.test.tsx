import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MockModeBanner from "./MockModeBanner";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("MockModeBanner", () => {
  it("shows a demo notice when mock mode is enabled", () => {
    vi.stubEnv("VITE_USE_MOCK", "true");

    render(<MockModeBanner />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Demoläge aktivt",
    );
  });

  it("hides the demo notice when backend mode is enabled", () => {
    vi.stubEnv("VITE_USE_MOCK", "false");

    render(<MockModeBanner />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});