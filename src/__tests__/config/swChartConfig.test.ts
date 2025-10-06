import { describe, test, expect } from "vitest";
import { createSwChartOptions } from "../../config/swChartConfig";
import { SwDataPoint } from "../../interfaces/swTypes";

describe("Slimming World Chart Configuration", () => {
  const mockData: SwDataPoint[] = [
    {
      date: "01/01/2025",
      weight: 200,
      lost: 2,
      target: 180,
      sotw: 2,
    },
  ];

  const config = createSwChartOptions(mockData);

  test("chart has correct base configuration", () => {
    expect(config.width).toBe(800);
    expect(config.height).toBe(400);
    expect(config.data).toBe(mockData);
  });

  test("chart has correct title configuration", () => {
    expect(config.title).toEqual({
      text: "Slimming World",
      enabled: true,
    });
  });

  test("chart has correct number of series", () => {
    expect(config.series).toHaveLength(4); // line, bar, line, scatter series
  });

  test("weight series has correct configuration", () => {
    const series = config.series || [];
    expect(series[0]).toMatchObject({
      type: "line",
      xKey: "date",
      yKey: "weight",
      yName: "Weight in lbs",
      stroke: "blue",
      strokeWidth: 3,
    });
  });

  test("lost weight series has correct configuration", () => {
    const series = config.series || [];
    expect(series[1]).toMatchObject({
      type: "bar",
      xKey: "date",
      yKey: "lost",
      yName: "Weight lost in lbs",
    });
  });

  test("target series has correct configuration", () => {
    const series = config.series || [];
    expect(series[2]).toMatchObject({
      type: "line",
      xKey: "date",
      yKey: "target",
      yName: "Target",
      stroke: "green",
      strokeWidth: 1,
    });
  });

  test("data is correctly assigned", () => {
    expect(config.data).toEqual(mockData);
  });

  test("axes are properly configured", () => {
    const axes = config.axes || [];
    expect(axes).toHaveLength(3); // category and 2 number axes

    expect(axes[0]).toMatchObject({
      type: "category",
      position: "bottom",
      title: { text: "Date of Weigh-in" },
    });

    expect(axes[1]).toMatchObject({
      type: "number",
      position: "left",
      title: { text: "Weight in lbs" },
    });

    expect(axes[2]).toMatchObject({
      type: "number",
      position: "right",
      title: { text: "Weight lost in lbs" },
    });
  });
});
