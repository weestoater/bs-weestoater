import { AgChartsReact } from "ag-charts-react";
import { GoalScorersDetails } from "../../interfaces/interfaces";

export const GoalScorerDetails = (props: any) => {
  const details: GoalScorersDetails = props.details ? props.details : null;

  const _options: any = {
    data: details,
    title: {
      enabled: true,
      text: "Goal Scorers",
    },
    autoSize: true,
    series: [
      {
        type: "bar",
        xKey: "player",
        xName: "Players",
        yKey: "goals",
        yName: "Goals Scored",
        cornerRadius: 5,
        fill: "#fd9402",
        stroke: "#6a0117",
        showInMiniChart: true,
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
