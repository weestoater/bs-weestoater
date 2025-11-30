import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { AgilePractices } from "../content/agile/agilepractices";
import { MobRulesContent } from "../content/agile/mobrules";
import { LessonsLearnedContent } from "../content/agile/lessonslearned";

export const AgilePage = () => {
  return (
    <>
      <PageTitleH1 title="Agile articles" />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <AgilePractices />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <MobRulesContent />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <LessonsLearnedContent />
        </div>
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
    </>
  );
};
