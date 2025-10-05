import { AgCartesianChartOptions } from "ag-charts-community";
import { formatDateToDDMMM } from "../utils/dateUtils";
import { SwDataPoint } from "../interfaces/swTypes";

export const createSwChartOptions = (
  data: SwDataPoint[]
): AgCartesianChartOptions<SwDataPoint> => ({
  width: 800,
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
      fill: "#999999",
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
      type: "scatter",
      xKey: "date",
      yKey: "sotw",
      yName: "Slimmer of the Week",
      size: 15,
      fill: "#6a0117",
      stroke: "#6a0117",
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
    top: 20,
    right: 40,
    bottom: 20,
    left: 40,
  },
  legend: {
    position: "bottom",
  },
  theme: {},
});
