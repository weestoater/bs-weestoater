import { lazy, Suspense, useState, useEffect } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";

// Lazy load AgGridReact
const AgGridReact = lazy(() =>
  import("ag-grid-react").then((m) => ({ default: m.AgGridReact }))
);

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface SwDataItem {
  date: string;
  weight: number;
  change: number;
  lost: number;
  target: number;
}

interface Props {
  data: SwDataItem[];
}

export const SwDataGrid = ({ data }: Props) => {
  const [rowData] = useState(data);
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

  // Column definitions
  const columnDefs = [
    { field: "date" as const, headerName: "Weigh in date", flex: 1.5 },
    {
      field: "change" as const,
      headerName: "Amount Lost (lbs)",
      flex: 1,
      valueFormatter: (params: { value: number }) => {
        const value = params.value;
        return value === 0 ? "0" : value > 0 ? `+${value}` : `${value}`;
      },
    },
    { field: "weight" as const, headerName: "New Weight (lbs)", flex: 1 },
    {
      field: "weight" as const,
      headerName: "Weight (st/lbs)",
      flex: 1.2,
      valueFormatter: (params: { value: number }) => {
        const totalPounds = params.value;
        const stones = Math.floor(totalPounds / 14);
        const pounds = Math.round(totalPounds % 14);
        return `${stones}st ${pounds}lbs`;
      },
    },
  ];

  // Dynamic grid configuration based on theme
  const gridTheme = themeAlpine.withParams({
    backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
    foregroundColor: theme === "dark" ? "#c9d1d9" : "#212529",
    borderColor: theme === "dark" ? "#30363d" : "#dee2e6",
    headerBackgroundColor: theme === "dark" ? "#161b22" : "#f8f9fa",
    headerTextColor: theme === "dark" ? "#c9d1d9" : "#212529",
    oddRowBackgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
    rowHoverColor: theme === "dark" ? "#161b22" : "#f8f9fa",
  });

  return (
    <div className="sw-data-grid">
      <Suspense
        fallback={
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading grid...</span>
            </div>
          </div>
        }
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={{
            sortable: true,
            filter: true,
          }}
          theme={gridTheme}
        />
      </Suspense>
    </div>
  );
};
