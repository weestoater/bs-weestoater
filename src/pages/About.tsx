import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { WhatIsWeestoater } from "../content/about/WhatIsWeestoater";
import { WhoIsWeestoater } from "../content/about/WhoIsWeestoater";
import { SadMessage } from "../content/about/SadMessage";
import { DoingWhatWeCan } from "../content/about/DoingWhatWeCan";

export const AboutPage = () => {
  return (
    <>
      <PageTitleH1
        title="About"
        description="Learn about Ian Burrett, a web developer passionate about accessibility, modern web technologies, and Motherwell FC. Discover the story behind weestoater."
        keywords="Ian Burrett, about, web developer bio, Motherwell FC fan, accessibility advocate"
      />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <WhoIsWeestoater />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <WhatIsWeestoater />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <SadMessage />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <DoingWhatWeCan />
        </div>
      </div>

      <BackToTop />
    </>
  );
};
