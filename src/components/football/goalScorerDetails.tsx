import { lazy, memo, Suspense } from "react";
import type { GoalScorer } from "../../interfaces/footballTypes";
import { GoalScorersGrid } from "./goalScorersGrid";

// Lazy load ag-charts to reduce initial bundle size
const AgCharts = lazy(() =>
  import("ag-charts-react").then((module) => ({ default: module.AgCharts }))
);

export const GoalScorerDetails = memo((props: any) => {
  const details: GoalScorer[] = props.details ? props.details : [];

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
        <Suspense
          fallback={
            <div className="text-center p-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading chart...</span>
              </div>
            </div>
          }
        >
          <AgCharts options={_options} />
        </Suspense>
      </div>

      <GoalScorersGrid details={details} />
    </>
  );
});
