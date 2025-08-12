import { WeightConverter } from "./WeightConverter";

export const SWDataTable = (props: any) => {
  const { data, startWeight, startDate, targetWeight } = props;

  const joinDate = startDate ? startDate : undefined;

  if (!data || data.length === 0) return <p>No data available</p>;

  function parseDateString(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  const mostRecent = [...data].sort(
    (a, b) =>
      parseDateString(b.date).getTime() - parseDateString(a.date).getTime()
  )[0];

  const totalLost = startWeight - mostRecent.weight;
  const totalLostFormatted = totalLost;

  return (
    <div className="card">
      <div className="card-header">Slimming World details</div>
      <div className="card-body">
        <p>
          Joined: <strong>{joinDate}</strong>
          <br />
          Start weight: <WeightConverter lbs={startWeight} />
          <br />
          Target weight: <WeightConverter lbs={targetWeight} />
        </p>
        <p>
          Last weigh-in: <WeightConverter lbs={mostRecent.weight} /> <br />
          Total lost: <WeightConverter lbs={totalLostFormatted} />
        </p>
      </div>
    </div>
  );
};
