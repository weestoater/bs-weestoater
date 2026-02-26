import {
  memo,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { GoalScorer } from "../../interfaces/footballTypes";
import { GoalScorersGrid } from "./goalScorersGrid";
import "../../utils/agChartsSetup";
import { AgCharts } from "ag-charts-react";

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
  showGridOnly?: boolean;
}

export const GoalScorerDetails = memo((props: GoalScorerDetailsProps) => {
  const details: GoalScorer[] = useMemo(
    () => props.details ?? [],
    [props.details],
  );
  const showGridOnly = props.showGridOnly ?? false;

  // Transform data to use surnames only
  const chartData = useMemo(() => {
    return details.map((item) => ({
      ...item,
      player: item.player.split(" ").pop() || item.player, // Get last name
    }));
  }, [details]);

  const createChartOptions = useCallback(() => {
    const themeColors = getThemeColors();

    return {
      data: chartData,
      background: {
        fill: themeColors.background,
      },
      title: {
        text: "Goals & Assists",
        color: themeColors.text,
        fontSize: 16,
      },
      series: [
        {
          type: "bar",
          direction: "horizontal",
          xKey: "player",
          yKey: "goals",
          yName: "Goals",
          fill: "#fd9402",
          strokeWidth: 0,
          label: {
            enabled: true,
            color: themeColors.text,
            fontSize: 14,
            fontWeight: "bold",
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "player",
          yKey: "assists",
          yName: "Assists",
          fill: "#6a0117",
          strokeWidth: 0,
          label: {
            enabled: true,
            color: themeColors.text,
            fontSize: 14,
            fontWeight: "bold",
          },
          tooltip: {
            enabled: true,
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "left",
          label: {
            color: themeColors.text,
            fontSize: 14,
          },
          paddingInner: 0.5,
          paddingOuter: 0.4,
        },
        {
          type: "number",
          position: "bottom",
          label: {
            color: themeColors.text,
            fontSize: 14,
          },
          title: {
            text: "Count",
            color: themeColors.text,
            fontSize: 14,
          },
        },
      ],
      legend: {
        enabled: true,
        position: "top",
        item: {
          label: {
            color: themeColors.text,
            fontSize: 14,
          },
        },
      },
      padding: {
        top: 0,
        right: 5,
        bottom: 15,
        left: 5,
      },
    };
  }, [chartData]);

  const [chartOptions, setChartOptions] = useState(createChartOptions);

  useEffect(() => {
    // Update chart when details change
    setChartOptions(createChartOptions());
  }, [createChartOptions]);

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
  }, [createChartOptions]);

  return (
    <>
      {showGridOnly ? (
        <GoalScorersGrid details={details} />
      ) : (
        <>
          <div
            className="goal-scorers"
            data-testid="goalscorers-pie-chart"
            style={{
              height: "440px",
              width: "100%",
            }}
          >
            <Suspense
              fallback={
                <div className="text-center p-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              }
            >
              <AgCharts options={chartOptions as Record<string, unknown>} />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
});
