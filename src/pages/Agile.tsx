import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { AgilePractices } from "../content/agile/agilepractices";
import { MobRulesContent } from "../content/agile/mobrules";
import { LessonsLearnedContent } from "../content/agile/lessonslearned";

export const AgilePage = () => {
  return (
    <>
      <PageTitleH1 title="Agile articles" />
      <div className="grid-auto-fill">
        <AgilePractices />
        <MobRulesContent />
        <LessonsLearnedContent />
      </div>
    </>
  );
};
