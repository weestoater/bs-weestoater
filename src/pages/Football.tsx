import { PageTitleH1 } from "../components/global/pageTitleHeading";
import mfcGoals from "../data/2025-26-goals.json";
import mfcMatches from "../data/2025-26-matches.json";
import { FootballIntro } from "../content/football/footballIntro";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";

export const FootballPage = () => {
  const seasons = ["2025-2026"];

  return (
    <div className="container-fluid" id="top">
      <PageTitleH1 title="Football" />
      <div className="row">
        <FootballIntro />
        <FootballSeasonResults
          season={seasons}
          matches={mfcMatches}
          goals={mfcGoals}
        />
      </div>

      <div className="text-center my-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-up-circle me-2"></i>
          Back to Top
        </button>
      </div>
    </div>
  );
};
