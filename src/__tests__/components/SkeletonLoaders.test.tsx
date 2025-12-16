import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  SkeletonCard,
  SkeletonGrid,
  SkeletonChart,
} from "../../components/global/SkeletonLoaders";

describe("SkeletonLoaders", () => {
  describe("SkeletonCard", () => {
    it("renders skeleton card with loading state", () => {
      const { container } = render(<SkeletonCard />);

      const skeleton = container.querySelector('[aria-busy="true"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("aria-live", "polite");
    });

    it("has correct CSS classes", () => {
      const { container } = render(<SkeletonCard />);

      expect(container.querySelector(".skeleton-card")).toBeInTheDocument();
      expect(container.querySelector(".skeleton-title")).toBeInTheDocument();
      expect(container.querySelectorAll(".skeleton-text")).toHaveLength(3);
    });
  });

  describe("SkeletonGrid", () => {
    it("renders skeleton grid with loading state", () => {
      const { container } = render(<SkeletonGrid />);

      const skeleton = container.querySelector('[aria-busy="true"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("aria-live", "polite");
    });

    it("renders grid header and rows", () => {
      const { container } = render(<SkeletonGrid />);

      expect(
        container.querySelector(".skeleton-grid-header")
      ).toBeInTheDocument();
      expect(container.querySelectorAll(".skeleton-grid-row")).toHaveLength(5);
    });

    it("has correct CSS classes", () => {
      const { container } = render(<SkeletonGrid />);

      expect(container.querySelector(".skeleton-grid")).toBeInTheDocument();
    });
  });

  describe("SkeletonChart", () => {
    it("renders skeleton chart with loading state", () => {
      const { container } = render(<SkeletonChart />);

      const skeleton = container.querySelector('[aria-busy="true"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("aria-live", "polite");
    });

    it("renders chart title and body", () => {
      const { container } = render(<SkeletonChart />);

      expect(
        container.querySelector(".skeleton-chart-title")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".skeleton-chart-body")
      ).toBeInTheDocument();
    });

    it("has correct CSS classes", () => {
      const { container } = render(<SkeletonChart />);

      expect(container.querySelector(".skeleton-chart")).toBeInTheDocument();
    });
  });
});
