import { PageTitleH1 } from "../components/global/pageTitleHeading";
import mfcGoals from "../data/2022-23-goals.json";
import mfcMatches from "../data/2022-23-matches.json";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";

export const FootballSeason202223 = () => {
  const seasons = ["2022-2023"];

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
