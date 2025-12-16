import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { Breadcrumb } from "../components/global/Breadcrumb";
import mfcGoals from "../data/2025-26-goals.json";
import mfcMatches from "../data/2025-26-matches.json";
import { FootballIntro } from "../content/football/footballIntro";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";

export const FootballPage = () => {
  const seasons = ["2025-2026"];

  return (
    <div className="container-fluid" id="top">
      <Breadcrumb />
      <PageTitleH1 title="Football" />
      <div className="row">
        <FootballIntro />
        <FootballSeasonResults
          season={seasons}
          matches={mfcMatches}
          goals={mfcGoals}
        />
      </div>

      <BackToTop />
    </div>
  );
};
