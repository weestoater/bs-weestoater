import { Suspense, useState, useEffect, lazy } from "react";
import { createWeightProgressChartOptions } from "../../config/weightProgressChartConfig";
import { SkeletonChart } from "../global/SkeletonLoaders";
import { SwDataPoint } from "../../interfaces/swTypes";
import "../../utils/agChartsSetup";

const AgCharts = lazy(() =>
  import("ag-charts-react").then((m) => ({ default: m.AgCharts })),
);

interface WeightProgressChartProps {
  data: SwDataPoint[];
}

export const WeightProgressChart = ({ data }: WeightProgressChartProps) => {
  const [chartOptions, setChartOptions] = useState(() =>
    createWeightProgressChartOptions(data),
  );

  useEffect(() => {
    // Watch for theme changes and update chart accordingly
    const observer = new MutationObserver(() => {
      setChartOptions(createWeightProgressChartOptions(data));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="weight-progress-chart">
      <Suspense fallback={<SkeletonChart />}>
        <AgCharts options={chartOptions} />
      </Suspense>
    </div>
  );
};
