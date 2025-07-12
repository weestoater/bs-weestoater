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
    marker: {
      fill: "orange",
      shape: "diamond",
      size: 10,
      strokeWidth: 2,
      stroke: "black",
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
