import { lazy, Suspense, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { goalScorersGridConfig } from "../../config/gridConfig";
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
        <AgGridReact {...goalScorersGridConfig} rowData={rowData} />
      </Suspense>
    </div>
  );
};
