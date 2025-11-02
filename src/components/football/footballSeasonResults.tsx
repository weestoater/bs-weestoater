import { memo } from "react";
import { MatchDetails } from "./matchDetails";
import { GoalScorerDetails } from "./goalScorerDetails";
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
    const seasonsTitle = props.season
      ? props.season[0]
      : "Football Season Results";

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

    return (
      <div className="row mt-4">
        <div className="col-lg-6 col-sm-12 mb-4">
          <h2>
            <i className="bi bi-calendar3 me-2"></i>
            {seasonsTitle} Matches
          </h2>

          {matches !== null && <MatchDetails details={matches} />}
          {matches === null && <>No match data found</>}
        </div>
        <div className="col-lg-6 col-sm-12 mb-4">
          <h2>
            <i className="bi bi-bar-chart-line me-2"></i>
            {seasonsTitle} Goals
          </h2>

          {goalScorers !== null && (
            <>
              <GoalScorerDetails details={goalScorers} />
            </>
          )}
          {goalScorers === null && <>No goals data found</>}
        </div>
      </div>
    );
  }
);
