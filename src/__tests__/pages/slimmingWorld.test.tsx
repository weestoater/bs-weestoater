import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlimmingWorld } from "../../pages/SlimmingWorld";
import { SwDataTableProps, ChartOptions } from "../test-types";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../components/sw/swDataTable", () => ({
  SWDataTable: ({
    startDate,
    startWeight,
    targetWeight,
    data,
  }: SwDataTableProps) => (
    <div data-testid="sw-data-table">
      <span>Start Date: {startDate}</span>
      <span>Start Weight: {startWeight}</span>
      <span>Target Weight: {targetWeight}</span>
      <span>Has Data: {data ? "Yes" : "No"}</span>
    </div>
  ),
}));

vi.mock("ag-charts-react", () => ({
  AgCharts: ({ options }: { options: ChartOptions }) => (
    <div data-testid="ag-charts">
      <span>Chart Data: {options ? "Present" : "Not Present"}</span>
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
      data: [{ date: "2023-01-01", weight: 100, lost: 0, target: 80 }],
    },
  ],
}));

vi.mock("../../config/swChartConfig", () => ({
  createSwChartOptions: (data: SwDataTableProps["data"]) => ({
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
    const dataTable = screen.getByTestId("sw-data-table");
    expect(dataTable).toBeInTheDocument();
    expect(screen.getByText("Start Date: 2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("Start Weight: 100")).toBeInTheDocument();
    expect(screen.getByText("Target Weight: 80")).toBeInTheDocument();
    expect(screen.getByText("Has Data: Yes")).toBeInTheDocument();
  });

  it("renders chart component", () => {
    render(<SlimmingWorld />);
    const chart = screen.getByTestId("ag-charts");
    expect(chart).toBeInTheDocument();
    expect(screen.getByText("Chart Data: Present")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<SlimmingWorld />);
    const columns = container.querySelectorAll(".col-lg-4");
    expect(columns).toHaveLength(1);
    expect(container.querySelector(".sw-chart")).toBeInTheDocument();
  });
});
