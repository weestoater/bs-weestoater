// ag-charts v13 module registration
// This must be imported before any AgCharts components are used
import { ModuleRegistry } from "ag-charts-community";
import { BarSeriesModule } from "ag-charts-community";
import { LineSeriesModule } from "ag-charts-community";
import { NumberAxisModule } from "ag-charts-community";
import { CategoryAxisModule } from "ag-charts-community";

// Register all required modules
ModuleRegistry.registerModules([
  BarSeriesModule,
  LineSeriesModule,
  NumberAxisModule,
  CategoryAxisModule,
]);

// Export a marker to ensure this file is imported
export const AG_CHARTS_INITIALIZED = true;
