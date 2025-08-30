import { AgChartsReact } from "ag-charts-react";
import { GoalScorersDetails } from "../../interfaces/interfaces";

export const GoalScorerDetails = (props: any) => {
  const details: GoalScorersDetails = props.details ? props.details : null;

  const _options: any = {
    data: details,
    title: {
      enabled: true,
      text: "No. of Goals & Assists",
    },
    autoSize: true,
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
      top: 20,
      right: 20,
      bottom: 20,
      left: 40,
    },
    legend: {
      position: "bottom",
      spacing: 20,
    },
    theme: {},
  };

  return (
    <div className="goal-scorers" data-testid="goalscorers-pie-chart">
      <AgChartsReact options={_options} />
    </div>
  );
};
