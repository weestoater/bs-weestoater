import {
  Shield,
  TrendUp,
  House,
  AirplaneTilt,
  Fire,
  Equals,
} from "@phosphor-icons/react";
import type { Match } from "../../interfaces/footballTypes";
import { calculateSeasonStats } from "../../utils/footballStatsCalculator";

interface SeasonStatisticsProps {
  matches: Match[];
}

export const SeasonStatistics: React.FC<SeasonStatisticsProps> = ({
  matches,
}) => {
  // Calculate all statistics using the utility function
  const stats = calculateSeasonStats(matches);

  // Return null if no completed matches
  if (stats.totalMatches === 0) {
    return null;
  }

  // Define display configuration for each statistic
  const statDisplays = [
    {
      icon: <House size={24} weight="duotone" />,
      label: "Home Wins",
      value: stats.homeWins,
      color: "text-info",
    },
    {
      icon: <Equals size={24} weight="duotone" />,
      label: "Draws",
      value: stats.draws,
      color: "text-secondary",
    },
    {
      icon: <AirplaneTilt size={24} weight="duotone" />,
      label: "Away Wins",
      value: stats.awayWins,
      color: "text-warning",
    },
    {
      icon: <Shield size={24} weight="duotone" />,
      label: "Clean Sheets",
      value: stats.cleanSheets,
      color: "text-success",
    },
    {
      icon: <TrendUp size={24} weight="duotone" />,
      label: "Win Rate",
      value: `${stats.winPercentage}%`,
      color: "text-primary",
    },
    {
      icon: <Fire size={24} weight="duotone" />,
      label: "Current Clean Sheet Streak",
      value: stats.currentCleanSheetStreak,
      color: stats.currentCleanSheetStreak > 0 ? "text-danger" : "text-muted",
    },
  ];

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body p-2">
            <div className="row g-2">
              {statDisplays.map((stat, index) => (
                <div
                  key={index}
                  className="col-lg-2 col-md-4 col-6 text-center"
                >
                  <div className="d-flex flex-column align-items-center py-2">
                    <div className={`mb-1 ${stat.color}`}>{stat.icon}</div>
                    <div className="fs-5 fw-bold">{stat.value}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
