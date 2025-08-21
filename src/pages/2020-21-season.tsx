import { PageTitleH1 } from "../components/global/pageTitleHeading";
import mfcGoals from "../data/2020-21-goals.json";
import mfcMatches from "../data/2020-21-matches.json";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";

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

      <FootballSeasonResults
        season={seasons}
        matches={mfcMatches}
        goals={mfcGoals}
      />
    </div>
  );
};
