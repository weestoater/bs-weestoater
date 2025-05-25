import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { MatchDetails } from "../components/football/matchDetails";
import { GoalScorerDetails } from "../components/football/goalScorerDetails";
import mfcGoals from "../data/2020-21-goals.json";
import mfcMatches from "../data/2020-21-matches.json";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";

export const FootballSeason202021 = () => {
  const seasons = ["2020-2021"];

  return (
    <div className="container-fluid">
      <PageTitleH1 title="Previous Football Seasons" />

      <div className="row">
        <div className="previous-seasons">
          <FootballSeasonsNav />
        </div>
      </div>

      {seasons.map((item, key) => {
        return (
          <div className="row mt-4">
            <div className="col-lg-6">
              <h2>
                <i className="bi bi-calendar3 me-2"></i>
                {item} Matches
              </h2>
              <MatchDetails details={mfcMatches[key].details} />
            </div>
            <div className="col-lg-6">
              <h2>
                <i className="bi bi-bar-chart-line me-2"></i>{" "}
                {mfcGoals[key].season} Goals
              </h2>
              <GoalScorerDetails details={mfcGoals[key].details} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
