import { memo } from "react";
import { MatchDetails } from "./matchDetails";
import { GoalScorerDetails } from "./goalScorerDetails";
import { SeasonStatistics } from "./seasonStatistics";
import type {
  SeasonMatchData,
  SeasonGoalsData,
  Season,
  GoalStats,
} from "../../interfaces/footballTypes";

interface FootballSeasonResultsProps {
  season?: string[];
  matches?: SeasonMatchData | Season[]; // Support both new and legacy structure
  goals?: SeasonGoalsData | GoalStats[]; // Support both new and legacy structure
}

export const FootballSeasonResults = memo(
  (props: FootballSeasonResultsProps) => {
    const seasonsGoals = props.goals ? props.goals : null;
    const seasonsMatches = props.matches ? props.matches : null;
    //const seasonsTitle = props.season
    //  ? props.season[0]
    //  : "Football Season Results";

    // Helper to get matches from either new or legacy structure
    const getMatches = () => {
      if (!seasonsMatches) return null;

      // New flattened structure
      if (!Array.isArray(seasonsMatches) && "matches" in seasonsMatches) {
        return seasonsMatches.matches;
      }

      // Legacy structure (array with [0].details)
      if (Array.isArray(seasonsMatches) && seasonsMatches[0]?.details) {
        return seasonsMatches[0].details;
      }

      return null;
    };

    // Helper to get goal scorers from either new or legacy structure
    const getGoalScorers = () => {
      if (!seasonsGoals) return null;

      // New flattened structure
      if (!Array.isArray(seasonsGoals) && "topScorers" in seasonsGoals) {
        return seasonsGoals.topScorers;
      }

      // Legacy structure (array with [0].details)
      if (Array.isArray(seasonsGoals) && seasonsGoals[0]?.details) {
        return seasonsGoals[0].details;
      }

      return null;
    };

    const matches = getMatches();
    const goalScorers = getGoalScorers();
    const mostRecentMatch = matches && matches.length > 0 ? [matches[0]] : null;
    const remainingMatches =
      matches && matches.length > 1 ? matches.slice(1) : null;

    return (
      <>
        {/* Statistics Section - Full Width Row */}
        <div className="row mt-4">
          <div className="col-12">
            <h2>
              <i className="bi bi-trophy me-2"></i>
              Statistics
            </h2>
            {matches !== null && <SeasonStatistics matches={matches} />}
          </div>
        </div>

        <div className="row mt-4">
          {/* Column 1: Goals Chart */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <h2>
              <i className="bi bi-bar-chart-line me-2"></i>
              Goals Chart
            </h2>
            {goalScorers !== null && (
              <GoalScorerDetails details={goalScorers} showGridOnly={false} />
            )}
          </div>

          {/* Column 2: Goal Scorers Grid */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <h2>
              <i className="bi bi-list-ol me-2"></i>
              Top Scorers
            </h2>
            {goalScorers !== null && (
              <GoalScorerDetails details={goalScorers} showGridOnly={true} />
            )}
            {goalScorers === null && (
              <div className="alert alert-info">No goals data found</div>
            )}
          </div>

          {/* Column 3: Most Recent Match */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <h2>
              <i className="bi bi-calendar-event me-2"></i>
              Latest Result
            </h2>
            {mostRecentMatch !== null && (
              <MatchDetails details={mostRecentMatch} noColumnWrapper={true} />
            )}
            {mostRecentMatch === null && (
              <div className="alert alert-info">No match data found</div>
            )}
          </div>
        </div>

        {/* Remaining Matches */}
        {remainingMatches && remainingMatches.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <h2>
                <i className="bi bi-calendar3 me-2"></i>
                Previous Matches
              </h2>
            </div>
            <MatchDetails details={remainingMatches} />
          </div>
        )}
      </>
    );
  },
);
