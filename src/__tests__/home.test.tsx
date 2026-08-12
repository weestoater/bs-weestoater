import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { HomePage } from "../pages/Home";

vi.mock("../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => (
    <h1 data-testid="page-title">{title}</h1>
  ),
}));

vi.mock("../components/global/BackToTop", () => ({
  BackToTop: () => <div>Back to Top</div>,
}));

vi.mock("../components/content/ContentBlockGrid", () => ({
  ContentBlockGrid: () => (
    <div>
      <div>Ethos</div>
      <div>Trial &amp; Error</div>
    </div>
  ),
}));

describe("Home page", () => {
  test("renders h1 correctly ", () => {
    render(<HomePage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
  });

  test("has a card titled Ethos", () => {
    render(<HomePage />);
    const heading = screen.getByText(/ethos/i);
    expect(heading).toBeInTheDocument();
  });

  test("has a card titled trial and error", () => {
    render(<HomePage />);
    const heading = screen.getByText(/trial & error/i);
    expect(heading).toBeInTheDocument();
  });
});
