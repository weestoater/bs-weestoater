import {
  lazy,
  memo,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { GoalScorer } from "../../interfaces/footballTypes";
import { GoalScorersGrid } from "./goalScorersGrid";

// Lazy load ag-charts to reduce initial bundle size
const AgCharts = lazy(() =>
  import("ag-charts-react").then((module) => ({ default: module.AgCharts }))
);

// Get theme-aware colors
const getThemeColors = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    text: isDark ? "#c9d1d9" : "#212529",
    gridLine: isDark ? "#30363d" : "#dee2e6",
    background: isDark ? "transparent" : "transparent",
  };
};

interface GoalScorerDetailsProps {
  details?: GoalScorer[];
}

export const GoalScorerDetails = memo((props: GoalScorerDetailsProps) => {
  const details: GoalScorer[] = useMemo(
    () => props.details ?? [],
    [props.details]
  );

  const createChartOptions = useCallback(() => {
    const themeColors = getThemeColors();

    return {
      data: details,
      background: {
        fill: themeColors.background,
      },
      title: {
        enabled: true,
        text: "No. of Goals & Assists",
        color: themeColors.text,
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
            size: 15,
            fill: "#6a0117",
          },
          showInMiniChart: true,
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: "Players",
            color: themeColors.text,
          },
          label: {
            color: themeColors.text,
          },
          gridLine: {
            style: [
              {
                stroke: themeColors.gridLine,
              },
            ],
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "No. of Goals",
            color: themeColors.text,
          },
          label: {
            color: themeColors.text,
          },
          gridLine: {
            style: [
              {
                stroke: themeColors.gridLine,
              },
            ],
          },
        },
        {
          type: "number",
          position: "right",
          title: {
            text: "No. of Assists",
            color: themeColors.text,
          },
          label: {
            color: themeColors.text,
          },
          gridLine: {
            style: [
              {
                stroke: themeColors.gridLine,
              },
            ],
          },
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
        item: {
          label: {
            color: themeColors.text,
          },
        },
      },
    };
  }, [details]);

  const [chartOptions, setChartOptions] = useState(createChartOptions);

  useEffect(() => {
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setChartOptions(createChartOptions());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [details, createChartOptions]);

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
          <AgCharts options={chartOptions as Record<string, unknown>} />
        </Suspense>
      </div>

      <GoalScorersGrid details={details} />
    </>
  );
});
