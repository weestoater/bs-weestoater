import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { EarlyAge } from "../content/landie/earlyage";
import { BirthdayTreat } from "../content/landie/birthdaytreat";

export const LandiePage = () => {
  return (
    <>
      <PageTitleH1 title="Land Rovers" />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <EarlyAge />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <BirthdayTreat />
        </div>
      </div>
    </>
  );
};
