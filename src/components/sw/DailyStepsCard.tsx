import { DailySteps } from "../../interfaces/DailySteps";

interface DailyStepsCardProps {
  dailySteps: DailySteps[];
}

export const DailyStepsCard = ({ dailySteps }: DailyStepsCardProps) => {
  if (dailySteps.length === 0) {
    return (
      <div className="daily-steps-card card">
        <div className="card-body">
          <h3 className="card-title">
            <span aria-hidden="true">👟 </span>Daily Steps
          </h3>
          <p className="text-muted">No daily step data available.</p>
          <p className="small">
            Export your daily steps from Garmin Connect and import using the
            daily-steps-importer script.
          </p>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalSteps = dailySteps.reduce((sum, d) => sum + d.steps, 0);
  const avgSteps = Math.round(totalSteps / dailySteps.length);
  const daysWithGoal = dailySteps.filter((d) => d.goal).length;
  const daysGoalMet = dailySteps.filter(
    (d) => d.goal && d.steps >= d.goal,
  ).length;

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get last 14 days
  const recentDays = dailySteps.slice(0, 14);

  return (
    <div className="daily-steps-card">
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">
            <span aria-hidden="true">👟 </span>Daily Steps Summary
          </h3>
          <div className="activity-stats-grid">
            <div className="stat-box">
              <div className="stat-value">{dailySteps.length}</div>
              <div className="stat-label">Days Tracked</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalSteps.toLocaleString()}</div>
              <div className="stat-label">Total Steps</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{avgSteps.toLocaleString()}</div>
              <div className="stat-label">Avg/Day</div>
            </div>
            {daysWithGoal > 0 && (
              <div className="stat-box">
                <div className="stat-value">
                  {daysGoalMet}/{daysWithGoal}
                </div>
                <div className="stat-label">Goals Met</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">
            <span aria-hidden="true">📅 </span>Recent Days
          </h3>
          <div className="daily-steps-table">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-end">Steps</th>
                  {recentDays.some((d) => d.goal) && (
                    <th className="text-end">Goal</th>
                  )}
                  {recentDays.some((d) => d.distance) && (
                    <th className="text-end">Distance</th>
                  )}
                  {recentDays.some((d) => d.calories) && (
                    <th className="text-end">Calories</th>
                  )}
                  {recentDays.some((d) => d.floors) && (
                    <th className="text-end">Floors</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {recentDays.map((day) => {
                  const goalMet = day.goal && day.steps >= day.goal;
                  return (
                    <tr key={day.date} className={goalMet ? "goal-met" : ""}>
                      <td>
                        <strong>{formatDate(day.date)}</strong>
                      </td>
                      <td className="text-end">
                        <strong>{day.steps.toLocaleString()}</strong>
                        {goalMet && (
                          <span
                            className="ms-1"
                            aria-label="Goal met"
                            title="Goal met"
                          >
                            ✓
                          </span>
                        )}
                      </td>
                      {recentDays.some((d) => d.goal) && (
                        <td className="text-end text-muted">
                          {day.goal ? day.goal.toLocaleString() : "-"}
                        </td>
                      )}
                      {recentDays.some((d) => d.distance) && (
                        <td className="text-end text-muted">
                          {day.distance ? `${day.distance} mi` : "-"}
                        </td>
                      )}
                      {recentDays.some((d) => d.calories) && (
                        <td className="text-end text-muted">
                          {day.calories ? day.calories : "-"}
                        </td>
                      )}
                      {recentDays.some((d) => d.floors) && (
                        <td className="text-end text-muted">
                          {day.floors ? day.floors : "-"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
