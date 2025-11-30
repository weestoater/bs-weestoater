import { lazy, Suspense, useState, useEffect } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";
import { GoalScorer } from "../../interfaces/footballTypes";

// Lazy load AgGridReact
const AgGridReact = lazy(() =>
  import("ag-grid-react").then((m) => ({ default: m.AgGridReact }))
);

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  details: GoalScorer[];
}

export const GoalScorersGrid = ({ details }: Props) => {
  const [rowData] = useState(details);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Dynamic grid configuration based on theme
  const gridConfig = {
    columnDefs: [
      { field: "player", flex: 2.5 },
      { field: "goals" },
      { field: "assists" },
    ],
    defaultColDef: {
      sortable: true,
      filter: true,
      flex: 1,
    },
    theme: themeAlpine.withParams({
      backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
      foregroundColor: theme === "dark" ? "#c9d1d9" : "#212529",
      borderColor: theme === "dark" ? "#30363d" : "#dee2e6",
      headerBackgroundColor: theme === "dark" ? "#161b22" : "#f8f9fa",
      headerTextColor: theme === "dark" ? "#c9d1d9" : "#212529",
      oddRowBackgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
      rowHoverColor: theme === "dark" ? "#161b22" : "#f8f9fa",
    }),
  };

  return (
    <div className="goal-scorers-grid">
      <Suspense
        fallback={
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading grid...</span>
            </div>
          </div>
        }
      >
        <AgGridReact {...(gridConfig as any)} rowData={rowData} />
      </Suspense>
    </div>
  );
};
