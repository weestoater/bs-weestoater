export const SWDataTable = (props: any) => {
  const { data, startWeight, startDate, targetWeight } = props;

  const joinDate = startDate ? startDate : undefined;

  return (
    <div className="card">
      <div className="card-header">Slimming World details</div>
      <div className="card-body">
        <p>
          Joined: <strong>{joinDate}</strong>
          <br />
          Start weight: <strong>{JSON.stringify(startWeight)}</strong> lbs
          <br />
          Target weight: <strong>{JSON.stringify(targetWeight)}</strong> lbs
        </p>

        <p>data: {JSON.stringify(data)}</p>
      </div>
      {/* <table>
        <thead>
          <tr>
            {columns.map((col: string, index: number) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((date: any, weight: number) => (
            <tr key={rowIndex}>
              {columns.map((col: string, colIndex: number) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};
