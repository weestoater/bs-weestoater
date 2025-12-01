import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutPage } from "../../pages/About";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../content/about/WhoIsWeestoater", () => ({
  WhoIsWeestoater: () => <div data-testid="who-is">Who Is Weestoater</div>,
}));

vi.mock("../../content/about/WhatIsWeestoater", () => ({
  WhatIsWeestoater: () => <div data-testid="what-is">What Is Weestoater</div>,
}));

vi.mock("../../content/about/SadMessage", () => ({
  SadMessage: () => <div data-testid="sad-message">Sad Message</div>,
}));

describe("AboutPage", () => {
  it("renders the page with correct title and components", () => {
    render(<AboutPage />);

    // Check if title is present
    expect(screen.getByText("About")).toBeInTheDocument();

    // Check if all components are rendered
    expect(screen.getByTestId("who-is")).toBeInTheDocument();
    expect(screen.getByTestId("what-is")).toBeInTheDocument();
    expect(screen.getByTestId("sad-message")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<AboutPage />);

    const columns = container.querySelectorAll(
      ".col-xxl-3.col-xl-3.col-lg-4.col-md-6.col-sm-6.col-xs-12.mb-4"
    );
    expect(columns).toHaveLength(3);
  });
});
