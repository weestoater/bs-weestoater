import { AgCharts } from "ag-charts-react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { SWDataTable } from "../components/sw/swDataTable";
import { createSwChartOptions } from "../config/swChartConfig";
import swData from "../data/slimmingWorldData.json";

export const SlimmingWorld = () => {
  const _options = createSwChartOptions(swData[0].data);

  return (
    <>
      <PageTitleH1 title="Slimming World" />
      <div className="row">
        <div className="col-lg-4">
          <SWDataTable
            startDate={swData[0].startDate}
            startWeight={swData[0].startWeight}
            targetWeight={swData[0].targetWeight}
            data={swData[0].data}
          />
        </div>
        <div className="col-lg-8">
          <div className="sw-chart">
            <AgCharts options={_options} />
          </div>
        </div>
      </div>
    </>
  );
};
