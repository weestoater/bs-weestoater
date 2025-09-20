import { AgCharts } from "ag-charts-react";
import { GoalScorersDetails } from "../../interfaces/interfaces";
import { GoalScorersGrid } from "./goalScorersGrid";

export const GoalScorerDetails = (props: any) => {
  const details: GoalScorersDetails = props.details ? props.details : null;

  const _options: any = {
    data: details,
    title: {
      enabled: true,
      text: "No. of Goals & Assists",
    },
    series: [
      {
        type: "bar",
        xKey: "player",
        xName: "Players",
        yKey: "goals",
        yName: "Goals Scored",
        fill: "#fd9402",
        stroke: "#6a0117",
        showInMiniChart: true,
      },
      {
        type: "line",
        xKey: "player",
        xName: "Players",
        yKey: "assists",
        yName: "Assists ",
        strokeWidth: 0,
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
        title: { text: "Players" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "No. of Goals" },
      },
      {
        type: "number",
        position: "right",
        title: { text: "No. of Assists" },
      },
    ],
    padding: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    },
    legend: {
      position: "top",
      spacing: 5,
    },
    theme: {},
  };

  return (
    <>
      <div className="goal-scorers" data-testid="goalscorers-pie-chart">
        <AgCharts options={_options} />
      </div>

      <GoalScorersGrid details={details} />
    </>
  );
};
