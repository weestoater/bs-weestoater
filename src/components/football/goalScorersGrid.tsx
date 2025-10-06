import { useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { goalScorersGridConfig } from "../../config/gridConfig";
import { GoalScorer } from "../../interfaces/footballTypes";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  details: GoalScorer[];
}

export const GoalScorersGrid = ({ details }: Props) => {
  const [rowData] = useState(details);

  return (
    <div className="goal-scorers-grid">
      <AgGridReact {...goalScorersGridConfig} rowData={rowData} />
    </div>
  );
};
