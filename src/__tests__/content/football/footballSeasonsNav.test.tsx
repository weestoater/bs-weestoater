import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FootballSeasonsNav } from "../../../content/football/footballSeasonsNav";
import { TestWrapper } from "../../testUtils";

const mockGetFootballSeasons = vi.fn().mockResolvedValue([
  { season_id: "2026-27", display_name: "2026-27", is_active: true },
  { season_id: "2025-26", display_name: "2025-26", is_active: false },
  { season_id: "2024-25", display_name: "2024-25", is_active: false },
  { season_id: "2023-24", display_name: "2023-24", is_active: false },
  { season_id: "2022-23", display_name: "2022-23", is_active: false },
  { season_id: "2021-22", display_name: "2021-22", is_active: false },
  { season_id: "2020-21", display_name: "2020-21", is_active: false },
]);

vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getFootballSeasons: mockGetFootballSeasons,
  })),
}));

describe("FootballSeasonsNav", () => {
  it("renders navigation links for all seasons", async () => {
    render(
      <TestWrapper>
        <FootballSeasonsNav />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("2026-27")).toHaveAttribute("href", "/football");
    });

    expect(screen.getByText("2025-26")).toHaveAttribute(
      "href",
      "/season/2025-26",
    );
    expect(screen.getByText("2024-25")).toHaveAttribute(
      "href",
      "/season/2024-25",
    );
    expect(screen.getByText("2023-24")).toHaveAttribute(
      "href",
      "/season/2023-24",
    );
    expect(screen.getByText("2022-23")).toHaveAttribute(
      "href",
      "/season/2022-23",
    );
    expect(screen.getByText("2021-22")).toHaveAttribute(
      "href",
      "/season/2021-22",
    );
    expect(screen.getByText("2020-21")).toHaveAttribute(
      "href",
      "/season/2020-21",
    );
  });

  it("renders with correct class for navigation list", async () => {
    const { container } = render(
      <TestWrapper>
        <FootballSeasonsNav />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(container.querySelector(".seasons-nav")).toBeInTheDocument();
    });
  });

  it("renders correct number of navigation items", async () => {
    render(
      <TestWrapper>
        <FootballSeasonsNav />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(7);
    });
  });
});
