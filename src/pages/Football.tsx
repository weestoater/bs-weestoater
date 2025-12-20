import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import mfcGoals from "../data/2025-26-goals.json";
import mfcMatches from "../data/2025-26-matches.json";
import { FootballIntro } from "../content/football/footballIntro";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";

export const FootballPage = () => {
  const seasons = ["2025-2026"];

  return (
    <div className="container-fluid" id="top">
      <PageTitleH1
        title="Motherwell FC Stats & Results"
        description="Comprehensive Motherwell FC match results, goal scorers, and season statistics. Track the Steelmen's performance with interactive data visualizations and detailed analytics."
        keywords="Motherwell FC, football statistics, Scottish football, Motherwell results, goal scorers, match data, SPFL"
      />
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
