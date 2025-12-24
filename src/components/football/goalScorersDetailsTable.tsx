import { useState, useEffect } from "react";
import { GoalScorer } from "../../interfaces/footballTypes";

interface GoalScorersDetailsTableProps {
  details?: GoalScorer[];
}

export const GoalScorersDetailsTable = (
  props: GoalScorersDetailsTableProps
) => {
  const details = props.details ? props.details : null;
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

  return (
    <div
      className="goal-scorers-table"
      data-testid="goal-scorers-table"
      data-theme={theme}
    >
      <div className="table-responsive" key={`table-${theme}`}>
        <table className="table table-hover table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Player</th>
              <th scope="col" className="text-center">
                Assists
              </th>
              <th scope="col" className="text-center">
                Goals
              </th>
            </tr>
          </thead>
          <tbody>
            {details !== null &&
              details.map((item: GoalScorer, index: number) => (
                <tr key={index}>
                  <td>{item.player ? item.player : " - "}</td>
                  <td className="text-center">
                    {item.assists ? item.assists : " - "}
                  </td>
                  <td className="text-center">
                    {item.goals ? item.goals : " - "}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
