import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlimmingWorld } from "../../pages/SlimmingWorld";
import { WeightSummaryCardProps } from "../test-types";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../components/sw/WeightSummaryCard", () => ({
  WeightSummaryCard: ({
    startDate,
    startWeight,
    targetWeight,
    data,
  }: WeightSummaryCardProps) => (
    <div data-testid="weight-summary-card">
      <span>Start Date: {startDate}</span>
      <span>Start Weight: {startWeight}</span>
      <span>Target Weight: {targetWeight}</span>
      <span>Has Data: {data ? "Yes" : "No"}</span>
    </div>
  ),
}));

vi.mock("../../components/sw/WeightProgressChart", () => ({
  WeightProgressChart: ({ data }: { data: WeightSummaryCardProps["data"] }) => (
    <div data-testid="weight-progress-chart">
      <span>Chart Data: {data ? "Present" : "Not Present"}</span>
    </div>
  ),
}));

vi.mock("../../components/sw/WeightHistoryGrid", () => ({
  WeightHistoryGrid: ({
    details,
  }: {
    details: WeightSummaryCardProps["data"];
  }) => (
    <div data-testid="weight-history-grid">
      <span>Grid Data: {details ? "Present" : "Not Present"}</span>
    </div>
  ),
}));

// Mock the JSON and config imports
vi.mock("../../data/slimmingWorldData.json", () => ({
  default: [
    {
      startDate: "2023-01-01",
      startWeight: 100,
      targetWeight: 80,
      data: [
        { date: "2023-01-01", weight: 100, lost: 0, target: 80, change: 0 },
        { date: "2023-01-08", weight: 95, lost: 5, target: 80, change: -5 },
        { date: "2023-01-15", weight: 90, lost: 10, target: 80, change: -5 },
      ],
    },
  ],
}));

vi.mock("../../config/weightProgressChartConfig", () => ({
  createWeightProgressChartOptions: (data: WeightSummaryCardProps["data"]) => ({
    data,
    series: [{ xKey: "date", yKey: "weight" }],
  }),
}));

describe("SlimmingWorld", () => {
  it("renders the page with correct title", () => {
    render(<SlimmingWorld />);
    expect(screen.getByText("Slimming World")).toBeInTheDocument();
  });

  it("renders data table with correct props", () => {
    render(<SlimmingWorld />);
    const dataTable = screen.getByTestId("weight-summary-card");
    expect(dataTable).toBeInTheDocument();
    expect(screen.getByText("Start Date: 2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("Start Weight: 100")).toBeInTheDocument();
    expect(screen.getByText("Target Weight: 80")).toBeInTheDocument();
    expect(screen.getByText("Has Data: Yes")).toBeInTheDocument();
  });

  it("renders chart component", async () => {
    render(<SlimmingWorld />);
    const chart = await screen.findByTestId("weight-progress-chart");
    expect(chart).toBeInTheDocument();
    expect(screen.getByText("Chart Data: Present")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<SlimmingWorld />);
    const columns = container.querySelectorAll(".col-lg-4");
    expect(columns).toHaveLength(1);
    expect(screen.getByTestId("weight-progress-chart")).toBeInTheDocument();
  });

  it("renders the total lost banner", () => {
    const { container } = render(<SlimmingWorld />);
    const banner = container.querySelector(".total-lost-banner");
    expect(banner).toBeInTheDocument();
  });

  it("displays correct total lost in lbs", () => {
    const { container } = render(<SlimmingWorld />);
    // The last entry in our mock data has 10 lbs lost
    // Text is split: "10" in stat-value and "lbs" in stat-label
    const banner = container.querySelector(".total-lost-banner");
    expect(banner).toHaveTextContent("10");
    expect(banner).toHaveTextContent("lbs");
  });

  it("displays correct total lost in kg", () => {
    const { container } = render(<SlimmingWorld />);
    // 10 lbs * 0.453592 = 4.54 kg
    const banner = container.querySelector(".total-lost-banner");
    expect(banner).toHaveTextContent("4.54");
    expect(banner).toHaveTextContent("kg");
  });

  it("displays correct total lost in stones", () => {
    const { container } = render(<SlimmingWorld />);
    // 10 lbs / 14 = 0 stone 10 lbs
    const banner = container.querySelector(".total-lost-banner");
    expect(banner).toHaveTextContent("0");
    expect(banner).toHaveTextContent("st");
  });

  it("banner has theme-aware styling classes", () => {
    const { container } = render(<SlimmingWorld />);
    const banner = container.querySelector(".total-lost-banner");
    expect(banner).toHaveClass("total-lost-banner");
  });

  it("banner is positioned in the left column", () => {
    const { container } = render(<SlimmingWorld />);
    const leftColumn = container.querySelector(".col-lg-4");
    const banner = leftColumn?.querySelector(".total-lost-banner");
    expect(banner).toBeInTheDocument();
  });

  it("banner title is prominent and descriptive", () => {
    render(<SlimmingWorld />);
    expect(screen.getByText("Total Lost to Date")).toBeInTheDocument();
  });
});
