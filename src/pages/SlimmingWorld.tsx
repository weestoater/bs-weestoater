import { lazy, Suspense } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { SWDataTable } from "../components/sw/swDataTable";
import { createSwChartOptions } from "../config/swChartConfig";
import swData from "../data/slimmingWorldData.json";

// Lazy load ag-charts to reduce initial bundle size
const AgCharts = lazy(() =>
  import("ag-charts-react").then((module) => ({ default: module.AgCharts }))
);

export const SlimmingWorld = () => {
  const _options = createSwChartOptions(swData[0].data);

  return (
    <>
      <PageTitleH1 title="Slimming World" />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <SWDataTable
            startDate={swData[0].startDate}
            startWeight={swData[0].startWeight}
            targetWeight={swData[0].targetWeight}
            data={swData[0].data}
          />
        </div>
        <div className="col-lg-8 col-md-6 col-sm-6 col-xs-12 mb-4">
          <div className="sw-chart">
            <Suspense
              fallback={
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              }
            >
              <AgCharts options={_options} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};
