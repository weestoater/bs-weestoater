import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MobRules from "../../content/agile/mobrules";

describe("MobRules", () => {
  it("renders main heading", () => {
    render(<MobRules />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("renders some expected content", () => {
    render(<MobRules />);
    expect(screen.getByText(/mob/i)).toBeInTheDocument();
  });
});
