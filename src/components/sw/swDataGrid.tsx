import { lazy, Suspense, useState, useEffect } from "react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";
import { SkeletonGrid } from "../global/SkeletonLoaders";

// Lazy load AgGridReact
const AgGridReact = lazy(() =>
  import("ag-grid-react").then((m) => ({ default: m.AgGridReact }))
);

// Register only the modules we need
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule,
]);

interface SwDataItem {
  date: string;
  weight: number;
  change: number;
  lost: number;
  target: number;
}

interface Props {
  details: SwDataItem[];
}

export const SwDataGrid = ({ details }: Props) => {
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

  // Column definitions
  const columnDefs = [
    { 
      field: "date" as const, 
      headerName: "Weigh in date", 
      width: 150,
      minWidth: 150
    },
    {
      field: "change" as const,
      headerName: "Lost (lbs)",
      width: 110,
      minWidth: 110,
      valueFormatter: (params: { value: number }) => {
        const value = params.value;
        return value === 0 ? "0" : value > 0 ? `+${value}` : `${value}`;
      },
    },
    { 
      field: "weight" as const, 
      headerName: "Weight (lbs)", 
      width: 120,
      minWidth: 120
    },
    {
      field: "weight" as const,
      headerName: "Weight (st/lbs)",
      width: 140,
      minWidth: 140,
      valueFormatter: (params: { value: number }) => {
        const totalPounds = params.value;
        const stones = Math.floor(totalPounds / 14);
        const pounds = Math.round(totalPounds % 14);
        return `${stones}st ${pounds}lbs`;
      },
    },
    {
      field: "change" as const,
      headerName: "Lost (kg)",
      width: 110,
      minWidth: 110,
      valueFormatter: (params: { value: number }) => {
        const valueKg = params.value * 0.453592;
        if (Math.abs(valueKg) < 0.005) return "0"; // Less than 0.01 rounds to 0
        const formatted = valueKg.toFixed(2);
        return valueKg > 0 ? `+${formatted}` : formatted;
      },
    },
    {
      field: "weight" as const,
      headerName: "Weight (kg)",
      width: 120,
      minWidth: 120,
      valueFormatter: (params: { value: number }) => {
        const weightKg = params.value * 0.453592;
        return weightKg.toFixed(2);
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
    oddRowBackgroundColor: theme === "dark" ? "#161b22" : "#f8f9fa",
    rowHoverColor: theme === "dark" ? "#21262d" : "#e9ecef",
  });

  return (
    <div className="sw-data-grid">
      <Suspense fallback={<SkeletonGrid />}>
        <AgGridReact
          rowData={rowData}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
