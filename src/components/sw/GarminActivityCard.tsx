import { GarminActivity } from "../../interfaces/GarminActivity";

interface GarminActivityCardProps {
  activities: GarminActivity[];
}

export const GarminActivityCard = ({ activities }: GarminActivityCardProps) => {
  // Calculate summary statistics
  const totalActivities = activities.length;
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0);
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
  const totalCalories = activities.reduce(
    (sum, a) => sum + (a.calories || 0),
    0,
  );
  const totalSteps = activities.reduce((sum, a) => sum + (a.steps || 0), 0);

  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  // Format pace as MM:SS per mile
  const formatPace = (pace?: number): string => {
    if (!pace) return "N/A";
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get activity icon
  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      running: "🏃",
      cycling: "🚴",
      walking: "🚶",
      swimming: "🏊",
      other: "💪",
    };
    return icons[type] || icons.other;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (activities.length === 0) {
    return (
      <div className="garmin-activity-card card">
        <div className="card-body">
          <h3 className="card-title">
            <span aria-hidden="true">⌚ </span>Garmin Activities
          </h3>
          <p className="text-muted">No activities recorded yet.</p>
          <p className="small">
            Export activities from Garmin Connect and convert them using the
            conversion script.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="garmin-activity-card">
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">
            <span aria-hidden="true">⌚ </span>Activity Summary
          </h3>
          <div className="activity-stats-grid">
            <div className="stat-box">
              <div className="stat-value">{totalActivities}</div>
              <div className="stat-label">Activities</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalDistance.toFixed(1)}</div>
              <div className="stat-label">miles</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">
                {Math.floor(totalDuration / 3600)}h{" "}
                {Math.floor((totalDuration % 3600) / 60)}m
              </div>
              <div className="stat-label">Duration</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalCalories.toLocaleString()}</div>
              <div className="stat-label">Calories</div>
            </div>
            {totalSteps > 0 && (
              <div className="stat-box">
                <div className="stat-value">{totalSteps.toLocaleString()}</div>
                <div className="stat-label">Steps</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">
            <span aria-hidden="true">📋 </span>Recent Activities
          </h3>
          <div className="activities-list">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-details">
                  <div className="activity-header">
                    <span className="activity-type">
                      {activity.type.charAt(0).toUpperCase() +
                        activity.type.slice(1)}
                    </span>
                    <span className="activity-date">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <div className="activity-metrics">
                    <span className="metric">
                      <strong>{activity.distance.toFixed(2)}</strong> mi
                    </span>
                    <span className="metric-separator">•</span>
                    <span className="metric">
                      <strong>{formatDuration(activity.duration)}</strong>
                    </span>
                    {activity.averagePace && (
                      <>
                        <span className="metric-separator">•</span>
                        <span className="metric">
                          <strong>{formatPace(activity.averagePace)}</strong>{" "}
                          /mi
                        </span>
                      </>
                    )}
                    {activity.calories && (
                      <>
                        <span className="metric-separator">•</span>
                        <span className="metric">
                          <strong>{activity.calories}</strong> cal
                        </span>
                      </>
                    )}
                    {activity.steps && (
                      <>
                        <span className="metric-separator">•</span>
                        <span className="metric">
                          <strong>{activity.steps.toLocaleString()}</strong>{" "}
                          steps
                        </span>
                      </>
                    )}
                  </div>
                  {activity.notes && (
                    <div className="activity-notes">{activity.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
