export const GoalScorersDetailsTable = (props: any) => {
  const details = props.details ? props.details : null;

  return (
    <div className="goal-scorers-table" data-testid="goal-scorers-table">
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-dark">
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
              details.map((item: any, index: number) => (
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
