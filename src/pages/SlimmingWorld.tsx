import { AgChartsReact } from "ag-charts-react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { SWDataTable } from "../components/sw/swDataTable";
import swData from "../data/slimmingWorldData.json";

export const SlimmingWorld = () => {
  const _options: any = {
    data: swData[0].data,
    title: {
      enabled: true,
      text: "Slimming World",
    },
    autoSize: true,
    series: [
      {
        type: "line",
        xKey: "date",
        yKey: "weight",
        yName: "Weight in lbs",
        strokeWidth: 3,
        marker: {
          enabled: true,
          shape: "diamond",
          size: 12, // Make marker large
          fill: "blue", // Optional: color of diamond
          stroke: "blue", // Optional: border color
          strokeWidth: 2, // Optional: border thickness
        },
      },
      {
        type: "bar",
        xKey: "date",
        yKey: "lost",
        yName: "Weight lost in lbs",
      },
      {
        type: "line",
        xKey: "date",
        yKey: "target",
        yName: "Target",
        strokeWidth: 1,
        marker: {
          enabled: true,
          shape: "circle",
          size: 12, // Make marker large
          fill: "green", // Optional: color of diamond
          stroke: "green", // Optional: border color
          strokeWidth: 1, // Optional: border thickness
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Date" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Weight in lbs" },
      },
      {
        type: "number",
        position: "right",
        title: { text: "Weight lost in lbs" },
      },
    ],
    padding: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 10,
    },
    legend: {
      position: "bottom",
      spacing: 20,
    },
    theme: {},
  };

  return (
    <>
      <PageTitleH1 title="Slimming World" />
      <div className="row">
        <div className="col-lg-6">
          <SWDataTable
            startDate={swData[0].startDate}
            startWeight={swData[0].startWeight}
            targetWeight={swData[0].targetWeight}
            data={swData[0].data}
          />
        </div>
        <div className="col-lg-6">
          <div className="sw-chart">
            <AgChartsReact options={_options} />
          </div>
        </div>
      </div>
    </>
  );
};
