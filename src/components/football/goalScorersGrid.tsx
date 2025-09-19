import { useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-community";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { AgGridReact } from "ag-grid-react";

export const GoalScorersGrid = (props: any) => {
  const details = props.details ? props.details : null;

  const [rowData] = useState(details);

  const [colDefs] = useState([
    { field: "player" },
    { field: "goals" },
    { field: "assists" },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
  };

  return (
    <div className="goal-scorers-grid">
      <AgGridReact
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}
        theme={themeAlpine}
      />
    </div>
  );
};
