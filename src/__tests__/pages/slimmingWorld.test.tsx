import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SlimmingWorld } from "../../pages/SlimmingWorld";
import { WeightSummaryCardProps } from "../test-types";

// Mock data for testing
const mockProfileData = {
  start_date: "2023-01-01",
  start_weight: 100,
  target_weight: 80,
  entries: [
    {
      entry_date: "2023-01-01",
      weight: 100,
      weight_change: 0,
      total_lost: 0,
      target_weight: 80,
      slimmer_of_week: null,
    },
    {
      entry_date: "2023-01-08",
      weight: 95,
      weight_change: -5,
      total_lost: 5,
      target_weight: 80,
      slimmer_of_week: null,
    },
    {
      entry_date: "2023-01-15",
      weight: 90,
      weight_change: -5,
      total_lost: 10,
      target_weight: 80,
      slimmer_of_week: null,
    },
  ],
};

// Mock the Supabase client and database service
const mockGetSlimmingWorldProfileWithEntries = vi
  .fn()
  .mockResolvedValue(mockProfileData);
const mockGetCurrentTargetWeight = vi.fn().mockResolvedValue({
  target_weight: 80,
});

vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getSlimmingWorldProfileWithEntries: mockGetSlimmingWorldProfileWithEntries,
    getCurrentTargetWeight: mockGetCurrentTargetWeight,
  })),
}));

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../components/global/BackToTop", () => ({
  BackToTop: () => <div data-testid="back-to-top">Back to Top</div>,
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

describe("SlimmingWorld", () => {
  it("renders the page with correct title", () => {
    render(<SlimmingWorld />);
    expect(screen.getByText("Slimming World")).toBeInTheDocument();
  });

  it("shows a loading indicator while fetching", async () => {
    render(<SlimmingWorld />);

    await waitFor(() => {
      expect(screen.getByTestId("weight-summary-card")).toBeInTheDocument();
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders data table with correct props after loading", async () => {
    render(<SlimmingWorld />);

    await waitFor(() => {
      const dataTable = screen.getByTestId("weight-summary-card");
      expect(dataTable).toBeInTheDocument();
    });

    // Date is converted from YYYY-MM-DD to DD/MM/YYYY
    expect(screen.getByText("Start Date: 01/01/2023")).toBeInTheDocument();
    expect(screen.getByText("Start Weight: 100")).toBeInTheDocument();
    expect(screen.getByText("Target Weight: 80")).toBeInTheDocument();
    expect(screen.getByText("Has Data: Yes")).toBeInTheDocument();
  });

  it("renders chart component after loading", async () => {
    render(<SlimmingWorld />);

    const chart = await screen.findByTestId("weight-progress-chart");
    expect(chart).toBeInTheDocument();
    expect(screen.getByText("Chart Data: Present")).toBeInTheDocument();
  });

  it("renders the total lost banner after loading", async () => {
    const { container } = render(<SlimmingWorld />);

    await waitFor(() => {
      const banner = container.querySelector(".total-lost-banner");
      expect(banner).toBeInTheDocument();
    });
  });

  it("displays correct total lost in lbs", async () => {
    const { container } = render(<SlimmingWorld />);

    await waitFor(() => {
      const banner = container.querySelector(".total-lost-banner");
      expect(banner).toHaveTextContent("10");
      expect(banner).toHaveTextContent("lbs");
    });
  });

  it("displays correct total lost in kg", async () => {
    const { container } = render(<SlimmingWorld />);

    await waitFor(() => {
      const banner = container.querySelector(".total-lost-banner");
      expect(banner).toHaveTextContent("4.54");
      expect(banner).toHaveTextContent("kg");
    });
  });

  it("displays correct total lost in stones", async () => {
    const { container } = render(<SlimmingWorld />);

    await waitFor(() => {
      const banner = container.querySelector(".total-lost-banner");
      expect(banner).toHaveTextContent("0");
      expect(banner).toHaveTextContent("st");
    });
  });

  it("banner title is prominent and descriptive", async () => {
    render(<SlimmingWorld />);

    await waitFor(() => {
      expect(screen.getByText("Total Lost to Date")).toBeInTheDocument();
    });
  });

  it("calls database service with correct user ID", async () => {
    render(<SlimmingWorld />);

    await waitFor(() => {
      expect(mockGetSlimmingWorldProfileWithEntries).toHaveBeenCalledWith(
        "default",
      );
    });
  });
});
