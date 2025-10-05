import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { WhatIsWeestoater } from "../content/about/WhatIsWeestoater";
import { WhoIsWeestoater } from "../content/about/WhoIsWeestoater";
import { SadMessage } from "../content/about/SadMessage";

export const AboutPage = () => {
  return (
    <>
      <PageTitleH1 title="About" />
      <div className="row">
        <div className="col-lg-3 col-sm-12 mb-4">
          <WhoIsWeestoater />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <WhatIsWeestoater />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <SadMessage />
        </div>
      </div>
    </>
  );
};
