import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutPage } from "../../pages/About";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../components/content/ContentBlockGrid", () => ({
  ContentBlockGrid: () => (
    <div className="row">
      <div
        className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
        data-testid="who-is"
      >
        Who Is Weestoater
      </div>
      <div
        className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
        data-testid="what-is"
      >
        What Is Weestoater
      </div>
      <div
        className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
        data-testid="sad-message"
      >
        Sad Message
      </div>
      <div
        className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
        data-testid="extra-card"
      >
        Extra card
      </div>
    </div>
  ),
}));

describe("AboutPage", () => {
  it("renders the page with correct title and components", () => {
    render(<AboutPage />);

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByTestId("who-is")).toBeInTheDocument();
    expect(screen.getByTestId("what-is")).toBeInTheDocument();
    expect(screen.getByTestId("sad-message")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<AboutPage />);

    const columns = container.querySelectorAll(
      ".col-xxl-3.col-xl-4.col-lg-4.col-md-6.col-sm-6.col-xs-12.mb-4",
    );
    expect(columns.length).toBeGreaterThanOrEqual(4);
  });
});
