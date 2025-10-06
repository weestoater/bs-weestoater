import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { A11yPage } from "../../pages/A11y";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../content/a11y/screenreaders", () => ({
  ScreenReaders: () => <div data-testid="screen-readers">Screen Readers</div>,
}));

vi.mock("../../content/a11y/a11itech", () => ({
  A11yTech: () => <div data-testid="a11y-tech">A11y Tech</div>,
}));

vi.mock("../../content/a11y/a11yme", () => ({
  A11yMe: () => <div data-testid="a11y-me">A11y Me</div>,
}));

vi.mock("../../content/a11y/a11ypromotion", () => ({
  A11yPromotion: () => <div data-testid="a11y-promotion">A11y Promotion</div>,
}));

vi.mock("../../content/a11y/axeplugin", () => ({
  AxePlugin: () => <div data-testid="axe-plugin">Axe Plugin</div>,
}));

describe("A11yPage", () => {
  it("renders the page with correct title", () => {
    render(<A11yPage />);
    expect(screen.getByText("Accessibility (a11y)")).toBeInTheDocument();
  });

  it("renders all accessibility content components", () => {
    render(<A11yPage />);

    expect(screen.getByTestId("screen-readers")).toBeInTheDocument();
    expect(screen.getByTestId("a11y-tech")).toBeInTheDocument();
    expect(screen.getByTestId("a11y-me")).toBeInTheDocument();
    expect(screen.getByTestId("a11y-promotion")).toBeInTheDocument();
    expect(screen.getByTestId("axe-plugin")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<A11yPage />);

    const columns = container.querySelectorAll(".col-lg-3.col-sm-12.mb-4");
    expect(columns).toHaveLength(5);
  });
});
