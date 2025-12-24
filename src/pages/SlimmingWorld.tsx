import { lazy, Suspense, useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { SWDataTable } from "../components/sw/swDataTable";
import { SwDataGrid } from "../components/sw/swDataGrid";
import { createSwChartOptions } from "../config/swChartConfig";
import { SkeletonChart } from "../components/global/SkeletonLoaders";
import swData from "../data/slimmingWorldData.json";

// Lazy load ag-charts to reduce initial bundle size
const AgCharts = lazy(() =>
  import("ag-charts-react").then((module) => ({ default: module.AgCharts }))
);

export const SlimmingWorld = () => {
  const [chartOptions, setChartOptions] = useState(() =>
    createSwChartOptions(swData[0].data)
  );

  // Calculate total lost from most recent entry
  const totalLost =
    swData[0].data.length > 0
      ? swData[0].data[swData[0].data.length - 1].lost
      : 0;
  const totalLostKg = totalLost * 0.453592;

  useEffect(() => {
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setChartOptions(createSwChartOptions(swData[0].data));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PageTitleH1
        title="Slimming World"
        description="Personal weight tracking and progress visualization for Slimming World journey."
        keywords="Slimming World, weight tracking, health, fitness, progress tracking"
      />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <SWDataTable
            startDate={swData[0].startDate}
            startWeight={swData[0].startWeight}
            targetWeight={swData[0].targetWeight}
            data={swData[0].data}
          />
          <div className="total-lost-banner mt-4">
            <h2>Total Lost to Date</h2>
            <div className="total-lost-stats">
              <div className="stat-item">
                <span className="stat-value">{totalLost}</span>
                <span className="stat-label">lbs</span>
              </div>
              <div className="stat-divider">•</div>
              <div className="stat-item">
                <span className="stat-value">{totalLostKg.toFixed(2)}</span>
                <span className="stat-label">kg</span>
              </div>
              <div className="stat-divider">•</div>
              <div className="stat-item">
                <span className="stat-value">
                  {Math.floor(totalLost / 14)}st {Math.round(totalLost % 14)}
                  lbs
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-6 col-sm-6 col-xs-12 mb-4">
          <div className="sw-chart">
            <Suspense fallback={<SkeletonChart />}>
              <AgCharts options={chartOptions} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h2 className="mb-3">Weight Loss History</h2>
          <div className="sw-grid-container">
            <SwDataGrid details={swData[0].data} />
          </div>
        </div>
      </div>

      <BackToTop />
    </>
  );
};
