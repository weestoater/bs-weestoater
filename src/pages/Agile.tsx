import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { AgilePractices } from "../content/agile/agilepractices";
import { MobRulesContent } from "../content/agile/mobrules";
import { LessonsLearnedContent } from "../content/agile/lessonslearned";

export const AgilePage = () => {
  return (
    <>
      <PageTitleH1 title="Agile articles" />
      <div className="row">
        <div className="col-lg-3 col-sm-12 mb-4">
          <AgilePractices />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <MobRulesContent />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <LessonsLearnedContent />
        </div>
      </div>
    </>
  );
};
