import { GridOptions } from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";

export const goalScorersGridConfig = {
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
  theme: themeAlpine,
} as GridOptions;
