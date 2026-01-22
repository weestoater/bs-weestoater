import { WeightConverter } from "./WeightConverter";

interface SwDataItem {
  date: string;
  weight: number;
  change: number;
  lost: number;
  target: number;
}

interface SWDataTableProps {
  data: SwDataItem[];
  startWeight: number;
  startDate: string;
  targetWeight: number;
}

export const SWDataTable = (props: SWDataTableProps) => {
  const { data, startWeight, startDate, targetWeight } = props;

  const joinDate = startDate ? startDate : undefined;

  if (!data || data.length === 0) return <p>No data available</p>;

  function parseDateString(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  const mostRecent = [...data].sort(
    (a, b) =>
      parseDateString(b.date).getTime() - parseDateString(a.date).getTime(),
  )[0];

  return (
    <div className="card">
      <div className="card-header">Slimming World details</div>
      <div className="card-body">
        <p>
          <span aria-hidden="true">📅 </span>Joined: <strong>{joinDate}</strong>
          <br />
          <span aria-hidden="true">🏁 </span>Start weight:{" "}
          <WeightConverter lbs={startWeight} />
          <br />
          <span aria-hidden="true">🎯 </span>Target weight:{" "}
          <WeightConverter lbs={targetWeight} />
          <hr />
          <span aria-hidden="true">⚖️ </span>Last weigh-in:{" "}
          <WeightConverter lbs={mostRecent.weight} />
          {/* <br />
          Total lost: <WeightConverter lbs={totalLostFormatted} /> */}
        </p>
      </div>
    </div>
  );
};
