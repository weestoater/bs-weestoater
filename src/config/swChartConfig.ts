import { AgCartesianChartOptions } from "ag-charts-community";
import { formatDateToDDMMM } from "../utils/dateUtils";
import { SwDataPoint } from "../interfaces/swTypes";

export const createSwChartOptions = (
  data: SwDataPoint[]
): AgCartesianChartOptions<SwDataPoint> => ({
  height: 400,
  data: data,
  title: {
    text: "Slimming World",
    enabled: true,
  },
  series: [
    {
      type: "line",
      xKey: "date",
      yKey: "weight",
      yName: "Weight in lbs",
      stroke: "blue",
      strokeWidth: 3,
      marker: {
        enabled: true,
        shape: "diamond",
        size: 12,
        fill: "blue",
        stroke: "blue",
        strokeWidth: 2,
      },
    },
    {
      type: "bar",
      xKey: "date",
      yKey: "lost",
      yName: "Weight lost in lbs",
      fill: "#ff9900",
    },
    {
      type: "line",
      xKey: "date",
      yKey: "target",
      yName: "Target",
      stroke: "green",
      strokeWidth: 1,
      marker: {
        enabled: true,
        shape: "circle",
        size: 12,
        fill: "green",
        stroke: "green",
        strokeWidth: 1,
      },
    },
    {
      type: "line",
      xKey: "date",
      yKey: "sotw",
      yName: "Slimmer of the Week",
      stroke: "#6a0117",
      strokeWidth: 3,
      marker: {
        enabled: true,
        shape: "star",
        size: 15, // Make marker large
        fill: "#6a0117", // Optional: color of diamond
      },
      showInMiniChart: true,
    },
  ],
  axes: [
    {
      type: "category",
      position: "bottom",
      title: {
        text: "Date of Weigh-in",
      },
      label: {
        rotation: 45,
        formatter: (params: { value: string }) =>
          formatDateToDDMMM(params.value),
      },
    },
    {
      type: "number",
      position: "left",
      title: {
        text: "Weight in lbs",
      },
    },
    {
      type: "number",
      position: "right",
      title: {
        text: "Weight lost in lbs",
      },
    },
  ],
  padding: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  legend: {
    position: "bottom",
  },
  theme: {},
});
