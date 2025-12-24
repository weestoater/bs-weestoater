import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SWDataTable } from "../../../components/sw/swDataTable";

// Mock the WeightConverter component
vi.mock("../../../components/sw/WeightConverter", () => ({
  WeightConverter: ({ lbs }: { lbs: number }) => (
    <span data-testid="weight-converter">{lbs}</span>
  ),
}));

describe("SWDataTable", () => {
  const mockData = [
    { date: "01/10/2023", weight: 180, change: -2, lost: 10, target: 170 },
    { date: "08/10/2023", weight: 178, change: -2, lost: 12, target: 170 },
    { date: "15/10/2023", weight: 175, change: -3, lost: 15, target: 170 },
  ];

  const defaultProps = {
    data: mockData,
    startWeight: 190,
    startDate: "01/01/2023",
    targetWeight: 170,
  };

  it("renders no data message when data is empty", () => {
    render(<SWDataTable {...defaultProps} data={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders with correct card structure", () => {
    const { container } = render(<SWDataTable {...defaultProps} />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
    expect(screen.getByText("Slimming World details")).toBeInTheDocument();
  });

  it("displays join date", () => {
    const { container } = render(<SWDataTable {...defaultProps} />);
    const joinDateText = container.querySelector(".card-body p");
    expect(joinDateText).toBeInTheDocument();
    expect(joinDateText).toHaveTextContent("Joined:");
    expect(joinDateText).toHaveTextContent("01/01/2023");
  });

  it("shows start weight", () => {
    render(<SWDataTable {...defaultProps} />);
    const startWeightConverters = screen.getAllByTestId("weight-converter");
    expect(startWeightConverters[0].textContent).toBe("190");
  });

  it("shows target weight", () => {
    render(<SWDataTable {...defaultProps} />);
    const targetWeightConverters = screen.getAllByTestId("weight-converter");
    expect(targetWeightConverters[1].textContent).toBe("170");
  });

  it("shows most recent weight", () => {
    render(<SWDataTable {...defaultProps} />);
    const recentWeightConverters = screen.getAllByTestId("weight-converter");
    // Most recent weight is 175 from the mock data
    expect(recentWeightConverters[2].textContent).toBe("175");
  });

  it("handles undefined start date", () => {
    const { container } = render(
      <SWDataTable {...defaultProps} startDate={""} />
    );
    const joinDateText = container.querySelector(".card-body p");
    expect(joinDateText).toBeInTheDocument();
    expect(joinDateText).toHaveTextContent("Joined:");
  });

  it("sorts dates correctly to find most recent weight", () => {
    const unsortedData = [
      { date: "15/10/2023", weight: 175, change: -3, lost: 15, target: 170 },
      { date: "01/10/2023", weight: 180, change: -2, lost: 10, target: 170 },
      { date: "08/10/2023", weight: 178, change: -2, lost: 12, target: 170 },
    ];
    render(<SWDataTable {...defaultProps} data={unsortedData} />);
    const weightConverters = screen.getAllByTestId("weight-converter");
    // Most recent weight should still be 175
    expect(weightConverters[2].textContent).toBe("175");
  });
});
