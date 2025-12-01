import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MobRulesContent } from "../../../content/agile/mobrules";

describe("MobRulesContent", () => {
  it("renders the card with correct title", () => {
    render(<MobRulesContent />);
    expect(screen.getByText("Mob Rules")).toBeInTheDocument();
  });

  it("displays mob programming image", () => {
    const { container } = render(<MobRulesContent />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
  });

  it("has correct card structure", () => {
    const { container } = render(<MobRulesContent />);
    const card = container.querySelector(".card");
    expect(card).toBeInTheDocument();
    expect(card?.querySelector(".card-header")).toBeInTheDocument();
    expect(card?.querySelector(".card-body")).toBeInTheDocument();
  });

  it("includes mob programming content", () => {
    render(<MobRulesContent />);
    expect(screen.getByText(/Try it, love it, code it/i)).toBeInTheDocument();
  });

  it("renders image with correct classes", () => {
    const { container } = render(<MobRulesContent />);
    const image = container.querySelector("img");
    expect(image).toHaveClass("fluid");
  });
});
