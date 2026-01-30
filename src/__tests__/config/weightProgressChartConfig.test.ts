import { describe, test, expect } from "vitest";
import { createWeightProgressChartOptions } from "../../config/weightProgressChartConfig";
import { SwDataPoint } from "../../interfaces/swTypes";

describe("Weight Progress Chart Configuration", () => {
  const mockData: SwDataPoint[] = [
    {
      date: "01/01/2025",
      weight: 200,
      lost: 2,
      target: 180,
      sotw: 2,
    },
  ];

  const config = createWeightProgressChartOptions(mockData);

  test("chart has correct base configuration", () => {
    expect(config.data).toBe(mockData);
  });

  test("chart has correct title configuration", () => {
    expect(config.title).toMatchObject({
      text: "Slimming World",
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
    const axes = config.axes as any;
    expect(axes).toBeDefined();
    expect(Object.keys(axes)).toHaveLength(3); // category, left, and right axes

    expect(axes.category).toMatchObject({
      type: "category",
      position: "bottom",
      title: { text: "Date of Weigh-in" },
    });

    expect(axes.left).toMatchObject({
      type: "number",
      position: "left",
      title: { text: "Weight in lbs" },
    });

    expect(axes.right).toMatchObject({
      type: "number",
      position: "right",
      title: { text: "Weight lost in lbs" },
    });
  });
});
