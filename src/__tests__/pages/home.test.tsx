import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "../../pages/Home";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title, hidden }: { title: string; hidden?: boolean }) => (
    <h1 className={hidden ? "visually-hidden" : ""}>{title}</h1>
  ),
}));

vi.mock("../../content/home/SlimLineVersion", () => ({
  SlimLineVersionCard: () => (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-bicycle me-4"></i>Slim Line
        </h2>
      </div>
      <div className="card-body">Mock Slim Line Content</div>
    </div>
  ),
}));

vi.mock("../../content/home/EthosCard", () => ({
  EthosCard: () => <div data-testid="ethos-card">Ethos Card</div>,
}));

vi.mock("../../content/home/TrialnErrorCard", () => ({
  TrialnErrorCard: () => (
    <div data-testid="trial-error-card">Trial and Error Card</div>
  ),
}));

// Mock phosphor icons
vi.mock("@phosphor-icons/react", () => ({
  BowlFood: () => <div>Bowl Icon</div>,
  Barbell: () => <div>Barbell Icon</div>,
}));

describe("HomePage", () => {
  it("renders the page with correct title and components", () => {
    render(<HomePage />);

    // Check if title is present
    const title = screen.getByText("Welcome");
    expect(title).toBeInTheDocument();

    // Check if all cards are rendered
    expect(screen.getByText("Slim Line")).toBeInTheDocument();
    expect(screen.getByTestId("ethos-card")).toBeInTheDocument();
    expect(screen.getByTestId("trial-error-card")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<HomePage />);

    const columns = container.querySelectorAll(
      ".col-xxl-3.col-xl-4.col-lg-4.col-md-6.col-sm-6.col-xs-12.mb-4"
    );
    expect(columns).toHaveLength(3);
  });
});
