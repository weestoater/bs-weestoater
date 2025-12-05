import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeightConverter } from "../../../components/sw/WeightConverter";

describe("WeightConverter", () => {
  it("converts pounds to stones, pounds, and kilograms", () => {
    render(<WeightConverter lbs={180} />);
    expect(
      screen.getByText("12 st 12.0 lbs (180.0 lbs) | 81.65 kgs")
    ).toBeInTheDocument();
  });

  it("converts kilograms to stones, pounds, and total pounds", () => {
    render(<WeightConverter kgs={100} />);
    expect(
      screen.getByText("15 st 10.5 lbs (220.5 lbs) | 100.00 kgs")
    ).toBeInTheDocument();
  });

  it("handles decimal values correctly", () => {
    render(<WeightConverter lbs={156.7} />);
    expect(
      screen.getByText("11 st 2.5 lbs (156.5 lbs) | 71.08 kgs")
    ).toBeInTheDocument();
  });

  it("displays error message for invalid weight (no input)", () => {
    render(<WeightConverter />);
    expect(screen.getByText("Invalid weight")).toBeInTheDocument();
  });

  it("displays error message for NaN input", () => {
    render(<WeightConverter lbs={NaN} />);
    expect(screen.getByText("Invalid weight")).toBeInTheDocument();
  });

  it("prefers kilograms input when both kgs and lbs are provided", () => {
    render(<WeightConverter kgs={50} lbs={150} />);
    expect(
      screen.getByText("7 st 12.0 lbs (110.0 lbs) | 50.00 kgs")
    ).toBeInTheDocument();
  });

  it("rounds kilograms to 2 decimal places", () => {
    render(<WeightConverter lbs={150.333} />);
    expect(
      screen.getByText("10 st 10.5 lbs (150.5 lbs) | 68.19 kgs")
    ).toBeInTheDocument();
  });
});
