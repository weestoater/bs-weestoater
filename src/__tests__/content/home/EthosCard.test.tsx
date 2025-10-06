import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EthosCard } from "../../../content/home/EthosCard";

// Mock the PhosphorIcons component
vi.mock("@phosphor-icons/react", () => ({
  Brain: ({ size }: { size: number }) => (
    <svg data-testid="brain-icon" width={size} height={size}></svg>
  ),
}));

describe("EthosCard", () => {
  it("renders the card with correct header", () => {
    render(<EthosCard />);
    expect(screen.getByText("Ethos")).toBeInTheDocument();
  });

  it("renders with Brain icon", () => {
    render(<EthosCard />);
    expect(screen.getByTestId("brain-icon")).toBeInTheDocument();
    expect(screen.getByTestId("brain-icon")).toHaveAttribute("width", "64");
    expect(screen.getByTestId("brain-icon")).toHaveAttribute("height", "64");
  });

  it("renders all paragraphs of content", () => {
    render(<EthosCard />);
    expect(screen.getByText(/I started this space/)).toBeInTheDocument();
    expect(screen.getByText(/There wasn't any roadmap/)).toBeInTheDocument();
    expect(
      screen.getByText(/That worked for a few seasons/)
    ).toBeInTheDocument();
  });

  it("renders the list of JSON files", () => {
    render(<EthosCard />);
    expect(screen.getByText("mfc-goals")).toBeInTheDocument();
    expect(screen.getByText("mfc-matches")).toBeInTheDocument();
  });

  it("renders with correct card structure", () => {
    const { container } = render(<EthosCard />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
  });
});
