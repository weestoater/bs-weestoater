import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandiePage } from "../../pages/Landie";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../content/landie/earlyage", () => ({
  EarlyAge: () => <div data-testid="early-age">Early Age</div>,
}));

vi.mock("../../content/landie/birthdaytreat", () => ({
  BirthdayTreat: () => <div data-testid="birthday-treat">Birthday Treat</div>,
}));

describe("LandiePage", () => {
  it("renders the page with correct title", () => {
    render(<LandiePage />);
    expect(screen.getByText("Land Rovers")).toBeInTheDocument();
  });

  it("renders all landie content components", () => {
    render(<LandiePage />);
    expect(screen.getByTestId("early-age")).toBeInTheDocument();
    expect(screen.getByTestId("birthday-treat")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<LandiePage />);
    const columns = container.querySelectorAll(".col-lg-3.col-sm-12.mb-4");
    expect(columns).toHaveLength(2);
  });
});
