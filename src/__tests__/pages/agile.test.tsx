import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgilePage } from "../../pages/Agile";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../content/agile/agilepractices", () => ({
  AgilePracticesContent: () => (
    <div data-testid="agile-practices">Agile Practices</div>
  ),
}));

vi.mock("../../content/agile/mobrules", () => ({
  MobRulesContent: () => <div data-testid="mob-rules">Mob Rules</div>,
}));

vi.mock("../../content/agile/lessonslearned", () => ({
  LessonsLearnedContent: () => (
    <div data-testid="lessons-learned">Lessons Learned</div>
  ),
}));

describe("AgilePage", () => {
  it("renders the page with correct title", () => {
    render(<AgilePage />);
    expect(screen.getByText("Agile")).toBeInTheDocument();
  });

  it("renders all agile content components", () => {
    render(<AgilePage />);
    expect(screen.getByTestId("agile-practices")).toBeInTheDocument();
    expect(screen.getByTestId("mob-rules")).toBeInTheDocument();
    expect(screen.getByTestId("lessons-learned")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<AgilePage />);
    const columns = container.querySelectorAll(
      ".col-xxl-3.col-xl-3.col-lg-4.col-md-6.col-sm-6.col-xs-12.mb-4"
    );
    expect(columns).toHaveLength(3);
  });
});
