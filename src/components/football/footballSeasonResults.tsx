import { MatchDetails } from "./matchDetails";
import { GoalScorerDetails } from "./goalScorerDetails";

export const FootballSeasonResults = (props: any) => {
  const seasonsGoals = props.goals ? props.goals : null;
  const seasonsMatches = props.matches ? props.matches : null;
  const seasonsTitle = props.season
    ? props.season[0]
    : "Football Season Results";

  return (
    <>
      <div className="row mt-4">
        <div className="col-lg-6">
          <h2>
            <i className="bi bi-calendar3 me-2"></i>
            {seasonsTitle} Matches
          </h2>

          {seasonsMatches !== null && (
            <MatchDetails details={seasonsMatches[0].details} />
          )}
          {seasonsMatches === null && <>No match data found</>}
        </div>
        <div className="col-lg-6">
          <h2>
            <i className="bi bi-bar-chart-line me-2"></i>
            {seasonsTitle} Goals
          </h2>

          {seasonsGoals !== null && (
            <GoalScorerDetails details={seasonsGoals[0].details} />
          )}
          {seasonsGoals === null && <>No goals data found</>}
        </div>
      </div>
    </>
  );
};
