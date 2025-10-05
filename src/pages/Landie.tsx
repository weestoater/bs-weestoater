import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { EarlyAge } from "../content/landie/earlyage";
import { BirthdayTreat } from "../content/landie/birthdaytreat";

export const LandiePage = () => {
  return (
    <>
      <PageTitleH1 title="Land Rovers" />
      <div className="row">
        <div className="col-lg-3 col-sm-12 mb-4">
          <EarlyAge />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <BirthdayTreat />
        </div>
      </div>
    </>
  );
};
